"use client";

import { format } from "@formkit/tempo";
import {
   Clock,
   LinkIcon,
   MailIcon,
   Megaphone,
   Mic2,
   Phone,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { RecordModel } from "pocketbase";
import { useTransition } from "react";
import {
   sendRecordingInvitationMailAction,
   sendRecordingReminderMailAction,
   sendReRecordingMailAction,
} from "@/actions/emailActions";
import type { ConferenceWithSpeakerNamesAndPhones } from "@/features/conferences/services/conferenceServices";
import type { ConferenceRecording } from "@/types/congress";
import { Button, CopyButton } from "../global/Buttons";
export function SendRecordingInvitationButton({
   recordingId,
   emailSent,
}: {
   recordingId: string;
   emailSent: ConferenceRecording["invitationEmailSent"];
}) {
   const [isSending, startTransition] = useTransition();

   const handleSendRecordingInvitation = () => {
      startTransition(async () => {
         const { success, message, error } =
            await sendRecordingInvitationMailAction(recordingId);
         if (error) {
            alert(`Error al enviar la invitación:\n${error}`);
         } else if (success) {
            alert(message);
         }
      });
   };

   return (
      <Button
         onClick={handleSendRecordingInvitation}
         disabled={isSending}
         className="!bg-blue-400 hover:!bg-blue-500 !p-1 !px-2 !rounded-full !font-normal !text-white !text-xs"
      >
         {isSending
            ? "Enviando..."
            : emailSent
              ? "Reenviar invitación"
              : "Enviar invitación"}
      </Button>
   );
}

function SendReminderButton({
   recordingId,
   remindersSentCount,
}: {
   recordingId: string;
   remindersSentCount: number;
}) {
   const [isSending, startTransition] = useTransition();

   const handleSendReminder = () => {
      startTransition(async () => {
         const { success, message, error } =
            await sendRecordingReminderMailAction(recordingId);
         if (error) {
            alert(`Error al enviar el recordatorio:\n${error}`);
         } else if (success) {
            alert(message);
         }
      });
   };

   if (remindersSentCount >= 5) {
      return (
         <div className="flex items-center gap-2 bg-red-100/70 p-2 rounded-md">
            <p className="text-xs">Máximo de recordatorios enviados</p>
         </div>
      );
   }

   return (
      <Button
         onClick={handleSendReminder}
         disabled={isSending}
         className="!bg-blue-400 hover:!bg-blue-500 !p-1 !px-2 !rounded-full !font-normal !text-white !text-xs"
      >
         {isSending ? "Enviando..." : "Enviar recordatorio"}
      </Button>
   );
}

function SendReRecordingButton({
   recordingId,
   reRecordingEmailSent,
}: {
   recordingId: string;
   reRecordingEmailSent?: boolean;
}) {
   const [isSending, startTransition] = useTransition();

   const handleSendReRecordingEmail = () => {
      const confirmed = window.confirm(
         "¡ADVERTENCIA!\n\nAl enviar esta solicitud de re-grabación, se le pedirá al ponente que vuelva a grabar su conferencia.\n\nSi el ponente realiza una nueva grabación, la grabación actual será reemplazada por la nueva versión.\n\n¿Está seguro de continuar?",
      );

      if (!confirmed) return;

      startTransition(async () => {
         const { success, message, error } =
            await sendReRecordingMailAction(recordingId);
         if (error) {
            alert(`Error al enviar la solicitud de re-grabación:\n${error}`);
         } else if (success) {
            alert(message);
         }
      });
   };

   return (
      <Button
         onClick={handleSendReRecordingEmail}
         disabled={isSending}
         className="!bg-red-400 hover:!bg-red-500 !p-1 !px-2 !rounded-full !font-normal !text-white !text-xs"
      >
         {isSending
            ? "Enviando..."
            : reRecordingEmailSent
              ? "Reenviar solicitud de re-grabación"
              : "Solicitar re-grabación"}
      </Button>
   );
}

function RecordingActionsSection({
   recording,
}: {
   recording: ConferenceRecording & RecordModel;
}) {
   if (recording.status === "available") {
      return (
         <div className="bg-blue-50 p-4 border border-blue-100 rounded-lg w-1/3">
            <p className="mb-3 font-medium text-blue-800 text-sm">Acciones:</p>
            <div className="flex flex-col gap-4">
               <Link href={`/watch-recording/${recording.id}`}>
                  <Button className="!bg-blue-400 hover:!bg-blue-500 !p-1 !px-2 !rounded-full !font-normal !text-white !text-xs">
                     Ver grabación
                  </Button>
               </Link>
               <SendReRecordingButton
                  recordingId={recording.id}
                  reRecordingEmailSent={recording.reRecordingEmailSent}
               />
            </div>
         </div>
      );
   }

   return (
      <div className="bg-blue-50 p-4 border border-blue-100 rounded-lg w-1/3">
         <p className="mb-3 font-medium text-blue-800 text-sm">Acciones:</p>
         <div className="flex flex-col gap-4">
            <SendRecordingInvitationButton
               recordingId={recording.id}
               emailSent={recording.invitationEmailSent}
            />
            <SendReminderButton
               recordingId={recording.id}
               remindersSentCount={recording.remindersSentCount}
            />
         </div>
      </div>
   );
}

function RecordingStatusSection({
   recording,
}: {
   recording: ConferenceRecording & RecordModel;
}) {
   return (
      <div className="flex-1 space-y-3">
         <RecordingStatusBadge
            status={recording.status}
            startedRecordingAt={recording.startedRecordingAt}
         />

         <BadgeWrapper
            color={recording.invitationEmailSent ? "green" : "blue"}
            label="Estado de invitación"
         >
            <p>
               {recording.invitationEmailSent
                  ? "Invitación enviada"
                  : "Invitación pendiente"}
            </p>
         </BadgeWrapper>

         <InvitationOpenedBadge
            invitationEmailOpened={recording.invitationEmailOpened}
            invitationEmailOpenedAt={recording.invitationEmailOpenedAt}
         />

         <RemindersSentBadge
            lastReminderSentAt={recording.lastReminderSentAt}
            remindersSentCount={recording.remindersSentCount}
         />

         <ReminderOpenedBadge
            lastReminderOpenedAt={recording.lastReminderOpenedAt}
            remindersSentCount={recording.remindersSentCount}
         />

         {recording.status === "available" && (
            <ReRecordingEmailBadge
               reRecordingEmailSent={recording.reRecordingEmailSent}
               reRecordingEmailSentAt={recording.reRecordingEmailSentAt}
               reRecordingEmailOpenedAt={recording.reRecordingEmailOpenedAt}
            />
         )}
      </div>
   );
}

type BadgeColor =
   | "green"
   | "blue"
   | "red"
   | "yellow"
   | "dark-blue"
   | "orange"
   | "cyan";
function BadgeWrapper({
   children,
   color,
   label,
   pulsing,
}: {
   children: React.ReactNode;
   color: BadgeColor;
   label?: string;
   pulsing?: boolean;
}) {
   const badgeColors: Record<BadgeColor, string> = {
      green: "bg-green-100 text-green-800 border border-green-200",
      blue: "bg-blue-100 text-blue-800 border border-blue-200",
      red: "bg-red-100 text-red-800 border border-red-200",
      yellow: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      orange: "bg-orange-100 text-orange-800 border border-orange-200",
      cyan: "bg-cyan-100 text-cyan-800 border border-cyan-200",
      "dark-blue": "bg-blue-900 text-white border border-blue-200",
   };

   return (
      <div className="flex flex-col w-full">
         {label && <span className="mb-1 text-gray-500 text-xs">{label}</span>}
         <div
            className={`px-3 py-1 rounded-md text-xs font-medium w-full ${badgeColors[color]} ${pulsing ? "animate-pulse" : ""}`}
         >
            {children}
         </div>
      </div>
   );
}

function RecordingStatusBadge({
   status,
   startedRecordingAt,
}: {
   status: ConferenceRecording["status"];
   startedRecordingAt?: ConferenceRecording["startedRecordingAt"];
}) {
   const badgeColors: Record<ConferenceRecording["status"], BadgeColor> = {
      available: "dark-blue",
      pending: "yellow",
      recording: "yellow",
      uploading: "cyan",
      processing: "orange",
      failed: "red",
   };

   const statusTextsMap: Record<ConferenceRecording["status"], string> = {
      available: "Grabada",
      pending: "Pendiente",
      recording: "Grabando",
      uploading: "Subiendo",
      processing: "Procesando",
      failed: "Error",
   };

   return (
      <BadgeWrapper
         color={badgeColors[status]}
         label="Estado de grabación"
         pulsing={
            status === "processing" ||
            status === "uploading" ||
            status === "recording"
         }
      >
         <p>{statusTextsMap[status]}</p>
         {status === "recording" && startedRecordingAt && (
            <p className="text-xs">
               Grabación iniciada:{" "}
               {format(new Date(startedRecordingAt), "DD/MM/YYYY hh:mm A")}
            </p>
         )}
      </BadgeWrapper>
   );
}

function InvitationOpenedBadge({
   invitationEmailOpened,
   invitationEmailOpenedAt,
}: {
   invitationEmailOpened: boolean;
   invitationEmailOpenedAt: ConferenceRecording["invitationEmailOpenedAt"];
}) {
   if (invitationEmailOpened) {
      return (
         <BadgeWrapper color="green" label="Apertura de invitación">
            <p>Invitación abierta</p>
            {invitationEmailOpenedAt && (
               <p className="text-xs">
                  {format(
                     new Date(invitationEmailOpenedAt),
                     "DD/MM/YYYY hh:mm A",
                  )}
               </p>
            )}
         </BadgeWrapper>
      );
   }

   return (
      <BadgeWrapper color="blue" label="Apertura de invitación">
         <p>Invitación no abierta</p>
      </BadgeWrapper>
   );
}

function RemindersSentBadge({
   lastReminderSentAt,
   remindersSentCount,
}: {
   lastReminderSentAt: ConferenceRecording["lastReminderSentAt"];
   remindersSentCount: ConferenceRecording["remindersSentCount"];
}) {
   const reminderLabel = `Recordatorios enviados: ${remindersSentCount} ${remindersSentCount >= 5 ? "(Maximo 5)" : ""}`;

   if (remindersSentCount === 0) {
      return (
         <BadgeWrapper color="blue" label={reminderLabel}>
            <p>No se han enviado recordatorios</p>
         </BadgeWrapper>
      );
   }

   return (
      <BadgeWrapper color="green" label={reminderLabel}>
         {lastReminderSentAt && (
            <>
               <p className="text-xs">Último recordatorio enviado:</p>
               <p className="text-xs">
                  {format(new Date(lastReminderSentAt), "DD/MM/YYYY hh:mm A")}
               </p>
            </>
         )}
      </BadgeWrapper>
   );
}

function ReminderOpenedBadge({
   lastReminderOpenedAt,
   remindersSentCount,
}: {
   lastReminderOpenedAt: ConferenceRecording["lastReminderOpenedAt"];
   remindersSentCount: ConferenceRecording["remindersSentCount"];
}) {
   if (remindersSentCount === 0) {
      return (
         <BadgeWrapper color="blue" label="Estado de recordatorio">
            <p>No se han enviado recordatorios</p>
         </BadgeWrapper>
      );
   }

   return (
      <BadgeWrapper
         color={lastReminderOpenedAt ? "green" : "blue"}
         label="Estado de recordatorio"
      >
         <p>
            {lastReminderOpenedAt
               ? "Último recordatorio abierto"
               : "Recordatorio no abierto"}
         </p>
         {lastReminderOpenedAt && (
            <p className="text-xs">
               {format(new Date(lastReminderOpenedAt), "DD/MM/YYYY hh:mm A")}
            </p>
         )}
      </BadgeWrapper>
   );
}

function ReRecordingEmailBadge({
   reRecordingEmailSent,
   reRecordingEmailSentAt,
   reRecordingEmailOpenedAt,
}: {
   reRecordingEmailSent?: boolean;
   reRecordingEmailSentAt?: string;
   reRecordingEmailOpenedAt?: string;
}) {
   if (!reRecordingEmailSent) {
      return (
         <BadgeWrapper color="blue" label="Estado de re-grabación">
            <p>No se ha solicitado re-grabación</p>
         </BadgeWrapper>
      );
   }

   return (
      <BadgeWrapper
         color={reRecordingEmailOpenedAt ? "green" : "red"}
         label="Solicitud de re-grabación"
      >
         <div className="flex flex-col gap-1">
            <p>
               {reRecordingEmailOpenedAt
                  ? "Solicitud vista por el ponente"
                  : "Solicitud enviada - No vista"}
            </p>

            {reRecordingEmailSentAt && (
               <div className="flex flex-col">
                  <p className="mt-1 font-semibold text-xs">Enviada:</p>
                  <p className="text-xs">
                     {format(
                        new Date(reRecordingEmailSentAt),
                        "DD/MM/YYYY hh:mm A",
                     )}
                  </p>
               </div>
            )}

            {reRecordingEmailOpenedAt && (
               <div className="flex flex-col">
                  <p className="mt-1 font-semibold text-xs">Vista:</p>
                  <p className="text-xs">
                     {format(
                        new Date(reRecordingEmailOpenedAt),
                        "DD/MM/YYYY hh:mm A",
                     )}
                  </p>
               </div>
            )}
         </div>
      </BadgeWrapper>
   );
}

export default function AdminConfernceCard({
   conference,
   conferenceRecordings,
}: {
   conference: ConferenceWithSpeakerNamesAndPhones;
   conferenceRecordings: (ConferenceRecording & RecordModel)[];
}) {
   const path = usePathname();
   const isAdminView = path.startsWith("/congress-admin");
   // const isGroupConference = conference.conferenceType === "group"

   return (
      <div className="relative flex flex-col gap-3 bg-blue-100 shadow-sm hover:shadow p-5 border border-blue-200 rounded-3xl transition-shadow">
         {/* {isAdminView && (
            <div className="top-4 right-4 absolute flex items-center gap-2 bg-white shadow-sm p-2 rounded-full">
               <Link href={`/congress-admin/conferences/${conference.id}/edit`}>
                  <PencilIcon className="size-4 text-blue-600" />
               </Link>
            </div>
         )} */}

         {/* Title and description */}
         <div className="mb-1">
            <h2 className="font-bold text-blue-900 text-lg capitalize">
               {conference.title}
            </h2>
            <p className="mt-1 text-blue-800/80 text-sm">
               {conference.shortDescription}
            </p>
         </div>

         {/* Conference Times */}
         <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-2">
               <div className="flex justify-center items-center bg-white shadow-sm rounded-full size-7">
                  <Clock className="size-4 text-blue-600" />
               </div>
               <span className="font-semibold text-blue-900">Horario:</span>
               <span className="bg-white shadow-sm px-3 py-1 rounded-full text-blue-800 capitalize">
                  {format(conference.startTime, "HH:mm")} -{" "}
                  {format(conference.endTime, "HH:mm")}
               </span>
            </div>
         </div>
         {/* Speakers section */}
         <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-2">
               <div className="flex justify-center items-center bg-white shadow-sm rounded-full size-7">
                  <Megaphone className="size-4 text-blue-600" />
               </div>
               {/* <span className="font-semibold text-blue-900">{conference.conferenceType === "individual" ? "Ponente" : "Ponentes"}:</span> */}
            </div>
            {conference.speakersDetails.map((speakerDetails, index) => (
               <div key={index} className="flex flex-col gap-1">
                  <span className="bg-white shadow-sm px-3 py-1 rounded-full w-max text-blue-800 capitalize">
                     {speakerDetails.name}
                  </span>
                  <div className="flex gap-2">
                     <div className="flex items-center gap-1">
                        <MailIcon className="size-3 text-blue-600" />
                        <span className="text-blue-700 text-xs">
                           {speakerDetails.email}
                        </span>
                     </div>
                     {speakerDetails.phone && (
                        <div className="flex items-center gap-1">
                           <Phone className="size-3 text-blue-600" />
                           <span className="text-blue-700 text-xs">
                              {speakerDetails.phone}
                           </span>
                        </div>
                     )}
                  </div>
               </div>
            ))}
         </div>

         {/* Presenter section - only for admin view */}
         <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="flex items-center gap-2">
               <div className="flex justify-center items-center bg-white shadow-sm rounded-full size-7">
                  <Mic2 className="size-4 text-blue-600" />
               </div>
               <span className="font-semibold text-blue-900">Presentador:</span>
            </div>
            <div className="flex flex-col gap-1">
               <span
                  className={`bg-white shadow-sm px-3 py-1 rounded-full w-max capitalize ${!conference.presenterDetails?.name ? "font-semibold text-red-500" : "text-blue-800"}`}
               >
                  {conference.presenterDetails?.name || "No asignado"}
               </span>
               {conference.presenterDetails?.email && (
                  <div className="flex items-center gap-1">
                     <MailIcon className="size-3 text-blue-600" />
                     <span className="text-blue-700 text-xs">
                        {conference.presenterDetails.email}
                     </span>
                  </div>
               )}
            </div>
         </div>

         {/* {isGroupConference && (
            <div className="flex flex-wrap gap-3 bg-yellow-100/70 p-4 rounded-2xl text-sm">
               <p className="font-semibold text-yellow-500">Grabaciones grupales en desarrollo</p>
            </div>
         )} */}

         {/* Recording links section - only for admin view */}
         {isAdminView && conferenceRecordings.length > 0 && (
            <div className="mt-2">
               <div className="flex items-center gap-2 mb-2 text-sm">
                  <div className="flex justify-center items-center bg-white shadow-sm rounded-full size-7">
                     <LinkIcon className="size-4 text-blue-600" />
                  </div>
                  <span className="font-semibold text-blue-900">
                     Links de grabación:
                  </span>
               </div>

               <div className="gap-2 grid grid-cols-2 w-full">
                  {conferenceRecordings.map((recording) => (
                     <div
                        key={recording.id}
                        className="bg-white/70 shadow-sm p-4 rounded-2xl"
                     >
                        {/* Recording type title */}
                        <p className="mb-3 font-semibold text-blue-900 text-sm">
                           {recording.recordingType === "conference"
                              ? "Conferencia"
                              : "Presentación"}
                        </p>
                        <div className="flex md:flex-row flex-col gap-4">
                           {/* Status information - Single column on mobile, side by side on desktop */}
                           <RecordingStatusSection recording={recording} />

                           {/* Actions - Visually distinct card */}
                           <RecordingActionsSection recording={recording} />
                        </div>

                        {/* Recording URL - More compact */}
                        <div className="flex items-center gap-2 bg-blue-50 mt-4 p-2 border border-blue-100 rounded-lg">
                           <a
                              className="flex-1 text-blue-700 hover:text-blue-900 text-xs hover:underline truncate"
                              href={recording.recordingUrl}
                              target="_blank"
                              rel="noreferrer"
                           >
                              {recording.recordingUrl}
                           </a>
                           <CopyButton text={recording.recordingUrl} />
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         )}
      </div>
   );
}
