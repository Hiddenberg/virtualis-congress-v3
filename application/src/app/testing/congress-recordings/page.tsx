import { getConferencePresentation } from "@/features/conferences/services/conferencePresentationsServices";
import PresentationAndVideoPlayer from "@/features/pptPresentations/components/PresentationAndVideoPlayer";
import { getPresentationRecordingByPresentationId } from "@/features/pptPresentations/services/presentationRecordingServices";
import { getPresentationSlidesById } from "@/features/pptPresentations/services/presentationServices";
import mux from "@/libs/mux";
import { getFullDBRecordsList } from "@/libs/pbServerClientNew";

export default async function CongressRecordingsPage() {
   const conferenceLivestreams = await getFullDBRecordsList<
      ConferenceLivestream & {
         expand: {
            livestreamSession: LivestreamSessionRecord & {
               expand: {
                  livestream__mux_livestream_via_livestreamSession: LivestreamMuxAssetRecord[];
               };
            };
            conference: CongressConferenceRecord;
         };
      }
   >("CONFERENCE_LIVESTREAMS", {
      expand: "livestreamSession, conference, livestreamSession.livestream__mux_livestream_via_livestreamSession",
   });

   console.log(conferenceLivestreams[0]);

   return (
      <div>
         <h1>Congress Recordings {conferenceLivestreams.length}</h1>

         <div className="grid grid-cols-3 gap-4 p-4">
            {conferenceLivestreams.map(async (conferenceLivestream) => {
               const muxLivestreamId =
                  conferenceLivestream.expand.livestreamSession.expand.livestream__mux_livestream_via_livestreamSession[0]
                     .muxLivestreamId;
               const livestreamSession = conferenceLivestream.expand.livestreamSession;
               const conference = conferenceLivestream.expand.conference;

               const livestreamMuxAssets = await mux.video.assets.list({
                  live_stream_id: muxLivestreamId,
               });

               const conferencePresentation = await getConferencePresentation(conference.id);
               const presentationRecording = await getPresentationRecordingByPresentationId(conferencePresentation?.id ?? "");
               const presentationSlides = await getPresentationSlidesById(conferencePresentation?.id ?? "");

               return (
                  <div key={conferenceLivestream.id} className="border border-gray-300 p-4 rounded-md">
                     <h2>{conference.title}</h2>
                     <p>{livestreamSession.status}</p>
                     <p className="truncate">{muxLivestreamId}</p>

                     <div>
                        <h3>Livestream Mux Assets {livestreamMuxAssets.data.length}</h3>
                        {livestreamMuxAssets.data.map((muxAsset) => (
                           <div key={muxAsset.id}>
                              <p className="truncate">{muxAsset.playback_ids?.[0]?.id}</p>
                              <p>{muxAsset.status}</p>
                              <p>{muxAsset.duration ? (muxAsset.duration / 60).toFixed(2) : 0} minutes</p>{" "}
                              {/* duration in minutes */}
                           </div>
                        ))}
                     </div>

                     {conferencePresentation ? (
                        <div>
                           <h3>Conference Presentation:</h3>
                           <p className="truncate">{conferencePresentation.name}</p>
                           {presentationRecording && (
                              <div>
                                 <h3>Presentation Recording:</h3>
                                 <p className="truncate">{presentationRecording.id}</p>
                                 <p>slideChanges</p>
                                 <div className="overflow-y-auto max-h-[200px]">
                                    <code className="text-xs">{JSON.stringify(presentationRecording.slideChanges, null, 2)}</code>
                                 </div>
                                 <div>
                                    <PresentationAndVideoPlayer
                                       muxPlaybackId={livestreamMuxAssets.data[0].playback_ids?.[0]?.id ?? ""}
                                       presentationSlides={presentationSlides}
                                       presentationRecording={presentationRecording}
                                    />
                                 </div>
                              </div>
                           )}
                        </div>
                     ) : (
                        <div>
                           <h3>No conference presentation found</h3>
                        </div>
                     )}
                  </div>
               );
            })}
         </div>
      </div>
   );
}
