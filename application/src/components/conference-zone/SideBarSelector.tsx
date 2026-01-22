"use client";

import { useState } from "react";
import ConferencesSection from "./ConferencesSection";
import UpcomingConferences from "./UpcomingConferences";
// import SurveyComponent from './SurveyComponent'

export default function SideBarSelector() {
   const [activeButton, setActiveButton] = useState("Preguntas");

   const buttons = [
      // { id: 'conference', label: 'Conferencias' },
      {
         id: "questions",
         label: "Preguntas",
      },
      // { id: 'encuesta', label: 'Encuesta' },
   ];

   return (
      <div className="flex flex-col">
         <div className="flex space-x-2 p-4">
            {buttons.map((button) => (
               <button
                  type="button"
                  key={button.id}
                  onClick={() => setActiveButton(button.label)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                     activeButton === button.label ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
               >
                  {button.label}
               </button>
            ))}
         </div>

         {activeButton === "Conferencias" && (
            <div className="flex flex-col space-y-4">
               <ConferencesSection />
               <UpcomingConferences />
            </div>
         )}

         {/* {activeButton === 'Preguntas' && <QuestionsSection />} */}

         {/* {activeButton === 'Encuesta' && <SurveyComponent />} */}
      </div>
   );
}
