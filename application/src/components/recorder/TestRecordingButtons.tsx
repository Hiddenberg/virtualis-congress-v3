import { Button } from "../global/Buttons";

export default function TestRecordingButtons({
   language,
}: {
   language: "es-MX" | "en-US";
}) {
   const texts = {
      "es-MX": {
         startTest: "Comenzar Prueba",
      },
      "en-US": {
         startTest: "Start Test",
      },
   };
   return (
      <div>
         <Button onClick={() => {}}>{texts[language].startTest}</Button>
      </div>
   );
}
