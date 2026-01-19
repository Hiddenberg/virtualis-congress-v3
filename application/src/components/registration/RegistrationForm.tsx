"use client";
import { ArrowUpRight, ChevronLeft, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useDynamicFormContext } from "@/contexts/DynamicFormContext";
import { useCountryCode } from "@/customHooks/useCountryCode";
import ACPIDCheckButton from "./ACPIDCheckButton";
import CMIMCredentialUploader from "./CMIMCredentialUploader";
import RegisterFormInput from "./FormInputs";
import StudentCredentialUploader from "./StudentCredentialUploader";

function NextSectionButton() {
   const { validateCurrentSection, nextSection, currentFormSection } =
      useDynamicFormContext();

   return (
      <button
         type="button"
         onClick={() => {
            const isValidSection = validateCurrentSection();

            if (isValidSection) {
               nextSection();
            }
         }}
         className="bg-white py-3 rounded-xl w-64 font-medium text-black"
      >
         {currentFormSection === 0 ? "Continuar sin ACP ID" : "Siguiente"}
      </button>
   );
}

function NotFromMexicoButton() {
   const { isPending, countryCode } = useCountryCode();
   const { isFirstSection, skipCmimSection } = useDynamicFormContext();

   if (isPending || !isFirstSection || countryCode == "MX") {
      return null;
   }

   return (
      <button
         className="bg-white px-4 py-3 rounded-xl w-64 font-medium text-black"
         onClick={() => {
            skipCmimSection();
         }}
      >
         Continuar como miembro ACP fuera de México
      </button>
   );
}

function SubmitButton() {
   const { isSubmitting, validateCurrentSection, submitDynamicForm } =
      useDynamicFormContext();
   return (
      <button
         type="button"
         onClick={(e) => {
            e.preventDefault();
            const isValidSection = validateCurrentSection();

            if (isValidSection) {
               submitDynamicForm();
            }
         }}
         disabled={isSubmitting}
         className="bg-yellow-400 disabled:bg-gray-400 py-3 rounded-xl w-64 font-medium text-black transition-colors disabled:animate-pulse"
      >
         <span>{isSubmitting ? "Enviando..." : "Confirmar Registro"}</span>
      </button>
   );
}

function PrevousSectionButton() {
   const { prevSection, isFirstSection } = useDynamicFormContext();
   return (
      <button
         type="button"
         onClick={() => {
            if (!isFirstSection) {
               prevSection();
            }
         }}
         className="flex justify-center items-center bg-white py-3 rounded-xl w-10 text-black"
      >
         <ChevronLeft className="size-6" />
      </button>
   );
}

