import RealtimePresentationViewer from "@/features/pptPresentations/components/realtime/RealtimePresentationViewer";

export default async function RealtimePresentationViewerPage({
   searchParams,
}: {
   searchParams: Promise<{ presentationId?: string }>;
}) {
   const { presentationId } = await searchParams;
   if (!presentationId) return <div className="p-6">Falta presentationId en la URL (?presentationId=...)</div>;
   return (
      <div className="p-6">
         <RealtimePresentationViewer presentationId={presentationId} />
      </div>
   );
}
