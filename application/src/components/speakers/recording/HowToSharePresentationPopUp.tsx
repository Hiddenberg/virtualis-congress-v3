"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/global/Buttons";
import PopUp from "@/components/global/PopUp";

function StepsSlider({ language = "es-MX" }: { language?: string }) {
   const [currentStep, setCurrentStep] = useState(0);

   const steps = {
      "es-MX": [
         {
            title: "Abrir Presentación y Seleccionar Modo Lectura (no pantalla completa)",
            image: "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1743285979/setp1_ad0fdk.png",
         },
         {
            title: 'Regresar a la ventana de grabación, y compartir la "Ventana" con la presentación correcta"',
            image: "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1743285979/step2_yq22z3.png",
         },
         {
            title: "Colocar el Power Point sobre la pantalla de grabación para corroborar que sus diapositivas aparecen correctamente, que su cámara está bien y aparece su video correctamente. Y comenzar a grabar",
            image: "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1743285979/step3_dhkqmj.png",
         },
      ],
      "en-US": [
         {
            title: "Open Presentation and Select Reading View (not full screen)",
            image: "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1743285979/setp1_ad0fdk.png",
         },
         {
            title: 'Return to the recording window, and share the "Window" with the correct presentation',
            image: "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1743285979/step2_yq22z3.png",
         },
         {
            title: "Position PowerPoint over the recording screen to verify that your slides appear correctly, your camera is working properly, and your video appears correctly. Then start recording",
            image: "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1743285979/step3_dhkqmj.png",
         },
      ],
   };

   const currentSteps = steps[language === "en-US" ? "en-US" : "es-MX"];
   const buttonText = {
      "en-US": {
         previous: "Previous",
         next: "Next",
         step: "Step",
      },
      "es-MX": {
         previous: "Anterior",
         next: "Siguiente",
         step: "Paso",
      },
   };
   const texts = buttonText[language === "en-US" ? "en-US" : "es-MX"];

   const nextStep = () => {
      if (currentStep < currentSteps.length - 1) {
         setCurrentStep(currentStep + 1);
      }
   };

   const previousStep = () => {
      if (currentStep > 0) {
         setCurrentStep(currentStep - 1);
      }
   };

   return (
      <div className="bg-white shadow-lg p-6 rounded-lg">
         <div className="flex flex-col items-center gap-4 mb-6">
            <div className="relative w-full max-w-2xl h-[400px]">
               <Image
                  src={currentSteps[currentStep]?.image || ""}
                  alt={currentSteps[currentStep]?.title || ""}
                  fill
                  className="object-contain"
                  priority
               />
            </div>
            <p className="font-medium text-xl text-center">
               {currentStep + 1}. {currentSteps[currentStep]?.title}
            </p>
         </div>

         <div className="flex justify-between items-center">
            <button
               onClick={previousStep}
               disabled={currentStep === 0}
               className={`px-4 py-2 rounded-md ${
                  currentStep === 0
                     ? "bg-gray-300 cursor-not-allowed"
                     : "bg-blue-500 hover:bg-blue-600 text-white"
               }`}
            >
               {texts.previous}
            </button>

            <span className="text-gray-600">
               {texts.step} {currentStep + 1}{" "}
               {language === "en-US" ? "of" : "de"} {currentSteps.length}
            </span>

            <button
               onClick={nextStep}
               disabled={currentStep === currentSteps.length - 1}
               className={`px-4 py-2 rounded-md ${
                  currentStep === currentSteps.length - 1
                     ? "bg-gray-300 cursor-not-allowed"
                     : "bg-blue-500 hover:bg-blue-600 text-white"
               }`}
            >
               {texts.next}
            </button>
         </div>
      </div>
   );
}

export default function HowToSharePresentationPopUp({
   onClose,
   language = "es-MX",
}: {
   onClose: () => void;
   language?: string;
}) {
   const title =
      language === "en-US"
         ? "How to share your presentation"
         : "Como compartir tu presentación";

   return (
      <PopUp onClose={onClose}>
         <div className="mx-auto p-6 max-w-4xl">
            <h2 className="mb-6 font-bold text-2xl text-center">{title}</h2>
            <StepsSlider language={language} />

            <Button onClick={onClose} variant="dark" className="mx-auto mt-6">
               {language === "en-US" ? "Close" : "Entendido"}
            </Button>
         </div>
      </PopUp>
   );
}
