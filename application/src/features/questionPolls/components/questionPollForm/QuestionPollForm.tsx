"use client";

import { Plus, Trash2 } from "lucide-react";
import { nanoid } from "nanoid";
import { useState } from "react";
import { createQuestionPollAndLinkToConferenceAction } from "@/features/questionPolls/serverActions/questionPollActions";

export default function QuestionPollForm({ conferenceId }: { conferenceId: CongressConferenceRecord["id"] }) {
   const [question, setQuestion] = useState("");
   const [options, setOptions] = useState<string[]>(["", ""]); // at least two inputs
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [success, setSuccess] = useState<string | null>(null);

   const updateOption = (index: number, value: string) => {
      setOptions((prev) => prev.map((opt, i) => (i === index ? value : opt)));
   };

   const addOption = () => setOptions((prev) => [...prev, ""]);
   const removeOption = (index: number) => setOptions((prev) => prev.filter((_, i) => i !== index));

   const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      const response = await createQuestionPollAndLinkToConferenceAction({
         conferenceId,
         question,
         options,
      });

      setIsSubmitting(false);
      if (!response.success) {
         setError(response.errorMessage ?? "No se pudo crear la encuesta");
         return;
      }
      setQuestion("");
      setOptions(["", ""]);
      setSuccess("Encuesta creada correctamente");
   };

   return (
      <form onSubmit={handleSubmit} className="space-y-6">
         <div>
            <label className="block mb-2 font-medium text-gray-900 text-sm">Pregunta</label>
            <textarea
               value={question}
               onChange={(e) => setQuestion(e.target.value)}
               placeholder="Escribe la pregunta de la encuesta"
               className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-gray-900 placeholder-gray-400"
               disabled={isSubmitting}
            />
         </div>

         <div>
            <label className="block mb-2 font-medium text-gray-900 text-sm">Opciones</label>
            <div className="space-y-3">
               {options.map((opt, index) => (
                  <div key={nanoid()} className="flex items-center gap-2">
                     <input
                        type="text"
                        value={opt}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Opción ${index + 1}`}
                        className="flex-1 px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                        disabled={isSubmitting}
                     />
                     {options.length > 2 && (
                        <button
                           type="button"
                           onClick={() => removeOption(index)}
                           className="hover:bg-gray-50 disabled:opacity-50 px-3 py-2 border border-gray-300 rounded-md text-gray-700"
                           disabled={isSubmitting}
                           aria-label="Eliminar opción"
                        >
                           <Trash2 className="w-4 h-4" />
                        </button>
                     )}
                  </div>
               ))}
               <button
                  type="button"
                  onClick={addOption}
                  className="inline-flex items-center gap-2 hover:bg-gray-50 disabled:opacity-50 px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                  disabled={isSubmitting}
               >
                  <Plus className="w-4 h-4" /> Agregar opción
               </button>
            </div>
         </div>

         {error && <div className="bg-red-50 px-4 py-2 rounded-md text-red-700">{error}</div>}
         {success && <div className="bg-green-50 px-4 py-2 rounded-md text-green-700">{success}</div>}

         <div className="flex justify-end">
            <button
               type="submit"
               className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-5 py-2 rounded-md text-white"
               disabled={isSubmitting}
            >
               {isSubmitting ? "Creando..." : "Crear encuesta"}
            </button>
         </div>
      </form>
   );
}
