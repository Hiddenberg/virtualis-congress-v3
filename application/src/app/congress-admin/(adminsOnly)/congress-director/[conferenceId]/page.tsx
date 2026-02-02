// import { getAllQuestionPollsForConference } from "@/features/conferences/services/conferenceQuestionPollsServices";

// import QuestionPollControls from "@/features/congressDirector/components/QuestionPollControls";
// import { LinkButton } from "@/components/global/Buttons";
import { ConferenceBadges, ConferenceCardHeader } from "@/features/conferences/components/AdminConferenceCard";
import ConferenceSchedule from "@/features/conferences/components/adminConferenceCard/ConferenceSchedule";
import { getConferenceById } from "@/features/conferences/services/conferenceServices";
import ConferencePresentationSlidesSection from "@/features/congressDirector/components/ConferencePresentationSlidesSection";

export default async function CongressDirectorConferencePage({ params }: { params: Promise<{ conferenceId: string }> }) {
   const { conferenceId } = await params;

   const conference = await getConferenceById(conferenceId);

   if (!conference) {
      return (
         <div>
            <h1>Conferencia no encontrada</h1>
         </div>
      );
   }

   // const editConferenceLink = `/congress-admin/conferences/${conferenceId}/edit`;
   // const conferenceLivestreamLink = `/congress-admin/conferences/${conferenceId}/livestream`;
   // const conferenceQnaLink = `/congress-admin/conferences/${conferenceId}/qna`;
   // const conferencePresentationLink = `/congress-admin/conferences/${conferenceId}/presentation`;
   // const conferenceQuestionPollLink = `/congress-admin/conferences/${conferenceId}/question-polls`;
   // const conferenceRecordingLink = `/congress-admin/conferences/${conferenceId}/recordings`;

   return (
      <div className="space-y-4">
         <section className="bg-white p-5 rounded-xl ring-1 ring-gray-200">
            <div>
               <ConferenceCardHeader conference={conference} />
               <ConferenceSchedule startTime={conference.startTime} endTime={conference.endTime} />
               <ConferenceBadges conference={conference} />
            </div>
            {/* <div>
               <LinkButton href={`/congress-admin/conferences/${conferenceId}/edit`} variant="primary" className="text-sm">
                  Editar conferencia
               </LinkButton>
            </div> */}
         </section>

         <ConferencePresentationSlidesSection conferenceId={conferenceId} />

         {/* <section>
            <AdminConferenceCard conference={conference} />
         </section> */}

         {/* {polls.length > 0 && (
            <section className="bg-white p-5 rounded-xl ring-1 ring-gray-200">
               <h2 className="font-semibold text-gray-900 text-base">Encuestas</h2>
               <div className="space-y-3 mt-3">
                  {polls.map((poll) => (
                     <div
                        key={poll.id}
                        className="flex justify-between items-center gap-3 bg-gray-50 px-3 py-2 rounded-md ring-1 ring-gray-200"
                     >
                        <div className="min-w-0">
                           <p className="font-medium text-gray-900 text-sm truncate">{poll.question}</p>
                           <p className="text-gray-600 text-xs capitalize">Estado: {poll.status}</p>
                        </div>
                        <QuestionPollControls conferenceId={conference.id} poll={poll} />
                     </div>
                  ))}
               </div>
            </section>
         )} */}
      </div>
   );
}
