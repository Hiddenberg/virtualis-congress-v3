interface BaseInput {
   name: string;
   label: string;
   required?: boolean;
   errorMessage?: string;
   hasError?: boolean;
   validationErrorMessage?: string;
   validation?: (value: DynamicFormInput["value"]) => boolean;
}

interface TextInput extends BaseInput {
   type: "text";
   placeholder?: string;
   value: string;
}

interface EmailInput extends TextInput {
   type: "email";
}

interface PhoneInput extends TextInput {
   type: "phone";
}

interface NumberInput extends BaseInput {
   type: "number";
   placeholder?: string;
   value: number;
}

interface DateInput extends BaseInput {
   type: "date";
   value: string;
}

interface BooleanInput extends BaseInput {
   type: "boolean";
   value: boolean | null;
}

interface OptionInput extends BaseInput {
   type: "select";
   options: string[];
   value: string;
}

type DynamicFormInput =
   | TextInput
   | EmailInput
   | PhoneInput
   | NumberInput
   | DateInput
   | BooleanInput
   | OptionInput;
type InputType = DynamicFormInput["type"];
type InputValueType = DynamicFormInput["value"];

interface FormSection {
   title: string;
   questions: DynamicFormInput[];
   sectionValidation?: (questions: DynamicFormInput[]) => boolean;
}
