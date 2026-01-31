import { getAllProgramConferencesWithSpeakers } from "@/features/conferences/aggregators/conferenceAggregators";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { ConferenceList } from "@/features/speakerSlidesV2/components/ConferenceList";
import { getAllSpeakerSlidesFilesByCongressId } from "@/features/speakerSlidesV2/services/speakerSlidesFilesServices";

export default async function PresentationUploadPage() {
   const [congress, conferencesWithSpeakers] = await Promise.all([getLatestCongress(), getAllProgramConferencesWithSpeakers()]);
   const speakerSlidesFiles = await getAllSpeakerSlidesFilesByCongressId(congress.id);

   return (
      <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
         <div className="mx-auto max-w-7xl">
            <div className="mb-8">
               <h1 className="mb-2 font-bold text-gray-900 md:text-3xl text-4xl">{congress.title}</h1>
               <p className="text-gray-600 text-lg">
                  Gestión de Presentaciones - Sube o reemplaza las presentaciones para tu conferencia
               </p>
            </div>

            <ConferenceList conferencesWithSpeakers={conferencesWithSpeakers} speakerSlidesFiles={speakerSlidesFiles} />
         </div>
      </div>
   );
}
