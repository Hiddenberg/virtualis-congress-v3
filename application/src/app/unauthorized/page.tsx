import { LogIn, Mail, Phone, Shield, User } from "lucide-react";
import Link from "next/link";
import GoBackButton from "@/components/global/GoBackButton";
import VirtualisCongressLogoHeader from "@/components/global/VirtualisCongressLogoHeader";
import { LogoutButton } from "@/components/registration/AuthHeader";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";
import { getUserById } from "@/features/users/services/userServices";

interface UnauthorizedPageProps {
   searchParams: Promise<{
      route?: string;
   }>;
}

export default async function UnauthorizedPage({ searchParams }: UnauthorizedPageProps) {
   const attemptedRoute = (await searchParams).route || "esta página";

   const userId = await getLoggedInUserId();
   const user = await getUserById(userId ?? "");

   return (
      <div className="flex flex-col bg-gradient-to-br from-blue-50 to-white min-h-screen">
         {/* Header with logo */}
         <div className="w-full">
            <VirtualisCongressLogoHeader />
         </div>

         {/* Main content */}
         <div className="flex flex-1 justify-center items-center px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md text-center">
               {/* Icon */}
               <div className="flex justify-center mb-6">
                  <div className="bg-red-100 p-6 rounded-full">
                     <Shield className="w-16 h-16 text-red-600" />
                  </div>
               </div>

               {/* Title */}
               <h1 className="mb-4 font-bold text-gray-900 text-3xl">Acceso No Autorizado</h1>

               {/* User info section */}
               {user && user.email ? (
                  <div className="bg-blue-50 mb-6 p-4 border border-blue-200 rounded-lg">
                     <div className="flex justify-center items-center gap-2 text-blue-700">
                        <User className="w-4 h-4" />
                        <span className="font-medium text-sm">Conectado como:</span>
                     </div>
                     <p className="mt-1 font-semibold text-blue-800">{user.email}</p>
                  </div>
               ) : null}

               {/* Description */}
               <div className="space-y-3 mb-8 text-gray-600">
                  <p className="text-lg">
                     No tienes permisos para acceder a{" "}
                     <span className="bg-blue-50 px-2 py-1 rounded font-semibold text-blue-600">{attemptedRoute}</span>
                  </p>
                  <p>
                     Si crees que esto es un error, por favor toma una captura de pantalla y contacta con los administradores del
                     sistema.
                  </p>
               </div>

               {/* Contact information */}
               <div className="bg-white shadow-sm mb-8 p-6 border border-gray-200 rounded-lg">
                  <h3 className="mb-4 font-semibold text-gray-900 text-lg">¿Necesitas ayuda?</h3>
                  <div className="space-y-3 text-gray-600 text-sm">
                     <div className="flex justify-center items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-500" />
                        <span>Contacta a los administradores</span>
                     </div>
                     <div className="flex justify-center items-center gap-2">
                        <Phone className="w-4 h-4 text-blue-500" />
                        <span>Solicita acceso al área requerida</span>
                     </div>
                  </div>
               </div>

               {/* Action buttons */}
               <div className="space-y-3">
                  {!user ? (
                     <Link
                        href={`/login?redirectTo=${encodeURIComponent(attemptedRoute)}`}
                        className="flex justify-center items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg w-full font-semibold text-white transition-colors duration-200"
                     >
                        <LogIn className="w-4 h-4" />
                        Iniciar Sesión
                     </Link>
                  ) : (
                     <LogoutButton redirectTo="/" />
                  )}

                  <Link
                     href="/lobby"
                     className="flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg w-full font-semibold text-white transition-colors duration-200"
                  >
                     Ir al Lobby
                  </Link>
                  <GoBackButton className="w-full" />
               </div>
            </div>
         </div>

         {/* Footer */}
         <div className="pb-8 text-gray-500 text-sm text-center">
            Si el problema persiste, contacta con el equipo de soporte técnico
         </div>
      </div>
   );
}
