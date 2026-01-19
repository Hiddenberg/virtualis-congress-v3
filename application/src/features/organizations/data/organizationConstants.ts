export const ORGANIZATION_SHORT_IDS = [
   "CMIMCC", // CMIM Costa Chiapas
   "ACP-MX", // ACP Mexico
] as const;

export type OrganizationShortId = (typeof ORGANIZATION_SHORT_IDS)[number];

export const ORGANIZATION_CONSTANTS = {
   CMIMCC: {
      WHATSAPP_LINK: "https://wa.link/l1bisb",
   },
   "ACP-MX": {
      WHATSAPP_LINK: "https://wa.me/5619920940",
   },
   HGEA: {
      WHATSAPP_LINK: "https://wa.me/+525513192018",
   },
} as const;
