import RealtimePresentationController from "@/features/pptPresentations/components/realtime/RealtimePresentationController";

export default async function RealtimePresentationControllerPage({
   searchParams,
}: {
   searchParams: Promise<{ presentationId?: string }>;
}) {
   const { presentationId } = await searchParams;
   if (!presentationId)
      return (
         <div className="p-6">
            Falta presentationId en la URL (?presentationId=...)
         </div>
      );
   return (
      <div className="p-6">
         <RealtimePresentationController presentationId={presentationId} />
      </div>
   );
}
