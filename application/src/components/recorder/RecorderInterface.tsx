"use client";

import { useContext } from "react";
import { ScreenRecorderContext } from "@/contexts/ScreenRecorderContext";
// import { HelpCircle } from "lucide-react";
// import { LinkButton } from "../global/Buttons";
import { PermissionCheck } from "../PermissionCheck";
import ConfirmationScreen from "./ConfirmationScreen";
import { ControlButtonsBar } from "./ControlButtonsBar";
import { RecordingTimerBar } from "./RecordingTimer";
import SynchronizedPlayerControls from "./SynchronizedPlayerControls";
import UploadingScreen from "./UploadingScreen";
import { VideoPreviews } from "./VideoPreviews";

type RecorderInterfaceProps = {
   language?: string;
};

function RecorderInterface({ language = "es-MX" }: RecorderInterfaceProps) {
   const { isStopped, isUploading, isUploaded } = useContext(
      ScreenRecorderContext,
   );

   // const texts = {
   //    "en-US": {
   //       viewing: "View Recording",
   //       recording: "Record Conference",
   //       needHelp: "Need help",
   //       whatsappMsg: "Hello, I need help recording a conference",
   //       settingUp: "Setting up recording..."
   //    },
   //    "es-MX": {
   //       viewing: "Ver Grabación",
   //       recording: "Grabar Conferencia",
   //       needHelp: "Necesitas ayuda",
   //       whatsappMsg: "Hola, necesito ayuda al momento de grabar una conferencia",
   //       settingUp: "Configurando la grabación..."
   //    }
   // };

   // const currentTexts = texts[language === "en-US" ? "en-US" : "es-MX"];

   if (isUploading) {
      return <UploadingScreen language={language} />;
   }

   if (isUploaded) {
      return (
         <ConfirmationScreen language={language} isSimpleRecording={true} />
      );
   }

   return (
      <div className="mx-auto my-4 p-4 border-2 rounded-lg w-full max-w-screen-xl">
         {/* <div className="mb-4">
            <h2 className="text-xl text-center">
               {recorderState === "settingUp" 
                  ? currentTexts.settingUp 
                  : isStopped ? currentTexts.viewing : currentTexts.recording}
            </h2>
         </div> */}

         <PermissionCheck />

         <VideoPreviews />
         {!isStopped && <RecordingTimerBar />}
         {isStopped ? (
            <SynchronizedPlayerControls language={language} />
         ) : (
            <ControlButtonsBar language={language} />
         )}

         {/* <LinkButton
            href={`https://wa.me/5619920940?text=${encodeURIComponent(currentTexts.whatsappMsg)}`}
            target='_blank'
            className="mx-auto mt-4 w-max">
            {currentTexts.needHelp}
            <HelpCircle className='hidden md:inline-block size-8' />
         </LinkButton> */}
      </div>
   );
}

export default RecorderInterface;
