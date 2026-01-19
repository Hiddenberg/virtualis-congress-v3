"use client";

import { ClipboardPenIcon, CreditCard, DoorOpenIcon } from "lucide-react";
import Link from "next/link";
import HelpButton from "@/features/userSupport/components/HelpButton";

export default function ACPPricingInfo({ userId }: { userId?: string }) {
   return (
      <section className="bg-white py-16">
         <div className="mx-auto px-4 container">
            <div className="mb-10 text-center">
               <h2 className="mb-3 font-bold text-gray-900 text-4xl">
                  Cuotas de recuperación
               </h2>
               <p className="mx-auto max-w-2xl text-gray-600 text-lg">
                  Acceso 100% en línea a todas las conferencias en vivo
               </p>
            </div>

            <div className="flex justify-center pb-6">
               <HelpButton />
            </div>

            <div className="gap-6 grid md:grid-cols-2 lg:grid-cols-5 mx-auto max-w-6xl">
               {/* General Doctors */}
               <div className="flex flex-col items-center bg-white hover:shadow-lg p-6 border-2 border-gray-100 hover:border-gray-200 rounded-2xl transition-all duration-300">
                  <div className="flex justify-center items-center bg-gradient-to-br from-teal-300 to-teal-400 mb-4 rounded-full w-12 h-12">
                     <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="mb-1 font-bold text-gray-900 text-base text-center">
                     Médicos en general
                  </h3>
                  <div className="bg-teal-50 mb-4 px-4 py-2 rounded-full font-bold text-teal-700 text-xl">
                     $700
                  </div>
                  <ul className="space-y-2 text-gray-600 text-sm">
                     <li>• Acceso a todas las conferencias en vivo</li>
                     <li>• Grabaciones incluidas</li>
                  </ul>
               </div>

               {/* Membership */}
               <div className="flex flex-col items-center bg-white hover:shadow-lg p-6 border-2 border-gray-100 hover:border-gray-200 rounded-2xl transition-all duration-300">
                  <div className="flex justify-center items-center bg-gradient-to-br from-emerald-300 to-emerald-400 mb-4 rounded-full w-12 h-12">
                     <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="mb-1 font-bold text-gray-900 text-base text-center">
                     Membresía ACP
                  </h3>
                  <div className="bg-emerald-50 mb-4 px-4 py-2 rounded-full font-bold text-emerald-700 text-xl">
                     $500
                  </div>
                  <ul className="space-y-2 text-gray-600 text-sm">
                     <li>• Acceso a todas las conferencias en vivo</li>
                     <li>• Grabaciones incluidas</li>
                  </ul>
               </div>

               {/* Nurses */}
               <div className="flex flex-col items-center bg-white hover:shadow-lg p-6 border-2 border-gray-100 hover:border-gray-200 rounded-2xl transition-all duration-300">
                  <div className="flex justify-center items-center bg-gradient-to-br from-green-300 to-green-400 mb-4 rounded-full w-12 h-12">
                     <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="mb-1 font-bold text-gray-900 text-base text-center">
                     Enfermeras y estudiantes no afiliados
                  </h3>
                  <div className="bg-green-50 mb-4 px-4 py-2 rounded-full font-bold text-green-700 text-xl">
                     $400
                  </div>
                  <ul className="space-y-2 text-gray-600 text-sm">
                     <li>• Acceso a todas las conferencias en vivo</li>
                     <li>• Grabaciones incluidas</li>
                  </ul>
               </div>

               <div className="flex flex-col items-center bg-white hover:shadow-lg p-6 border-2 border-gray-100 hover:border-gray-200 rounded-2xl transition-all duration-300">
                  <div className="flex justify-center items-center bg-gradient-to-br from-green-300 to-green-400 mb-4 rounded-full w-12 h-12">
                     <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="mb-1 font-bold text-gray-900 text-base text-center">
                     Extranjeros
                  </h3>
                  <div className="bg-green-50 mb-4 px-4 py-2 rounded-full font-bold text-green-700 text-xl">
                     $30 USD
                  </div>
                  <ul className="space-y-2 text-gray-600 text-sm">
                     <li>• Acceso a todas las conferencias en vivo</li>
                     <li>• Grabaciones incluidas</li>
                  </ul>
               </div>

               {/* Students and Residents ACP Members */}
               <div className="flex flex-col items-center bg-gradient-to-br from-lime-50 to-green-50 hover:shadow-lg p-6 border-2 border-lime-200 hover:border-lime-300 rounded-2xl transition-all duration-300">
                  <div className="flex justify-center items-center bg-gradient-to-br from-lime-300 to-green-400 mb-4 rounded-full w-12 h-12">
                     <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="mb-1 font-bold text-gray-900 text-base text-center">
                     Estudiantes y residentes miembros del ACP
                  </h3>
                  <div className="bg-lime-100 mb-4 px-4 py-2 rounded-full font-bold text-lime-700 text-xl">
                     Sin costo
                  </div>
                  <ul className="space-y-2 text-gray-600 text-sm">
                     <li>• Acceso a todas las conferencias en vivo</li>
                     <li>• Grabaciones incluidas</li>
                  </ul>
               </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-teal-600 via-emerald-500 to-green-400 mt-12 p-8 rounded-2xl text-white text-center">
               <h3 className="mb-4 font-bold text-3xl">¡Inscríbete ya!</h3>
               <p className="mb-6 text-teal-100">
                  Asegura tu acceso al congreso en línea del Hospital Gea
               </p>
               <div className="flex sm:flex-row flex-col justify-center gap-4">
                  {!userId && (
                     <Link
                        href="/signup"
                        className="flex items-center gap-2 bg-white hover:bg-gray-100 shadow-lg px-8 py-3 rounded-full font-bold text-teal-900 transition-colors"
                     >
                        <ClipboardPenIcon className="w-4 h-4" /> Quiero
                        registrarme
                     </Link>
                  )}
                  <Link
                     href="/lobby"
                     className="flex items-center gap-2 bg-white hover:bg-gray-100 shadow-lg px-8 py-3 rounded-full font-bold text-teal-900 transition-colors"
                  >
                     <DoorOpenIcon className="w-4 h-4" /> Entrar con mi cuenta
                  </Link>
               </div>
            </div>
         </div>
      </section>
   );
}
