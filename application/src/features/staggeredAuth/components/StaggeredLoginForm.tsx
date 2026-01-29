"use client";

import { AlertCircle, ArrowLeft, LoaderCircle, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
// import validator from "validator"
import { z } from "zod";
import { Button } from "@/components/global/Buttons";
import { useStaggeredAuthContext } from "../context/StaggeredAuthContext";
import { checkExistingUserAction } from "../serverActions/staggeredAuthActions";

function ReSendCodeButton({ handleSendOTP }: { handleSendOTP: () => void }) {
   const [wasResent, setWasResent] = useState(false);

   return (
      <Button
         type="button"
         disabled={wasResent}
         onClick={() => {
            handleSendOTP();
            setWasResent(true);
         }}
         className="bg-gray-100! hover:bg-gray-200! disabled:bg-green-50 shadow-sm py-2.5 border border-blue-300 disabled:border-green-200 rounded-xl w-full font-semibold text-blue-800 disabled:text-green-600 text-sm transition-all duration-200"
      >
         {wasResent ? "Enviado!" : "Reenviar código"}
      </Button>
   );
}

function CodeNotReceivedButton({ onClick }: { onClick: () => void }) {
   return (
      <Button
         type="button"
         variant="outline"
         className="hover:bg-gray-100! mx-auto border border-gray-300 w-full text-gray-700 hover:text-gray-800 transition-all duration-200"
         onClick={onClick}
      >
         No encuentro el código en mi correo
      </Button>
   );
}

function BirthdayLoginForm({
   email,
   redirectTo,
   setStage,
}: {
   email: string | undefined;
   redirectTo: string | null;
   setStage: (stage: "login" | "otp_verification" | "birthday_login" | "phone_login") => void;
}) {
   const [isLoading, setIsLoading] = useState(false);
   const [birthday, setBirthday] = useState<string>();
   const [incorrectBirthday, setIncorrectBirthday] = useState(false);

   const { loginWithBirthdate } = useStaggeredAuthContext();

   const handleLoginWithBirthday = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!birthday || !email) {
         return;
      }
      setIsLoading(true);
      setIncorrectBirthday(false);

      console.log("birthday", birthday);

      const loginResult = await loginWithBirthdate(email, birthday);

      if (loginResult === false) {
         setIsLoading(false);
         setIncorrectBirthday(true);
         return;
      }

      if (loginResult === true) {
         if (redirectTo) {
            window.location.href = redirectTo;
         } else {
            window.location.href = "/lobby";
         }
      }
   };

   if (isLoading) {
      return (
         <div className="flex justify-center items-center py-10 w-full">
            <LoaderCircle className="w-10 h-10 text-blue-500 animate-spin" />
         </div>
      );
   }

   return (
      <form className="space-y-6" onSubmit={handleLoginWithBirthday}>
         {/* Header with back button */}
         <div className="flex items-center gap-3">
            <button
               type="button"
               onClick={() => setStage("otp_verification")}
               className="flex justify-center items-center hover:bg-gray-200 rounded-full w-8 h-8 text-gray-600 hover:text-blue-600 transition-colors"
            >
               <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
               <h3 className="font-bold text-gray-800 text-lg">Verificación alternativa</h3>
               <p className="text-gray-600 text-sm">Ingresa tu fecha de nacimiento para continuar</p>
            </div>
         </div>

         {/* Email reminder */}
         <div className="bg-linear-to-r from-blue-50 to-gray-50 p-4 border border-blue-200 rounded-xl">
            <p className="text-gray-700 text-sm">
               Verificando acceso para: <strong className="text-blue-700">{email}</strong>
            </p>
         </div>

         {/* Error message */}
         {incorrectBirthday && (
            <div className="bg-red-50 p-4 border border-red-200 rounded-xl">
               <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 w-5 h-5 text-red-500 shrink-0" />
                  <div>
                     <p className="font-semibold text-red-700 text-sm">Fecha de nacimiento incorrecta</p>
                     <p className="mt-1 text-red-600 text-sm">
                        La fecha ingresada no coincide con nuestros registros. Por favor, verifica e intenta nuevamente.
                     </p>
                  </div>
               </div>
            </div>
         )}

         {/* Birthday input */}
         <div>
            <label htmlFor="birthday" className="block mb-2 font-semibold text-gray-700 text-sm">
               Fecha de nacimiento
            </label>
            <input
               id="birthday"
               type="date"
               value={birthday}
               onChange={(e) => {
                  setBirthday(e.target.value);
                  setIncorrectBirthday(false);
               }}
               className="bg-white px-4 py-3 border border-gray-300 focus:border-blue-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 w-full text-gray-900 transition-all duration-200"
               required
            />
         </div>

         {/* Submit button */}
         <Button
            type="submit"
            disabled={!birthday || isLoading}
            className="bg-linear-to-r! from-blue-600 hover:from-blue-700 to-blue-700 hover:to-blue-800 disabled:opacity-50 shadow-lg mx-auto py-3 rounded-xl w-full font-bold text-white! transition-all duration-200"
         >
            {isLoading ? (
               <div className="flex items-center gap-2">
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                  Verificando...
               </div>
            ) : (
               "Ingresar con fecha de nacimiento"
            )}
         </Button>

         {/* Alternative phone login - appears when birthday is incorrect */}
         {incorrectBirthday && (
            <div className="space-y-3">
               <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-300 h-px" />
                  <span className="text-gray-600 text-sm">o intenta con</span>
                  <div className="flex-1 bg-gray-300 h-px" />
               </div>
               <Button
                  type="button"
                  onClick={() => setStage("phone_login")}
                  variant="outline"
                  className="bg-gray-50! hover:bg-gray-100! shadow-sm hover:shadow-md mx-auto py-3 border-gray-300! rounded-xl w-full font-semibold text-gray-700! transition-all duration-200"
               >
                  Ingresar con número de teléfono
               </Button>
            </div>
         )}

         {/* Help section */}
         <div className="pt-2">
            <p className="mb-2 text-gray-600 text-sm text-center">¿Necesitas ayuda adicional?</p>
            <Button
               type="button"
               onClick={() => setStage("login")}
               variant="outline"
               className="hover:bg-gray-100 mx-auto border border-gray-300 rounded-xl w-full text-gray-700 transition-all duration-200"
            >
               Volver al inicio
            </Button>
         </div>
      </form>
   );
}

