import { notFound } from "next/navigation";
import DeleteRecordingsCampagin from "@/features/platformSync/components/DeleteRecordingsCampagin";
import SyncAllCongressRecordings from "@/features/platformSync/components/SyncAllCongressRecordings";
import SyncRecordingDurationsButton from "@/features/platformSync/components/SyncRecordingDurationsButton";
import {
   scheduleAllConferencePresentationRecordingsAction,
   scheduleAllConferenceRecordingsAction,
} from "@/features/platformSync/serverActions/recordingsSyncActions";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";
import SuperAdminToolCard from "@/features/superAdminTools/components/SuperAdminToolCard";
import { sendSpeakerPresentationUploadReminderEmailToAllSpeakersAction } from "@/features/superAdminTools/serverActions/massEmailsActions";
import {
   sendAboutToStartEventEmailToAllUsersAction,
   sendCongressInvitationEmailsToNonPayersAction,
   sendEventFinishedEmailToAllUsersAction,
   sendIphoneIssueSolvedEmailToAllUsersAction,
   sendNewEventDayAboutToStartEmailToAllUsersAction,
   sendOnDemandReminderEmailsToAllUsersWithoutPaymentsAction,
   sendSpeakerCertificateEmailToAllSpeakersAction,
   testSendCongressInvitationEmailToNonPayerAction,
} from "@/features/superAdminTools/serverActions/superAdminActions";
import { checkUserAuthorization } from "@/features/users/services/userServices";

export default async function CongressAdminSynchPage() {
   const userId = await getLoggedInUserId();

   const isAuthorized = await checkUserAuthorization(userId ?? "", ["super_admin"]);
   if (!isAuthorized) {
      return notFound();
   }

   return (
      <div>
         <h1>Synch</h1>
         <div className="gap-4 grid grid-cols-1 md:grid-cols-2 *:bg-gray-100 mb-4 *:p-4 *:rounded-md">
            <SyncRecordingDurationsButton />
            <SyncAllCongressRecordings />
            {/* <ScheduleAllConferenceRecordings /> */}
            <SuperAdminToolCard action={scheduleAllConferenceRecordingsAction} buttonText="Schedule All Conference Recordings" />
            {/* <ScheduleAllConferencePresentationRecordings /> */}
            <SuperAdminToolCard
               action={scheduleAllConferencePresentationRecordingsAction}
               buttonText="Schedule All Conference Presentation Recordings"
               description="Esta acción programará todas las grabaciones para que los coordinadores graben la presentación de CV de los ponentes, esto solo aplica a conferencias simuladas en vivo."
            />
            <DeleteRecordingsCampagin />
         </div>
         <div className="gap-4 grid grid-cols-2">
            <SuperAdminToolCard
               action={testSendCongressInvitationEmailToNonPayerAction}
               buttonText="Enviar correo de prueba a usuarios sin pagos"
               withInput={true}
               inputPlaceholder="ID de usuario"
            />
            <SuperAdminToolCard
               action={sendCongressInvitationEmailsToNonPayersAction}
               buttonText="Enviar correos de invitación a usuarios sin pagos"
            />

            <SuperAdminToolCard
               description="Esta acción enviará un correo notificando que el evento está por empezar a todos los usuarios registrados en el congreso actual."
               action={sendAboutToStartEventEmailToAllUsersAction}
               buttonText="Enviar correo de inicio de evento a todos los usuarios"
            />
            <SuperAdminToolCard
               action={sendIphoneIssueSolvedEmailToAllUsersAction}
               buttonText="Enviar correo de problema de iPhone resuelto a todos los usuarios"
            />
            <SuperAdminToolCard
               action={sendNewEventDayAboutToStartEmailToAllUsersAction}
               buttonText="Enviar correo de inicio de evento a todos los usuarios"
               description="Esta acción enviará un correo notificando un nuevo día del evento está por empezar a todos los usuarios registrados en el congreso actual."
               withInput={true}
               inputPlaceholder="Día del evento (1-6)"
            />
            <SuperAdminToolCard
               action={sendEventFinishedEmailToAllUsersAction}
               description="Esta acción enviará un correo notificando que el evento ha finalizado a todos los usuarios registrados en el congreso actual."
               buttonText="Enviar correo de fin de evento a todos los usuarios"
            />

            <SuperAdminToolCard
               action={sendSpeakerCertificateEmailToAllSpeakersAction}
               description="Esta acción enviará un correo para que los ponentes generen su certificado de ponente a todos los ponentes registrados en el congreso actual."
               buttonText="Enviar correo de certificado de ponente a todos los ponentes"
            />
            <SuperAdminToolCard
               action={sendOnDemandReminderEmailsToAllUsersWithoutPaymentsAction}
               buttonText="Enviar correo de recordatorio de congreso 'on demand' a usuarios sin pagos"
               description="Esta acción enviará un correo de recordatorio de que tienen las grabaciones bajo demanda a todos los usuarios sin pagos."
            />
            <SuperAdminToolCard
               action={sendSpeakerPresentationUploadReminderEmailToAllSpeakersAction}
               buttonText="Enviar correo de recordatorio de subida de presentación a todos los ponentes"
               description="Esta acción enviará un correo de recordatorio a los ponentes de todas las conferencias en vivo o presenciales de que deben subir su presentación para todas las conferencias del congreso actual."
            />
         </div>
      </div>
   );
}
