import { Building, CreditCard, MapPin, MonitorIcon, PlayCircle, Video, Wifi } from "lucide-react";
import Link from "next/link";
import { getAllCongressProductsWithPrices } from "@/features/congresses/services/congressProductsServices";
import type { CongressRecord } from "@/features/congresses/types/congressTypes";

function formatPrice(amount: number, currency: "mxn" | "usd"): string {
   return new Intl.NumberFormat(currency === "mxn" ? "es-MX" : "en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
   }).format(amount);
}

function getPriceColorClasses(index: number) {
   const colors = [
      { gradient: "from-blue-500 to-blue-600", bg: "bg-blue-50", text: "text-blue-600" },
      { gradient: "from-green-500 to-green-600", bg: "bg-green-50", text: "text-green-600" },
      { gradient: "from-purple-500 to-purple-600", bg: "bg-purple-50", text: "text-purple-600" },
      { gradient: "from-orange-500 to-orange-600", bg: "bg-orange-50", text: "text-orange-600" },
      { gradient: "from-pink-500 to-pink-600", bg: "bg-pink-50", text: "text-pink-600" },
      { gradient: "from-teal-500 to-teal-600", bg: "bg-teal-50", text: "text-teal-600" },
   ];
   return colors[index % colors.length];
}

interface GenericPricesSectionProps {
   congress: CongressRecord;
   userId?: string;
}

