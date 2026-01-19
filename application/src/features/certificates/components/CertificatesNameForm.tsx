"use client";

import { CheckCircle2, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { LinkButton } from "@/components/global/Buttons";
import { useStaggeredAuthContext } from "@/features/staggeredAuth/context/StaggeredAuthContext";
import { capitalizeText } from "@/utils/textUtils";
import { createCongressCertificateAction } from "../serverActions/congressCertificateActions";

export default function CertificatesNameForm() {
   const [formData, setFormData] = useState({
      fullName: "",
      academicTitle: "",
      preferredName: "",
      includeMiddleName: true,
      namePreview: "",
   });

   const [loading, setLoading] = useState(false);
   const [loadingStep, setLoadingStep] = useState(0);
   const [loadingComplete, setLoadingComplete] = useState(false);
   const [randomDuration, setRandomDuration] = useState(0);
   const [submitCompleted, setSubmitCompleted] = useState(false);

   const loadingMessages = [
      "Preparando el formato de tus certificados...",
      "Configurando tus preferencias de nombre...",
      "Actualizando plantillas de certificados...",
      "Sincronizando con la base de datos...",
      "Personalizando tu experiencia en Virtualis Congress...",
      "Aplicando cambios a todos tus certificados...",
      "¡Estamos casi listos!",
   ];

   useEffect(() => {
      let interval: NodeJS.Timeout;

      if (loading && !loadingComplete && submitCompleted) {
         interval = setInterval(() => {
            setLoadingStep((prevStep) => {
               const nextStep = prevStep + 1;

               // If we've shown all messages and reached the random duration
               if (
                  nextStep >= loadingMessages.length ||
                  nextStep >= randomDuration / 1000
               ) {
                  clearInterval(interval);

                  // Add a slight delay before showing completion
                  setTimeout(() => {
                     setLoadingComplete(true);

                     // Redirect after showing completion message
                     setTimeout(() => {
                        // Redirect logic would go here
                        // For demo, we just reset the loading state
                        // setLoading(false)
                        // setLoadingStep(0)
                        // setLoadingComplete(false)
                     }, 1500);
                  }, 500);

                  return prevStep;
               }

               return nextStep;
            });
         }, 1000);
      }

      return () => {
         if (interval) clearInterval(interval);
      };
   }, [
      loading,
      loadingComplete,
      randomDuration,
      loadingMessages.length,
      submitCompleted,
   ]);

   const router = useRouter();
   const { user } = useStaggeredAuthContext();

   if (user === null) {
      router.push("/login");
   }

   const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
   ) => {
      const { name, value, type } = e.target;
      const isCheckbox = type === "checkbox";
      const newValue = isCheckbox
         ? (e.target as HTMLInputElement).checked
         : value;

      setFormData((prev) => {
         const newData = {
            ...prev,
            [name]: newValue,
         };

         // Update the name preview whenever form fields change
         if (
            [
               "fullName",
               "academicTitle",
               "preferredName",
               "includeMiddleName",
            ].includes(name)
         ) {
            const nameParts = newData.fullName.split(" ");
            let displayName = "";

            if (newData.preferredName) {
               displayName = newData.preferredName;
            } else if (newData.includeMiddleName && nameParts.length > 2) {
               displayName = nameParts.join(" ");
            } else if (nameParts.length >= 2) {
               displayName = [
                  nameParts[0],
                  nameParts[nameParts.length - 1],
               ].join(" ");
            } else {
               displayName = newData.fullName;
            }

            newData.namePreview = newData.academicTitle
               ? capitalizeText(`${newData.academicTitle} ${displayName}`)
               : capitalizeText(displayName);
         }

         return newData;
      });
   };

   const handleSubmit = async (e: React.FormEvent) => {
      if (!user) {
         alert("No se pudo obtener el usuario");
         return;
      }

      e.preventDefault();

      // Generate random duration between 8-15 seconds
      const duration = Math.floor(Math.random() * (15000 - 10000 + 1)) + 8000;
      setRandomDuration(duration);

      // Start the loading process
      setLoading(true);
      setLoadingStep(0);
      setLoadingComplete(false);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoadingStep(1);
      await createCongressCertificateAction(user.id, formData.namePreview);
      setSubmitCompleted(true);
      // Here you would also send the data to your backend
      console.log("Form submitted:", formData);
   };

   return (
      <div>
         {loading ? (
            <div className="bg-white shadow-md p-8 rounded-xl text-center">
               <div className="flex flex-col justify-center items-center min-h-[400px]">
                  {loadingComplete ? (
                     <>
                        <CheckCircle2
                           className="mb-4 text-green-500"
                           size={60}
                        />
                        <h2 className="mb-2 font-medium text-gray-800 text-2xl">
                           ¡Configuración guardada!
                        </h2>
                        <p className="text-gray-600">
                           Tus preferencias han sido aplicadas a todos tus
                           certificados.
                        </p>

                        <LinkButton
                           variant="green"
                           href="/certificates"
                           className="mt-4"
                        >
                           Ver mis certificados
                        </LinkButton>
                     </>
                  ) : (
                     <>
                        <div className="relative mb-8">
                           <Loader2
                              className="text-indigo-600 animate-spin"
                              size={60}
                           />
                           <div className="absolute inset-0 flex justify-center items-center">
                              <div className="bg-white rounded-full w-12 h-12" />
                           </div>
                           <div className="absolute inset-0 flex justify-center items-center">
                              <span className="font-semibold text-indigo-600">
                                 {Math.min(
                                    Math.round(
                                       (loadingStep /
                                          (loadingMessages.length - 1)) *
                                          100,
                                    ),
                                    95,
                                 )}
                                 %
                              </span>
                           </div>
                        </div>

                        <h2 className="mb-4 font-medium text-gray-800 text-xl">
                           {loadingMessages[loadingStep] ||
                              loadingMessages[loadingMessages.length - 1]}
                        </h2>

                        <div className="max-w-md">
                           <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div
                                 className="bg-indigo-600 rounded-full h-full transition-all duration-300 ease-out"
                                 style={{
                                    width: `${Math.min(Math.round((loadingStep / (loadingMessages.length - 1)) * 100), 95)}%`,
                                 }}
                              />
                           </div>

                           <p className="mt-4 text-gray-500 text-sm">
                              Por favor, espera mientras actualizamos tus
                              preferencias. Esto puede tomar unos momentos.
                           </p>
                        </div>
                     </>
                  )}
               </div>
            </div>
         ) : (
            <div className="bg-white shadow-md p-8 rounded-xl">
               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-6">
                     <div>
                        <label
                           htmlFor="fullName"
                           className="block mb-1 font-medium text-gray-700 text-sm"
                        >
                           Ingresa tu nombre como quieres que aparezca en tus
                           certificados
                        </label>
                        <input
                           type="text"
                           id="fullName"
                           name="fullName"
                           value={formData.fullName}
                           onChange={handleChange}
                           className="px-4 py-3 border border-gray-300 focus:border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                           placeholder="Ingresa tu nombre"
                           required
                        />
                     </div>

                     <div>
                        <label
                           htmlFor="academicTitle"
                           className="block mb-1 font-medium text-gray-700 text-sm"
                        >
                           Título académico (opcional)
                        </label>
                        <select
                           id="academicTitle"
                           name="academicTitle"
                           value={formData.academicTitle}
                           onChange={handleChange}
                           className="px-4 py-3 border border-gray-300 focus:border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                        >
                           <option value="">Ninguno</option>
                           <option value="Dr.">Dr.</option>
                           <option value="Dra.">Dra.</option>
                           <option value="Lic.">Lic.</option>
                           <option value="Ing.">Ing.</option>
                           <option value="Mtro.">Mtro.</option>
                           <option value="Mtra.">Mtra.</option>
                           <option value="Prof.">Prof.</option>
                           <option value="Profa.">Profa.</option>
                        </select>
                     </div>

                     <div className="flex items-center">
                        <input
                           type="checkbox"
                           id="includeMiddleName"
                           name="includeMiddleName"
                           checked={formData.includeMiddleName}
                           onChange={handleChange}
                           className="border-gray-300 rounded focus:ring-indigo-500 size-6 text-indigo-600"
                        />
                        <label
                           htmlFor="includeMiddleName"
                           className="block ml-2 text-gray-700 text-sm"
                        >
                           Incluir segundo nombre y apellidos intermedios
                        </label>
                     </div>

                     <div className="bg-gradient-to-r from-indigo-50 to-purple-50 mt-8 p-6 rounded-lg">
                        <h3 className="mb-2 font-semibold text-indigo-700 text-sm uppercase">
                           Vista previa
                        </h3>
                        <div className="pt-3 border-indigo-200 border-t">
                           <p className="mb-1 text-gray-600 text-sm">
                              Así aparecerá tu nombre en los certificados:
                           </p>
                           <p className="font-serif font-medium text-gray-800 text-xl">
                              {formData.namePreview ||
                                 "Tu nombre aparecerá aquí"}
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className="pt-4 border-gray-200 border-t">
                     <button
                        type="submit"
                        className="flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg w-full text-white"
                     >
                        <Save size={18} className="mr-2" />
                        Guardar preferencias
                     </button>
                  </div>
               </form>
            </div>
         )}
      </div>
   );
}
