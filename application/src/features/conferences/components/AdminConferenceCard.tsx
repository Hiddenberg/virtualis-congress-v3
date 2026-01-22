import {
   ArrowRightIcon,
   CheckCircleIcon,
   CheckIcon,
   Clock,
   CoffeeIcon,
   FileTextIcon,
   FilmIcon,
   LinkIcon,
   type LucideIcon,
   MessageCircleQuestionIcon,
   MessageSquareIcon,
   PencilIcon,
   RadioTowerIcon,
   UsersIcon,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { CopyButton, LinkButton } from "@/components/global/Buttons";
import { PLATFORM_BASE_DOMAIN } from "@/data/constants/platformConstants";
import { getConferenceQnASession } from "@/features/conferences/services/conferenceQnASessionsServices";
import { getAllQuestionPollsForConference } from "@/features/conferences/services/conferenceQuestionPollsServices";
import { getConferenceRecordings } from "@/features/conferences/services/conferenceRecordingsServices";
import { getConferenceSpeakers } from "@/features/conferences/services/conferenceSpeakersServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { formatVideoTime } from "@/utils/recorderUtils";
import { getSpeakerPresentationRecordingByConferenceId } from "../services/conferenceSpeakerPresentationRecordingServices";
import ConferenceSchedule from "./adminConferenceCard/ConferenceSchedule";
import SubCard from "./adminConferenceCard/SubCard";
import DeleteConferenceButton from "./DeleteConferenceButton";

const conferenceTypeStyles: Record<CongressConference["conferenceType"], string> = {
   "in-person": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
   livestream: "bg-blue-50 text-blue-700 ring-blue-600/20",
   "pre-recorded": "bg-amber-50 text-amber-700 ring-amber-600/20",
   simulated_livestream: "bg-cyan-50 text-cyan-700 ring-cyan-600/20",
   break: "bg-teal-50 text-teal-700 ring-teal-600/20",
};

const statusStyles: Record<CongressConference["status"], string> = {
   scheduled: "bg-gray-100 text-gray-700 ring-gray-600/20",
   active: "bg-green-50 text-green-700 ring-green-600/20",
   finished: "bg-slate-50 text-slate-700 ring-slate-600/20",
   canceled: "bg-red-50 text-red-700 ring-red-600/20",
};

const statusTexts: Record<CongressConference["status"], string> = {
   scheduled: "Programada",
   active: "En vivo",
   finished: "Finalizada",
   canceled: "Cancelada",
};

const conferenceTypeTexts: Record<CongressConference["conferenceType"], string> = {
   "in-person": "Presencial",
   livestream: "En vivo",
   "pre-recorded": "Grabada",
   simulated_livestream: "En vivo simulado",
   break: "Descanso",
};

export function ConferenceCardHeader({ conference }: { conference: CongressConferenceRecord }) {
   return (
      <div className="mb-3">
         <span className="text-gray-500 text-xs">id: {conference.id}</span>
         <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 leading-snug">{conference.title}</h3>
         {conference.shortDescription && <p className="mt-1 text-gray-600 text-sm line-clamp-2">{conference.shortDescription}</p>}
      </div>
   );
}

export function ConferenceBadges({ conference }: { conference: CongressConferenceRecord }) {
   return (
      <div className="flex justify-between items-center mt-4">
         <div className="flex items-center gap-2">
            <span
               className={`px-2.5 py-1 ring-1 rounded-md font-medium text-xs ${conferenceTypeStyles[conference.conferenceType]}`}
            >
               {conferenceTypeTexts[conference.conferenceType]}
            </span>
            <span className={`px-2.5 py-1 ring-1 rounded-md font-medium capitalize text-xs ${statusStyles[conference.status]}`}>
               {statusTexts[conference.status]}
            </span>
         </div>
      </div>
   );
}

export async function ConferenceSpeakersSection({ conferenceId }: { conferenceId: string }) {
   const speakers = await getConferenceSpeakers(conferenceId);

   return (
      <SubCard title="Ponentes" icon={<UsersIcon className="w-4 h-4 text-gray-600" />}>
         {speakers.length === 0 ? (
            <p>No hay ponentes asignados a esta conferencia</p>
         ) : (
            <ul className="space-y-1">
               {speakers.map((speaker) => (
                  <li key={speaker.id} className="flex items-center gap-2 text-gray-700 text-sm">
                     <span className="bg-blue-400 rounded-full w-1.5 h-1.5" />
                     <span className="truncate">{speaker.displayName}</span>
                     {speaker.user ? (
                        <span className="flex items-center gap-1 text-gray-500 text-xs">
                           <CheckCircleIcon className="w-4 h-4 text-green-500" />
                           <span>Cuenta asociada</span>
                        </span>
                     ) : (
                        <span className="text-gray-500 text-xs">No tiene cuenta asociada</span>
                     )}
                  </li>
               ))}
            </ul>
         )}
      </SubCard>
   );
}

export async function ConferencePresentationSection({
   conferenceId,
   presentation,
}: {
   conferenceId: string;
   presentation?: PresentationRecord;
}) {
   const organization = await getOrganizationFromSubdomain();
   const uploadLink = `${organization.subdomain}.${PLATFORM_BASE_DOMAIN}/preparation/${conferenceId}/presentation/upload`;

   if (!presentation)
      return (
         <SubCard
            title="Presentación"
            icon={<FileTextIcon className="w-4 h-4 text-gray-600" />}
            footer={
               <LinkButton href={`/congress-admin/conferences/${conferenceId}/presentation`} variant="blue">
                  Administrar presentación <ArrowRightIcon className="w-4 h-4" />
               </LinkButton>
            }
         >
            <p>El ponente no ha subido su presentación</p>
            <div className="flex justify-between items-center gap-3 bg-white mt-3 px-3 py-2 rounded-md ring-1 ring-gray-200">
               <div className="flex items-center gap-2 min-w-0">
                  <LinkIcon className="w-4 h-4 text-gray-500 shrink-0" />
                  <a
                     href={`//${uploadLink}`}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-blue-700 text-sm hover:underline truncate"
                  >
                     {uploadLink}
                  </a>
               </div>
               <CopyButton text={uploadLink} />
            </div>
            <p className="mt-1 text-gray-500 text-xs">
               Comparte este link con el participante para que pueda subir su presentación
            </p>
         </SubCard>
      );

   return (
      <SubCard
         title="Presentación"
         icon={<FileTextIcon className="w-4 h-4 text-emerald-700" />}
         footer={
            <LinkButton href={`/congress-admin/conferences/${conferenceId}/presentation`} variant="blue">
               Administrar presentación <ArrowRightIcon className="w-4 h-4" />
            </LinkButton>
         }
      >
         <p className="text-emerald-900 truncate">{presentation.name}</p>
      </SubCard>
   );
}

function LinkedRecordingSummaryCard({ recording }: { recording: SimpleRecording }) {
   const statusConfig: Record<SimpleRecording["status"], { color: string; bgColor: string; label: string }> = {
      ready: {
         color: "text-green-600",
         bgColor: "bg-green-500",
         label: "Lista",
      },
      processing: {
         color: "text-yellow-600",
         bgColor: "bg-yellow-500",
         label: "Procesando",
      },
      reviewing: {
         color: "text-amber-600",
         bgColor: "bg-amber-500",
         label: "Revisando",
      },
      uploading: {
         color: "text-blue-600",
         bgColor: "bg-blue-500",
         label: "Subiendo",
      },
      recording: {
         color: "text-blue-600",
         bgColor: "bg-blue-500",
         label: "Grabando",
      },
      scheduled: {
         color: "text-gray-600",
         bgColor: "bg-gray-400",
         label: "Programada",
      },
      error: {
         color: "text-red-600",
         bgColor: "bg-red-500",
         label: "Error",
      },
   };

   const status = statusConfig[recording.status];

   return (
      <div className="bg-white shadow-sm rounded-lg ring-1 ring-gray-200 overflow-hidden">
         <div className="flex items-center gap-2 bg-linear-to-r from-blue-50 to-transparent px-3 py-2">
            <CheckIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="font-medium text-blue-900 text-xs">Grabación vinculada</span>
            <div className="flex items-center gap-1.5 ml-auto">
               <div className={`w-1.5 h-1.5 rounded-full ${status.bgColor} animate-pulse`} />
               <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
            </div>
         </div>
         <div className="space-y-2 px-3 py-2.5">
            <div className="flex items-start gap-2">
               <FileTextIcon className="mt-0.5 w-3.5 h-3.5 text-gray-400 shrink-0" />
               <p className="flex-1 text-gray-700 text-xs line-clamp-2 leading-relaxed" title={recording.title}>
                  {recording.title}
               </p>
            </div>
            <div className="flex items-center gap-2">
               <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
               <span className="font-medium text-gray-600 text-xs">{formatVideoTime(recording.durationSeconds)}</span>
            </div>
         </div>
      </div>
   );
}

export async function ConferenceQuestionPollsSection({ conferenceId }: { conferenceId: string }) {
   const polls = await getAllQuestionPollsForConference(conferenceId);
   const manageLink = `/preparation/${conferenceId}/question-polls`;
   const activeCount = polls.filter((p) => p.status === "active").length;

   return (
      <SubCard
         title="Encuestas"
         icon={<MessageSquareIcon className="w-4 h-4 text-gray-600" />}
         badge={
            <span className="bg-blue-50 px-1.5 py-0.5 rounded-full ring-1 ring-blue-100 font-medium text-blue-700 text-xs">
               {polls.length}
            </span>
         }
         footer={
            <LinkButton href={`${manageLink}`} variant="blue">
               Gestionar encuestas <ArrowRightIcon className="w-4 h-4" />
            </LinkButton>
         }
      >
         {polls.length === 0 ? (
            <p>No hay encuestas asignadas a esta conferencia</p>
         ) : (
            <div className="text-gray-700 text-sm">
               <p>
                  <strong>{polls.length}</strong> encuestas asignadas
                  {activeCount > 0 ? (
                     <span className="ml-1 text-green-700" />
                  ) : (
                     <span className="ml-1 text-gray-600">• todas finalizadas</span>
                  )}
               </p>
            </div>
         )}
      </SubCard>
   );
}

export async function ConferenceRecordingsSection({ conferenceId }: { conferenceId: string }) {
   const recordings = await getConferenceRecordings(conferenceId);
   const manageLink = `/congress-admin/conferences/${conferenceId}/recordings`;

   const recording = recordings[0];

   return (
      <SubCard
         title="Grabaciones"
         icon={<FilmIcon className="w-4 h-4 text-gray-600" />}
         badge={
            <span className="bg-blue-50 px-1.5 py-0.5 rounded-full ring-1 ring-blue-100 font-medium text-blue-700 text-xs">
               {recordings.length}
            </span>
         }
         footer={
            <LinkButton href={`${manageLink}`} variant="blue">
               Gestionar grabaciones <ArrowRightIcon className="w-4 h-4" />
            </LinkButton>
         }
      >
         {recording ? (
            <LinkedRecordingSummaryCard recording={recording} />
         ) : (
            <div className="flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-md ring-1 ring-amber-100 text-amber-700 text-sm">
               <div className="bg-gray-300 rounded-full w-2 h-2" />
               <p className="text-gray-500 text-sm">Sin presentación vinculada</p>
            </div>
         )}
      </SubCard>
   );
}

export async function ConferenceLivestreamSection({ conference }: { conference: CongressConferenceRecord }) {
   const manageLink = `/congress-admin/conferences/${conference.id}/livestream`;
   const requiresLivestream = conference.conferenceType === "in-person" || conference.conferenceType === "livestream";

   return (
      <SubCard
         title="Transmisión en vivo"
         icon={<RadioTowerIcon className="w-4 h-4 text-gray-600" />}
         footer={
            <LinkButton href={manageLink} variant="blue">
               Gestionar transmisión <ArrowRightIcon className="w-4 h-4" />
            </LinkButton>
         }
      >
         {requiresLivestream ? (
            <p className="text-gray-700 text-sm">Esta conferencia requiere transmisión en vivo. Configúrala desde el panel.</p>
         ) : (
            <p className="text-gray-500 text-sm">Esta conferencia no requiere transmisión en vivo.</p>
         )}
      </SubCard>
   );
}

export async function ConferenceQnASection({ conferenceId }: { conferenceId: string }) {
   const qnaSession = await getConferenceQnASession(conferenceId);
   const manageLink = `/congress-admin/conferences/${conferenceId}/qna`;

   return (
      <SubCard
         title="Sesión de QnA"
         icon={<MessageCircleQuestionIcon className="w-4 h-4 text-gray-600" />}
         footer={
            <LinkButton href={manageLink} variant="blue">
               Gestionar QnA <ArrowRightIcon className="w-4 h-4" />
            </LinkButton>
         }
      >
         {qnaSession ? (
            <p className="text-gray-700 text-sm">Sesión preparada.</p>
         ) : (
            <div className="flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-md ring-1 ring-amber-100 text-amber-700 text-sm">
               <span className="bg-amber-400 rounded-full w-1.5 h-1.5" />
               <p>No hay sesión de QnA preparada</p>
            </div>
         )}
      </SubCard>
   );
}

export function AdminConferenceCardContainer({ conferenceId, children }: { conferenceId: string; children: ReactNode }) {
   return (
      <div className="relative bg-white shadow-sm hover:shadow-md p-5 border border-gray-200 rounded-xl transition-all">
         <div className="top-1 right-1 absolute flex items-center gap-2">
            <Link
               href={`/congress-admin/conferences/${conferenceId}/edit`}
               className="bg-gray-100 hover:bg-gray-200 p-1 px-2 py-1 rounded-lg transition-colors"
            >
               <PencilIcon className="w-4 h-4 text-gray-600" />
            </Link>
            <DeleteConferenceButton conferenceId={conferenceId} />
         </div>
         {children}
      </div>
   );
}

export async function SpeakerPresentationRecordingSection({ conferenceId }: { conferenceId: string }) {
   const recording = await getSpeakerPresentationRecordingByConferenceId(conferenceId);

   const getStatusBadge = (status: string) => {
      const statusConfig = {
         ready: {
            label: "Lista",
            className: "bg-green-50 text-green-700 ring-green-600/20",
         },
         processing: {
            label: "Procesando",
            className: "bg-yellow-50 text-yellow-700 ring-yellow-600/20",
         },
         error: {
            label: "Error",
            className: "bg-red-50 text-red-700 ring-red-600/20",
         },
      };
      const config = statusConfig[status as keyof typeof statusConfig] || {
         label: status,
         className: "bg-gray-50 text-gray-700 ring-gray-600/20",
      };
      return <span className={`px-2 py-1 rounded-md text-xs font-medium ring-1 ${config.className}`}>{config.label}</span>;
   };

   return (
      <SubCard
         title="Presentación del ponente"
         icon={<FilmIcon className="w-4 h-4 text-gray-600" />}
         badge={recording ? getStatusBadge(recording.status) : undefined}
         footer={
            <LinkButton href={`/congress-admin/conferences/${conferenceId}/speaker-presentation-recording`} variant="blue">
               Administrar presentación del ponente
               <ArrowRightIcon className="w-4 h-4" />
            </LinkButton>
         }
      >
         {recording ? (
            <LinkedRecordingSummaryCard recording={recording} />
         ) : (
            <div className="flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-md ring-1 ring-amber-100 text-amber-700 text-sm">
               <div className="bg-gray-300 rounded-full w-2 h-2" />
               <p className="text-gray-500 text-sm">Sin presentación vinculada</p>
            </div>
         )}
      </SubCard>
   );
}

function GenericSubCardSkeleton({ title, Icon }: { title: string; Icon: LucideIcon }) {
   return (
      <div className="flex flex-col bg-gray-50 p-3 rounded-lg ring-1 ring-gray-200 h-full animate-pulse">
         <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
               <Icon className="w-4 h-4 text-gray-400" />
               <span className="font-semibold text-gray-900 text-sm">{title}</span>
            </div>
         </div>
         <div className="flex-1 mt-2 text-gray-700 text-sm">
            <div className="space-y-2">
               <div className="bg-gray-200 rounded w-48 h-2.5" />
               <div className="bg-gray-200 rounded w-40 h-2.5" />
               <div className="bg-gray-200 rounded w-56 h-2.5" />
            </div>
         </div>
      </div>
   );
}

export default function AdminConferenceCard({
   conference,
   presentation,
}: {
   conference: CongressConferenceRecord;
   presentation?: PresentationRecord;
}) {
   const requiresRecording = conference.conferenceType === "pre-recorded" || conference.conferenceType === "simulated_livestream";
   const requiresLivestream = conference.conferenceType === "in-person" || conference.conferenceType === "livestream";

   return (
      <AdminConferenceCardContainer conferenceId={conference.id}>
         <ConferenceCardHeader conference={conference} />
         <ConferenceSchedule startTime={conference.startTime} endTime={conference.endTime} />
         <ConferenceBadges conference={conference} />
         {conference.conferenceType !== "break" ? (
            <div className="items-stretch gap-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-4">
               <Suspense fallback={<GenericSubCardSkeleton title="Ponentes" Icon={UsersIcon} />}>
                  <ConferenceSpeakersSection conferenceId={conference.id} />
               </Suspense>
               <ConferenceQuestionPollsSection conferenceId={conference.id} />
               <ConferencePresentationSection presentation={presentation} conferenceId={conference.id} />
               {requiresRecording && (
                  <Suspense fallback={<GenericSubCardSkeleton title="Grabaciones" Icon={FilmIcon} />}>
                     <ConferenceRecordingsSection conferenceId={conference.id} />
                  </Suspense>
               )}
               {requiresLivestream && <ConferenceLivestreamSection conference={conference} />}
               <ConferenceQnASection conferenceId={conference.id} />
               <Suspense fallback={<GenericSubCardSkeleton title="Presentación del ponente" Icon={FilmIcon} />}>
                  <SpeakerPresentationRecordingSection conferenceId={conference.id} />
               </Suspense>
            </div>
         ) : (
            <div className="mt-4">
               <div className="flex flex-col justify-center items-center gap-2 bg-gray-50 p-3 rounded-lg ring-1 ring-gray-200">
                  <span className="font-semibold text-gray-900 text-sm">Descanso</span>
                  <CoffeeIcon className="size-10 text-gray-600" />
               </div>
            </div>
         )}
      </AdminConferenceCardContainer>
   );
}
