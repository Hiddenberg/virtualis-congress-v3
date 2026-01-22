"use client";

import { ChevronDownIcon, ChevronUpIcon, LinkIcon, TriangleAlertIcon } from "lucide-react";
import { useState } from "react";
import { CopyButton } from "@/components/global/Buttons";
import { IS_DEV_ENVIRONMENT, PLATFORM_BASE_DOMAIN } from "@/data/constants/platformConstants";
import { useOrganizationContext } from "@/features/organizations/context/OrganizationContext";

export default function CollapsibleGuestLink({ streamingRoute }: { streamingRoute: string }) {
   const { organization } = useOrganizationContext();
   const [isOpen, setIsOpen] = useState(false);

   if (!organization) {
      return <div>Error: Organization is required</div>;
   }

   const protocol = IS_DEV_ENVIRONMENT ? "http" : "https";
   const guestLink = `${protocol}://${organization.subdomain}.${PLATFORM_BASE_DOMAIN}/${streamingRoute}`;

   return (
      <div className="bg-linear-to-r from-stone-50 to-stone-100 border border-stone-200 rounded-xl overflow-hidden">
         <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex justify-between items-center hover:bg-stone-100 p-4 w-full text-left transition-colors duration-200"
         >
            <div className="flex items-center gap-3">
               <div className="bg-stone-200 p-2 rounded-lg">
                  <LinkIcon className="w-5 h-5 text-stone-700" />
               </div>
               <div>
                  <h3 className="font-semibold text-stone-800 text-base">Link para Invitados</h3>
                  <p className="text-stone-500 text-sm">Compartir acceso a la transmisión</p>
               </div>
            </div>
            <div className="bg-stone-200 p-1 rounded-lg">
               {isOpen ? (
                  <ChevronUpIcon className="w-5 h-5 text-stone-600" />
               ) : (
                  <ChevronDownIcon className="w-5 h-5 text-stone-600" />
               )}
            </div>
         </button>

         {isOpen && (
            <div className="space-y-4 px-4 pb-4">
               {/* Link Container */}
               <div className="bg-white p-4 border border-stone-200 rounded-xl">
                  <div className="flex justify-between items-center gap-3">
                     <div className="flex-1 min-w-0">
                        <p className="text-stone-600 text-sm truncate">{guestLink}</p>
                     </div>
                     <CopyButton text={guestLink} />
                  </div>
               </div>

               {/* Warning */}
               <div className="bg-linear-to-r from-amber-50 to-amber-100 p-4 border border-amber-200 rounded-xl">
                  <div className="flex items-start gap-3">
                     <TriangleAlertIcon className="mt-0.5 w-5 h-5 text-amber-600 shrink-0" />
                     <div>
                        <h4 className="mb-1 font-medium text-amber-800 text-sm">Uso Restringido</h4>
                        <p className="text-amber-700 text-xs">
                           Solo para administradores y presentadores. No compartir públicamente.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}