function PhoneLoginForm({
   email,
   redirectTo,
   setStage,
}: {
   email: string | undefined;
   redirectTo: string | null;
   setStage: (stage: "login" | "otp_verification" | "birthday_login" | "phone_login") => void;
}) {
   const [isLoading, setIsLoading] = useState(false);
   const [phoneNumber, setPhoneNumber] = useState<string>();
   const [incorrectPhoneNumber, setIncorrectPhoneNumber] = useState(false);

   const { loginWithPhoneNumber } = useStaggeredAuthContext();

   const handleLoginWithPhoneNumber = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!phoneNumber || !email) {
         return;
      }
      setIsLoading(true);
      setIncorrectPhoneNumber(false);

      const loginResult = await loginWithPhoneNumber(email, phoneNumber);

      if (loginResult === false) {
         setIsLoading(false);
         setIncorrectPhoneNumber(true);
         return;
      }

      if (loginResult === true) {
         if (redirectTo) {
            window.location.href = redirectTo;
         } else {
            window.location.href = "/lobby";
         }
      }
   };

   if (isLoading) {
      return (
         <div className="flex justify-center items-center py-10 w-full">
            <LoaderCircle className="w-10 h-10 text-blue-500 animate-spin" />
         </div>
      );
   }

   return (
      <form className="space-y-6" onSubmit={handleLoginWithPhoneNumber}>
         {/* Header with back button */}
         <div className="flex items-center gap-3">
            <button
               type="button"
               onClick={() => setStage("birthday_login")}
               className="flex justify-center items-center hover:bg-gray-200 rounded-full w-8 h-8 text-gray-600 hover:text-blue-600 transition-colors"
            >
               <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
               <h3 className="font-bold text-gray-800 text-lg">Verificación con teléfono</h3>
               <p className="text-gray-600 text-sm">Ingresa tu número de teléfono para continuar</p>
            </div>
         </div>

         {/* Email reminder */}
         <div className="bg-linear-to-r from-blue-50 to-gray-50 p-4 border border-blue-200 rounded-xl">
            <p className="text-gray-700 text-sm">
               Verificando acceso para: <strong className="text-blue-700">{email}</strong>
            </p>
         </div>

         {/* Error message */}
         {incorrectPhoneNumber && (
            <div className="bg-red-50 p-4 border border-red-200 rounded-xl">
               <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 w-5 h-5 text-red-500 shrink-0" />
                  <div>
                     <p className="font-semibold text-red-700 text-sm">Número de teléfono incorrecto</p>
                     <p className="mt-1 text-red-600 text-sm">
                        El número ingresado no coincide con nuestros registros. Por favor, verifica e intenta nuevamente.
                     </p>
                  </div>
               </div>
            </div>
         )}

         {/* Phone input */}
         <div>
            <label htmlFor="phoneNumber" className="block mb-2 font-semibold text-gray-700 text-sm">
               Número de teléfono
            </label>
            <input
               id="phoneNumber"
               type="tel"
               value={phoneNumber}
               onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setIncorrectPhoneNumber(false);
               }}
               className="bg-white px-4 py-3 border border-gray-300 focus:border-blue-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 w-full text-gray-900 transition-all duration-200"
               placeholder="Ingresa tu número de teléfono"
               required
            />
         </div>

         {/* Submit button */}
         <Button
            type="submit"
            disabled={!phoneNumber || isLoading}
            className="bg-linear-to-r! from-blue-600 hover:from-blue-700 to-blue-700 hover:to-blue-800 disabled:opacity-50 shadow-lg mx-auto py-3 rounded-xl w-full font-bold text-white! transition-all duration-200"
         >
            {isLoading ? (
               <div className="flex items-center gap-2">
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                  Verificando...
               </div>
            ) : (
               "Ingresar con número de teléfono"
            )}
         </Button>

         {/* Help section */}
         <div className="pt-2">
            <p className="mb-2 text-gray-600 text-sm text-center">¿Necesitas ayuda adicional?</p>
            <Button
               type="button"
               onClick={() => setStage("login")}
               variant="outline"
               className="hover:bg-gray-100 mx-auto border border-gray-300 rounded-xl w-full text-gray-700 transition-all duration-200"
            >
               Volver al inicio
            </Button>
         </div>
      </form>
   );
}

