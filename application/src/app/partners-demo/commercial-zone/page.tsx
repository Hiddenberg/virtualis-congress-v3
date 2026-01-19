import type { Partner } from "@/components/partners-demo/commercial-zone/PartnerCard";
import PartnersGrid from "@/components/partners-demo/commercial-zone/PartnersGrid";
import TopBrandsNav from "@/components/partners-demo/commercial-zone/TopBrandsNav";
import {
   PARTNERS_DEMO_CONSTANTS,
   SPONSOR_LOGO_URLS,
} from "@/data/partnersDemoConstants";

export default function DemoCommercialZonePage() {
   const partners = [
      {
         id: "abbott",
         name: "Abbott",
         description:
            "Innovamos en salud con soluciones de diagnóstico y dispositivos médicos.",
         logoUrl: PARTNERS_DEMO_CONSTANTS.ABBOTT_LOGO_URL,
         link: "/partners-demo/commercial-zone/partner/abbott",
         darkBackground: true,
         tint: "blue",
         actions: [
            {
               label: "Descarga nuestro eBook gratis",
            },
            {
               label: "Recibe muestras de producto",
            },
            {
               label: "Sorteo de kits de bienestar",
            },
         ],
      },
      {
         id: "sanfer",
         name: "Sanfer",
         description:
            "Líderes en innovación farmacéutica en LATAM. Beneficios exclusivos durante el congreso.",
         logoUrl: PARTNERS_DEMO_CONSTANTS.SANFER_LOGO_URL,
         link: "/partners-demo/commercial-zone/partner/sanfer",
         tint: "pink",
         actions: [
            {
               label: "Descarga nuestro eBook gratis",
            },
            {
               label: "Recibe muestras de producto",
            },
            {
               label: "Sorteo de kits de bienestar",
            },
         ],
      },
      {
         id: "jnj",
         name: "Johnson & Johnson",
         logoUrl: SPONSOR_LOGO_URLS.JNJ,
         tint: "green",
         actions: [
            {
               label: "Prueba gratuita de nuestra plataforma",
            },
            {
               label: "Descarga cupones de descuento",
            },
         ],
      },
      {
         id: "pfizer",
         name: "Pfizer",
         logoUrl: SPONSOR_LOGO_URLS.PFIZER,
         tint: "purple",
         actions: [
            {
               label: "Prueba gratuita de nuestra plataforma",
            },
            {
               label: "Descarga cupones de descuento",
            },
         ],
      },
      {
         id: "roche",
         name: "Roche",
         logoUrl: SPONSOR_LOGO_URLS.ROCHE,
         tint: "sky",
         actions: [
            {
               label: "Muestras de kits de diagnóstico",
            },
            {
               label: "Accede a una demo gratuita",
            },
         ],
      },
      {
         id: "merck",
         name: "Merck & Co.",
         logoUrl: SPONSOR_LOGO_URLS.MERK,
         tint: "green",
         actions: [
            {
               label: "Prueba gratuita de nuestra plataforma",
            },
            {
               label: "Descarga cupones de descuento",
            },
         ],
      },
      {
         id: "sanofi",
         name: "Sanofi",
         logoUrl: SPONSOR_LOGO_URLS.SANOFI,
         tint: "blue",
         actions: [
            {
               label: "Ver más",
            },
         ],
      },
      {
         id: "astrazeneca",
         name: "AstraZeneca",
         logoUrl: SPONSOR_LOGO_URLS.ASTRAZENECA,
         tint: "amber",
         actions: [
            {
               label: "Ver más",
            },
         ],
      },
      {
         id: "novartis",
         name: "Novartis",
         logoUrl: SPONSOR_LOGO_URLS.NOVARTIS,
         tint: "sky",
         actions: [
            {
               label: "Ver más",
            },
         ],
      },
      {
         id: "abbvie",
         name: "AbbVie",
         logoUrl: SPONSOR_LOGO_URLS.ABBVIE,
         tint: "purple",
         actions: [
            {
               label: "Ver más",
            },
         ],
      },
   ] satisfies Partner[];

   return (
      <div className="flex flex-col gap-4">
         <TopBrandsNav active="Todos" />
         <PartnersGrid partners={partners} />
      </div>
   );
}
