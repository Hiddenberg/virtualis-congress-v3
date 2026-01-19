"use client";

import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import validator from "validator";
import { checkExistingUserAction } from "@/actions/userActions";
import emailExplanationImage from "@/assets/email-explanation.png";
import { useAuthContext } from "@/contexts/AuthContext";
import PopUp from "../global/PopUp";
import { RegistrationConfirmationPopUp } from "./RegistrationConfirmationPopUp";

function SpamNotificationMessage() {
   return (
      <p className="text-yellow-400 text-lg">
         <strong>Nota: </strong>
         Si no encuentras el correo de verificación por favor revisa en la
         carpeta de spam
      </p>
   );
}

function ReSendCodeButton({ handleSendOTP }: { handleSendOTP: () => void }) {
   const [wasResent, setWasResent] = useState(false);

   return (
      <button
         type="button"
         disabled={wasResent}
         onClick={() => {
            handleSendOTP();
            setWasResent(true);
         }}
         className="bg-white hover:bg-gray-100 disabled:bg-green-200 py-3 rounded-md w-full font-semibold text-[#1e3a8a] disabled:text-gray-400 transition-colors"
      >
         {wasResent ? "Enviado!" : "Reenviar código"}
      </button>
   );
}

export default function LoginForm() {
   const [email, setEmail] = useState<string>();
   const [otpCode, setOtpCode] = useState<string>();
   const [otpId, setOtpId] = useState<string>();
   const [stage, setStage] = useState<"login" | "otp_verification">("login");
   const [isLoading, setIsLoading] = useState(false);
   const { requestOTPCode, loginWithOTPCode } = useAuthContext();
   const [showPopUp, setShowPopUp] = useState(false);
   const router = useRouter();
   const [codeFailed, setCodeFailed] = useState(false);

   const redirectTo = useSearchParams().get("redirectTo");

   console.log("[LoginForm] Redirect destination:", redirectTo);

   const handleSendOTP = async (e?: React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault();

      if (!email) {
         return;
      }

      if (!validator.isEmail(email)) {
         alert("Ingresa un correo válido");
         return;
      }

      const existingUser = await checkExistingUserAction(email);
      if (!existingUser) {
         alert(
            "Este correo aun no está registrado, por favor completa tu registro para poder continuar",
         );
         return;
      }

      const otpIdGenerated = await requestOTPCode(email);
      setOtpId(otpIdGenerated);
      setStage("otp_verification");
      console.log("[LoginForm] Generated OTP ID:", otpIdGenerated);
   };

   const handleValidateOTP = async (e?: React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault();

      if (!otpId || !otpCode) {
         return;
      }

      setIsLoading(true);
      const loginResult = await loginWithOTPCode(otpId, otpCode.trim());
      console.log("[LoginForm] OTP login result:", loginResult);
      if (loginResult) {
         router.push(
            (redirectTo as string) || "/registro/confirmacion-registro",
         );
      } else {
         setCodeFailed(true);
         setIsLoading(false);
      }
   };

   if (isLoading) {
      return (
         <div className="flex justify-center items-center w-full h-32">
            <LoaderCircle className="w-10 h-10 text-white animate-spin" />
         </div>
      );
   }

   if (stage === "otp_verification") {
      return (
         <form className="space-y-6" onSubmit={handleValidateOTP}>
            <p className="text-white text-xl">
               Hemos enviado un código de verificación a tu correo{" "}
               <strong className="text-yellow-400">{email}</strong>, ingresa el
               código para continuar
            </p>

            <input
               type="text"
               value={otpCode}
               onChange={(e) => setOtpCode(e.target.value)}
               className="bg-transparent px-4 py-3 border border-white/30 focus:border-yellow-400 rounded-md focus:outline-none w-full text-white placeholder-white/50"
            />

            <div className="space-y-4">
               <div className="flex gap-2">
                  <button
                     type="submit"
                     disabled={!otpCode}
                     className="bg-white hover:bg-gray-100 disabled:bg-gray-200 py-3 rounded-md w-full font-semibold text-[#1e3a8a] disabled:text-gray-400 transition-colors"
                  >
                     Confirmar código
                  </button>

                  {codeFailed && (
                     <ReSendCodeButton handleSendOTP={handleSendOTP} />
                  )}
               </div>

               <div>
                  <p className="text-gray-300 text-center">
                     Si tu mail tiene algun error puedes corregirlo
                  </p>
                  <button
                     type="button"
                     onClick={() => setStage("login")}
                     className="bg-blue-400 hover:bg-blue-100 disabled:bg-gray-200 py-3 rounded-md w-full font-semibold text-[#1e3a8a] disabled:text-gray-400 transition-colors"
                  >
                     Corregir mail
                  </button>
               </div>
            </div>

            <div className="space-y-2">
               <SpamNotificationMessage />
               <button
                  type="button"
                  onClick={() => setShowPopUp(true)}
                  className="bg-blue-400 hover:bg-blue-100 disabled:bg-gray-200 py-3 rounded-md w-full font-semibold text-[#1e3a8a] disabled:text-gray-400 transition-colors"
               >
                  No he recibido el código
               </button>
            </div>

            {showPopUp && (
               <PopUp onClose={() => setShowPopUp(false)}>
                  <div className="space-y-4 mb-10">
                     <p className="text-xl">
                        Por favor corrobora que tu mail sea correcto y que
                        ingresaste a la bandeja de entrada del mail{" "}
                        <span className="font-semibold">{email}</span>
                     </p>

                     <p className="text-xl">
                        Si no encuentras el correo de verificación por favor
                        revisa en la carpeta de spam o busca el mail en la
                        bandeja de entrada por el nombre de ACP México
                     </p>

                     <p className="text-xl">
                        Busca en las carpetas de &quot;Promociones&quot; o
                        &quot;Publicidad&quot; de tu correo
                     </p>
                     <Image
                        src={emailExplanationImage}
                        alt="Email de verificación"
                        className="w-full"
                     />

                     <p className="text-xl">
                        O escribe en el buscador de tu mail &quot;ACP
                        Mexico&quot;
                     </p>
                  </div>
                  {/* <Link className='group flex justify-center items-center gap-2 bg-blue-200 p-2 px-4 rounded-full'
                        href="https://wa.me/5619920940?text=Hola, necesito ayuda con mi registro al congreso"
                        target='_blank'>
                        <Headset className='hidden md:inline-block size-8 text-blue-400 group-hover:text-blue-500' />
                        <span className='font-semibold text-black'>Ayuda</span>
                     </Link> */}
               </PopUp>
            )}
         </form>
      );
   }

   return (
      <form className="space-y-6" onSubmit={handleSendOTP}>
         <RegistrationConfirmationPopUp />

         <div>
            <label htmlFor="email" className="block mb-2 text-white">
               Correo electrónico
            </label>
            <input
               type="email"
               id="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               className="bg-transparent px-4 py-3 border border-white/30 focus:border-yellow-400 rounded-md focus:outline-none w-full text-white placeholder-white/50"
               placeholder="correo@ejemplo.com"
               required
            />
         </div>

         <button
            type="submit"
            disabled={!email}
            className="bg-white hover:bg-gray-100 disabled:bg-gray-200 py-3 rounded-md w-full font-semibold text-[#1e3a8a] disabled:text-gray-400 transition-colors"
         >
            Iniciar Sesión
         </button>

         <p className="text-white/70 text-center">
            ¿No tienes una cuenta?{" "}
            <a
               href="/registro/formulario"
               className="text-yellow-400 hover:text-yellow-300"
            >
               Regístrate aquí
            </a>
         </p>
      </form>
   );
}