function FormInputsSection() {
   const {
      isFirstSection,
      currentSectionInputs,
      currentFormSection,
      isLastSection,
      getInputValue,
   } = useDynamicFormContext();

   return (
      <div>
         {isFirstSection && (
            <div className="mb-8">
               <p>¿Cuentas con tu ACP ID?</p>
               <p className="mb-4">
                  Ingresa con tu ACP ID para obtener un descuento{" "}
                  <span className="text-yellow-400" />
               </p>

               <p className="text-yellow-400">
                  Si tu ACP ID ya no está vigente o no eres afiliado del ACP
                  puedes hacer click en &quot;Continuar sin ACP ID&quot;
               </p>
            </div>
         )}

         {currentFormSection === 4 &&
            getInputValue("studiesGrade") ===
               "Estudiante/Residente sin credencial" && (
               <p className="my-2 text-red-400">
                  NOTA: Si no subes tu comprobante de estudiante o residente, no
                  se aplicará el descuento
               </p>
            )}
         <div className="space-y-4">
            {currentSectionInputs.map((question, index) => (
               <RegisterFormInput registrationInput={question} key={index} />
            ))}
         </div>

         {isFirstSection && <ACPIDCheckButton />}

         {currentFormSection === 1 && getInputValue("isCMIMAffiliated") && (
            <CMIMCredentialUploader />
         )}

         {currentFormSection === 4 &&
            (getInputValue("studiesGrade") === "Estudiante" ||
               getInputValue("studiesGrade") === "Residente") && (
               <StudentCredentialUploader />
            )}

         {isLastSection && getInputValue("wantToBeACPMember") === true && (
            <div className="mt-8">
               <p>
                  Si te gustaría ser miembro del ACP, te invitamos a registrarte
                  en el siguiente enlace
               </p>
               <Link
                  href="https://webapi.acponline.org/Account/Register?ReturnUrl=https%3A%2F%2Fwebapi.acponline.org%2Foauth%3Fclient_id%3D5523755E-E816-40BA-845E-E6802D955711%26scope%3D%26response_type%3Dcode%26redirect_uri%3Dhttps%3A%252f%252fmembershipapp.acponline.org%252foauth-callback%26state%3DCfDJ8H6hTMXdPApCk6ygXkfK9Xp3luG1MuDLNx3iuvayHvaJ5CUTc-fpzp72MnLOcjJxKK74CMNn2J3Pb5psSJsIElZs6GXZIHaBk6lz72En7dFdQhBDRsSPiDxI7d4cpuf_fpkzhRWckzOW3VlNQWhM51oAIx5jnn32jkCWnWGvYOc0qngzl4DPWUDVKnwEfQoNWxvpMIXRvTXBnTeOZT8CS2xmJB_xZ9Ejjt__8y69D0kHh4OR3paxJ0KDZ3um-rfSUg%26show_allow%3Dfalse&Source=ACPWEBAPI"
                  target="_blank"
                  className="font-semibold text-yellow-400 underline"
               >
                  Ir a la página de registro
                  <ArrowUpRight className="inline-block" />
               </Link>
            </div>
         )}
      </div>
   );
}

export function FormHelpButton() {
   return (
      <Link
         title="Help"
         className="group top-4 right-2 absolute flex justify-center items-center gap-2 bg-slate-100 p-2 px-4 rounded-full"
         href="https://wa.me/5619920940?text=Hola, necesito ayuda con mi registro al congreso"
         target="_blank"
      >
         <span className="hidden md:inline-block text-black">
            Necesitas ayuda
         </span>
         <span className="md:hidden text-black">Ayuda</span>
         <HelpCircle className="hidden md:inline-block size-8 text-blue-400 group-hover:text-blue-500" />
      </Link>
   );
}

function AlreadyRegisteredMessage() {
   const { isFirstSection } = useDynamicFormContext();

   if (!isFirstSection) {
      return null;
   }

   return (
      <div className="flex flex-col items-center">
         <h2 className="mb-2 text-xl">¿Ya completaste tu registro?</h2>
         <p>
            <Link className="text-yellow-400 underline" href="/login">
               Haz clic aquí
            </Link>{" "}
            para iniciar sesión.
         </p>
      </div>
   );
}

export default function RegistrationForm() {
   const {
      currentFormSection,
      currentSectionTitle,
      isLastSection,
      isFirstSection,
   } = useDynamicFormContext();

   return (
      <div className="relative bg-blue-900 p-5 md:rounded-l-3xl h-screen text-white transition-colors">
         {/* <FormHelpButton /> */}
         <h1 className="mb-2 font-semibold text-white text-xl text-center">
            Registro
         </h1>

         <h1 className="mb-2 text-yellow-400">
            {currentFormSection !== -1 && (
               <span className="mr-2 font-bold text-xl">
                  {currentSectionTitle}
               </span>
            )}
            {/* <span className='uppercase'>{ currentSectionTitle}</span> */}
         </h1>

         <FormInputsSection />

         <div className="flex justify-center items-center gap-2 my-10">
            {!isFirstSection && <PrevousSectionButton />}
            <div className="flex flex-col gap-4">
               <NotFromMexicoButton />
               {isLastSection ? <SubmitButton /> : <NextSectionButton />}
            </div>
         </div>

         <AlreadyRegisteredMessage />
      </div>
   );
}
