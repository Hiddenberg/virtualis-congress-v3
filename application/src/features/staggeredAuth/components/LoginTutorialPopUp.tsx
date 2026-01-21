"use client";

import { useEffect } from "react";
import { Button } from "@/components/global/Buttons";
import { useGlobalPopUpContext } from "@/features/globalPopUp/context/GlobalPopUpContext";

function TutorialContent() {
   const { closePopUp } = useGlobalPopUpContext();
   return (
      <div className="flex flex-col gap-4">
         <h1 className="font-bold text-2xl text-center">Como ingresar a la plataforma</h1>
         <iframe
            className="rounded-lg w-full aspect-video"
            src="https://drive.google.com/file/d/1Ae6rm-qgRaJ4sefcUMLKs_Wbp7VBjFkV/preview"
            // width="640"
            // height="480"
            allow="autoplay"
         />

         <Button onClick={closePopUp} variant="dark" className="mx-auto w-full">
            Entendido
         </Button>
      </div>
   );
}

export default function LoginTutorialPopUp() {
   const { showInPopUp } = useGlobalPopUpContext();

   useEffect(() => {
      showInPopUp(<TutorialContent />);
   }, [showInPopUp]);

   return <div />;
}
