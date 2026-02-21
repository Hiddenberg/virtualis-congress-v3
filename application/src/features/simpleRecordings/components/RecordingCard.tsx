import MuxPlayer from "@mux/mux-player-react/lazy";
import { ArrowRightIcon, ClockIcon, LinkIcon, MailIcon, PhoneIcon, UserIcon } from "lucide-react";
import { CopyButton, LinkButton } from "@/components/global/Buttons";
import type { OrganizationRecord } from "@/features/organizations/types/organizationTypes";
import PresentationAndVideoPlayer from "@/features/pptPresentations/components/PresentationAndVideoPlayer";
import { getPresentationRecordingByPresentationId } from "@/features/pptPresentations/services/presentationRecordingServices";
import { getPresentationSlidesById } from "@/features/pptPresentations/services/presentationServices";
import { getUserByEmail } from "@/features/users/services/userServices";
import { checkAuthorizedUserFromServer } from "@/services/authServices";
import { getRecordingPresentationByRecordingId } from "../services/recordingPresentationsServices";
import { getRecordingTrackedEmails, type RecordingTrackedEmailWithType } from "../services/recordingTrackedEmailsServices";
import { getRecordingLink } from "../utils/recordingUtils";
import EmailStatusItem from "./EmailStatusItem";
import RecordingActions from "./RecordingActions";
import RecordingStatusBadge from "./RecordingStatusBadge";
import SendRecordingInvitationButton from "./SendRecordingInvitationButton";
import SendRecordingReminderButton from "./SendRecordingReminderButton";

// function EmailStatusSectionOld ({ recording }: {
//    recording: SimpleRecordingRecord
// }) {
//    const recorderEmail = recording.recorderEmail
//    const invitationEmailStatus = recording.invitationEmailStatus

//    // Email status configuration
//    const emailStatusConfig = {
//       not_sent: {
//          label: "No enviado",
//          icon: ClockIcon,
//          color: "text-gray-600",
//          bgColor: "bg-gray-50",
//          borderColor: "border-gray-200"
//       },
//       sent: {
//          label: "Enviado",
//          icon: CheckCircleIcon,
//          color: "text-blue-600",
//          bgColor: "bg-blue-50",
//          borderColor: "border-blue-200"
//       },
//       opened: {
//          label: "Abierto",
//          icon: CheckCircleIcon,
//          color: "text-green-600",
//          bgColor: "bg-green-50",
//          borderColor: "border-green-200"
//       },
//       error: {
//          label: "Error",
//          icon: XCircleIcon,
//          color: "text-red-600",
//          bgColor: "bg-red-50",
//          borderColor: "border-red-200"
//       }
//    }

//    const emailStatus = emailStatusConfig[invitationEmailStatus]
//    return (
//       <div className={`${emailStatus.bgColor} border ${emailStatus.borderColor} rounded-lg p-3 mb-3`}>
//          <div className="flex justify-between items-start mb-2">
//             <div className="flex items-center gap-2">
//                <MailIcon className="size-4 text-gray-400" />
//                <span className="font-medium text-gray-700 text-sm">Estado del correo</span>
//             </div>
//             <div className="flex flex-col items-center gap-1">
//                <div className="flex items-center gap-1">
//                   <emailStatus.icon className={`size-4 ${emailStatus.color}`} />
//                   <span className={`text-sm font-medium ${emailStatus.color}`}>
//                      {emailStatus.label}
//                   </span>
//                </div>
//                {
//                   recording.invitationEmailOpenedAt && (
//                      <span className="text-gray-500 text-xs">
//                         {format({
//                            date: recording.invitationEmailOpenedAt,
//                            format: "DD/MM/YYYY hh:mm A",
//                            locale: "es-MX",
//                            tz: "America/Mexico_City"
//                         })}
//                      </span>
//                   )
//                }
//             </div>
//          </div>

//          <div className="mb-3 text-gray-600 text-xs">
//             <span className="font-medium">Correo:</span> {recorderEmail}
//          </div>

