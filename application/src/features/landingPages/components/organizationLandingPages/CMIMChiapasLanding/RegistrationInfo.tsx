"use client";

import {
   Building,
   ClipboardPenIcon,
   CreditCard,
   DoorOpenIcon,
   Globe,
   MapPin,
   PlayCircle,
   Users,
   Video,
   Wifi,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import HelpButton from "@/features/userSupport/components/HelpButton";

export default function RegistrationInfo({ userId }: { userId?: string }) {
   const [activeMode, setActiveMode] = useState<"presencial" | "virtual">("presencial");

   const pricingTiers = [
      {
         category: "Especialistas / Subespecialistas",
         price: "$2,000 MXN",
         icon: Users,
         color: "from-blue-500 to-blue-600",
         bgColor: "bg-blue-50",
         textColor: "text-blue-600",
         type: "presencial",
      },
      {
         category: "Médicos Generales",
         price: "$1,500 MXN",
         icon: Users,
         color: "from-green-500 to-green-600",
         bgColor: "bg-green-50",
         textColor: "text-green-600",
         type: "presencial",
      },
      {
         category: "Profesionales de la Salud",
         price: "$1,000 MXN",
         icon: Users,
         color: "from-purple-500 to-purple-600",
         bgColor: "bg-purple-50",
         textColor: "text-purple-600",
         type: "presencial",
      },
      {
         category: "Estudiantes - Residentes",
         price: "$700 MXN",
         icon: Users,
         color: "from-orange-500 to-orange-600",
         bgColor: "bg-orange-50",
         textColor: "text-orange-600",
         type: "presencial",
      },
   ];

   const virtualTier = {
      category: "Asistencia Virtual",
      price: "$1,500 MXN",
      icon: Video,
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      textColor: "text-pink-600",
      type: "virtual",
      description: "Solo transmisión en vivo - No incluye grabaciones",
   };

   const specialTiers = [
      {
         category: "Extranjeros (Registros Fuera de México)",
         price: "$75 USD",
         icon: Globe,
         color: "from-indigo-500 to-indigo-600",
         bgColor: "bg-indigo-50",
         textColor: "text-indigo-600",
         type: "internacional",
      },
      {
         category: "Acceso a Grabaciones",
         price: "$290 MXN",
         icon: PlayCircle,
         color: "from-teal-500 to-teal-600",
         bgColor: "bg-teal-50",
         textColor: "text-teal-600",
         type: "grabaciones",
         subtitle: "Adicional",
      },
   ];

   return (
      <div className="bg-white py-16">
         <div className="mx-auto px-4 container">
            {/* Section Header */}
            <div className="mb-12 text-center">
               <h2 className="mb-4 font-bold text-gray-900 text-4xl">Cuotas de Recuperación</h2>
               <p className="mx-auto max-w-2xl text-gray-600 text-lg">Elige la modalidad que mejor se adapte a tus necesidades</p>
            </div>

            {/* Pricing Mode Tabs */}
            <div className="mb-12">
               <div className="flex justify-center">
                  <div className="bg-white shadow-lg p-2 border border-gray-200 rounded-xl">
                     <div className="flex gap-2">
                        <button
                           type="button"
                           onClick={() => setActiveMode("presencial")}
                           className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                              activeMode === "presencial"
                                 ? "bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-md"
                                 : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                           }`}
                        >
                           <div className="flex items-center gap-3">
                              <div
                                 className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    activeMode === "presencial" ? "bg-white/20" : "bg-blue-100"
                                 }`}
                              >
                                 <Building
                                    className={`w-4 h-4 ${activeMode === "presencial" ? "text-white" : "text-blue-600"}`}
                                 />
                              </div>
                              <div className="text-left">
                                 <div className="font-bold">Presencial</div>
                                 <div className="opacity-75 text-xs">En el hotel</div>
                              </div>
                           </div>
                        </button>

                        <button
                           type="button"
                           onClick={() => setActiveMode("virtual")}
                           className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                              activeMode === "virtual"
                                 ? "bg-linear-to-r from-pink-500 to-pink-600 text-white shadow-md"
                                 : "text-gray-600 hover:text-pink-600 hover:bg-pink-50"
                           }`}
                        >
                           <div className="flex items-center gap-3">
                              <div
                                 className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    activeMode === "virtual" ? "bg-white/20" : "bg-pink-100"
                                 }`}
                              >
                                 <Video className={`w-4 h-4 ${activeMode === "virtual" ? "text-white" : "text-pink-600"}`} />
                              </div>
                              <div className="text-left">
                                 <div className="font-bold">Virtual</div>
                                 <div className="opacity-75 text-xs">En línea</div>
                              </div>
                           </div>
                        </button>
                     </div>
                  </div>
               </div>
            </div>
            <div className="flex justify-center pb-4">
               <HelpButton />
            </div>

            {/* Pricing Content */}
            {activeMode === "presencial" ? (
               /* Presencial Pricing Grid */
               <div className="mb-12">
                  <h3 className="mb-6 font-bold text-gray-900 text-2xl text-center">Modalidad Presencial</h3>
                  <div className="gap-6 grid md:grid-cols-2 lg:grid-cols-4">
                     {pricingTiers.map((tier) => {
                        const IconComponent = tier.icon;
                        return (
                           <div
                              key={tier.category}
                              className="flex flex-col items-center bg-white hover:shadow-lg p-6 border-2 border-gray-100 hover:border-gray-200 rounded-2xl transition-all duration-300"
                           >
                              <div
                                 className={`w-12 h-12 bg-linear-to-br ${tier.color} rounded-full flex items-center justify-center mb-4`}
                              >
                                 <IconComponent className="w-6 h-6 text-white" />
                              </div>
                              <h3 className="mb-2 font-bold text-gray-900 text-sm leading-tight">{tier.category}</h3>
                              {/* <div className="mb-4 font-bold text-gray-900 text-2xl">
                              </div> */}
                              <div
                                 className={`text-center py-2 px-4 rounded-full font-semibold ${tier.textColor} ${tier.bgColor}`}
                              >
                                 {tier.price}
                              </div>
                           </div>
                        );
                     })}
                  </div>
               </div>
            ) : (
               /* Virtual Pricing Section */
               <div className="mb-12">
                  <h3 className="mb-6 font-bold text-gray-900 text-2xl text-center">Modalidad Virtual</h3>
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
                           <div
                              className={`w-16 h-16 bg-linear-to-br ${virtualTier.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                           >
                              <Video className="w-8 h-8 text-white" />
                           </div>
                           <div className="mb-3 font-bold text-gray-900 text-3xl">{virtualTier.price}</div>
                           <div className="bg-pink-100 mb-4 px-4 py-2 rounded-full font-semibold text-pink-700 text-sm">
                              Transmisiones en Vivo
                           </div>

                           {/* What's included */}
                           <div className="space-y-2 text-gray-700 text-sm text-left">
                              <div className="flex items-center gap-2">
                                 <div className="bg-pink-400 rounded-full w-2 h-2" />
                                 <span>Acceso a todas las conferencias en vivo</span>
                              </div>
                              <div className="flex items-center gap-2">
                                 <div className="bg-pink-400 rounded-full w-2 h-2" />
                                 <span>Chat interactivo con ponentes</span>
                              </div>
                              <div className="flex items-center gap-2">
                                 <div className="bg-pink-400 rounded-full w-2 h-2" />
                                 <span>Material digital del congreso</span>
                              </div>
                           </div>

                           {/* Important note */}
                           <div className="bg-amber-50 mt-4 p-3 border border-amber-200 rounded-lg">
                              <p className="font-medium text-amber-800 text-xs">⚠️ No incluye acceso a grabaciones posteriores</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {/* Special Pricing Grid - Always Visible */}
            <div className="mb-12">
               <h3 className="mb-6 font-bold text-gray-900 text-2xl text-center">Opciones Adicionales</h3>
               <div className="gap-6 grid md:grid-cols-2 mx-auto max-w-3xl">
                  {specialTiers.map((tier) => {
                     const IconComponent = tier.icon;
                     return (
                        <div
                           key={tier.category}
                           className="relative flex flex-col items-center bg-white hover:shadow-lg p-6 border-2 border-gray-100 hover:border-gray-200 rounded-2xl transition-all duration-300"
                        >
                           {tier.subtitle && (
                              <div className="-top-3 right-4 absolute bg-linear-to-r from-orange-400 to-red-400 px-3 py-1 rounded-full font-bold text-white text-xs">
                                 {tier.subtitle}
                              </div>
                           )}
                           <div
                              className={`w-12 h-12 bg-linear-to-br ${tier.color} rounded-full flex items-center justify-center mb-4`}
                           >
                              <IconComponent className="w-6 h-6 text-white" />
                           </div>
                           <h3 className="mb-2 font-bold text-gray-900 text-sm leading-tight">{tier.category}</h3>
                           {/* <div className="mb-4 font-bold text-gray-900 text-2xl">
                           </div> */}
                           <div className={`text-center py-2 px-4 rounded-full font-semibold ${tier.textColor} ${tier.bgColor}`}>
                              {tier.price}
                           </div>
                           {tier.type === "grabaciones" && (
                              <p className="mt-2 text-gray-500 text-xs text-center">Se suma a cualquier modalidad</p>
                           )}
                        </div>
                     );
                  })}
               </div>
            </div>

            {/* Important Notes */}
            <div className="bg-linear-to-r from-blue-50 to-cyan-50 mb-12 p-6 border border-blue-100 rounded-2xl">
               <h4 className="flex items-center gap-2 mb-3 font-bold text-gray-900">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Información Importante
               </h4>
               <div className="gap-4 grid md:grid-cols-2 text-gray-700 text-sm">
                  <div className="space-y-2">
                     <p>
                        <strong>Modalidad Presencial:</strong> Incluye acceso completo al evento, coffee breaks y material del
                        congreso.
                     </p>
                     <p>
                        <strong>Modalidad Virtual:</strong> Solo transmisión en vivo. Para acceso a grabaciones, debe adquirir el
                        complemento adicional.
                     </p>
                  </div>
                  <div className="space-y-2">
                     <p>
                        <strong>Grabaciones:</strong> Acceso por 3 meses posteriores al evento para revisión y estudio.
                     </p>
                     <p>
                        <strong>Extranjeros:</strong> Precio especial para profesionales fuera de México.
                     </p>
                  </div>
               </div>
            </div>

            {/* Registration CTA */}
            <div
               className={`rounded-2xl p-8 text-white text-center mb-12 ${
                  activeMode === "presencial"
                     ? "bg-linear-to-r from-blue-900 via-blue-700 to-cyan-600"
                     : "bg-linear-to-r from-pink-600 via-rose-600 to-pink-700"
               }`}
            >
               <h3 className="mb-4 font-bold text-3xl">¡INSCRÍBETE YA!</h3>
               <p className={`mb-6 text-lg ${activeMode === "presencial" ? "text-blue-100" : "text-pink-100"}`}>
                  {activeMode === "presencial"
                     ? "Asegura tu lugar en el congreso más importante de medicina interna en la región"
                     : "Participa desde cualquier lugar con nuestra modalidad virtual"}
               </p>
               <div className="flex sm:flex-row flex-col justify-center gap-4">
                  {!userId && (
                     <Link
                        href="/signup"
                        className={`px-8 flex items-center gap-2 py-3 rounded-full font-bold transition-colors shadow-lg ${
                           activeMode === "presencial"
                              ? "bg-white text-blue-900 hover:bg-gray-100"
                              : "bg-white text-pink-900 hover:bg-gray-100"
                        }`}
                     >
                        <ClipboardPenIcon className="w-4 h-4" />
                        Quiero Registrarme
                     </Link>
                  )}
                  <Link
                     href="/lobby"
                     className={`px-8 flex items-center gap-2 py-3 rounded-full font-bold transition-colors shadow-lg ${
                        activeMode === "presencial"
                           ? "bg-white text-blue-900 hover:bg-gray-100"
                           : "bg-white text-pink-900 hover:bg-gray-100"
                     }`}
                  >
                     <DoorOpenIcon className="w-4 h-4" />
                     Entrar con mi cuenta
                  </Link>
               </div>
            </div>

            {/* Contact Information */}
            <div className="gap-6 grid grid-cols-1">
               {/* <div className="bg-gray-50 p-6 rounded-xl text-center">
                  <div className="flex justify-center items-center bg-blue-100 mx-auto mb-4 rounded-full w-12 h-12">
                     <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-900">Teléfono</h3>
                  <p className="text-gray-600">+52 (961) 992-0940</p>
                  <p className="mt-1 text-gray-500 text-sm">Lunes a Viernes 9:00 - 18:00</p>
               </div> */}

               {/* <div className="bg-gray-50 p-6 rounded-xl text-center">
                  <div className="flex justify-center items-center bg-green-100 mx-auto mb-4 rounded-full w-12 h-12">
                     <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600">info@congresocmim.mx</p>
                  <p className="mt-1 text-gray-500 text-sm">Respuesta en 24 horas</p>
               </div> */}

               <div className="bg-gray-50 p-6 rounded-xl text-center">
                  <div className="flex justify-center items-center bg-purple-100 mx-auto mb-4 rounded-full w-12 h-12">
                     <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-900">Ubicación</h3>
                  <p className="text-gray-600">Hotel Holiday Inn</p>
                  <p className="mt-1 text-gray-500 text-sm">Tapachula, Chiapas</p>
               </div>
            </div>
         </div>
      </div>
   );
}
