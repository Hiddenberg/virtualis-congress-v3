import { Check } from "lucide-react";

interface ProgressIndicatorProps {
   currentStep: number;
   totalSteps: number;
}

interface StepIndicatorProps {
   stepNumber: number;
   currentStep: number;
}

interface ConnectorProps {
   isCompleted: boolean;
}

function StepIndicator({ stepNumber, currentStep }: StepIndicatorProps) {
   const isActive = currentStep >= stepNumber;
   const isCompleted = currentStep > stepNumber;

   const stepClasses = isActive
      ? "bg-linear-to-br from-blue-600 to-blue-700 text-white ring-2 ring-blue-200"
      : "bg-gray-200 text-gray-500";

   return (
      <div
         className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold transition-all duration-300 shadow-sm ${stepClasses}`}
      >
         {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
      </div>
   );
}

function Connector({ isCompleted }: ConnectorProps) {
   const connectorClasses = isCompleted ? "bg-linear-to-r from-blue-600 to-blue-700" : "bg-gray-200";

   return <div className={`flex-1 h-2 mx-6 rounded-full transition-colors duration-300 ${connectorClasses}`} />;
}

export default function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
   const steps = Array.from({ length: totalSteps }, (_, index) => index + 1);

   return (
      <div className="mb-4">
         <div className="flex justify-between items-center mb-2">
            {steps.flatMap((stepNumber, index) => {
               const isLastStep = index === steps.length - 1;
               const isConnectorCompleted = currentStep > stepNumber;

               return [
                  <StepIndicator key={`step-${stepNumber}`} stepNumber={stepNumber} currentStep={currentStep} />,
                  ...(isLastStep ? [] : [<Connector key={`connector-${stepNumber}`} isCompleted={isConnectorCompleted} />]),
               ];
            })}
         </div>
         <p className="font-medium text-gray-600 text-xs text-center">
            Paso {currentStep} de {totalSteps}
         </p>
      </div>
   );
}
