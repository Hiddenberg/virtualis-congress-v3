"use client";

import { BarChart2 } from "lucide-react";
import { useState } from "react";

const surveyOptions = ["Regulaciones", "Costos de producción", "Investigación clínica limitada", "Complejidad de fabricación"];

export default function SurveyComponent() {
   const [selectedOption, setSelectedOption] = useState<string | null>(null);

   return (
      <div className="w-full mx-auto bg-gray-100 rounded-xl p-6 shadow-md">
         <div className="flex items-center mb-4">
            <BarChart2 className="w-6 h-6 mr-2 text-gray-700" />
            <h2 className="text-xl font-semibold">Encuesta</h2>
         </div>
         <div className="mb-4">
            <h3 className="text-lg font-medium">
               ¿Cuál es el mayor desafío en la implementación de la nanotecnología en medicamentos?
            </h3>
         </div>
         <form>
            {surveyOptions.map((option, index) => (
               <div key={index} className="mb-2">
                  <label className="flex items-center p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                     <input
                        type="radio"
                        name="survey"
                        value={option}
                        checked={selectedOption === option}
                        onChange={() => setSelectedOption(option)}
                        className="form-radio h-5 w-5 text-blue-600"
                     />
                     <span className="ml-2 text-gray-700">{option}</span>
                  </label>
               </div>
            ))}
         </form>
      </div>
   );
}
