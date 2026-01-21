"use client";

import { Coffee, Home, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { Button, LinkButton } from "@/components/global/Buttons";
import HelpButton from "@/features/userSupport/components/HelpButton";

interface ErrorPageProps {
   error: Error & { digest?: string };
   reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
   useEffect(() => {
      // Log the error to an error reporting service
      console.error("Application error:", error);
   }, [error]);

   return (
      <div className="flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4 min-h-screen">
         <div className="bg-white shadow-xl rounded-3xl w-full max-w-2xl overflow-hidden">
            {/* Header with friendly icon */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-center">
               <div className="mb-4">
                  <Coffee className="mx-auto mb-4 size-16 text-white" />
               </div>
               <h1 className="mb-2 font-bold text-white text-2xl">¡Ups! Algo no salió como esperábamos</h1>
               <p className="text-blue-100 text-base">
                  Algo no salió como esperábamos, pero no te preocupes, estamos trabajando para solucionarlo.{" "}
               </p>
            </div>

            {/* Main content */}
            <div className="p-8">
               {/* Friendly action options */}
               <div className="space-y-6 mb-8">
                  <h3 className="mb-4 font-semibold text-gray-800 text-base text-center">¿Qué te gustaría hacer?</h3>

                  <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
                     <div className="bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-md p-6 border-2 border-blue-200 rounded-2xl text-center transition-all">
                        <RefreshCw className="mx-auto mb-4 size-12 text-blue-600" />
                        <h4 className="mb-2 font-semibold text-blue-900 text-base">Intentémoslo otra vez</h4>
                        <p className="mb-4 text-blue-700 text-sm">A veces funciona a la segunda 🎯</p>
                        <Button onClick={reset} variant="blue" className="mx-auto py-2 w-full text-sm">
                           <RefreshCw className="size-4" />
                           Reintentar
                        </Button>
                     </div>

                     <div className="bg-gradient-to-br from-green-50 to-green-100 hover:shadow-md p-6 border-2 border-green-200 rounded-2xl text-center transition-all">
                        <Home className="mx-auto mb-4 size-12 text-green-600" />
                        <h4 className="mb-2 font-semibold text-green-900 text-base">Volver al inicio</h4>
                        <p className="mb-4 text-green-700 text-sm">Empezar desde el principio 🏠</p>
                        <LinkButton href="/" variant="green" className="mx-auto py-2 w-full text-sm">
                           <Home className="size-4" />
                           Ir al inicio
                        </LinkButton>
                     </div>
                  </div>

                  <div className="flex sm:flex-row flex-col justify-center items-center gap-3 mt-6">
                     {/* <LinkButton
                        href="/"
                        variant="secondary"
                        className="px-6 py-2 w-full sm:w-auto text-sm"
                     >
                        <ArrowLeft className="size-4" />
                        Regresar
                     </LinkButton> */}
                  </div>
               </div>

               {/* Encouraging message */}
               <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 border-2 border-amber-200 rounded-2xl text-center">
                  <h4 className="mb-3 font-semibold text-amber-900 text-base">¡Estamos aquí para ayudarte! 🤝</h4>
                  <p className="text-amber-800 text-sm leading-relaxed">
                     Si nada de esto funciona, no dudes en contactarnos. Nuestro equipo estará encantado de ayudarte a resolver
                     cualquier problema que tengas.
                  </p>
                  <div className="flex justify-center mt-4 w-full">
                     <HelpButton />
                  </div>
               </div>

               {/* Development error details - hidden in production */}
               <div className="bg-gray-50 mt-6 p-4 border border-gray-200 rounded-lg">
                  <p className="mb-2 font-medium text-gray-700 hover:text-gray-900 cursor-pointer">Detalles técnicos</p>
                  <code className="block bg-white p-2 border rounded text-red-600 text-xs break-all">{error.message}</code>
                  {error.digest && <p className="mt-2 text-gray-500 text-xs">ID: {error.digest}</p>}
               </div>

               {/* Footer message */}
               <div className="mt-8 pt-6 border-gray-200 border-t text-center">
                  <p className="text-gray-500 text-sm">Gracias por tu paciencia. Valoramos mucho que uses Virtualis Congress ❤️</p>
               </div>
            </div>
         </div>
      </div>
   );
}
