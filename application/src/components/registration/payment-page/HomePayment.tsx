"use client";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ClientResponseError, type RecordModel } from "pocketbase";
import { useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import type { CongressRegistration } from "@/features/congresses/types/congressRegistrationTypes";
import pbClient from "@/libs/pbClient";
import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";

export default function HomePayment() {
   const router = useRouter();
   const { user } = useAuthContext();

   useEffect(() => {
      const checkUserPayment = async () => {
         let congressRegistration;
         try {
            congressRegistration = await pbClient
               .collection(PB_COLLECTIONS.CONGRESS_REGISTRATIONS)
               .getFirstListItem<CongressRegistration & RecordModel>(
                  `userRegistered.id = "${user!.id}"`,
               );
         } catch (error) {
            if (error instanceof ClientResponseError && error.status === 404) {
               congressRegistration = null;
            }
            throw error;
         }

         if (congressRegistration.paymentConfirmed) {
            router.push("/registro/confirmacion-pago?status=success");
         }
      };
      checkUserPayment();
   }, [user, router]);

   return (
      <div className="flex flex-col justify-center items-center">
         <div className="items-center md:bg-[#F5F6FA] mx-auto md:mt-10 md:p-12 px-4 pt-20 md:rounded-3xl max-w-2xl text-center">
            <div className="mb-8">
               <svg
                  viewBox="0 0 24 24"
                  className="opacity-80 mx-auto w-16 h-16 text-blue-900"
                  fill="currentColor"
               >
                  <CheckCircle />
               </svg>
            </div>

            <h1 className="mb-5 font-bold text-blue-900 text-2xl">
               ¡Ya estás Registrado!
            </h1>

            <p className="mb-2 text-lg">
               Ahora toca realizar el último paso para inscribirte. Realiza tu
               pago aquí para completar tu inscripción.
            </p>
         </div>
      </div>
   );
}
