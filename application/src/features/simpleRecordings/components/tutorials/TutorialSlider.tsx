/* eslint-disable @next/next/no-img-element */
"use client";

import { ChevronLeft, ChevronRight, InfoIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/global/Buttons";

export interface TutorialStep {
   imageURL: string;
   description: string;
   notes?: string;
}

interface TutorialSliderProps {
   title: string;
   steps: TutorialStep[];
   onFinish: () => void;
   lastButtonText?: string;
}

export default function TutorialSlider({ title, steps, onFinish, lastButtonText }: TutorialSliderProps) {
   const [currentStep, setCurrentStep] = useState(0);

   const totalSteps = steps.length;
   const isLastStep = currentStep === totalSteps - 1;
   const isFirstStep = currentStep === 0;

   const previousStep = () => {
      if (currentStep > 0) {
         setCurrentStep(currentStep - 1);
      }
   };

   const nextStep = () => {
      if (isLastStep) {
         onFinish();
         return;
      }

      if (currentStep < totalSteps - 1) {
         setCurrentStep(currentStep + 1);
      }
   };

   return (
      <div className="flex justify-center items-center bg-linear-to-br from-blue-50 to-indigo-50 p-2 sm:p-4">
         <div className="flex flex-col bg-white shadow-2xl mx-auto rounded-2xl sm:rounded-3xl w-full max-w-5xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5">
               <h1 className="font-bold text-white text-xl sm:text-2xl lg:text-3xl text-center">{title}</h1>
               <p className="mt-1 sm:mt-2 font-medium text-blue-100 text-sm text-center">
                  Paso {currentStep + 1} de {totalSteps}
               </p>
            </div>

            {/* Content - Scrollable if needed */}
            <div key={currentStep} className="flex-1 px-4 sm:px-6 lg:px-8 py-1 animate-appear">
               {/* Description */}
               <div className="space-y-2 sm:space-y-3 bg-blue-50 mt-3 sm:mt-4 mb-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl">
                  <p className="font-semibold text-gray-800 text-sm sm:text-base lg:text-lg leading-relaxed">
                     {currentStep + 1}. {steps[currentStep].description}
                  </p>

                  {/* Notes */}
                  {steps[currentStep].notes && (
                     <div className="flex gap-2 sm:gap-3 bg-red-100 px-3 sm:px-4 py-2 sm:py-3 border-blue-400 border-l-4 rounded-lg">
                        <InfoIcon className="flex-shrink-0 mt-0.5 w-4 sm:w-5 h-4 sm:h-5 text-red-500" />
                        <p className="font-semibold text-blue-900 text-xs sm:text-sm leading-relaxed">
                           Nota: {steps[currentStep].notes}
                        </p>
                     </div>
                  )}
               </div>
               {/* Image */}
               <div className="relative bg-gray-50 !shadow-lg mx-auto !border !border-gray-500 rounded-xl sm:rounded-2xl w-full overflow-hidden">
                  <span className="top-0 !left-[50%] absolute bg-red-500 px-2 py-1 rounded-b-lg text-white text-xs sm:text-sm !-translate-x-1/2">
                     Imagen de ejemplo
                  </span>
                  <img
                     src={steps[currentStep].imageURL}
                     alt={steps[currentStep].description}
                     className="mx-auto w-full h-auto object-contain"
                  />
               </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center bg-gray-50 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5">
               <Button
                  variant="secondary"
                  onClick={previousStep}
                  disabled={isFirstStep}
                  className="!gap-1 !px-3 sm:!px-4 !py-1.5 sm:!py-2 !text-sm sm:!text-base"
               >
                  <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5" />
                  Anterior
               </Button>

               {/* Progress Indicators */}
               <div className="flex justify-center items-center gap-2 bg-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                  {steps.map((_, index) => (
                     <div
                        key={index}
                        className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                           index === currentStep
                              ? "bg-blue-500 w-10 sm:w-12"
                              : index < currentStep
                                ? "bg-blue-300 w-6 sm:w-8"
                                : "bg-gray-200 w-6 sm:w-8"
                        }`}
                     />
                  ))}
               </div>

               <Button
                  variant="blue"
                  onClick={nextStep}
                  className="!gap-1 !px-3 sm:!px-4 !py-1.5 sm:!py-2 !text-sm sm:!text-base"
               >
                  {isLastStep ? lastButtonText || "Continuar" : "Siguiente"}
                  {!isLastStep && <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5" />}
               </Button>
            </div>
         </div>
      </div>
   );
}
