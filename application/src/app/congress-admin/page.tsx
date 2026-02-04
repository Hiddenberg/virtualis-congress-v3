import { format } from "@formkit/tempo";
import {
   ArrowDownUp,
   BarChart3,
   Calendar,
   CreditCard,
   // GiftIcon,
   GlobeIcon,
   HomeIcon,
   ShoppingCartIcon,
   UsersIcon,
   VideoIcon,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CopyButton } from "@/components/global/Buttons";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import type { CongressRecord } from "@/features/congresses/types/congressTypes";
import { getOrganizationBaseUrl } from "@/features/organizations/services/organizationServices";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";
import { getUserById } from "@/features/users/services/userServices";

interface AdminLink {
   title: string;
   description: string;
   openInNewTab?: boolean;
   href: string;
   icon: React.ElementType;
   color: string;
   lightColor: string;
   textColor: string;
   disabled?: boolean;
}

const adminSections: AdminLink[] = [
   {
      title: "Página Informativa",
      description: "Ver la página informativa del congreso",
      href: "/",
      openInNewTab: true,
      icon: GlobeIcon,
      color: "bg-green-500",
      lightColor: "bg-green-50",
      textColor: "text-green-600",
   },
   {
      title: "Lobby",
      description: "Ver el lobby del congreso",
      href: "/lobby",
      openInNewTab: true,
      icon: HomeIcon,
      color: "bg-yellow-500",
      lightColor: "bg-yellow-50",
      textColor: "text-yellow-600",
   },
   {
      title: "Ponentes",
      description: "Agregar, editar y administrar ponentes de conferencias",
      href: "/congress-admin/speakers",
      icon: UsersIcon,
      color: "bg-purple-500",
      lightColor: "bg-purple-50",
      textColor: "text-purple-600",
   },
   {
      title: "Conferencias",
      description: "Administrar conferencias del congreso, horarios y contenido",
      href: "/congress-admin/conferences",
      icon: Calendar,
      color: "bg-blue-500",
      lightColor: "bg-blue-50",
      textColor: "text-blue-600",
   },
   {
      title: "Precios y Productos de Congreso",
      description: "Agregar, editar y administrar precios y productos de congreso",
      href: "/congress-admin/products",
      icon: ShoppingCartIcon,
      color: "bg-sky-500",
      lightColor: "bg-sky-50",
      textColor: "text-sky-600",
   },
   {
      title: "Estadísticas de Conferencias",
      description: "Panel de análisis y estadísticas",
      href: "/congress-admin/registration-metrics",
      icon: BarChart3,
      color: "bg-indigo-500",
      lightColor: "bg-indigo-50",
      textColor: "text-indigo-600",
   },
   {
      title: "Registro Manual",
      description: "Registrar asistentes manualmente y gestionar accesos",
      href: "/manual-registration",
      icon: CreditCard,
      color: "bg-sky-500",
      lightColor: "bg-sky-50",
      textColor: "text-sky-600",
   },
   {
      title: "Grabaciones",
      description: "Gestionar grabaciones de conferencias",
      href: "/recordings",
      icon: VideoIcon,
      color: "bg-sky-500",
      lightColor: "bg-orange-50",
      textColor: "text-orange-600",
   },
   // {
   //    title: "Invitaciones de Cortesía",
   //    description: "Administrar invitaciones especiales y códigos de acceso",
   //    href: "/congress-admin/courtesy-invitations",
   //    icon: GiftIcon,
   //    color: "bg-pink-500",
   //    lightColor: "bg-pink-50",
   //    textColor: "text-pink-600",
   //    disabled: true,
   // },
   // {
   //    title: "Mensajes de Inauguración",
   //    description: "Configurar mensajes de apertura y bienvenida",
   //    href: "/congress-admin/inauguration-messages",
   //    icon: MessageSquare,
   //    color: "bg-cyan-500",
   //    lightColor: "bg-cyan-50",
   //    textColor: "text-cyan-600"
   // },
];

