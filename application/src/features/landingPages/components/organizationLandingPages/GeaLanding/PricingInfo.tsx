"use client";

import { ClipboardPenIcon, CreditCard, DoorOpenIcon, Film, Globe, Video, Wifi } from "lucide-react";
import Link from "next/link";
import HelpButton from "@/features/userSupport/components/HelpButton";

export default function PricingInfo({ userId }: { userId?: string }) {
   return (
      <section className="bg-white py-16">
         <div className="mx-auto px-4 container">
            <div className="mb-10 text-center">
               <h2 className="mb-3 font-bold text-gray-900 text-4xl">Cuotas de recuperación</h2>
               <p className="mx-auto max-w-2xl text-gray-600 text-lg">Acceso 100% en línea a todas las conferencias en vivo</p>
            </div>

            <div className="flex justify-center pb-6">
               <HelpButton />
            </div>

            <div className="gap-6 grid md:grid-cols-3 mx-auto max-w-5xl">
               {/* Online only card */}
               <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 p-8 border-2 border-blue-200 rounded-2xl">
                  <div className="top-4 right-4 absolute opacity-10">
                     <Wifi className="w-12 h-12 text-blue-400" />
                  </div>
                  <div className="-top-3 left-1/2 absolute bg-gradient-to-r from-blue-400 to-cyan-400 shadow px-4 py-1.5 rounded-full font-bold text-white text-xs -translate-x-1/2 transform">
                     SOLO EN LÍNEA
                  </div>
                  <div className="z-10 relative text-center">
                     <div className="flex justify-center items-center bg-gradient-to-br from-blue-300 to-cyan-400 mx-auto mb-4 rounded-full w-16 h-16">
                        <Video className="w-8 h-8 text-white" />
                     </div>
                     <div className="bg-blue-100 mx-auto mb-2 px-4 py-2 rounded-full w-max font-semibold text-blue-700 text-sm">
                        Transmisiones en vivo
                     </div>
                     <div className="inline-flex items-center gap-2 bg-rose-100 mx-auto mb-4 px-3 py-1 rounded-full font-semibold text-rose-700 text-xs">
                        <Film className="w-4 h-4" /> Grabaciones incluidas
                     </div>
                     <p className="mx-auto max-w-sm text-gray-700 text-sm">Disfruta el congreso desde cualquier dispositivo.</p>
                  </div>
               </div>

               {/* Mexico price */}
               <div className="flex flex-col items-center bg-white hover:shadow-lg p-8 border-2 border-gray-100 hover:border-gray-200 rounded-2xl transition-all duration-300">
                  <div className="flex justify-center items-center bg-gradient-to-br from-blue-300 to-blue-400 mb-4 rounded-full w-12 h-12">
                     <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="mb-1 font-bold text-gray-900 text-base">Participantes en México</h3>
                  <div className="bg-blue-50 mb-4 px-4 py-2 rounded-full font-bold text-blue-700 text-xl">$500 MXN</div>
                  <ul className="space-y-2 text-gray-600 text-sm">
                     <li>• Acceso a todas las conferencias en vivo</li>
                     <li>• Grabaciones incluidas</li>
                  </ul>
               </div>

               {/* Foreigners price */}
               <div className="flex flex-col items-center bg-white hover:shadow-lg p-8 border-2 border-gray-100 hover:border-gray-200 rounded-2xl transition-all duration-300">
                  <div className="flex justify-center items-center bg-gradient-to-br from-indigo-300 to-indigo-400 mb-4 rounded-full w-12 h-12">
                     <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="mb-1 font-bold text-gray-900 text-base">Participantes extranjeros</h3>
                  <div className="bg-indigo-50 mb-4 px-4 py-2 rounded-full font-bold text-indigo-700 text-xl">$30 USD</div>
                  <ul className="space-y-2 text-gray-600 text-sm">
                     <li>• Acceso a todas las conferencias en vivo</li>
                     <li>• Grabaciones incluidas</li>
                  </ul>
               </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-400 mt-12 p-8 rounded-2xl text-white text-center">
               <h3 className="mb-4 font-bold text-3xl">¡Inscríbete ya!</h3>
               <p className="mb-6 text-blue-100">Asegura tu acceso al congreso en línea del Hospital Gea</p>
               <div className="flex sm:flex-row flex-col justify-center gap-4">
                  {!userId && (
                     <Link
                        href="/signup"
                        className="flex items-center gap-2 bg-white hover:bg-gray-100 shadow-lg px-8 py-3 rounded-full font-bold text-blue-900 transition-colors"
                     >
                        <ClipboardPenIcon className="w-4 h-4" /> Quiero registrarme
                     </Link>
                  )}
                  <Link
                     href="/lobby"
                     className="flex items-center gap-2 bg-white hover:bg-gray-100 shadow-lg px-8 py-3 rounded-full font-bold text-blue-900 transition-colors"
                  >
                     <DoorOpenIcon className="w-4 h-4" /> Entrar con mi cuenta
                  </Link>
               </div>
            </div>
         </div>
      </section>
   );
}
