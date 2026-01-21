import { format, isBefore } from "@formkit/tempo";
import {
   CalendarIcon,
   // Sparkles, Users, ArrowRight, Play
} from "lucide-react";
import { redirect } from "next/navigation";
import { LinkButton } from "@/components/global/Buttons";
import ClosingConferenceBanner from "@/components/lobby/ClosingConferenceBanner";
import CongressEndedBanner from "@/components/lobby/CongressEndedBanner";
import CountdownCard from "@/components/lobby/CountdownCard";
import DayCompletedBanner from "@/components/lobby/DayCompletedBanner";
import DynamicConferenceProgram from "@/components/lobby/DynamicConferenceProgram";
import LobbyConferencesPreview from "@/components/lobby/LobbyConferencesPreview";
import SecondDayBanner from "@/components/lobby/SecondDayBanner";
import { getAllProgramConferencesWithSpeakersAndDurations } from "@/features/conferences/aggregators/conferenceAggregators";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { confirmUserCongressPayment } from "@/features/organizationPayments/services/organizationPaymentsServices";
import { checkIfUserHasAccessToRecordings } from "@/features/organizationPayments/services/userPurchaseServices";
import OrganizationSpecificComponent from "@/features/organizations/components/OrganizationSpecificComponent";
import {
   ClosingVideoBanner,
   InaugurationVideoBanner,
} from "@/features/organizations/organizationSpecifics/HGEA/data/components/HGEALobbyVideoComponents";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";

export default async function LobbyPage() {
   console.time("LobbyPage");
   const [organization, congress, programConferencesWithSpeakersAndDurations] = await Promise.all([
      getOrganizationFromSubdomain(),
      getLatestCongress(),
      getAllProgramConferencesWithSpeakersAndDurations(),
   ]);
   // const paymentConfirmed = await confirmUserCongressPayment(userId ?? "")
   // if (!paymentConfirmed) {
   //    redirect("/registration-confirmed")
   // }
   const hasAccessToRecordings = true;
   console.timeEnd("LobbyPage");
   if (isBefore(new Date(), congress.startDate)) {
      return (
         <div className="flex flex-col justify-center items-center p-4 md:p-8 min-h-[calc(100vh-200px)]">
            <div className="w-full max-w-6xl">
               <CountdownCard date={congress.startDate} title={congress.title} />
            </div>

            {organization.shortID === "CMIMCC" && (
               <div className="flex justify-center items-center p-4">
                  <LinkButton variant="blue" href="/CMIMCC/files/programa-CMIMCC.pdf" target="_blank">
                     <CalendarIcon className="w-4 h-4" />
                     Ver Programa
                  </LinkButton>
               </div>
            )}

            <div className="mt-6 w-full">
               <LobbyConferencesPreview conferences={programConferencesWithSpeakersAndDurations} />
            </div>
         </div>
      );
   }

   return (
      <div className="py-8">
         {congress.status === "finished" ? (
            <div>
               <CongressEndedBanner congress={congress} hasAccessToRecordings={hasAccessToRecordings} />

               <OrganizationSpecificComponent organizationShortID="HGEA">
                  <ClosingVideoBanner playbackId="nqg1GwpfTcggcS3Yn2UXbA4MIBAmP5rJvHXk4PkRiXs" />
               </OrganizationSpecificComponent>
            </div>
         ) : (
            <div className="mb-8 text-center">
               <div className="flex justify-center items-center gap-3 mb-4">
                  <h1 className="font-bold text-slate-800 text-2xl md:text-3xl">{congress.title}</h1>
               </div>
               <div className="flex justify-center items-center gap-2 mb-2 text-slate-600">
                  <CalendarIcon className="w-4 h-4" />
                  <p className="text-base md:text-lg">
                     {format({
                        date: congress.startDate,
                        format: "DD MMMM YYYY",
                        tz: "America/Mexico_City",
                        locale: "es-MX",
                     })}
                  </p>
               </div>

               <OrganizationSpecificComponent organizationShortID="ACP-MX">
                  <ClosingConferenceBanner />
               </OrganizationSpecificComponent>

               <OrganizationSpecificComponent organizationShortID="HGEA">
                  {organization.shortID === "HGEA" &&
                     (congress.showEndOfDayMessage ? <DayCompletedBanner /> : <SecondDayBanner congressDayNumber={3} />)}
               </OrganizationSpecificComponent>

               <OrganizationSpecificComponent organizationShortID="ACP-MX">
                  <InaugurationVideoBanner playbackId="h00D6JrqlVF2eXWcktGg7qH6BGPa1KjKKtoATTAN8Qzo" />
               </OrganizationSpecificComponent>
            </div>
         )}
         <DynamicConferenceProgram allCongressConferencesWithSpeakersAndDurations={programConferencesWithSpeakersAndDurations} />
      </div>
   );
}
