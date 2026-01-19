"use client";

import { useEffect, useState } from "react";

export default function PricingSection() {
   const [isMobile, setIsMobile] = useState(false);

   useEffect(() => {
      const handleResize = () => {
         setIsMobile(window.innerWidth < 768);
      };

      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
   }, []);

   const pricingData = [
      {
         category: "Especialista en Medicina Interna",
         member: "$500 MXN",
         nonMember: "$2000 MXN",
      },
      {
         category: "Especialista en Medicina Interna afiliado a CMIM",
         member: "$500 MXN",
         nonMember: "$1000 MXN",
      },
      {
         category: "Médicos residentes",
         member: "$500 MXN",
         nonMember: "$500 MXN",
      },
      {
         category: "Estudiantes",
         member: "$500 MXN",
         nonMember: "$500 MXN",
      },
      {
         category: "Norte, Centro y Sudamérica",
         member: "$50 USD",
         nonMember: "$50 USD",
      },
   ];

   return (
      <section className="bg-white py-16 w-full">
         <div className="mx-auto px-4 max-w-6xl container">
            <div className="mb-12 text-center">
               <h2 className="mb-4 font-bold text-[#1a237e] text-2xl md:text-3xl">
                  Costos del 1er Curso Internacional ACP México Chapter 2025
               </h2>
               <p className="mx-auto max-w-2xl text-gray-600 text-sm md:text-base">
                  Selecciona la categoría que mejor se adapte a tu perfil
                  profesional
               </p>
            </div>

            {isMobile ? (
               <div className="grid gap-6">
                  {pricingData.map((item, index) => (
                     <div
                        key={index}
                        className="bg-white shadow-md rounded-lg overflow-hidden"
                     >
                        <div className="bg-[#1a237e] text-white p-4">
                           <h3 className="font-semibold text-lg">
                              {item.category}
                           </h3>
                        </div>
                        <div className="p-4">
                           <p className="mb-2">
                              <span className="font-medium">Miembros:</span>{" "}
                              {item.member}
                           </p>
                           <p>
                              <span className="font-medium">No miembros:</span>{" "}
                              {item.nonMember}
                           </p>
                        </div>
                     </div>
                  ))}
               </div>
            ) : (
               <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                     <thead>
                        <tr>
                           <th className="bg-[#1a237e] px-6 py-4 rounded-tl-lg text-white text-left">
                              Categoría
                           </th>
                           <th className="bg-[#1a237e] px-6 py-4 text-white text-left">
                              Miembros
                           </th>
                           <th className="bg-[#1a237e] px-6 py-4 rounded-tr-lg text-white text-left">
                              No miembros
                           </th>
                        </tr>
                     </thead>
                     <tbody>
                        {pricingData.map((row, index, array) => (
                           <tr
                              key={index}
                              className={`
                                 border-b border-gray-200
                                 ${index === array.length - 1 ? "last:border-b-0" : ""}
                                 hover:bg-gray-50 transition-colors
                              `}
                           >
                              <td className="px-6 py-4 text-gray-800">
                                 {row.category}
                              </td>
                              <td className="px-6 py-4 font-medium text-gray-800">
                                 {row.member}
                              </td>
                              <td className="px-6 py-4 font-medium text-gray-800">
                                 {row.nonMember}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            )}
         </div>
      </section>
   );
}
