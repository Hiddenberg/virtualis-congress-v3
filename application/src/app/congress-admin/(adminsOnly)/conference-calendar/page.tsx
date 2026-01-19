import { format } from "@formkit/tempo";
import { redirect } from "next/navigation";
import { TEMP_CONSTANTS } from "@/data/tempConstants";
import { getCongressDates } from "@/features/congresses/services/congressServices";

export const dynamic = "force-dynamic";
async function ConferenceCalendar() {
   const congressDates = await getCongressDates(TEMP_CONSTANTS.CONGRESS_ID);

   redirect(`./conference-calendar/${format(congressDates[0], "DD-MM-YYYY")}`);
}

export default ConferenceCalendar;
