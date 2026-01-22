import MuxPlayer from "@mux/mux-player-react/lazy";
import { Video } from "lucide-react";

export function InaugurationVideoBanner({ playbackId }: { playbackId: string }) {
   return (
      <div className="flex justify-center px-4 py-6">
         <div className="w-full max-w-4xl">
            <div className="bg-white shadow-lg border border-slate-200 rounded-2xl overflow-hidden">
               {/* Header */}
               <div className="bg-linear-to-r from-blue-50 to-slate-50 px-6 py-4 border-slate-200 border-b">
                  <div className="flex justify-center items-center gap-3">
                     <div className="flex justify-center items-center bg-blue-100 rounded-full w-10 h-10">
                        <Video className="w-5 h-5 text-blue-700" />
                     </div>
                     <h2 className="font-bold text-slate-800 text-xl md:text-2xl">Mensaje de inauguración</h2>
                  </div>
               </div>

               {/* Video Container */}
               <div className="bg-slate-50 p-4 md:p-6">
                  <div className="relative shadow-md border border-slate-200 rounded-xl overflow-hidden">
                     <MuxPlayer playbackId={playbackId} className="w-full aspect-video" />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export function ClosingVideoBanner({ playbackId }: { playbackId: string }) {
   return (
      <div className="flex justify-center px-4 py-6">
         <div className="w-full max-w-4xl">
            <div className="bg-white shadow-lg border border-slate-200 rounded-2xl overflow-hidden">
               {/* Header */}
               <div className="bg-linear-to-r from-blue-50 to-slate-50 px-6 py-4 border-slate-200 border-b">
                  <div className="flex justify-center items-center gap-3">
                     <div className="flex justify-center items-center bg-blue-100 rounded-full w-10 h-10">
                        <Video className="w-5 h-5 text-blue-700" />
                     </div>
                     <h2 className="font-bold text-slate-800 text-xl md:text-2xl">Mensaje de clausura</h2>
                  </div>
               </div>

               {/* Video Container */}
               <div className="bg-slate-50 p-4 md:p-6">
                  <div className="relative shadow-md border border-slate-200 rounded-xl overflow-hidden">
                     <MuxPlayer playbackId={playbackId} className="w-full aspect-video" />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
