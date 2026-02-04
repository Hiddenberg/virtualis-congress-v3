import { render } from "@react-email/render";
import Link from "next/link";
import AboutToStartEventTemplate from "@/features/emails/templates/AboutToStartEventTemplate";
import AccountCreatedTemplate from "@/features/emails/templates/AccountCreatedTemplate";
import EventFinishedTemplate from "@/features/emails/templates/EventFinishedTemplate";
import IphoneIssueSolvedTemplate from "@/features/emails/templates/IphoneIssueSolvedTemplate";
import NewEventDayAboutToStartEmailTemplate from "@/features/emails/templates/NewEventDayAboutToStart";
import NonPayersCongressInvitationTemplate from "@/features/emails/templates/NonPayersCongressInvitation";
import OnDemandReminderTemplate from "@/features/emails/templates/OnDemandReminderTemplate";
import OTPCodeTemplate from "@/features/emails/templates/OTPCodeTemplate";
import PaymentConfirmationTemplate from "@/features/emails/templates/PaymentConfirmationTemplate";
import PreCongressInvitationTemplate from "@/features/emails/templates/PreCongressInvitationTemplate";
import RecordingInvitationTemplate from "@/features/emails/templates/RecordingInvitationTemplate";
import RecordingReminder from "@/features/emails/templates/RecordingReminder";
import RecordingsReadyTemplate from "@/features/emails/templates/RecordingsReadyTemplate";
import SpeakerCertificateTemplate from "@/features/emails/templates/SpeakerCertificateTemplate";
import SpeakerPresentationUploadReminderTemplate from "@/features/emails/templates/SpeakerPresentationUploadReminderTemplate";

const emailTemplatesMap: Record<string, React.ReactNode> = {
   "account-created": AccountCreatedTemplate({
      userName: "John Doe",
      organizationName: "Test Organization",
      congressTitle: "Test Congress",
      platformLink: "https://test.com",
      congressDates: "Test Dates",
   }),
   "otp-code": OTPCodeTemplate({
      organizationName: "Test Organization",
      userEmail: "test@test.com",
      otpCode: "123456",
   }),
   "payment-confirmation": PaymentConfirmationTemplate({
      userName: "John Doe",
      congressTitle: "Congreso Virtualis",
      platformLink: "https://virtualis.com",
      congressStartDate: "10-12 de septiembre de 2025",
      hasAccessToRecordings: true,
      modalitySelected: "virtual",
      organizationName: "CMIM",
   }),
   "pre-congress-invitation": PreCongressInvitationTemplate({
      conferenceTitle: "Conferencia Pre-Congreso",
      conferenceDescription: "Conferencia Pre-Congreso Description",
      conferenceFormattedDate: "10-12 de septiembre de 2025",
      accessLink: "https://cmimcostachiapas.virtualis.app/lobby",
      organizationName: "CMIM",
   }),
   "recordings-ready": RecordingsReadyTemplate({
      userName: "John Doe",
      congressTitle: "Congreso Virtualis",
      accessLink: "https://cmimcostachiapas.virtualis.app/lobby",
      organizationName: "CMIM",
   }),
   "recording-invitation": RecordingInvitationTemplate({
      inviteeName: "John Doe",
      recordingTitle: "Recording Title",
      recordingLink: "https://recording.com",
      trackingUrl: "https://tracking.com",
      organizationName: "CMIM",
      maxDeadline: "2025-09-18",
   }),
   "recording-reminder": RecordingReminder({
      speakerName: "John Doe",
      conferenceTitle: "Conference Title",
      recordingUrl: "https://recording.com",
      trackingUrl: "https://tracking.com",
      organizationName: "CMIM",
   }),
   "non-payers-congress-invitation": NonPayersCongressInvitationTemplate({
      conferenceTitle: "Conference Title",
      conferenceFormattedStartDate: "12 de septiembre de 2025",
      accessLink: "https://cmimcostachiapas.virtualis.app/lobby",
      organizationName: "CMIM",
   }),
   "about-to-start-event": AboutToStartEventTemplate({
      userName: "John Doe",
      eventTitle: "Event Title",
      startTime: "10:00 AM",
      joinURL: "https://event.com",
   }),
   "iphone-issue-solved": IphoneIssueSolvedTemplate({
      userName: "John Doe",
      congressTitle: "Congreso Virtualis",
      platformLink: "https://virtualis.com",
      organizationName: "CMIM",
   }),
   "new-event-day-about-to-start": NewEventDayAboutToStartEmailTemplate({
      eventDayNumber: 3,
      attendeeName: "John Doe",
      congressTitle: "Congreso Virtualis",
      joinUrl: "https://event.com",
      startTime: "10:00 AM",
   }),
   "event-finished": EventFinishedTemplate({
      userName: "John Doe",
      congressTitle: "Congreso Virtualis",
      recordingsLink: "https://cmimcostachiapas.virtualis.app/congress-recordings",
      organizationName: "CMIM",
      totalConferences: 12,
   }),
   "speaker-certificate": SpeakerCertificateTemplate({
      speakerName: "John Doe",
      academicTitle: "Dr.",
      congressTitle: "Congreso Virtualis",
      certificateUrl: "http://gea.localhost:3000/certificates/speaker-certificate",
   }),
   "on-demand-reminder": OnDemandReminderTemplate({
      userName: "John Doe",
      conferenceTitle: "Conference Title",
      accessLink: "https://cmimcostachiapas.virtualis.app/lobby",
      organizationName: "CMIM",
   }),
   "speaker-presentation-upload-reminder": SpeakerPresentationUploadReminderTemplate({
      speakerName: "John Doe",
      conferenceTitle: "Conference Title",
      uploadLink: "https://cmimcostachiapas.virtualis.app/lobby",
      organizationName: "CMIM",
      deadlineDate: "2025-09-18",
      conferenceDate: "2025-09-19",
   }),
} as const;

export default async function EmailPreview({ params }: { params: Promise<{ templateId: string }> }) {
   const { templateId } = await params;

   const emailHtml = await render(emailTemplatesMap[templateId]);

   if (!emailHtml) {
      return <div>Template not found</div>;
   }

   return (
      <div className="py-4">
         <div className="gap-4 grid grid-cols-5">
            <div className="col-span-1">
               <h1 className="mb-4 font-bold">Email Templates</h1>
               <div className="space-y-2">
                  {Object.entries(emailTemplatesMap).map(([key]) => (
                     <Link key={key} href={`/email-templates/${key}`} className="block p-2 border rounded-lg">
                        <h2>{key}</h2>
                     </Link>
                  ))}
               </div>
            </div>
            <div className="col-span-4">
               <h1 className="mb-4 font-bold text-2xl">Email Preview</h1>
               <iframe srcDoc={emailHtml} className="border rounded-lg w-full h-[90dvh]" title="Email Preview" />
            </div>
         </div>
      </div>
   );
}
