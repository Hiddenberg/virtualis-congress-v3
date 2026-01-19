"use client";
import { QRCodeSVG } from "qrcode.react";
import {
   IS_DEV_ENVIRONMENT,
   PLATFORM_BASE_DOMAIN,
} from "@/data/constants/platformConstants";
import { useOrganizationContext } from "@/features/organizations/context/OrganizationContext";

export default function LobbyQrCodeWidget() {
   const { organization } = useOrganizationContext();
   if (!organization) {
      return null;
   }
   const protocol = IS_DEV_ENVIRONMENT ? "http" : "https";
   const platformQrURL = `${protocol}://${organization.subdomain}.${PLATFORM_BASE_DOMAIN}/lobby`;

   return (
      <div className="size-64">
         <QRCodeSVG value={platformQrURL} className="w-full h-full" />
      </div>
   );
}
