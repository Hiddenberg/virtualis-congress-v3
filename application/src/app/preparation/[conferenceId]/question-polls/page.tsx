import { redirect } from "next/navigation";
import { getConferenceById } from "@/features/conferences/services/conferenceServices";
import ExistingQuestionPollsList from "@/features/questionPolls/components/admin/ExistingQuestionPollsList";
import QuestionPollForm from "@/features/questionPolls/components/questionPollForm/QuestionPollForm";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";

export default async function QuestionPollsPage({ params }: { params: Promise<{ conferenceId: string }> }) {
   const { conferenceId } = await params;

   const user = await getLoggedInUserId();

   if (!user) {
      return redirect(`/preparation/${conferenceId}/speaker-signup?redirectTo=/preparation/${conferenceId}/question-polls`);
   }

   const conference = await getConferenceById(conferenceId);
   if (!conference) {
      return (
         <div>
            <h1>Conferencia no encontrada</h1>
         </div>
      );
   }

   return (
      <div className="p-6">
         <div className="mb-6">
            <h1 className="mb-2 font-bold text-gray-900 text-2xl">Encuestas de la conferencia: {conference.title}</h1>
            <p className="text-gray-600">Crea y administra encuestas para esta conferencia.</p>
         </div>
         <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <div className="bg-white shadow-sm p-6 border border-gray-200 rounded-lg max-w-2xl">
               <h2 className="mb-4 font-semibold text-gray-900 text-lg">Nueva encuesta</h2>
               <QuestionPollForm conferenceId={conferenceId} />
            </div>

            <ExistingQuestionPollsList conferenceId={conferenceId} />
         </div>
      </div>
   );
}
