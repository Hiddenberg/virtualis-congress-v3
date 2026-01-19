import { redirect } from "next/navigation";

export default async function ConferenceRecordingsPage({
   params,
}: {
   params: Promise<{ conferenceId: string }>;
}) {
   const { conferenceId } = await params;
   return redirect(`/congress-admin/conferences/${conferenceId}/recordings`);
}
