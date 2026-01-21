import { Check } from "lucide-react";

interface ProgressIndicatorProps {
   currentStep: number;
   totalSteps: number;
}

export default function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
   return (
      <div className="mb-10">
         <div className="flex justify-between items-center mb-6">
            <div
               className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold transition-all duration-300 shadow-sm ${
                  currentStep >= 1
                     ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white ring-2 ring-blue-200"
                     : "bg-gray-200 text-gray-500"
               }`}
            >
               {currentStep > 1 ? <Check className="w-5 h-5" /> : "1"}
            </div>
            <div
               className={`flex-1 h-2 mx-6 rounded-full transition-colors duration-300 ${
                  currentStep > 1 ? "bg-gradient-to-r from-blue-600 to-blue-700" : "bg-gray-200"
               }`}
            />
            <div
               className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold transition-all duration-300 shadow-sm ${
                  currentStep >= 2
                     ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white ring-2 ring-blue-200"
                     : "bg-gray-200 text-gray-500"
               }`}
            >
               2
            </div>
         </div>
         <p className="font-medium text-gray-600 text-sm text-center">
            Paso {currentStep} de {totalSteps}
         </p>
      </div>
   );
}
