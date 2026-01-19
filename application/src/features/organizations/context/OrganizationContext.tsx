"use client";

import { createContext, useContext } from "react";
import type { OrganizationRecord } from "../types/organizationTypes";

interface OrganizationContextType {
   organizationShortID: string;
   organization: OrganizationRecord | null;
}

export const OrganizationContext =
   createContext<OrganizationContextType | null>(null);

export function OrganizationContextProvider({
   organization,
   children,
}: {
   organization: OrganizationRecord | null;
   children: React.ReactNode;
}) {
   return (
      <OrganizationContext.Provider
         value={{
            organization,
            organizationShortID: organization?.shortID ?? "",
         }}
      >
         {children}
      </OrganizationContext.Provider>
   );
}

export function useOrganizationContext() {
   const context = useContext(OrganizationContext);

   if (!context) {
      throw new Error(
         "useOrganizationContext must be used within a OrganizationContextProvider",
      );
   }

   return context;
}
