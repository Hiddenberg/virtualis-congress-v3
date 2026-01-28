"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { staffCreateAttendantUserAction } from "../serverActions/manualRegistrationActions";
import { FormActionButtons } from "./FormActionButtons";
import { FormCardHeader } from "./FormCardHeader";
import { FormHeader } from "./FormHeader";
import { FormHelpText } from "./FormHelpText";
import { FormStatusIndicator } from "./FormStatusIndicator";
import { OptionalFieldsSection } from "./OptionalFieldsSection";
import { RequiredFieldsSection } from "./RequiredFieldsSection";

export default function StaffCreateUserForm() {
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [emailVerification, setEmailVerification] = useState("");
   const [phoneNumber, setPhoneNumber] = useState("");
   const [dateOfBirth, setDateOfBirth] = useState("");
   const [additionalEmail1, setAdditionalEmail1] = useState("");
   const [additionalEmail2, setAdditionalEmail2] = useState("");
   const [isPending, startTransition] = useTransition();
   const router = useRouter();

   const validateEmail = (email: string) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
   };

   // Validation
   const nameError = name.trim().length > 0 && name.trim().length < 3 ? "El nombre debe tener al menos 3 caracteres" : "";
   const emailError = email.trim().length > 0 && !validateEmail(email) ? "Ingresa un correo electrónico válido" : "";
   const emailVerificationError =
      emailVerification.trim().length > 0 && emailVerification !== email ? "Los correos electrónicos no coinciden" : "";
   const additionalEmail1Error =
      additionalEmail1.trim().length > 0 && !validateEmail(additionalEmail1) ? "Ingresa un correo electrónico válido" : "";
   const additionalEmail2Error =
      additionalEmail2.trim().length > 0 && !validateEmail(additionalEmail2) ? "Ingresa un correo electrónico válido" : "";

   const canSubmit =
      name.trim().length > 2 &&
      validateEmail(email) &&
      emailVerification === email &&
      !additionalEmail1Error &&
      !additionalEmail2Error &&
      !isPending;

   const onSubmit = () => {
      if (!canSubmit) return;

      // Validate additional emails don't match main email or each other
      if (additionalEmail1.trim() && additionalEmail1.trim().toLowerCase() === email.trim().toLowerCase()) {
         toast.error("No puedes usar tu correo electrónico como correo adicional");
         return;
      }

      if (additionalEmail2.trim() && additionalEmail2.trim().toLowerCase() === email.trim().toLowerCase()) {
         toast.error("No puedes usar tu correo electrónico como correo adicional");
         return;
      }

      if (
         additionalEmail1.trim() &&
         additionalEmail2.trim() &&
         additionalEmail1.trim().toLowerCase() === additionalEmail2.trim().toLowerCase()
      ) {
         toast.error("No puedes usar el mismo correo electrónico como correo adicional dos veces");
         return;
      }

      const confirm = window.confirm("¿Estás seguro de crear este usuario?");
      if (!confirm) return;

      startTransition(async () => {
         const res = await staffCreateAttendantUserAction({
            name: name.trim(),
            email: email.trim(),
            phoneNumber: phoneNumber.trim() || undefined,
            dateOfBirth: dateOfBirth || undefined,
            additionalEmail1: additionalEmail1.trim() || undefined,
            additionalEmail2: additionalEmail2.trim() || undefined,
         });
         if (res.success) {
            toast.success("Usuario creado exitosamente");
            router.push("/manual-registration");
         } else {
            toast.error(res.errorMessage);
         }
      });
   };

   return (
      <div className="bg-gray-50 min-h-screen">
         <div className="mx-auto px-4 py-8 max-w-3xl">
            <FormHeader />

            <div className="bg-white shadow-sm border border-gray-200 rounded-xl">
               <FormCardHeader />

               <div className="space-y-6 p-6">
                  <RequiredFieldsSection
                     name={name}
                     setName={setName}
                     email={email}
                     setEmail={setEmail}
                     emailVerification={emailVerification}
                     setEmailVerification={setEmailVerification}
                     nameError={nameError}
                     emailError={emailError}
                     emailVerificationError={emailVerificationError}
                  />

                  <OptionalFieldsSection
                     phoneNumber={phoneNumber}
                     setPhoneNumber={setPhoneNumber}
                     dateOfBirth={dateOfBirth}
                     setDateOfBirth={setDateOfBirth}
                     additionalEmail1={additionalEmail1}
                     setAdditionalEmail1={setAdditionalEmail1}
                     additionalEmail2={additionalEmail2}
                     setAdditionalEmail2={setAdditionalEmail2}
                     additionalEmail1Error={additionalEmail1Error}
                     additionalEmail2Error={additionalEmail2Error}
                  />

                  <FormStatusIndicator canSubmit={canSubmit} />

                  <FormActionButtons canSubmit={canSubmit} isPending={isPending} onSubmit={onSubmit} />
               </div>
            </div>

            <FormHelpText />
         </div>
      </div>
   );
}
