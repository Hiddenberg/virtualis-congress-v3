// import { RealtimeLivestreamStatusProvider } from "../../contexts/RealtimeLivestreamStatusProvider";
// import LiveClassVideoSection from "./LiveClassVideoSection";
// import { getLivestreamMuxAssetByLivestreamSessionId } from "../../services/livestreamMuxAssetServices";
// import { AlertCircle, Wifi } from "lucide-react";

// export default async function ClassQnAPlayer ({ classRecord }: { classRecord: DBRecordItem<Class> }) {

//    const livestreamSession = await getClassQnASessionByClassId(classRecord.id)

//    if (!livestreamSession) {
//       return (
//          <div className="bg-white shadow-xl border border-stone-200 rounded-2xl overflow-hidden">
//             <div className="flex flex-col justify-center items-center p-8 min-h-[400px]">
//                <div className="bg-amber-50 mb-4 p-4 rounded-full">
//                   <AlertCircle className="w-12 h-12 text-amber-600" />
//                </div>
//                <h2 className="mb-2 font-bold text-stone-900 text-xl">Sesión no encontrada</h2>
//                <p className="max-w-md text-stone-600 text-center">
//                   No se pudo encontrar la sesión de transmisión en vivo para esta clase.
//                </p>
//             </div>
//          </div>
//       )
//    }

//    const muxLivestreamAsset = await getLivestreamMuxAssetByLivestreamSessionId(livestreamSession.id)

//    if (!muxLivestreamAsset) {
//       return (
//          <div className="bg-white shadow-xl border border-stone-200 rounded-2xl overflow-hidden">
//             <div className="flex flex-col justify-center items-center p-8 min-h-[400px]">
//                <div className="bg-red-50 mb-4 p-4 rounded-full">
//                   <Wifi className="w-12 h-12 text-red-600" />
//                </div>
//                <h2 className="mb-2 font-bold text-stone-900 text-xl">Error de configuración</h2>
//                <p className="max-w-md text-stone-600 text-center">
//                   No se pudo configurar la transmisión en vivo para esta clase. Contacta al administrador.
//                </p>
//             </div>
//          </div>
//       )
//    }

//    return (
//       <div className="bg-white shadow-xl border border-stone-200 rounded-2xl overflow-hidden">
//          <RealtimeLivestreamStatusProvider
//             livestreamSession={livestreamSession}>
//             <LiveClassVideoSection
//                classRecord={classRecord}
//                currentServerTime={new Date()
//                   .toISOString()}
//                livestreamPlaybackId={muxLivestreamAsset.livestreamPlaybackId}
//             />
//          </RealtimeLivestreamStatusProvider>
//       </div>
//    )
// }
