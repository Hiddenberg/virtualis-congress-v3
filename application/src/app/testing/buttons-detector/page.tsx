import ButtonsDetector from "../../../features/testing/components/ButtonsDetector";

export default function ButtonsDetectorPage() {
   return (
      <div className="mx-auto p-6 max-w-4xl">
         <h1 className="mb-4 font-semibold text-blue-900 text-2xl">
            Detector de botones
         </h1>
         {/* Client component below */}
         <ButtonsDetector />
      </div>
   );
}
