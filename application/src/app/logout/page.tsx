import { HomeIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { LinkButton } from "@/components/global/Buttons";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";
import { getUserById } from "@/features/users/services/userServices";
import LogoutButton from "./LogoutButton";

export default async function LogoutPage() {
   const userId = await getLoggedInUserId();
   const user = await getUserById(userId ?? "");

   if (!user) {
      redirect("/login");
   }

   return (
      <div className="flex justify-center items-center bg-linear-to-br from-gray-50 to-gray-100 p-4 w-full min-h-screen">
         <div className="bg-white shadow-xl p-8 md:p-10 border border-gray-200 rounded-2xl w-full max-w-lg">
            <div className="mb-10 text-center">
               <h1 className="mb-3 font-bold text-gray-800 text-3xl tracking-tight">Cerrar sesión</h1>
               <p className="text-gray-600 text-base leading-relaxed">¿Estás seguro de que deseas cerrar sesión?</p>
            </div>

            <div className="bg-linear-to-r from-gray-50 to-blue-50 shadow-sm mb-8 p-6 border-2 border-gray-200 rounded-2xl">
               <div className="mb-4">
                  <p className="mb-2 font-semibold text-gray-500 text-sm uppercase tracking-wide">Nombre</p>
                  <p className="font-bold text-gray-800 text-lg">{user.name}</p>
               </div>
               <div className="mb-4">
                  <p className="mb-2 font-semibold text-gray-500 text-sm uppercase tracking-wide">Correo electrónico</p>
                  <p className="font-bold text-gray-800 text-lg">{user.email}</p>
               </div>
               {user.additionalEmail1 || user.additionalEmail2 ? (
                  <div className="pt-4 border-gray-200 border-t-2">
                     <p className="mb-3 font-semibold text-gray-500 text-sm uppercase tracking-wide">Correos adicionales</p>
                     {user.additionalEmail1 && (
                        <div className="mb-3">
                           <p className="font-bold text-gray-800 text-lg">{user.additionalEmail1}</p>
                        </div>
                     )}
                     {user.additionalEmail2 && (
                        <div>
                           <p className="font-bold text-gray-800 text-lg">{user.additionalEmail2}</p>
                        </div>
                     )}
                  </div>
               ) : (
                  <div className="pt-4 border-gray-200 border-t-2">
                     <p className="mb-3 font-semibold text-gray-500 text-sm uppercase tracking-wide">Correos adicionales</p>
                     <p className="font-bold text-gray-800 text-lg">No hay correos adicionales</p>
                  </div>
               )}
            </div>

            <LogoutButton />
            <LinkButton href="/" variant="blue" className="mt-4 p-4! w-full!">
               <HomeIcon className="size-4" />
               Volver a la página de inicio
            </LinkButton>
         </div>
      </div>
   );
}
