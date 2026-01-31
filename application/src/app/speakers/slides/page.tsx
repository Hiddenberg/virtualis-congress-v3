import { getAllProgramConferencesWithSpeakers } from "@/features/conferences/aggregators/conferenceAggregators";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { getAllSpeakerSlidesFilesByCongressId } from "@/features/speakerSlidesV2/services/speakerSlidesFilesServices";

export default async function PresentationUploadPage() {
   const [congress, conferencesWithSpeakers] = await Promise.all([getLatestCongress(), getAllProgramConferencesWithSpeakers()]);
   const speakerSlidesFiles = await getAllSpeakerSlidesFilesByCongressId(congress.id);

   return (
      <div>
         <h1>Speaker Slides</h1>
         <div>
            <h2>Congress: {congress.title}</h2>
            <h2>Conferences: {conferencesWithSpeakers.length}</h2>
            <h2>Speaker Slides: {speakerSlidesFiles.length}</h2>
         </div>
      </div>
   );
}