export default async function GenericPricesSection({ congress, userId }: GenericPricesSectionProps) {
   const productsWithPrices = await getAllCongressProductsWithPrices(congress.id);

   // Group products by type
   const onlineAccessProduct = productsWithPrices.find(
      (p) => p.product.productType === "congress_online_access" && p.prices.length > 0,
   );
   const inPersonAccessProduct = productsWithPrices.find(
      (p) => p.product.productType === "congress_in_person_access" && p.prices.length > 0,
   );
   const recordingsProduct = productsWithPrices.find(
      (p) => p.product.productType === "congress_recordings" && p.prices.length > 0,
   );

   // Don't render if there are no products with prices
   if (!onlineAccessProduct && !inPersonAccessProduct && !recordingsProduct) {
      return null;
   }

   return (
      <div className="bg-white py-16">
         <div className="mx-auto px-4 container">
            {/* Section Header */}
            <div className="mb-12 text-center">
               <h2 className="mb-4 font-bold text-gray-900 text-4xl">Cuotas de Recuperación</h2>
               <p className="mx-auto max-w-2xl text-gray-600 text-lg">
                  Elige la modalidad que mejor se adapte a tus necesidades
               </p>
            </div>

            {/* Online Access Section */}
            {onlineAccessProduct && (
               <div className="mb-12">
                  <h3 className="mb-6 font-bold text-gray-900 text-2xl text-center">Acceso Online</h3>
                  {onlineAccessProduct.prices.length === 1 ? (
                     // Single price - show as featured card
                     <div className="mx-auto max-w-md">
                        <div className="relative bg-linear-to-br from-pink-50 to-rose-50 p-8 border-2 border-pink-200 rounded-2xl">
                           {/* Background decoration */}
                           <div className="top-4 right-4 absolute opacity-10">
                              <Wifi className="w-16 h-16 text-pink-600" />
                           </div>

                           {/* Online Only Badge */}
                           <div className="-top-3 left-1/2 absolute bg-linear-to-r from-pink-500 to-rose-500 shadow-lg px-4 py-2 rounded-full font-bold text-white text-xs -translate-x-1/2 transform">
                              🌐 SOLO EN LÍNEA
                           </div>

                           <div className="z-10 relative text-center">
                              <div className="w-16 h-16 bg-linear-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                 <Video className="w-8 h-8 text-white" />
                              </div>
                              <div className="mb-3 font-bold text-gray-900 text-3xl">
                                 {formatPrice(onlineAccessProduct.prices[0].priceAmount, onlineAccessProduct.prices[0].currency)}
                              </div>
                              <div className="bg-pink-100 mb-4 px-4 py-2 rounded-full font-semibold text-pink-700 text-sm">
                                 Transmisiones en Vivo
                              </div>

                              {/* What's included */}
                              {onlineAccessProduct.product.description && (
                                 <div className="space-y-2 text-gray-700 text-sm text-left">
                                    <div className="flex items-center gap-2">
                                       <div className="bg-pink-400 rounded-full w-2 h-2" />
                                       <span>{onlineAccessProduct.product.description}</span>
                                    </div>
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>
                  ) : (
                     // Multiple prices - show as grid
                     <div className="gap-6 grid md:grid-cols-2 lg:grid-cols-3">
                        {onlineAccessProduct.prices.map((price, index) => {
                           const colors = getPriceColorClasses(index);
                           return (
                              <div
                                 key={price.id}
                                 className="flex flex-col items-center bg-white hover:shadow-lg p-6 border-2 border-gray-100 hover:border-gray-200 rounded-2xl transition-all duration-300"
                              >
                                 <div className={`w-12 h-12 bg-linear-to-br ${colors.gradient} rounded-full flex items-center justify-center mb-4`}>
                                    <MonitorIcon className="w-6 h-6 text-white" />
                                 </div>
                                 <h3 className="mb-2 font-bold text-gray-900 text-sm leading-tight">{price.name}</h3>
                                 <div className={`text-center py-2 px-4 rounded-full font-semibold ${colors.text} ${colors.bg}`}>
                                    {formatPrice(price.priceAmount, price.currency)}
                                 </div>
                              </div>
                           );
                        })}
                     </div>
                  )}
               </div>
            )}

            {/* In-Person Access Section - Only if hybrid and product exists */}
            {congress.modality === "hybrid" && inPersonAccessProduct && (
               <div className="mb-12">
                  <h3 className="mb-6 font-bold text-gray-900 text-2xl text-center">Acceso Presencial</h3>
                  {congress.congressLocation && (
                     <div className="mb-6 flex justify-center">
                        <div className="bg-gray-50 px-6 py-3 border border-gray-200 rounded-xl flex items-center gap-3">
                           <MapPin className="w-5 h-5 text-purple-600" />
                           <div className="text-left">
                              <div className="font-semibold text-gray-900 text-sm">Ubicación del Evento</div>
                              <div className="text-gray-600 text-sm">{congress.congressLocation}</div>
                           </div>
                        </div>
                     </div>
                  )}
                  {inPersonAccessProduct.prices.length === 1 ? (
                     // Single price - show as featured card
                     <div className="mx-auto max-w-md">
                        <div className="relative bg-linear-to-br from-blue-50 to-cyan-50 p-8 border-2 border-blue-200 rounded-2xl">
                           {/* Background decoration */}
                           <div className="top-4 right-4 absolute opacity-10">
                              <Building className="w-16 h-16 text-blue-600" />
                           </div>

                           {/* In-Person Badge */}
                           <div className="-top-3 left-1/2 absolute bg-linear-to-r from-blue-500 to-cyan-500 shadow-lg px-4 py-2 rounded-full font-bold text-white text-xs -translate-x-1/2 transform">
                              🏢 PRESENCIAL
                           </div>

                           <div className="z-10 relative text-center">
                              <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                 <Building className="w-8 h-8 text-white" />
                              </div>
                              <div className="mb-3 font-bold text-gray-900 text-3xl">
                                 {formatPrice(inPersonAccessProduct.prices[0].priceAmount, inPersonAccessProduct.prices[0].currency)}
                              </div>
                              <div className="bg-blue-100 mb-4 px-4 py-2 rounded-full font-semibold text-blue-700 text-sm">
                                 Acceso Completo Presencial
                              </div>

                              {/* What's included */}
                              {inPersonAccessProduct.product.description && (
                                 <div className="space-y-2 text-gray-700 text-sm text-left">
                                    <div className="flex items-center gap-2">
                                       <div className="bg-blue-400 rounded-full w-2 h-2" />
                                       <span>{inPersonAccessProduct.product.description}</span>
                                    </div>
                                 </div>
                              )}

                              {/* Online also available note */}
                              <div className="bg-cyan-50 mt-4 p-3 border border-cyan-200 rounded-lg">
                                 <p className="flex items-center gap-2 font-medium text-cyan-800 text-xs">
                                    <MonitorIcon className="size-4" />
                                    También disponible en línea
                                 </p>
                              </div>
                           </div>
                        </div>
                     </div>
                  ) : (
                     // Multiple prices - show as grid
                     <div className="gap-6 grid md:grid-cols-2 lg:grid-cols-3">
                        {inPersonAccessProduct.prices.map((price, index) => {
                           const colors = getPriceColorClasses(index);
                           return (
                              <div
                                 key={price.id}
                                 className="flex flex-col items-center bg-white hover:shadow-lg p-6 border-2 border-gray-100 hover:border-gray-200 rounded-2xl transition-all duration-300"
                              >
                                 <div className={`w-12 h-12 bg-linear-to-br ${colors.gradient} rounded-full flex items-center justify-center mb-4`}>
                                    <Building className="w-6 h-6 text-white" />
                                 </div>
                                 <h3 className="mb-2 font-bold text-gray-900 text-sm leading-tight">{price.name}</h3>
                                 <div className={`text-center py-2 px-4 rounded-full font-semibold ${colors.text} ${colors.bg}`}>
                                    {formatPrice(price.priceAmount, price.currency)}
                                 </div>
                                 <div className="mt-3 flex items-center gap-1 text-gray-500 text-xs">
                                    <MonitorIcon className="size-3" />
                                    <span>También disponible en línea</span>
                                 </div>
                              </div>
                           );
                        })}
                     </div>
                  )}
               </div>
            )}

            {/* Recordings Section */}
            {recordingsProduct && (
               <div className="mb-12">
                  <h3 className="mb-6 font-bold text-gray-900 text-2xl text-center">Acceso a Grabaciones</h3>
                  <div className="gap-6 grid md:grid-cols-2 mx-auto max-w-3xl">
                     {recordingsProduct.prices.map((price, index) => {
                        const colors = getPriceColorClasses(index + 2);
                        return (
                           <div
                              key={price.id}
                              className="relative flex flex-col items-center bg-white hover:shadow-lg p-6 border-2 border-gray-100 hover:border-gray-200 rounded-2xl transition-all duration-300"
                           >
                              <div className="-top-3 right-4 absolute bg-linear-to-r from-orange-400 to-red-400 px-3 py-1 rounded-full font-bold text-white text-xs">
                                 Adicional
                              </div>
                              <div className={`w-12 h-12 bg-linear-to-br ${colors.gradient} rounded-full flex items-center justify-center mb-4`}>
                                 <PlayCircle className="w-6 h-6 text-white" />
                              </div>
                              <h3 className="mb-2 font-bold text-gray-900 text-sm leading-tight">{price.name}</h3>
                              <div className={`text-center py-2 px-4 rounded-full font-semibold ${colors.text} ${colors.bg}`}>
                                 {formatPrice(price.priceAmount, price.currency)}
                              </div>
                              {recordingsProduct.product.description && (
                                 <p className="mt-2 text-gray-500 text-xs text-center">{recordingsProduct.product.description}</p>
                              )}
                              <p className="mt-2 text-gray-500 text-xs text-center">Se suma a cualquier modalidad</p>
                           </div>
                        );
                     })}
                  </div>
               </div>
            )}

            {/* Important Notes */}
            <div className="bg-linear-to-r from-blue-50 to-cyan-50 mb-12 p-6 border border-blue-100 rounded-2xl">
               <h4 className="flex items-center gap-2 mb-3 font-bold text-gray-900">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Información Importante
               </h4>
               <div className="gap-4 grid md:grid-cols-2 text-gray-700 text-sm">
                  <div className="space-y-2">
                     {onlineAccessProduct && (
                        <p>
                           <strong>Acceso Online:</strong> Transmisión en vivo de todas las conferencias con acceso desde cualquier
                           dispositivo.
                        </p>
                     )}
                     {congress.modality === "hybrid" && inPersonAccessProduct && (
                        <p>
                           <strong>Acceso Presencial:</strong> Incluye acceso completo al evento, coffee breaks y material del congreso.
                        </p>
                     )}
                  </div>
                  <div className="space-y-2">
                     {recordingsProduct && (
                        <p>
                           <strong>Grabaciones:</strong> Acceso por 3 meses posteriores al evento para revisión y estudio.
                        </p>
                     )}
                     {congress.modality === "hybrid" && (
                        <p>
                           <strong>Modalidad Híbrida:</strong> Puedes asistir presencialmente o seguir el evento en línea desde cualquier
                           lugar.
                        </p>
                     )}
                  </div>
               </div>
            </div>

            {/* Registration CTA */}
            <div className="rounded-2xl p-8 text-white text-center mb-12 bg-linear-to-r from-blue-900 via-blue-700 to-cyan-600">
               <h3 className="mb-4 font-bold text-3xl">¡INSCRÍBETE YA!</h3>
               <p className="mb-6 text-lg text-blue-100">
                  Asegura tu lugar en el congreso más importante de medicina interna en la región
               </p>
               <div className="flex sm:flex-row flex-col justify-center gap-4">
                  {!userId && (
                     <Link
                        href="/signup"
                        className="px-8 flex items-center gap-2 py-3 rounded-full font-bold transition-colors shadow-lg bg-white text-blue-900 hover:bg-gray-100"
                     >
                        Quiero Registrarme
                     </Link>
                  )}
                  <Link
                     href="/lobby"
                     className="px-8 flex items-center gap-2 py-3 rounded-full font-bold transition-colors shadow-lg bg-white text-blue-900 hover:bg-gray-100"
                  >
                     Entrar con mi cuenta
                  </Link>
               </div>
            </div>
         </div>
      </div>
   );
}
