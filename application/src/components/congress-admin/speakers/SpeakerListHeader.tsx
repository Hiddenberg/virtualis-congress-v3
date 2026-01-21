import SpeakerRegistrationPopUpButton from "./SpeakerRegistrationPopUpButton";

export default function SpeakerListHeader() {
   return (
      <div className="space-y-4 py-8 w-full">
         <h1 className="font-bold text-blue-600 text-2xl">Lista de conferencistas</h1>

         <SpeakerRegistrationPopUpButton />
      </div>
   );
}
