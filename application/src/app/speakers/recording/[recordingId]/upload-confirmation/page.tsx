"use client";
import { CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function UploadConfirmationPage() {
   const searchParams = useSearchParams();
   const language = searchParams.get("language");

   const texts = {
      "en-US": {
         title: "Conference Successfully Saved!",
         message1: "Your conference has been saved in our platform.",
         message2: "You can now close this page.",
         thanks: "Thank you for your participation!",
      },
      "es-MX": {
         title: "Conferencia Guardada Exitosamente!",
         message1: "Tu conferencia ha quedado guardada en nuestra plataforma.",
         message2: "Ya puedes cerrar la página.",
         thanks: "¡Gracias por tu participación!",
      },
   };

   const currentTexts = texts[language === "en-US" ? "en-US" : "es-MX"];

   return (
      <div className="flex justify-center items-center mx-auto p-4 h-screen container">
         <div className="space-y-6 shadow-md p-6 border rounded-xl w-full max-w-2xl">
            <div className="flex flex-col items-center space-y-4 text-center">
               <CheckCircle className="w-16 h-16 text-green-500" />
               <h1 className="font-bold text-2xl">{currentTexts.title}</h1>
               <p className="text-gray-600">{currentTexts.message1}</p>
               <p className="text-gray-600">{currentTexts.message2}</p>
               <p className="font-semibold text-gray-600">
                  {currentTexts.thanks}
               </p>
            </div>
         </div>
      </div>
   );
}
