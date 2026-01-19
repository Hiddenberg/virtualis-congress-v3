"use client";

import { useState } from "react";
import { Button } from "@/components/global/Buttons";
import PopUp from "@/components/global/PopUp";
import AdminSpeakerRegistrationForm from "./AdminSpeakerRegistrationForm";

function SpeakerRegistrationPopUp({
   isOpen,
   setIsOpen,
}: {
   isOpen: boolean;
   setIsOpen: (isOpen: boolean) => void;
}) {
   if (!isOpen) return null;

   return (
      <PopUp onClose={() => setIsOpen(false)}>
         <AdminSpeakerRegistrationForm closePopUp={() => setIsOpen(false)} />
      </PopUp>
   );
}

export default function SpeakerRegistrationPopUpButton() {
   const [isOpen, setIsOpen] = useState(false);

   return (
      <div>
         <Button onClick={() => setIsOpen(true)}>
            Registrar nuevo conferencista
         </Button>

         <SpeakerRegistrationPopUp isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
   );
}
