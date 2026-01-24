"use client";
import { LifeBuoyIcon } from "lucide-react";
import { LinkButton } from "@/components/global/Buttons";
import { useOrganizationContext } from "@/features/organizations/context/OrganizationContext";
import { ORGANIZATION_CONSTANTS, type OrganizationShortId } from "@/features/organizations/data/organizationConstants";

function getWhatsappLink(organizationShortID: string, message?: string) {
   const whatsappLink = ORGANIZATION_CONSTANTS[organizationShortID as OrganizationShortId]?.WHATSAPP_LINK;

   if (!whatsappLink) {
      return "";
   }

   return whatsappLink + (message ? `?text=${message}` : "");
}

export default function HelpButton() {
   const { organizationShortID } = useOrganizationContext();
   const whatsappLink = getWhatsappLink(organizationShortID);

   if (!whatsappLink) {
      return null;
      // return <div className="flex justify-center items-center h-full font-bold text-red-500">Enlace de ayuda no encontrado</div>;
   }

   return (
      <LinkButton
         variant="none"
         title="Contactar por WhatsApp"
         href={getWhatsappLink(organizationShortID)}
         target="_blank"
         className="bg-green-500 hover:bg-green-600 text-white"
      >
         <LifeBuoyIcon className="w-4 h-4" />
         Ayuda
      </LinkButton>
   );
}