//          {/* Send Invitation Button - Only show if not sent and scheduled */}
//          {invitationEmailStatus === "not_sent" && recording.status === "scheduled" && (
//             <SendRecordingInvitationButton recordingId={recording.id} />
//          )}
//       </div>
//    )
// }

async function EmailStatusSectionNew({ recording }: { recording: SimpleRecordingRecord }) {
   const recorderEmail = recording.recorderEmail;

   const recordingTrackedEmails: RecordingTrackedEmailWithType[] = await getRecordingTrackedEmails(recording.id);
   const invitationEmail = recordingTrackedEmails.find((trackedEmail) => trackedEmail.type === "invitation");
   const reminderEmails = recordingTrackedEmails.filter((trackedEmail) => trackedEmail.type === "reminder");

   const emailsNotSent = recordingTrackedEmails.length === 0;

   const hasValidEmail = recorderEmail !== "automated@recording.com";

   if (!hasValidEmail) {
      return (
         <div className="bg-red-50 mb-3 p-3 border border-red-200 rounded-lg">
            <p className="font-semibold text-red-700 text-sm">
               No hay un correo electrónico registrado para esta grabación, por favor comparta el enlace de grabación directamente
               con el ponente.
            </p>
         </div>
      );
   }

   return (
      <div className={`border border-gray-200 bg-gray-50 rounded-lg p-3 mb-3`}>
         <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
               <MailIcon className="size-4 text-gray-400" />
               <span className="font-medium text-gray-700 text-sm">Estado del correo</span>
            </div>
            <div className="flex flex-col items-center gap-1">
               {emailsNotSent && (
                  <div className="flex items-center gap-1">
                     <ClockIcon className={`size-4 text-gray-400`} />
                     <span className={`text-sm font-medium text-gray-700`}>No enviado</span>
                  </div>
               )}
            </div>
         </div>

         <div className="mb-3 text-gray-600 text-xs">
            <span className="font-medium">Correo:</span> {recorderEmail}
         </div>

         {/* Send Invitation Button - Only show if not sent */}
         <div className="mb-2">
            {emailsNotSent && <SendRecordingInvitationButton recordingId={recording.id} />}

            {invitationEmail && reminderEmails.length < 5 && <SendRecordingReminderButton recordingId={recording.id} />}
         </div>

         {recordingTrackedEmails.length > 0 && (
            <div className="space-y-2">
               <p className="mb-3 font-medium text-gray-700 text-xs">Emails enviados ({recordingTrackedEmails.length})</p>
               <div className="space-y-2 max-h-52 overflow-y-auto">
                  {recordingTrackedEmails.map((trackedEmail) => (
                     <EmailStatusItem key={trackedEmail.id} trackedEmail={trackedEmail} />
                  ))}
               </div>
            </div>
         )}
      </div>
   );
}

async function RecordingPresentationSection({ recording }: { recording: SimpleRecordingRecord }) {
   const recordingPresentation = await getRecordingPresentationByRecordingId(recording.id);

   if (!recordingPresentation) {
      return null;
   }

   return (
      <div className="bg-gray-50 p-2 border border-gray-200 rounded-lg">
         <h1>Presentación asociada</h1>
         <LinkButton href={`/recordings/recording/${recording.id}/presentation`} variant="blue">
            Ver presentación <ArrowRightIcon className="w-4 h-4" />
         </LinkButton>
      </div>
   );
}

interface RecordingCardProps {
   recording: SimpleRecordingRecord;
   organization: OrganizationRecord;
}

