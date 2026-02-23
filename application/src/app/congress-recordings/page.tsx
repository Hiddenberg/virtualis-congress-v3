import { ArrowLeft, Home } from "lucide-react";
import { redirect } from "next/navigation";
import { LinkButton } from "@/components/global/Buttons";
import { getAllCongressConferences } from "@/features/conferences/services/conferenceServices";
import { getConferenceSpeakers } from "@/features/conferences/services/conferenceSpeakersServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { checkIfUserHasAccessToRecordings } from "@/features/organizationPayments/services/userPurchaseServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import NoRecordingsAccessCard from "@/features/recordings/components/NoRecordingsAccessCard";
import RecordingsByDateAccordion from "@/features/recordings/components/RecordingsByDateAccordion";
import RecordingsComingSoonBanner from "@/features/recordings/components/RecordingsComingSoonBanner";
import type { SimpleRecording } from "@/features/simpleRecordings/types/recordingsTypes";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";
import { getFullDBRecordsList, pbFilter } from "@/libs/pbServerClientNew";

function BackNavigationButtons() {
   return (
      <div className="flex justify-center items-center gap-3 mt-6">
         <LinkButton href="/" variant="secondary">
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
         </LinkButton>
         <LinkButton href="/lobby" variant="blue">
            <Home className="w-4 h-4" />
            Ir al lobby
         </LinkButton>
      </div>
   );
}

function CongressRecordingsLayout({ congressTitle, children }: { congressTitle: string; children: React.ReactNode }) {
   return (
      <div className="p-4 md:p-8">
         <div className="mb-6 text-center">
            <h1 className="mb-2 font-bold text-slate-800 text-2xl md:text-3xl">Grabaciones del congreso</h1>
            <h2 className="mb-2 font-bold text-slate-800 text-2xl md:text-3xl">{congressTitle}</h2>
            <p className="text-slate-600 text-base md:text-lg">Revive las ponencias a tu ritmo.</p>
         </div>
         <div className="mb-6">
            <BackNavigationButtons />
         </div>
         {children}
         <BackNavigationButtons />
      </div>
   );
}

export default async function CongressRecordingsPage() {
   const userId = await getLoggedInUserId();
   if (!userId) {
      redirect("/login");
   }

   const congress = await getLatestCongress();
   if (!congress) {
      redirect("/congress");
   }

   const hasAccessToRecordings = await checkIfUserHasAccessToRecordings(userId, congress.id);
   const organization = await getOrganizationFromSubdomain();

   const recordingsCampaignFilter = pbFilter(
      `
      organization = {:organizationId} &&
      status = "ready" &&
      (campaign.title = "[Congress Recordings] - ${congress.title}" || campaign.title = "Conferencias del congreso: ${congress.title}")
   `,
      {
         organizationId: organization.id,
      },
   );
   const congressRecordings = await getFullDBRecordsList<SimpleRecording>("SIMPLE_RECORDINGS", {
      filter: recordingsCampaignFilter,
   });

   const allConferences = await getAllCongressConferences(congress.id);

   if (congressRecordings.length === 0) {
      return (
         <CongressRecordingsLayout congressTitle={congress.title}>
            {hasAccessToRecordings ? <RecordingsComingSoonBanner /> : <NoRecordingsAccessCard />}
         </CongressRecordingsLayout>
      );
   }

   const recordingsWithMeta = await Promise.all(
      congressRecordings.map(async (recording) => {
         const recordingTitle = recording.title.split(" - ")[1] ?? recording.title;
         const conference = allConferences.find((conf) => conf.title === recordingTitle);
         const speakers = await getConferenceSpeakers(conference?.id ?? "");
         return {
            recording,
            recordingTitle,
            conference,
            speakers,
         };
      }),
   );

   const sortedRecordingsWithMeta = recordingsWithMeta.sort((a, b) => {
      // sort by recordingTitle
      return a.recordingTitle.localeCompare(b.recordingTitle);
   });

   return (
      <CongressRecordingsLayout congressTitle={congress.title}>
         <RecordingsByDateAccordion
            items={sortedRecordingsWithMeta.map((item) => ({
               recording: {
                  id: item.recording.id,
                  durationSeconds: item.recording.durationSeconds,
               },
               recordingTitle: item.recordingTitle,
               conference: item.conference
                  ? {
                       id: item.conference.id,
                       startTime: item.conference.startTime,
                       shortDescription: item.conference.shortDescription,
                    }
                  : undefined,
               speakers: item.speakers.map((s) => ({
                  id: s.id,
                  displayName: s.displayName,
               })),
            }))}
         />
      </CongressRecordingsLayout>
   );
}