const hybridCongressSections: AdminLink[] = [
   {
      title: "Director del Congreso",
      description: "Herramientas para dirigir el congreso en tiempo real",
      href: "/congress-admin/congress-director",
      icon: Calendar,
      color: "bg-amber-500",
      lightColor: "bg-amber-50",
      textColor: "text-amber-600",
   },
   {
      title: "Pantalla de Proyección",
      description: "Vista optimizada para proyectar la transmisión en pantalla",
      href: "/projection-screen-v2",
      icon: BarChart3,
      color: "bg-rose-500",
      lightColor: "bg-rose-50",
      textColor: "text-rose-600",
   },
   // {
   //    title: "Control de Presentación",
   //    description: "Controla el avance de diapositivas y presentaciones en vivo",
   //    href: "/congress-admin/presentation-controller",
   //    icon: UsersIcon,
   //    color: "bg-teal-500",
   //    lightColor: "bg-teal-50",
   //    textColor: "text-teal-600",
   // },
];

const superAdminSections: AdminLink[] = [
   {
      title: "Funciones de Sincronización",
      description: "Funciones de sincronización de la plataforma",
      href: "/congress-admin/sync",
      icon: ArrowDownUp,
      color: "bg-blue-500",
      lightColor: "bg-blue-50",
      textColor: "text-blue-600",
   },
   {
      title: "Credenciales de Stripe",
      description: "Configurar y administrar credenciales de pago de Stripe",
      href: "/congress-admin/stripe-credentials",
      icon: CreditCard,
      color: "bg-emerald-500",
      lightColor: "bg-emerald-50",
      textColor: "text-emerald-600",
   },
];

