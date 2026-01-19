"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import PopUp from "@/components/global/PopUp";
import UploadVideoManuallyButton from "@/components/global/UploadVideoManuallyButton";
import { useGlobalPopUpContext } from "@/features/globalPopUp/context/GlobalPopUpContext";

function StepsSlider({ language = "es-MX" }: { language?: string }) {
   const [currentStep, setCurrentStep] = useState(0);

   const steps = {
      "en-US": [
         {
            title: "Select the presentation",
            image: "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1742936590/Paso_1_Seleccionar_la_presentaci%C3%B3n_zm60l2.png",
         },
         {
            title: 'Select "Record on this computer"',
            image: "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1742936590/Paso_2_Seleccionar_grabar_en_esta_computadora_rdetgv.png",
         },
         {
            title: "End the Zoom call",
            image: "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1742936590/Paso_3_Terminar_la_llamada_de_Zoom_jkrw5h.png",
         },
         {
            title: "Confirm that the recording is being saved to the computer",
            image: "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1742936590/Paso_4_Ver_que_se_est%C3%A1_guardando_la_grabaci%C3%B3n_en_la_computadora_iaqka4.png",
         },
         {
            title: "Go to the folder where the MP4 was saved and upload it to the platform",
            image: "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1742936590/Paso_5_Ir_a_la_carpeta_donde_se_guard%C3%B3_el_MP4_y_subirlo_a_la_plataforma_uxd7ci.png",
         },
      ],
      "es-MX": [
         {
            title: "Seleccionar la presentación",
            image: "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1742936590/Paso_1_Seleccionar_la_presentaci%C3%B3n_zm60l2.png",
         },
         {
            title: 'Seleccionar "Grabar en esta computadora"',
            image: "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1742936590/Paso_2_Seleccionar_grabar_en_esta_computadora_rdetgv.png",
         },
         {
            title: "Terminar la llamada de zoom",
            image: "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1742936590/Paso_3_Terminar_la_llamada_de_Zoom_jkrw5h.png",
         },
         {
            title: "Confirmar que la grabación se está guardando en la computadora",
            image: "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1742936590/Paso_4_Ver_que_se_est%C3%A1_guardando_la_grabaci%C3%B3n_en_la_computadora_iaqka4.png",
         },
         {
            title: "Ir a la carpeta donde se guardó el MP4 y subirlo a la plataforma",
            image: "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1742936590/Paso_5_Ir_a_la_carpeta_donde_se_guard%C3%B3_el_MP4_y_subirlo_a_la_plataforma_uxd7ci.png",
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
               {currentSteps[currentStep]?.title}
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

export default function HowToRecordOnZoomPopUp({
   onClose,
   language = "es-MX",
}: {
   onClose?: () => void;
   language?: string;
}) {
   const title =
      language === "en-US" ? "How to record on Zoom" : "Como grabar en Zoom";

   const { showInPopUp } = useGlobalPopUpContext();

   useEffect(() => {
      showInPopUp(
         <div>
            <h2 className="mb-6 font-bold text-2xl text-center">{title}</h2>
            <StepsSlider language={language} />
         </div>,
      );
   }, [showInPopUp, language, title]);

   return null;

   return (
      <PopUp onClose={onClose || (() => {})}>
         <div className="mx-auto p-6 max-w-4xl">
            <StepsSlider language={language} />

            <div className="flex justify-center mx-auto mt-6 w-full">
               <UploadVideoManuallyButton language={language} />
            </div>
         </div>
      </PopUp>
   );
}
