export default function PricingSection() {
   const pricingData = [
      {
         category: "Médicos especialistas en Medicina Interna",
         affiliatedPrice: "500",
         nonAffiliatedPrice: "2000",
         hasDifferentPrices: true,
      },
      {
         category: "Especialista medicina interna colegiado vigente a CMIM y sus filiales",
         price: "1000",
         hasDifferentPrices: false,
      },
      {
         category: "Médicos de otra Especialidad",
         price: "2000",
         hasDifferentPrices: false,
      },
      {
         category: "Médicos Generales",
         price: "1500",
         hasDifferentPrices: false,
      },
      {
         category: "Médicos residentes",
         affiliatedPrice: "Sin costo",
         nonAffiliatedPrice: "500",
         hasDifferentPrices: true,
      },
      {
         category: "Estudiantes de medicina",
         affiliatedPrice: "Sin costo",
         nonAffiliatedPrice: "250",
         hasDifferentPrices: true,
      },
   ];

   return (
      <section className="bg-white px-4 md:px-6 lg:px-8 py-12 w-full">
         <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
               <h2 className="mb-4 font-bold text-gray-900 text-3xl">Inscripción</h2>
               <p className="text-gray-600">Seleccione la categoría que corresponda a su perfil profesional</p>
            </div>

            {/* Mobile view - Single column layout */}
            <div className="md:hidden space-y-6">
               <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="divide-y divide-gray-200">
                     {pricingData.map((item) => (
                        <div key={item.category} className="p-4">
                           <h3 className="mb-3 font-medium text-gray-900">{item.category}</h3>
                           {item.hasDifferentPrices ? (
                              <div className="space-y-2">
                                 <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm">Afiliados ACP:</span>
                                    <span className="font-semibold text-blue-600">
                                       {item.affiliatedPrice === "Sin costo" ? "Sin costo" : `$${item.affiliatedPrice}`}
                                    </span>
                                 </div>
                                 <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm">No Afiliados:</span>
                                    <span className="font-semibold text-blue-600">${item.nonAffiliatedPrice}</span>
                                 </div>
                              </div>
                           ) : (
                              <div className="flex justify-between items-center">
                                 <span className="text-gray-600 text-sm">Precio único:</span>
                                 <span className="font-semibold text-blue-600">${item.price}</span>
                              </div>
                           )}
                        </div>
                     ))}
                  </div>
               </div>

               {/* Foreign Doctors Section - Mobile */}
               <div className="border border-blue-200 rounded-lg overflow-hidden">
                  <div className="p-4">
                     <h3 className="mb-3 font-medium text-gray-900">Médicos extranjeros</h3>
                     <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Precio fijo:</span>
                        <span className="font-semibold text-blue-600">$50 USD</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Desktop view - Table */}
            <div className="hidden md:block space-y-6">
               <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                     <thead>
                        <tr className="bg-gray-50">
                           <th className="px-6 py-4 font-semibold text-gray-900 text-left">Categoría</th>
                           <th className="bg-blue-50 px-6 py-4 w-[200px] font-semibold text-gray-900 text-center">
                              Afiliados ACP
                           </th>
                           <th className="px-6 py-4 w-[200px] font-semibold text-gray-900 text-center">No Afiliados</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-200">
                        {pricingData.map((item) => (
                           <tr key={item.category} className="hover:bg-gray-50">
                              <td className="px-6 py-4 text-gray-900">{item.category}</td>
                              {item.hasDifferentPrices ? (
                                 <>
                                    <td className="px-6 py-4 font-semibold text-blue-600 text-center">
                                       {item.affiliatedPrice === "Sin costo" ? "Sin costo" : `$${item.affiliatedPrice}`}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-blue-600 text-center">
                                       ${item.nonAffiliatedPrice}
                                    </td>
                                 </>
                              ) : (
                                 <td colSpan={2} className="px-6 py-4 font-semibold text-blue-600 text-center">
                                    ${item.price}
                                 </td>
                              )}
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               {/* Foreign Doctors Section - Desktop */}
               <div className="border border-blue-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                     <thead>
                        <tr>
                           <th className="px-6 py-4 font-semibold text-gray-900 text-left">Categoría Especial</th>
                           <th className="px-6 py-4 font-semibold text-gray-900 text-center">Precio Fijo</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr>
                           <td className="px-6 py-4 text-gray-900">Médicos extranjeros</td>
                           <td className="px-6 py-4 font-semibold text-blue-600 text-center">
                              $50 USD
                              <div className="mt-1 font-normal text-gray-500 text-xs">
                                 (Precio único en dólares estadounidenses)
                              </div>
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>

            <div className="mt-8 text-gray-500 text-sm text-center">
               * Los precios están expresados en pesos mexicanos (MXN), excepto donde se indica USD
            </div>
         </div>
      </section>
   );
}
