"use client";

import { useState } from "react";
import CertificateComponent from "@/features/certificates/components/CertificateComponent";
import type { CertificateDesign } from "@/features/certificates/types/certificatesTypes";

export default function AdjustCertificatesPage() {
   const [certificateDesign, setCertificateDesign] = useState<CertificateDesign>({
      certificateType: "speaker",
      backgroundURL: "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1770475275/Constancia_asistente_2026.jpg_dpsyvr.webp",
      nameXPosition: 0.5,
      nameYPosition: 0.5,
      nameWidthPercentage: 50,
      nameColor: "#000000",
      nameFontSizeMultiplier: 1,
      organization: "1",
      congress: "1",
   });

   const [displayName, setDisplayName] = useState("Juan Perez");

   const updateCertificateDesign = (field: keyof CertificateDesign, value: string | number) => {
      setCertificateDesign((prev) => ({ ...prev, [field]: value }));
   };

   return (
      <div className="bg-gray-50 py-8 min-h-screen">
         <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="mb-8">
               <h1 className="font-bold text-gray-900 text-3xl">Ajusta los certificados</h1>
               <p className="mt-2 text-gray-600">Modifica los parámetros del certificado y ve los cambios en tiempo real</p>
            </div>

            <div className="gap-8 grid grid-cols-1 lg:grid-cols-2">
               {/* Controls Panel */}
               <div className="bg-white shadow-sm p-6 rounded-lg">
                  <h2 className="mb-6 font-semibold text-gray-900 text-xl">Parámetros del Certificado</h2>

                  <div className="space-y-6">
                     {/* Display Name */}
                     <div>
                        <label htmlFor="displayName" className="block mb-2 font-medium text-gray-700 text-sm">
                           Nombre a mostrar
                        </label>
                        <input
                           id="displayName"
                           type="text"
                           value={displayName}
                           onChange={(e) => setDisplayName(e.target.value)}
                           className="px-4 py-2 border border-gray-300 focus:border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-full transition-colors"
                           placeholder="Ej: Dr. Juan Pérez García"
                        />
                     </div>

                     {/* Certificate Type */}
                     <div>
                        <label htmlFor="certificateType" className="block mb-2 font-medium text-gray-700 text-sm">
                           Tipo de certificado
                        </label>
                        <select
                           id="certificateType"
                           value={certificateDesign.certificateType}
                           onChange={(e) =>
                              updateCertificateDesign("certificateType", e.target.value as CertificateDesign["certificateType"])
                           }
                           className="px-4 py-2 border border-gray-300 focus:border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-full transition-colors"
                        >
                           <option value="attendee">Asistente</option>
                           <option value="speaker">Ponente</option>
                           <option value="coordinator">Coordinador</option>
                        </select>
                     </div>

                     {/* Background URL */}
                     <div>
                        <label htmlFor="backgroundURL" className="block mb-2 font-medium text-gray-700 text-sm">
                           URL de fondo
                        </label>
                        <input
                           id="backgroundURL"
                           type="text"
                           value={certificateDesign.backgroundURL}
                           onChange={(e) => updateCertificateDesign("backgroundURL", e.target.value)}
                           className="px-4 py-2 border border-gray-300 focus:border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-full transition-colors"
                           placeholder="https://..."
                        />
                     </div>

                     {/* Name X Position */}
                     <div>
                        <div className="flex justify-between items-center mb-2">
                           <label htmlFor="nameXPosition" className="block font-medium text-gray-700 text-sm">
                              Posición horizontal del nombre
                           </label>
                           <span className="text-gray-500 text-sm">{certificateDesign.nameXPosition}</span>
                        </div>
                        <input
                           id="nameXPosition"
                           type="range"
                           min="-50"
                           max="100"
                           step="0.01"
                           value={certificateDesign.nameXPosition}
                           onChange={(e) => updateCertificateDesign("nameXPosition", parseFloat(e.target.value))}
                           className="w-full"
                        />
                        <div className="flex justify-between mt-1 text-gray-400 text-xs">
                           <span>Izquierda (0%)</span>
                           <span>Derecha (100%)</span>
                        </div>
                     </div>

                     {/* Name Y Position */}
                     <div>
                        <div className="flex justify-between items-center mb-2">
                           <label htmlFor="nameYPosition" className="block font-medium text-gray-700 text-sm">
                              Posición vertical del nombre
                           </label>
                           <span className="text-gray-500 text-sm">{certificateDesign.nameYPosition}</span>
                        </div>
                        <input
                           id="nameYPosition"
                           type="range"
                           min="0"
                           max="100"
                           step="0.01"
                           value={certificateDesign.nameYPosition}
                           onChange={(e) => updateCertificateDesign("nameYPosition", parseFloat(e.target.value))}
                           className="w-full"
                        />
                        <div className="flex justify-between mt-1 text-gray-400 text-xs">
                           <span>Arriba (0%)</span>
                           <span>Abajo (100%)</span>
                        </div>
                     </div>

                     {/* Name Width Percentage */}
                     <div>
                        <div className="flex justify-between items-center mb-2">
                           <label htmlFor="nameWidthPercentage" className="block font-medium text-gray-700 text-sm">
                              Ancho del nombre
                           </label>
                           <span className="text-gray-500 text-sm">{Math.round(certificateDesign.nameWidthPercentage)}%</span>
                        </div>
                        <input
                           id="nameWidthPercentage"
                           type="range"
                           min="10"
                           max="100"
                           step="1"
                           value={certificateDesign.nameWidthPercentage}
                           onChange={(e) => updateCertificateDesign("nameWidthPercentage", parseFloat(e.target.value))}
                           className="w-full"
                        />
                        <div className="flex justify-between mt-1 text-gray-400 text-xs">
                           <span>Estrecho (10%)</span>
                           <span>Ancho (100%)</span>
                        </div>
                     </div>

                     {/* Name Color */}
                     <div>
                        <label htmlFor="nameColor" className="block mb-2 font-medium text-gray-700 text-sm">
                           Color del nombre
                        </label>
                        <div className="flex gap-3">
                           <input
                              id="nameColor"
                              type="color"
                              value={certificateDesign.nameColor}
                              onChange={(e) => updateCertificateDesign("nameColor", e.target.value)}
                              className="border border-gray-300 rounded-lg w-20 h-10 cursor-pointer"
                           />
                           <input
                              type="text"
                              value={certificateDesign.nameColor}
                              onChange={(e) => updateCertificateDesign("nameColor", e.target.value)}
                              className="flex-1 px-4 py-2 border border-gray-300 focus:border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                              placeholder="#000000"
                           />
                        </div>
                     </div>

                     {/* Font Size Multiplier */}
                     <div>
                        <div className="flex justify-between items-center mb-2">
                           <label htmlFor="nameFontSizeMultiplier" className="block font-medium text-gray-700 text-sm">
                              Multiplicador de tamaño de fuente
                           </label>
                           <span className="text-gray-500 text-sm">{certificateDesign.nameFontSizeMultiplier.toFixed(2)}x</span>
                        </div>
                        <input
                           id="nameFontSizeMultiplier"
                           type="range"
                           min="0.5"
                           max="2"
                           step="0.1"
                           value={certificateDesign.nameFontSizeMultiplier}
                           onChange={(e) => updateCertificateDesign("nameFontSizeMultiplier", parseFloat(e.target.value))}
                           className="w-full"
                        />
                        <div className="flex justify-between mt-1 text-gray-400 text-xs">
                           <span>Pequeño (0.5x)</span>
                           <span>Grande (2x)</span>
                        </div>
                     </div>

                     {/* Organization */}
                     <div>
                        <label htmlFor="organization" className="block mb-2 font-medium text-gray-700 text-sm">
                           Organización
                        </label>
                        <input
                           id="organization"
                           type="text"
                           value={certificateDesign.organization}
                           onChange={(e) => updateCertificateDesign("organization", e.target.value)}
                           className="px-4 py-2 border border-gray-300 focus:border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-full transition-colors"
                        />
                     </div>

                     {/* Congress */}
                     <div>
                        <label htmlFor="congress" className="block mb-2 font-medium text-gray-700 text-sm">
                           Congreso
                        </label>
                        <input
                           id="congress"
                           type="text"
                           value={certificateDesign.congress}
                           onChange={(e) => updateCertificateDesign("congress", e.target.value)}
                           className="px-4 py-2 border border-gray-300 focus:border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-full transition-colors"
                        />
                     </div>
                  </div>
               </div>

               {/* Preview Panel */}
               <div className="bg-white shadow-sm p-6 rounded-lg">
                  <h2 className="mb-6 font-semibold text-gray-900 text-xl">Vista previa</h2>
                  <div className="flex justify-center">
                     <CertificateComponent certificateDesign={certificateDesign} displayName={displayName} isDebug={true} />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
