"use client";

import { CheckCircle, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getSpeakerEmailByRecordingIdAction } from "@/actions/userActions";

type ConfirmationScreenProps = {
   language?: string;
   isSimpleRecording?: boolean;
};

export default function ConfirmationScreen({
   language = "es-MX",
   isSimpleRecording = false,
}: ConfirmationScreenProps) {
   const { recordingId } = useParams();

   const [isLoading, setIsLoading] = useState(true);
   const [speakerEmail, setSpeakerEmail] = useState("");

   useEffect(() => {
      const getSpeakerEmail = async () => {
         try {
            const speakerEmail = await getSpeakerEmailByRecordingIdAction(
               recordingId as string,
            );
            setSpeakerEmail(speakerEmail);
            setIsLoading(false);
         } catch {
            setSpeakerEmail("");
         }
      };

      getSpeakerEmail();
   }, [recordingId]);

   const simpleRecordingTexts = {
      title: "Grabación Guardada Exitosamente!",
      message1:
         "Tu grabación ha sido guardada en nuestra plataforma exitosamente",
      message2: "Ya puedes cerrar la página.",
      message3: ``,
      thanks: "¡Gracias por tu participación!",
   };
   const texts = {
      "en-US": {
         title: "Conference Successfully Saved!",
         message1:
            "Your conference has been saved in our platform, you will receive an email with the link to the conference once the videos have been processed.",
         message2: "You can now close this page.",
         message3: `You will receive this email at:`,
         thanks: "Thank you for your participation!",
      },
      "es-MX": {
         title: "Conferencia Guardada Exitosamente!",
         message1:
            "Tu conferencia ha sido guardada en nuestra plataforma, recibirás un correo electrónico con el link de la conferencia una vez que se hayan procesado los videos.",
         message2: "Ya puedes cerrar la página.",
         message3: `Se enviará este correo electrónico a:`,
         thanks: "¡Gracias por tu participación!",
      },
   };

   const currentTexts = texts[language === "en-US" ? "en-US" : "es-MX"];

   if (isLoading) {
      return (
         <div className="flex justify-center items-center mx-auto mt-10 p-4 container">
            <Loader2 className="w-16 h-16 text-gray-500 animate-spin" />
         </div>
      );
   }

   return (
      <div className="flex justify-center items-center mx-auto mt-10 p-4 container">
         <div className="space-y-6 shadow-md p-6 border rounded-xl w-full max-w-2xl">
            <div className="flex flex-col items-center space-y-4 text-center">
               <CheckCircle className="w-16 h-16 text-green-500" />
               <h1 className="font-bold text-2xl">
                  {isSimpleRecording
                     ? simpleRecordingTexts.title
                     : currentTexts.title}
               </h1>
               <p className="text-gray-600">
                  {isSimpleRecording
                     ? simpleRecordingTexts.message1
                     : currentTexts.message1}
               </p>
               <p className="text-gray-600">
                  {isSimpleRecording
                     ? simpleRecordingTexts.message2
                     : currentTexts.message2}
               </p>
               <p className="text-gray-600">
                  {isSimpleRecording
                     ? simpleRecordingTexts.message3
                     : currentTexts.message3}{" "}
                  <strong>{speakerEmail}</strong>
               </p>
               <p className="font-semibold text-gray-600">
                  {isSimpleRecording
                     ? simpleRecordingTexts.thanks
                     : currentTexts.thanks}
               </p>
            </div>
         </div>
      </div>
   );
}
