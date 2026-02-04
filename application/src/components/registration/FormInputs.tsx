"use client";

import { useDynamicFormContext } from "@/contexts/DynamicFormContext";
import { Button } from "../global/Buttons";

function TextInput({ textInput }: { textInput: TextInput }) {
   const { updateInputValue } = useDynamicFormContext();

   return (
      <input
         type="text"
         name={textInput.name}
         placeholder={textInput.placeholder}
         required={textInput.required}
         value={textInput.value}
         onChange={(e) => {
            updateInputValue(textInput.name, e.target.value);
         }}
      />
   );
}

function EmailInput({ emailInput }: { emailInput: EmailInput }) {
   const { updateInputValue } = useDynamicFormContext();

   return (
      <input
         type="email"
         name={emailInput.name}
         placeholder={emailInput.placeholder}
         required={emailInput.required}
         value={emailInput.value}
         onChange={(e) => {
            updateInputValue(emailInput.name, e.target.value);
         }}
      />
   );
}

function PhoneInput({ phoneInput }: { phoneInput: PhoneInput }) {
   const { updateInputValue } = useDynamicFormContext();

   return (
      <input
         type="tel"
         name={phoneInput.name}
         placeholder={phoneInput.placeholder}
         required={phoneInput.required}
         value={phoneInput.value}
         onChange={(e) => {
            updateInputValue(phoneInput.name, e.target.value);
         }}
      />
   );
}

function NumberInput({ numberInput }: { numberInput: NumberInput }) {
   const { updateInputValue } = useDynamicFormContext();

   return (
      <input
         type="number"
         name={numberInput.name}
         placeholder={numberInput.placeholder}
         required={numberInput.required}
         value={numberInput.value || ""}
         onChange={(e) => {
            updateInputValue(numberInput.name, e.target.value);
         }}
      />
   );
}

function DateInput({ dateInput }: { dateInput: DateInput }) {
   const { updateInputValue } = useDynamicFormContext();

   return (
      <input
         type="date"
         name={dateInput.name}
         required={dateInput.required}
         value={dateInput.value}
         onChange={(e) => {
            updateInputValue(dateInput.name, e.target.value);
         }}
      />
   );
}

function BooleanInput({ checkboxInput: booleanInput }: { checkboxInput: BooleanInput }) {
   const { updateInputValue } = useDynamicFormContext();

   return (
      <div className="flex gap-2">
         <Button
            className={`py-1! px-6! ${booleanInput.value === true ? "bg-yellow-400!" : ""}`}
            onClick={() => updateInputValue(booleanInput.name, true)}
            variant="secondary"
         >
            Sí
         </Button>
         <Button
            className={`py-1! px-6! ${booleanInput.value === false ? "bg-yellow-400!" : ""}`}
            onClick={() => updateInputValue(booleanInput.name, false)}
            variant="secondary"
         >
            No
         </Button>
      </div>
   );
}

function OptionInput({ optionInput }: { optionInput: OptionInput }) {
   const { updateInputValue } = useDynamicFormContext();

   return (
      <select
         name={optionInput.name}
         required={optionInput.required}
         value={optionInput.value}
         className="bg-transparent border-b-2 focus-within:border-b-yellow-400 active:border-b-yellow-400 transition-colors"
         onChange={(e) => {
            updateInputValue(optionInput.name, e.target.value);
         }}
      >
         <option className="bg-transparent text-black" key="dpbw" value="" selected disabled hidden defaultChecked>
            Selecciona
         </option>
         {optionInput.options.map((option) => (
            <option className="bg-transparent text-black" key={option} value={option}>
               {option}
            </option>
         ))}
      </select>
   );
}

function FormInput({ registrationInput }: { registrationInput: DynamicFormInput }) {
   const { inputValues } = useDynamicFormContext();
   const inputValue = inputValues.find((input) => input.name === registrationInput.name);

   if (!inputValue) {
      return null;
   }

   switch (registrationInput.type) {
      case "text":
         return <TextInput textInput={inputValue as TextInput} />;
      case "email":
         return <EmailInput emailInput={inputValue as EmailInput} />;
      case "phone":
         return <PhoneInput phoneInput={inputValue as PhoneInput} />;
      case "number":
         return <NumberInput numberInput={inputValue as NumberInput} />;
      case "date":
         return <DateInput dateInput={inputValue as DateInput} />;
      case "boolean":
         return <BooleanInput checkboxInput={inputValue as BooleanInput} />;
      case "select":
         return <OptionInput optionInput={inputValue as OptionInput} />;
      default:
         return null;
   }
}

export default function RegisterFormInput({ registrationInput }: { registrationInput: DynamicFormInput }) {
   return (
      <div className="block [&>input]:bg-transparent [&>input]:border-b-2 [&>input]:w-full [&>input]:text-white [&>input]:focus:outline-none [&>input]:outline-none [&>input]:focus:border-b-yellow-400 [&>input]:focus-within:border-b-yellow-400">
         {registrationInput.hasError && <span className="block text-red-500 text-sm">{registrationInput.errorMessage}</span>}
         <span className="block mb-2">
            {registrationInput.label} {registrationInput.required && <span className="text-red-500">*</span>}
         </span>
         <FormInput registrationInput={registrationInput} />
      </div>
   );
}
