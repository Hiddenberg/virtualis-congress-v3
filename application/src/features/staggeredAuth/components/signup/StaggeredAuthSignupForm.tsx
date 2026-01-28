"use client";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { checkExistingUserAction } from "../../serverActions/staggeredAuthActions";
import { ProgressIndicator, SignUpFooter, StepHeader, StepOne, StepThree, StepTwo } from ".";

export interface NewUserFormData {
   email: string;
   name: string;
   additionalEmail1: string;
   additionalEmail2: string;
   dateOfBirth: string;
   phoneNumber: string;
}

export default function StaggeredAuthSignupForm({
   onSubmit,
   welcomeMessage,
   welcomeDescription,
}: {
   onSubmit: (newUserData: NewUserFormData) => Promise<void>;
   welcomeMessage?: string;
   welcomeDescription?: string;
}) {
   const [currentStep, setCurrentStep] = useState(1);
   const [newUserData, setNewUserData] = useState<NewUserFormData>({
      email: "",
      name: "",
      additionalEmail1: "",
      additionalEmail2: "",
      dateOfBirth: "",
      phoneNumber: "",
   });

   const [emailVerification, setEmailVerification] = useState("");

   const [errors, setErrors] = useState({
      email: "",
      emailVerification: "",
      name: "",
      additionalEmail1: "",
      additionalEmail2: "",
      dateOfBirth: "",
      phoneNumber: "",
   });

   const [isSubmitting, startTransition] = useTransition();

   const validateEmail = (email: string) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
   };

   const validateStep1 = () => {
      const newErrors = {
         ...errors,
      };
      let isValid = true;

      if (!newUserData.email) {
         newErrors.email = "El email es requerido";
         isValid = false;
      } else if (!validateEmail(newUserData.email)) {
         newErrors.email = "Ingresa un email válido";
         isValid = false;
      } else {
         newErrors.email = "";
      }

      if (!emailVerification) {
         newErrors.emailVerification = "Confirma tu email";
         isValid = false;
      } else if (emailVerification !== newUserData.email) {
         newErrors.emailVerification = "Los emails no coinciden";
         isValid = false;
      } else {
         newErrors.emailVerification = "";
      }

      if (!newUserData.name.trim()) {
         newErrors.name = "El nombre es requerido";
         isValid = false;
      } else if (newUserData.name.trim().length < 2) {
         newErrors.name = "El nombre debe tener al menos 2 caracteres";
         isValid = false;
      } else {
         newErrors.name = "";
      }

      setErrors(newErrors);
      return isValid;
   };

   const validateStep2 = () => {
      const newErrors = {
         ...errors,
      };
      let isValid = true;

      // Additional emails are optional, but if provided, must be valid
      if (newUserData.additionalEmail1 && !validateEmail(newUserData.additionalEmail1)) {
         newErrors.additionalEmail1 = "Ingresa un email válido";
         isValid = false;
      } else {
         newErrors.additionalEmail1 = "";
      }

      if (newUserData.additionalEmail2 && !validateEmail(newUserData.additionalEmail2)) {
         newErrors.additionalEmail2 = "Ingresa un email válido";
         isValid = false;
      } else {
         newErrors.additionalEmail2 = "";
      }

      setErrors(newErrors);
      return isValid;
   };

   const validateStep3 = () => {
      const newErrors = {
         ...errors,
      };
      let isValid = true;

      if (!newUserData.dateOfBirth) {
         newErrors.dateOfBirth = "La fecha de nacimiento es requerida";
         isValid = false;
      } else {
         const birthDate = new Date(newUserData.dateOfBirth);
         const today = new Date();
         const age = today.getFullYear() - birthDate.getFullYear();

         if (age < 13 || age > 120) {
            newErrors.dateOfBirth = "Debes tener entre 13 y 120 años";
            isValid = false;
         } else {
            newErrors.dateOfBirth = "";
         }
      }

      if (!newUserData.phoneNumber) {
         newErrors.phoneNumber = "El teléfono es requerido";
         isValid = false;
      } else if (newUserData.phoneNumber.length < 8) {
         newErrors.phoneNumber = "Ingresa un número válido";
         isValid = false;
      } else {
         newErrors.phoneNumber = "";
      }

      setErrors(newErrors);
      return isValid;
   };

   const handleNext = () => {
      if (validateStep1()) {
         startTransition(async () => {
            const userExistsResponse = await checkExistingUserAction(newUserData.email);
            if (!userExistsResponse.success) {
               toast.error(userExistsResponse.errorMessage);
               return;
            }

            if (userExistsResponse.data.exists) {
               toast.error("Este correo electrónico ya está registrado, por favor inicia sesión");
               return;
            }

            setCurrentStep(2);
         });
      }
   };

   const handleStep2Next = () => {
      if (validateStep2()) {
         startTransition(async () => {
            if (!newUserData.additionalEmail1 && !newUserData.additionalEmail2) {
               setCurrentStep(3);
               return;
            }

            if (newUserData.additionalEmail1 === newUserData.email || newUserData.additionalEmail2 === newUserData.email) {
               toast.error("No puedes usar tu correo electrónico como correo adicional");
               return;
            }

            if (newUserData.additionalEmail1 === newUserData.additionalEmail2) {
               toast.error("No puedes usar el mismo correo electrónico como correo adicional dos veces");
               return;
            }

            if (newUserData.additionalEmail1) {
               const userExistsResponse = await checkExistingUserAction(newUserData.additionalEmail1);
               if (!userExistsResponse.success) {
                  toast.error(userExistsResponse.errorMessage);
                  return;
               }
               if (userExistsResponse.data.exists) {
                  toast.error(
                     `El correo electrónico ${newUserData.additionalEmail1} ya está registrado, no puedes usarlo como correo adicional por favor inicia sesión`,
                  );
                  return;
               }
            }

            if (newUserData.additionalEmail2) {
               const userExistsResponse = await checkExistingUserAction(newUserData.additionalEmail2);
               if (!userExistsResponse.success) {
                  toast.error(userExistsResponse.errorMessage);
                  return;
               }
               if (userExistsResponse.data.exists) {
                  toast.error(
                     `El correo electrónico ${newUserData.additionalEmail2} ya está registrado, no puedes usarlo como correo adicional por favor inicia sesión`,
                  );
                  return;
               }
            }

            setCurrentStep(3);
         });
      }
   };

   const handleBack = () => {
      if (currentStep === 3) {
         setCurrentStep(2);
      } else if (currentStep === 2) {
         setCurrentStep(1);
      }
   };

   const handleSubmit = async () => {
      if (validateStep3()) {
         startTransition(async () => {
            try {
               await onSubmit(newUserData);
            } catch (error) {
               if (error instanceof Error) {
                  toast.error(error.message);
                  return;
               }

               toast.error("Ocurrió un error inesperado al crear el usuario");
            }
         });
      }
   };

   const handleInputChange = (field: keyof typeof newUserData, value: string) => {
      setNewUserData((prev) => ({
         ...prev,
         [field]: value,
      }));
      // Clear error when user starts typing
      if (errors[field]) {
         setErrors((prev) => ({
            ...prev,
            [field]: "",
         }));
      }
      // Clear email verification error when email changes
      if (field === "email" && errors.emailVerification) {
         setErrors((prev) => ({
            ...prev,
            emailVerification: "",
         }));
      }
   };

   const handleEmailVerificationChange = (value: string) => {
      setEmailVerification(value);
      // Clear error when user starts typing
      if (errors.emailVerification) {
         setErrors((prev) => ({
            ...prev,
            emailVerification: "",
         }));
      }
   };

   const handlePhoneInputChange = (value: string) => {
      // Remove whitespace from input and allow only numbers
      const sanitizedValue = value.replace(/\D/g, "");
      setNewUserData((prev) => ({
         ...prev,
         phoneNumber: sanitizedValue,
      }));
      // Clear error when user starts typing
      if (errors.phoneNumber) {
         setErrors((prev) => ({
            ...prev,
            phoneNumber: "",
         }));
      }
   };

   return (
      <div className="flex justify-center items-center bg-linear-to-br from-gray-50 to-gray-100 p-4 w-full min-h-screen">
         <div className="bg-white shadow-xl p-8 md:p-10 border border-gray-200 rounded-2xl w-full max-w-lg">
            <ProgressIndicator currentStep={currentStep} totalSteps={3} />
            <StepHeader currentStep={currentStep} welcomeMessage={welcomeMessage} welcomeDescription={welcomeDescription} />

            {/* Step 1: Email and Name */}
            {currentStep === 1 && (
               <StepOne
                  email={newUserData.email}
                  emailVerification={emailVerification}
                  name={newUserData.name}
                  errors={{
                     email: errors.email,
                     emailVerification: errors.emailVerification,
                     name: errors.name,
                  }}
                  onEmailChange={(value) => handleInputChange("email", value)}
                  onEmailVerificationChange={handleEmailVerificationChange}
                  onNameChange={(value) => handleInputChange("name", value)}
                  onNext={handleNext}
                  isSubmitting={isSubmitting}
               />
            )}

            {/* Step 2: Additional Emails */}
            {currentStep === 2 && (
               <StepTwo
                  additionalEmail1={newUserData.additionalEmail1}
                  additionalEmail2={newUserData.additionalEmail2}
                  errors={{
                     additionalEmail1: errors.additionalEmail1,
                     additionalEmail2: errors.additionalEmail2,
                  }}
                  isSubmitting={isSubmitting}
                  onAdditionalEmail1Change={(value) => handleInputChange("additionalEmail1", value)}
                  onAdditionalEmail2Change={(value) => handleInputChange("additionalEmail2", value)}
                  onNext={handleStep2Next}
                  onBack={handleBack}
               />
            )}

            {/* Step 3: Date of Birth and Phone */}
            {currentStep === 3 && (
               <StepThree
                  dateOfBirth={newUserData.dateOfBirth}
                  phoneNumber={newUserData.phoneNumber}
                  errors={{
                     dateOfBirth: errors.dateOfBirth,
                     phoneNumber: errors.phoneNumber,
                  }}
                  onDateOfBirthChange={(value) => handleInputChange("dateOfBirth", value)}
                  onPhoneNumberChange={handlePhoneInputChange}
                  onBack={handleBack}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
               />
            )}

            <SignUpFooter />
         </div>
      </div>
   );
}
