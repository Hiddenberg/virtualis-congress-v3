"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./Buttons";
import PopUp from "./PopUp";
import UploadVideoManuallyButton from "./UploadVideoManuallyButton";

function StepsSlider({
   language = "es-MX",
   type = "macUpdate",
}: {
   language?: string;
   type?: "macUpdate" | "zoom";
}) {
   const [currentStep, setCurrentStep] = useState(0);

   useEffect(() => {
      setCurrentStep(0);
   }, [type]);

   const stepsData = {
      macUpdate: {
         "es-MX": [
            {
               title: "Verifica que tu sistema operativo esté actualizado en el menú de Apple",
               image: "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1743516431/macos_menu_to_update_wdvlh8.jpg",
            },
            {
               title: "Asegúrate de tener una versión de Mac OS reciente (12 o superior)",
               image: "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1743516915/macos_version_xei73t.jpg",
            },
            {
               title: "Si tu sistema operativo no está actualizado, por favor actualiza tu Mac",
               image: "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1743522681/macos_option_to_update_ssto0t.jpg",
            },
         ],
         "en-US": [
            {
               title: "Check if your operating system is up to date in the Apple menu",
               image: "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1743516431/macos_menu_to_update_wdvlh8.jpg",
            },
            {
               title: "Make sure you have a recent version of Mac OS (12 or higher)",
               image: "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1743516915/macos_version_xei73t.jpg",
            },
            {
               title: "If your operating system is not up to date, please update your Mac",
               image: "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1743522681/macos_option_to_update_ssto0t.jpg",
            },
         ],
      },
      zoom: {
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
      },
   };

   const steps = stepsData[type][language === "en-US" ? "en-US" : "es-MX"];
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
      if (currentStep < steps.length - 1) {
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
                  src={steps[currentStep]?.image || ""}
                  alt={steps[currentStep]?.title || ""}
                  fill
                  className="object-contain"
                  priority
               />
            </div>
            <p className="font-medium text-xl text-center">
               {currentStep + 1}. {steps[currentStep]?.title}
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
               {language === "en-US" ? "of" : "de"} {steps.length}
            </span>

            <button
               onClick={nextStep}
               disabled={currentStep === steps.length - 1}
               className={`px-4 py-2 rounded-md ${
                  currentStep === steps.length - 1
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

export default function MacOsDetectionPopUp({
   closePopUp,
}: {
   closePopUp: () => void;
}) {
   const [showZoomInstructions, setShowZoomInstructions] = useState(false);
   const language =
      useSearchParams().get("language") === "en-US" ? "en-US" : "es-MX";

   const texts = {
      "es-MX": {
         title: "Detección de Mac OS",
         message:
            "Hemos detectado que estás usando Mac OS. Por favor, verifica que tu sistema operativo esté actualizado para poder grabar correctamente.",
         closeButton: "Entendido",
         systemUpdated: "Mi sistema operativo está actualizado",
         dontUpdate: "No quiero actualizar mi sistema operativo",
         zoomMessage:
            "Lamentamos el inconveniente, pero las versiones antiguas de Mac no permiten usar nuestro sistema correctamente por lo que le pedimos que grabe su sesión en Zoom",
         zoomTitle: "Grabar con Zoom",
      },
      "en-US": {
         title: "Mac OS Detection",
         message:
            "We've detected that you're using Mac OS. Please verify that your operating system is up to date to record correctly.",
         closeButton: "Got it",
         systemUpdated: "My operating system is up to date",
         dontUpdate: "I don't want to update my operating system",
         zoomMessage:
            "We apologize for the inconvenience, but older versions of Mac do not allow our system to work correctly, so we ask you to record your session on Zoom",
         zoomTitle: "Record with Zoom",
      },
   };

   if (showZoomInstructions) {
      return (
         <PopUp
            canBeClosed={true}
            onClose={() => {
               closePopUp();
            }}
         >
            <div className="mx-auto p-6 max-w-4xl">
               <h1 className="mb-4 font-bold text-2xl text-center">
                  {texts[language].zoomTitle}
               </h1>
               <p className="mb-6 text-gray-700 text-center">
                  {texts[language].zoomMessage}
               </p>

               <StepsSlider language={language} type="zoom" />

               <div className="flex justify-center mt-6">
                  <UploadVideoManuallyButton language={language} />
               </div>
            </div>
         </PopUp>
      );
   }

   return (
      <PopUp
         canBeClosed={true}
         onClose={() => {
            closePopUp();
         }}
      >
         <div className="mx-auto max-w-4xl">
            <h1 className="mb-4 font-bold text-2xl text-center">
               {texts[language].title}
            </h1>
            <p className="mb-6 text-gray-700 text-center">
               {texts[language].message}
            </p>

            <StepsSlider language={language} type="macUpdate" />

            <div className="flex justify-center items-center gap-4 mt-6">
               <Button
                  variant="green"
                  onClick={() => {
                     closePopUp();
                  }}
               >
                  {texts[language].systemUpdated}
               </Button>

               <Button
                  variant="dark"
                  onClick={() => {
                     setShowZoomInstructions(true);
                  }}
                  className="!bg-gray-600"
               >
                  {texts[language].dontUpdate}
               </Button>
            </div>
         </div>
      </PopUp>
   );
}