export default async function RecordingCard({ recording, organization }: RecordingCardProps) {
   const recordingLink = `${getRecordingLink(recording.id, organization)}`;

   const recordingPresentation = await getRecordingPresentationByRecordingId(recording.id);
   const presentationSlides = await getPresentationSlidesById(recordingPresentation?.id || "");
   const presentationRecording = await getPresentationRecordingByPresentationId(recordingPresentation?.id || "");
   const isAdmin = await checkAuthorizedUserFromServer(["super_admin", "admin"]);
   const recorderPhone = isAdmin ? (await getUserByEmail(recording.recorderEmail))?.phoneNumber : undefined;

   const recorderName = recording.recorderName === "Automated Recording" ? "Ponente no asignado" : recording.recorderName;

   return (
      <div className="flex flex-col bg-white shadow-sm hover:shadow-lg p-4 border border-gray-200 rounded-xl h-full transition-all duration-200">
         <div className="pb-3">
            <div className="flex justify-between items-start mb-2">
               <div>
                  <RecordingStatusBadge status={recording.status} />
               </div>
               <div className="ml-2 shrink-0">
                  <RecordingActions recording={recording} recordingLink={recordingLink} />
               </div>
            </div>

            <h3 title={recording.title} className="font-semibold text-gray-900 line-clamp-3 leading-tight">
               {recording.title}
            </h3>

            <div className="flex items-center gap-2 mt-1 text-gray-600 text-sm">
               <UserIcon className="size-4 text-gray-400" />
               <span>Grabado por: {recorderName}</span>
            </div>

            <div className="flex items-center gap-2 mt-1 text-gray-600 text-sm">
               <PhoneIcon className="size-4 text-gray-400" />
               <span>Número de teléfono: {recorderPhone ? recorderPhone : "No disponible"}</span>
            </div>
         </div>

         <div className="flex flex-col flex-1 pt-0">
            {/* Video Player for Ready Recordings */}
            {recording.status === "ready" && recording.muxPlaybackId && !recordingPresentation && (
               <div className="bg-gray-100 mb-3 rounded-lg aspect-video overflow-hidden">
                  <MuxPlayer
                     playbackId={recording.muxPlaybackId}
                     metadataVideoTitle={recording.title}
                     className="w-full h-full"
                  />
               </div>
            )}

            {recording.status === "ready" && recording.muxPlaybackId && recordingPresentation && presentationRecording && (
               <div className="bg-gray-100 mb-3 rounded-lg">
                  <PresentationAndVideoPlayer
                     isSmall={true}
                     muxPlaybackId={recording.muxPlaybackId}
                     presentationSlides={presentationSlides || []}
                     presentationRecording={presentationRecording}
                  />
               </div>
            )}

            {/* Scheduled Status - Show Recording Link Prominently */}
            {recording.status === "scheduled" && (
               <div className="bg-blue-50 mb-3 p-4 border border-blue-200 rounded-lg">
                  <div className="mb-3 text-center">
                     <div className="font-medium text-blue-700 text-sm">Link de grabación</div>
                     <div className="mt-1 text-blue-600 text-xs">
                        Comparte este enlace con la persona que realizará la grabación
                     </div>
                  </div>

                  <div className="flex items-center gap-2 bg-white p-2 border border-blue-200 rounded-md">
                     <LinkIcon className="size-4 text-blue-500 shrink-0" />
                     <code className="flex-1 font-mono text-blue-700 text-sm truncate">{recordingLink}</code>
                     <CopyButton text={recordingLink} />
                  </div>
               </div>
            )}

            {/* Placeholder for Other Statuses */}
            {recording.status !== "ready" && recording.status !== "scheduled" && (
               <div className="flex justify-center items-center bg-gray-100 mb-3 rounded-lg aspect-video">
                  <div className="text-gray-500 text-center">
                     <div className="text-sm">
                        {recording.status === "recording" && "Grabación en proceso..."}
                        {recording.status === "uploading" && "Subiendo video..."}
                        {recording.status === "processing" && "Procesando video..."}
                        {recording.status === "error" && "Error en la grabación"}
                     </div>
                  </div>
               </div>
            )}

            {recording.status !== "ready" && (
               <>
                  <EmailStatusSectionNew recording={recording} />
                  <RecordingPresentationSection recording={recording} />
               </>
            )}
         </div>
      </div>
   );
}