function AdminLink({ link }: { link: AdminLink }) {
   const IconComponent = link.icon;
   return (
      <Link
         key={link.href}
         href={link.href}
         target={link.openInNewTab ? "_blank" : undefined}
         className={`group block h-full ${link.disabled ? "opacity-60 cursor-not-allowed pointer-events-none" : ""}`}
      >
         <div className="flex flex-col bg-white shadow-sm hover:shadow-md p-6 border border-gray-200 rounded-xl h-full hover:scale-105 transition-all duration-200">
            {/* Icon */}
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${link.lightColor} mb-4`}>
               <IconComponent className={`w-6 h-6 ${link.textColor}`} />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1">
               <h3 className="mb-2 font-semibold text-gray-900 group-hover:text-gray-700 text-lg">{link.title}</h3>
               <p className="flex-1 text-gray-600 text-sm leading-relaxed">{link.description}</p>
            </div>

            {/* Hover indicator */}
            <div className="opacity-0 group-hover:opacity-100 mt-4 transition-opacity duration-200">
               <div className={`w-full h-1 rounded-full ${link.color}`} />
            </div>
         </div>
      </Link>
   );
}

async function CongressLinkSection() {
   const baseURL = await getOrganizationBaseUrl();
   const landingUrl = `${baseURL}/`;
   return (
      <div className="mt-6">
         <div className="flex items-center gap-2 mb-1">
            <GlobeIcon className="w-5 h-5 text-blue-500" />
            <span className="font-semibold text-gray-900 text-base">Página informativa del congreso</span>
         </div>
         <div className="flex items-center bg-linear-to-r from-blue-50 to-white shadow-sm px-4 py-3 border border-blue-100 rounded-xl w-max">
            <span className="font-medium text-blue-700 text-sm truncate" title={landingUrl}>
               {landingUrl}
            </span>
            <CopyButton text={landingUrl} />
         </div>
      </div>
   );
}

function CongressInformationHeader({ congress }: { congress: CongressRecord }) {
   return (
      <div className="bg-linear-to-br from-blue-50 to-white shadow-sm mb-8 p-6 border border-blue-100 rounded-xl">
         <div className="flex md:flex-row flex-col md:justify-between md:items-center gap-4">
            <div className="flex-1">
               <h2 className="mb-3 font-bold text-gray-900 text-xl">{congress.title}</h2>
               <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-700">
                     <Calendar className="w-5 h-5 text-blue-600" />
                     <div className="flex sm:flex-row flex-col sm:items-center sm:gap-2">
                        <span className="font-medium text-sm">
                           {format({
                              date: congress.startDate,
                              format: "DD MMMM YYYY hh:mm A",
                              tz: "America/Mexico_City",
                              locale: "es-MX",
                           })}
                        </span>
                        {congress.startDate !== congress.finishDate && (
                           <>
                              <span className="hidden sm:inline text-gray-400">-</span>
                              <span className="font-medium text-sm">
                                 {format({
                                    date: congress.finishDate,
                                    format: "DD MMMM YYYY hh:mm A",
                                    tz: "America/Mexico_City",
                                    locale: "es-MX",
                                 })}
                              </span>
                           </>
                        )}
                     </div>
                  </div>
               </div>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 border border-blue-200 rounded-lg">
               <div className={`w-2 h-2 rounded-full ${congress.status === "active" ? "bg-green-500" : "bg-gray-400"}`} />
               <span className="font-medium text-gray-700 text-sm capitalize">
                  {congress.status === "active" ? "Activo" : "Finalizado"}
               </span>
            </div>
         </div>
         <CongressLinkSection />
      </div>
   );
}

export default async function CongressAdminPage() {
   const userId = await getLoggedInUserId();
   const congress = await getLatestCongress();
   const user = await getUserById(userId ?? "");

   if (!user) {
      return redirect("/login/?redirectTo=/congress-admin");
   }

   if (user.role === "coordinator") {
      return redirect("/recordings");
   }

   if (user.role !== "super_admin" && user.role !== "admin") {
      return redirect("/unauthorized?route=/congress-admin");
   }

   return (
      <div className="p-6">
         {/* Header */}
         <div className="mb-4">
            <h1 className="mb-2 font-bold text-gray-900 text-3xl">Administración del Congreso</h1>
            <p className="text-gray-600">Administra todos los aspectos de tu congreso desde ponentes hasta horarios y análisis</p>
         </div>

         <CongressInformationHeader congress={congress} />

         {/* Dashboard Grid */}
         <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {adminSections.map((section) => {
               return <AdminLink key={section.href} link={section} />;
            })}

            {congress.modality === "hybrid" &&
               hybridCongressSections.map((section) => {
                  return <AdminLink key={section.href} link={section} />;
               })}
         </div>

         {user.role === "super_admin" && (
            <div className="mt-12">
               <h3 className="mb-4 font-bold text-gray-900 text-xl">Super Admin only</h3>
               <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {superAdminSections.map((section) => {
                     return <AdminLink key={section.href} link={section} />;
                  })}
               </div>
            </div>
         )}

         {/* Quick Stats Section */}
         {/* <div className="bg-linear-to-br from-gray-50 to-gray-100 mt-12 p-6 rounded-xl">
            <h2 className="mb-4 font-semibold text-gray-900 text-xl">Vista Rápida</h2>
            <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
               <div className="bg-white p-4 rounded-lg text-center">
                  <div className="mb-1 font-bold text-blue-600 text-2xl">-</div>
                  <div className="text-gray-600 text-sm">Conferencias Activas</div>
               </div>
               <div className="bg-white p-4 rounded-lg text-center">
                  <div className="mb-1 font-bold text-purple-600 text-2xl">-</div>
                  <div className="text-gray-600 text-sm">Ponentes Registrados</div>
               </div>
               <div className="bg-white p-4 rounded-lg text-center">
                  <div className="mb-1 font-bold text-green-600 text-2xl">-</div>
                  <div className="text-gray-600 text-sm">Coordinadores del Equipo</div>
               </div>
            </div>
         </div> */}
      </div>
   );
}