export default function StaggeredLoginForm() {
   const [email, setEmail] = useState<string>("");
   const [otpCode, setOtpCode] = useState<string>("");
   const [stage, setStage] = useState<"login" | "otp_verification" | "birthday_login" | "phone_login">("login");
   const router = useRouter();
   const [codeFailed, setCodeFailed] = useState(false);

   const [isSendingOtp, startSendingOtpTransition] = useTransition();
   const [isValidatingOtp, startValidatingOtpTransition] = useTransition();

   const { loginWithOTPCode, requestOTPCode } = useStaggeredAuthContext();

   const searchParams = useSearchParams();

   const redirectTo = searchParams.get("redirectTo");

   const handleSendOTP = async (e?: React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault();
      if (!email) {
         toast.error("Ingresa un correo válido");
         return;
      }

      startSendingOtpTransition(async () => {
         try {
            // Validate email
            const emailSchema = z.string().email();
            if (!emailSchema.safeParse(email).success) {
               toast.error("Ingresa un correo válido");
               return;
            }

            const userExistsResponse = await checkExistingUserAction(email);

            if (!userExistsResponse.success) {
               toast.error(userExistsResponse.errorMessage);
               return;
            }

            if (!userExistsResponse.data.exists) {
               toast.error("Este correo aun no está registrado, por favor registrate para poder iniciar sesión");
               return;
            }

            const requestOTPCodeResult = await requestOTPCode(email);

            if (requestOTPCodeResult === true) {
               setStage("otp_verification");
            }
         } catch (error) {
            console.error("Error sending OTP:", error);
            toast.error("Error al enviar el código. Intenta nuevamente.");
         }
      });
   };

   const handleValidateOTP = async (e?: React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault();
      if (!otpCode || !email || isValidatingOtp) {
         toast.error("Ingresa un código");
         return;
      }

      startValidatingOtpTransition(async () => {
         try {
            setCodeFailed(false);
            const loginResult = await loginWithOTPCode(email, otpCode);
            if (loginResult === true) {
               if (redirectTo) {
                  router.push(redirectTo);
               } else {
                  router.push("/lobby");
               }
            } else {
               setCodeFailed(true);
            }
         } catch (error) {
            console.error("Error validating OTP:", error);
            setCodeFailed(true);
            toast.error("Error al validar el código. Intenta nuevamente.");
         }
      });
   };

   if (isValidatingOtp) {
      return (
         <div className="flex justify-center items-center py-10 w-full">
            <LoaderCircle className="w-10 h-10 text-blue-500 animate-spin" />
         </div>
      );
   }

   if (stage === "otp_verification") {
      return (
         <form className="space-y-6" onSubmit={handleValidateOTP}>
            <div className="text-center">
               <p className="font-medium text-gray-800 text-lg">Hemos enviado un código de verificación a tu correo</p>
               <p className="mt-1 font-bold text-blue-700">{email}</p>
               <p className="mt-2 text-gray-600 text-sm">Ingresa el código para continuar</p>
            </div>

            {/* Email Help Message */}
            <div className="bg-blue-50 shadow-lg p-4 border border-blue-200 rounded-xl">
               <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 w-5 h-5 text-blue-600 shrink-0" />
                  <div className="space-y-2">
                     <p className="font-semibold text-gray-800 text-sm">Consejos para encontrar tu código:</p>
                     <div className="space-y-1 text-gray-700 text-sm">
                        <p>
                           • Revisa tu bandeja de <strong className="text-gray-900">spam o correo no deseado</strong>
                        </p>
                        <p>
                           • Busca un email con el asunto{" "}
                           <strong className="text-gray-900">&quot;Código de verificación&quot;</strong> o{" "}
                           <strong className="text-gray-900">&quot;Virtualis Courses&quot;</strong>
                        </p>
                        <p>• El código puede tardar hasta 2 minutos en llegar</p>
                     </div>
                  </div>
               </div>
            </div>

            <div>
               <label htmlFor="otp-code" className="block mb-2 font-semibold text-gray-700 text-sm">
                  Código de verificación
               </label>
               <input
                  id="otp-code"
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.trim())}
                  className="bg-white px-4 py-3 border border-gray-300 focus:border-blue-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 w-full font-mono text-gray-900 text-lg text-center tracking-widest transition-all duration-200 placeholder-gray-400"
                  placeholder="000000"
                  maxLength={10}
               />
            </div>

            <div className="space-y-4">
               <div className="flex gap-2">
                  <Button
                     type="submit"
                     disabled={!otpCode || isValidatingOtp}
                     className="bg-linear-to-r! from-blue-600 hover:from-blue-700 to-blue-700 hover:to-blue-800 disabled:opacity-50 shadow-lg py-3 rounded-xl w-full font-bold text-white! transition-all duration-200"
                  >
                     {isValidatingOtp ? (
                        <div className="flex items-center gap-2">
                           <LoaderCircle className="w-4 h-4 animate-spin" />
                           Verificando...
                        </div>
                     ) : (
                        "Confirmar código"
                     )}
                  </Button>

                  {codeFailed && <ReSendCodeButton handleSendOTP={handleSendOTP} />}
               </div>

               <div className="pt-2">
                  <p className="mb-2 text-gray-600 text-sm text-center">¿No recibiste el código o necesitas corregir tu email?</p>

                  <div className="space-y-2 *:w-full">
                     <Button
                        type="button"
                        onClick={() => setStage("login")}
                        variant="outline"
                        className="hover:bg-gray-100 mx-auto py-2.5 border border-gray-300 rounded-xl w-full text-gray-700 transition-all duration-200"
                     >
                        Corregir email
                     </Button>
                     <CodeNotReceivedButton
                        onClick={() => {
                           setStage("birthday_login");
                        }}
                     />
                  </div>
               </div>
            </div>
         </form>
      );
   }

   if (stage === "birthday_login") {
      return <BirthdayLoginForm setStage={setStage} email={email} redirectTo={redirectTo} />;
   }

   if (stage === "phone_login") {
      return <PhoneLoginForm setStage={setStage} email={email} redirectTo={redirectTo} />;
   }

   return (
      <form className="space-y-6" onSubmit={handleSendOTP}>
         <div>
            <label htmlFor="email" className="block mb-2 font-semibold text-gray-700 text-sm">
               Correo electrónico
            </label>
            <input
               type="email"
               id="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               className="bg-white px-4 py-3 border border-gray-300 focus:border-blue-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 w-full text-gray-900 transition-all duration-200 placeholder-gray-400"
               placeholder="correo@ejemplo.com"
               required
            />
         </div>

         <Button
            type="submit"
            disabled={!email || isSendingOtp}
            className="bg-linear-to-r! from-blue-600 hover:from-blue-700 to-blue-700 hover:to-blue-800 disabled:opacity-50 shadow-lg py-3 rounded-xl w-full font-bold text-white! transition-all duration-200"
         >
            {isSendingOtp ? (
               <div className="flex items-center gap-2">
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                  Enviando código...
               </div>
            ) : (
               "Continuar"
            )}
         </Button>
      </form>
   );
}
