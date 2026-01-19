"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/global/Buttons";

type SuperAdminToolCardProps =
   | {
        action: () => Promise<BackendResponse<unknown>>;
        description?: string;
        buttonText: string;
        withInput?: false;
        inputPlaceholder?: undefined;
     }
   | {
        action: (input: string) => Promise<BackendResponse<unknown>>;
        description?: string;
        buttonText: string;
        withInput: true;
        inputPlaceholder: string;
     };

export default function SuperAdminToolCard({
   action,
   description,
   buttonText,
   withInput,
   inputPlaceholder,
}: SuperAdminToolCardProps) {
   const [results, setResults] = useState<string | null>(null);
   const [resultMessage, setResultMessage] = useState<string | null>(null);
   const [resultStatus, setResultStatus] = useState<"success" | "error" | null>(
      null,
   );
   const [isLoading, startTransition] = useTransition();
   const [inputText, setInputText] = useState<string>("");

   const handleAction = () => {
      const confirmation = confirm(
         `¿Estás seguro de querer ejecutar esta acción?: ${buttonText}`,
      );
      if (!confirmation) {
         return;
      }
      // reset the results and error occured
      setResults(null);
      setResultStatus(null);

      startTransition(async () => {
         if (withInput) {
            const response = await action(inputText);
            if (response.success) {
               if (response.successMessage) {
                  setResultMessage(response.successMessage);
               }
               setResults(JSON.stringify(response.data, null, 2));
               setResultStatus("success");
            } else {
               setResultMessage(response.errorMessage);
               setResultStatus("error");
            }
         } else {
            const response = await action();
            if (response.success) {
               if (response.successMessage) {
                  setResultMessage(response.successMessage);
               }
               setResults(JSON.stringify(response.data, null, 2));
               setResultStatus("success");
            } else {
               setResultMessage(response.errorMessage);
               setResultStatus("error");
            }
         }
      });
   };

   return (
      <div className="space-y-2 bg-white shadow-sm p-2 border border-gray-200 rounded-lg">
         {/* button section */}
         {withInput && (
            <input
               type="text"
               value={inputText}
               onChange={(e) => setInputText(e.target.value)}
               placeholder={inputPlaceholder}
               className="p-2 border border-gray-300 rounded-lg"
            />
         )}
         <Button loading={isLoading} onClick={handleAction}>
            {buttonText}
         </Button>

         {description && !resultStatus && (
            <p className="text-gray-600 text-sm">{description}</p>
         )}

         {/* Result Section */}
         {resultStatus && (
            <div
               className={`p-2 rounded-lg ${resultStatus === "error" ? "bg-red-50 border border-red-200" : resultStatus === "success" ? "bg-green-50 border border-green-200" : ""}`}
            >
               <h3 className="font-medium text-gray-800 text-lg">
                  Resultados:
               </h3>
               {resultMessage && (
                  <p className="text-gray-600 text-sm">{resultMessage}</p>
               )}
               <pre className="max-h-96 overflow-y-auto">
                  <code
                     datatype="json"
                     className="max-h-96 font-mono text-gray-600 text-sm"
                  >
                     {results}
                  </code>
               </pre>
            </div>
         )}
      </div>
   );
}
