"use client";

import { useRouter } from "next/navigation";
import {
   createContext,
   useCallback,
   useContext,
   useState,
   useTransition,
} from "react";
import { registrationFormSections } from "@/data/registrationFormSections";

function useDynamicFormState(formSteps: FormSection[]) {
   const [currentFormSection, setCurrentFormSection] = useState(0);
   const [inputValues, setInputValues] = useState<DynamicFormInput[]>(() => {
      return formSteps.reduce((prev, formSection) => {
         return [...prev, ...formSection.questions];
      }, [] as DynamicFormInput[]);
   });
   const [cmimFile, setCMIMFile] = useState<File | null>(null);
   const [studentCredentialFile, setStudentCredentialFile] =
      useState<File | null>(null);
   const [isSubmitting, startTransition] = useTransition();

   const router = useRouter();

   const formLenght = formSteps.length;
   const isLastSection = currentFormSection === formSteps.length - 1;
   const isFirstSection = currentFormSection === 0;
   const currentSectionInputs = inputValues.filter((input) =>
      formSteps[currentFormSection].questions.some(
         (question) => question.name === input.name,
      ),
   );
   const currentSectionTitle = formSteps[currentFormSection].title;

   function updateInputValue<TName extends DynamicFormInput["name"]>(
      name: TName,
      newValue: Extract<DynamicFormInput, { name: TName }>["value"],
   ) {
      setInputValues((prevInputValues) =>
         prevInputValues.map((input) => {
            if (input.name !== name) {
               return input;
            }

            // Now that we know `input.name === name`,
            // cast `input` to the more specific type for that `name`.
            const typedInput = input as Extract<
               DynamicFormInput,
               { name: TName }
            >;
            return {
               ...typedInput,
               value: newValue,
            };
         }),
      );
   }

   const getInputValuesObject = useCallback(() => {
      const inputValuesObject: Record<string, InputValueType> =
         inputValues.reduce((prev, input) => {
            return {
               ...prev,
               [input.name]: input.value ?? null,
            };
         }, {});

      return inputValuesObject;
   }, [inputValues]);

   const getInputValue = useCallback(
      (name: string) => {
         return inputValues.find((input) => input.name === name)?.value ?? null;
      },
      [inputValues],
   );

   const setInputError = useCallback((name: string, message: string) => {
      setInputValues((prevInputValues) =>
         prevInputValues.map((input) => {
            if (input.name !== name) {
               return input;
            }

            return {
               ...input,
               hasError: true,
               errorMessage: message,
            };
         }),
      );
   }, []);

   const clearInputError = useCallback((name: string) => {
      setInputValues((prevInputValues) =>
         prevInputValues.map((input) => {
            if (input.name !== name) {
               return input;
            }

            return {
               ...input,
               hasError: false,
               errorMessage: undefined,
            };
         }),
      );
   }, []);

   const clearAllInputErrors = useCallback(() => {
      setInputValues((prevInputValues) =>
         prevInputValues.map((input) => {
            return {
               ...input,
               hasError: false,
               errorMessage: undefined,
            };
         }),
      );
   }, []);

   const validateCurrentSection = useCallback(() => {
      clearAllInputErrors();

      const isSectionValid = currentSectionInputs.every((input) => {
         if (
            input.required &&
            (input.value === null ||
               input.value === "" ||
               input.value === undefined)
         ) {
            setInputError(input.name, "Este campo es requerido");
            return false;
         }

         if (input.validation && !input.validation(input.value)) {
            setInputError(
               input.name,
               input.validationErrorMessage ?? "Este campo no es válido",
            );
            return false;
         }

         return true;
      });

      if (
         currentFormSection === 1 &&
         inputValues.find((input) => input.name === "isCMIMAffiliated")
            ?.value === true &&
         !cmimFile
      ) {
         setInputError(
            "isCMIMAffiliated",
            "Debes subir tu comprobante para poder continuar",
         );
         return false;
      }

      if (
         currentFormSection === 4 &&
         (inputValues.find((input) => input.name === "studiesGrade")?.value ===
            "Estudiante" ||
            inputValues.find((input) => input.name === "studiesGrade")
               ?.value === "Residente") &&
         !studentCredentialFile
      ) {
         setInputError(
            "studiesGrade",
            "Debes subir tu comprobante para poder continuar",
         );
         return false;
      }

      return isSectionValid;
   }, [
      setInputError,
      currentSectionInputs,
      clearAllInputErrors,
      cmimFile,
      currentFormSection,
      inputValues,
      studentCredentialFile,
   ]);

   const nextSection = useCallback(() => {
      if (isLastSection) {
         return;
      }

      setCurrentFormSection((prev) => prev + 1);
   }, [isLastSection]);

   const prevSection = useCallback(() => {
      if (isFirstSection) {
         return;
      }

      setCurrentFormSection((prev) => prev - 1);
   }, [isFirstSection]);

   const skipCmimSection = useCallback(() => {
      updateInputValue("isCMIMAffiliated", false as never);
      setCurrentFormSection(2);
   }, []);

   const submitDynamicForm = useCallback(async () => {
      startTransition(async () => {
         // const userName = inputValues.find((input) => input.name === "name")?.value as string
         // const email = inputValues.find((input) => input.name === "email")?.value as string
         // const phoneNumber = inputValues.find((input) => input.name === "phone")?.value as string

         // const password = generateRandomPassword(25)
         // const response = await registerUserAction({
         //    fullName: userName,
         //    email,
         //    phoneNumber,
         //    password,
         //    cmimFile,
         //    studentCredentialFile,
         // }, {
         //    "acpId": getInputValue("acpID") as string,
         //    "isCMIMAffiliated": getInputValue("isCMIMAffiliated") as boolean,
         //    "age": getInputValue("age") as number,

         //    "sex": getInputValue("sex") as string,
         //    "country": getInputValue("country") as string,
         //    "city": getInputValue("city") as string,

         //    "studiesGrade": getInputValue("studiesGrade") as string,
         //    "institution": getInputValue("institution") as string,
         //    "contactWithStudents": getInputValue("contactWithStudents") as string,
         //    "howDidYouHearAboutTheCourse": getInputValue("howDidYouHearAboutTheCourse") as string,
         //    "wantToBeACPMember": getInputValue("wantToBeACPMember") as boolean,
         //    "wantToReceiveNotifications": getInputValue("wantToReceiveNotifications") as boolean,
         //    "notificationsPreference": getInputValue("notificationsPreference") as string,
         // })

         // if (response.error) {
         //    alert(response.error)
         // }

         router.push("/login?registerSuccess=true");
      });
   }, [router]);

   return {
      inputValues,
      isSubmitting,
      formLenght,
      isLastSection,
      isFirstSection,
      currentSectionInputs,
      currentFormSection,
      currentSectionTitle,
      cmimFile,
      studentCredentialFile,
      updateInputValue,
      submitDynamicForm,
      getInputValuesObject,
      getInputValue,
      setInputError,
      clearInputError,
      validateCurrentSection,
      nextSection,
      prevSection,
      setCMIMFile,
      setStudentCredentialFile,
      skipCmimSection,
   };
}

const RegistrationFormContext = createContext(
   {} as ReturnType<typeof useDynamicFormState>,
);

export function DynamicFormContextProvider({
   children,
}: {
   children: React.ReactNode;
}) {
   const registrationFormState = useDynamicFormState(registrationFormSections);

   return (
      <RegistrationFormContext.Provider value={registrationFormState}>
         {children}
      </RegistrationFormContext.Provider>
   );
}

export function useDynamicFormContext() {
   if (!RegistrationFormContext) {
      throw new Error(
         "useRegistrationFormContext must be used within a RegistrationFormContextProvider",
      );
   }

   return useContext(RegistrationFormContext);
}
