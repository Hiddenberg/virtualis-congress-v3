import Link from "next/link";
import AdminConferenceCard from "@/features/conferences/components/AdminConferenceCard";
import { getAllQuestionPollsForConference } from "@/features/conferences/services/conferenceQuestionPollsServices";
import { getConferenceById } from "@/features/conferences/services/conferenceServices";
import FinishConferenceButton from "@/features/congressDirector/components/FinishConferenceButton";
import QuestionPollControls from "@/features/congressDirector/components/QuestionPollControls";
import StandbyButton from "@/features/congressDirector/components/StandbyButton";
import StartConferenceButton from "@/features/congressDirector/components/StartConferenceButton";
import { ensuredCongressInPersonState } from "@/features/congressInPersonState/services/congressInPersonState";

export default async function CongressDirectorConferencePage({ params }: { params: Promise<{ conferenceId: string }> }) {
   const { conferenceId } = await params;

   const conference = await getConferenceById(conferenceId);
   const inPersonState = await ensuredCongressInPersonState();
   const polls = await getAllQuestionPollsForConference(conferenceId);

   if (!conference) {
      return (
         <div>
            <h1>Conferencia no encontrada</h1>
         </div>
      );
   }

   const editConferenceLink = `/congress-admin/conferences/${conferenceId}/edit`;
   const conferenceLivestreamLink = `/congress-admin/conferences/${conferenceId}/livestream`;
   const conferenceQnaLink = `/congress-admin/conferences/${conferenceId}/qna`;
   const conferencePresentationLink = `/congress-admin/conferences/${conferenceId}/presentation`;
   const conferenceQuestionPollLink = `/congress-admin/conferences/${conferenceId}/question-polls`;
   const conferenceRecordingLink = `/congress-admin/conferences/${conferenceId}/recordings`;

   return (
      <div className="space-y-4">
         <section className="bg-white p-5 rounded-xl ring-1 ring-gray-200">
            <div className="flex flex-col gap-2">
               <div className="flex flex-wrap items-center gap-2">
                  {conference.status !== "active" && conference.status !== "canceled" && (
                     <StartConferenceButton conferenceId={conference.id} />
                  )}
                  {conference.status === "active" && <FinishConferenceButton conferenceId={conference.id} />}
                  <StandbyButton isInitiallyStandby={inPersonState.status === "standby"} />
               </div>
               <div className="flex flex-wrap items-center gap-2">
                  <Link
                     target="_blank"
                     href={editConferenceLink}
                     className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md font-medium text-gray-900 text-sm transition-colors"
                  >
                     Editar
                  </Link>
                  {conference.conferenceType !== "pre-recorded" && conference.conferenceType !== "simulated_livestream" && (
                     <Link
                        target="_blank"
                        href={conferenceLivestreamLink}
                        className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md font-medium text-gray-900 text-sm transition-colors"
                     >
                        Transmisión
                     </Link>
                  )}
                  <Link
                     target="_blank"
                     href={conferenceQnaLink}
                     className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md font-medium text-gray-900 text-sm transition-colors"
                  >
                     QnA
                  </Link>
                  <Link
                     target="_blank"
                     href={conferencePresentationLink}
                     className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md font-medium text-gray-900 text-sm transition-colors"
                  >
                     Presentación
                  </Link>
                  <Link
                     target="_blank"
                     href={conferenceQuestionPollLink}
                     className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md font-medium text-gray-900 text-sm transition-colors"
                  >
                     Encuestas
                  </Link>
                  {(conference.conferenceType === "pre-recorded" || conference.conferenceType === "simulated_livestream") && (
                     <Link
                        target="_blank"
                        href={conferenceRecordingLink}
                        className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md font-medium text-gray-900 text-sm transition-colors"
                     >
                        Grabaciones
                     </Link>
                  )}
               </div>
            </div>
         </section>

         <section>
            <AdminConferenceCard conference={conference} />
         </section>

         {polls.length > 0 && (
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
         )}
      </div>
   );
}
