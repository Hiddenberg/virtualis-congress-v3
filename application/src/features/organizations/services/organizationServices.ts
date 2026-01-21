import "server-only";
import { headers } from "next/headers";
import { cache } from "react";
import { getSingleDBRecord, pbFilter } from "@/libs/pbServerClientNew";
import type { Organization } from "../types/organizationTypes";

const isDevEnvironment = process.env.NODE_ENV === "development";

async function getSubDomain() {
   const headersList = await headers();
   const host = headersList.get("host");

   if (isDevEnvironment) {
      return host?.split(".")[0] ?? null;
   }

   const subdomain = host?.split(isDevEnvironment ? ".localhost" : ".virtualis.app")[0];
   return subdomain ?? null;
}

export const getOrganizationFromSubdomain = cache(async () => {
   const subdomain = await getSubDomain();

   if (!subdomain) {
      throw new Error("No subdomain found");
   }

   const filter = pbFilter(
      `
      subdomain = {:subdomain}
   `,
      {
         subdomain,
      },
   );
   const organization = await getSingleDBRecord<Organization>("ORGANIZATIONS", filter);

   if (!organization) {
      throw new Error("Organization not found");
   }

   return organization;
});

export async function getOrganizationBaseUrl() {
   const organization = await getOrganizationFromSubdomain();

   if (isDevEnvironment) {
      return `http://${organization.subdomain}.localhost:3000`;
   }

   return `https://${organization.subdomain}.virtualis.app`;
}
