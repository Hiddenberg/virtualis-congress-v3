import { parse } from "@formkit/tempo";
import { notFound } from "next/navigation";
import CalendarSection from "@/components/conference-calendar/CalendarSection";
import { ConferenceCalendarHeader } from "@/components/conference-calendar/ConferenceCalendarHeader";
import ConferencesStatusBar from "@/components/congress-admin/conference-calendar/ConferencesStatusBar";
import { TEMP_CONSTANTS } from "@/data/tempConstants";
import { getCongressDates } from "@/features/congresses/services/congressServices";

export const dynamic = "force-dynamic";

async function ConferenceCalendar({
   params,
}: {
   params: Promise<{ conferenceDate: string }>;
}) {
   const congressDates = await getCongressDates(TEMP_CONSTANTS.CONGRESS_ID);

   const { conferenceDate } = await params;

   try {
      const parsedDate = parse({
         date: conferenceDate,
         format: "DD-MM-YYYY",
         locale: "es-MX",
      });

      return (
         <div>
            <ConferencesStatusBar />

            <ConferenceCalendarHeader
               congressDates={congressDates}
               currentDate={conferenceDate}
            />
            <CalendarSection conferenceDate={parsedDate} />
         </div>
      );
   } catch {
      notFound();
   }
}

export default ConferenceCalendar;
