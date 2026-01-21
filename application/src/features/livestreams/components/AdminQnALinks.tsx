"use client";

import { LinkIcon, MessageSquareIcon, TriangleAlertIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { CopyButton } from "@/components/global/Buttons";
import { IS_DEV_ENVIRONMENT, PLATFORM_BASE_DOMAIN } from "@/data/constants/platformConstants";
import { disableConferenceQnAAction } from "@/features/conferences/actions/conferenceQnAActions";
import { useOrganizationContext } from "@/features/organizations/context/OrganizationContext";

interface AdminQnALinksProps {
   conferenceId: string;
   sessionStatus?: LivestreamSessionRecord["status"];
}

function StatusBadge({ status }: { status: AdminQnALinksProps["sessionStatus"] }) {
   if (!status) return null;
   const map = {
      scheduled: {
         label: "Programada",
         className: "bg-stone-100 text-stone-800 border-stone-200",
      },
      preparing: {
         label: "Preparando",
         className: "bg-amber-50 text-amber-800 border-amber-200",
      },
      streaming: {
         label: "En vivo",
         className: "bg-green-50 text-green-800 border-green-200",
      },
      ended: {
         label: "Finalizada",
         className: "bg-red-50 text-red-800 border-red-200",
      },
      paused: {
         label: "Pausada",
         className: "bg-yellow-50 text-yellow-800 border-yellow-200",
      },
   } as const;
   const conf = map[status];
   return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs border ${conf.className}`}>{conf.label}</span>
   );
}

export default function AdminQnALinks({ conferenceId, sessionStatus }: AdminQnALinksProps) {
   const router = useRouter();
   const { organization } = useOrganizationContext();
   const [isDisabling, startTransition] = useTransition();

   if (!organization) return <div className="p-6">Error: Organization is required</div>;

   const protocol = IS_DEV_ENVIRONMENT ? "http" : "https";
   const routeBase = `live-transmission/${conferenceId}/qna`;
   const baseUrl = `${protocol}://${organization.subdomain}.${PLATFORM_BASE_DOMAIN}/${routeBase}`;

   const adminLink = `${baseUrl}?ishost=true`;
   const guestLink = `${baseUrl}`;

   const handleDisable = () => {
      const confirmed = window.confirm("¿Eliminar la sesión de QnA? Esta acción no se puede deshacer.");
      if (!confirmed) return;
      startTransition(async () => {
         const res = await disableConferenceQnAAction({
            conferenceId,
         });
         if (!res.success) {
            toast.error(res.errorMessage);
            return;
         }
         toast.success("Sesión de QnA eliminada");
         router.refresh();
      });
   };

   return (
      <div className="p-6">
         <div className="space-y-6 max-w-3xl">
            <div className="flex justify-between items-center">
               <button onClick={() => router.back()} className="text-stone-700 hover:text-stone-900 text-sm">
                  ← Volver
               </button>
               <StatusBadge status={sessionStatus} />
            </div>

            {/* Admin (Host) Link */}
            <div className="bg-white shadow-sm p-5 border border-stone-200 rounded-xl">
               <div className="flex items-start gap-3 mb-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                     <MessageSquareIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                     <h2 className="font-semibold text-stone-900 text-base">Iniciar QnA (admin)</h2>
                     <p className="text-stone-600 text-sm">Link para anfitriones de la sesión de preguntas y respuestas.</p>
                  </div>
               </div>
               <div className="flex items-center gap-3 bg-stone-50 p-3 border border-stone-200 rounded-lg">
                  <span className="flex-1 min-w-0 text-stone-700 text-sm truncate">{adminLink}</span>
                  <CopyButton text={adminLink} />
                  <Link
                     href={adminLink}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md text-white text-sm"
                  >
                     Abrir
                  </Link>
               </div>
               <div className="flex items-start gap-2 bg-amber-50 mt-3 p-2 border border-amber-200 rounded-md text-amber-700 text-xs">
                  <TriangleAlertIcon className="mt-0.5 w-4 h-4 shrink-0" />
                  <p>Solo para administradores o coordinadores. NO compartir este link públicamente.</p>
               </div>
            </div>

            {/* Guest Link */}
            <div className="bg-white shadow-sm p-5 border border-stone-200 rounded-xl">
               <div className="flex items-start gap-3 mb-3">
                  <div className="bg-stone-100 p-2 rounded-lg">
                     <LinkIcon className="w-5 h-5 text-stone-700" />
                  </div>
                  <div>
                     <h2 className="font-semibold text-stone-900 text-base">Link para invitados</h2>
                     <p className="text-stone-600 text-sm">Comparte este link con asistentes o invitados.</p>
                  </div>
               </div>
               <div className="flex items-center gap-3 bg-stone-50 p-3 border border-stone-200 rounded-lg">
                  <span className="flex-1 min-w-0 text-stone-700 text-sm truncate">{guestLink}</span>
                  <CopyButton text={guestLink} />
                  <Link
                     href={guestLink}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="bg-stone-800 hover:bg-stone-900 px-3 py-2 rounded-md text-white text-sm"
                  >
                     Abrir
                  </Link>
               </div>
            </div>

            {/* Danger zone */}
            <div className="bg-red-50 shadow-sm p-5 border border-red-200 rounded-xl">
               <h3 className="mb-2 font-semibold text-red-800 text-base">Eliminar sesión de QnA</h3>
               <p className="mb-3 text-red-700 text-sm">
                  Si ya no necesitas esta sesión, puedes eliminarla. Esto también eliminará los recursos asociados.
               </p>
               <button
                  onClick={handleDisable}
                  disabled={isDisabling}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 px-4 py-2 rounded-md text-white text-sm"
               >
                  {isDisabling ? "Eliminando..." : "Eliminar sesión de QnA"}
               </button>
            </div>
         </div>
      </div>
   );
}
