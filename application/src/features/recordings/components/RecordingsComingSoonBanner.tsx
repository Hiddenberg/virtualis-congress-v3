import { Bell, Mail, VideoIcon } from "lucide-react";

export default function RecordingsComingSoonBanner() {
   return (
      <div className="flex flex-col justify-center items-center p-4 md:p-8">
         <div className="w-full max-w-3xl">
            <div className="bg-linear-to-br from-blue-50 to-white shadow-sm p-6 md:p-8 border border-blue-100 rounded-2xl text-center">
               <div className="flex justify-center mb-4">
                  <div className="flex justify-center items-center bg-blue-100 rounded-full w-12 h-12 text-blue-700">
                     <VideoIcon className="w-6 h-6" />
                  </div>
               </div>
               <h1 className="mb-2 font-bold text-slate-800 text-2xl md:text-3xl">Grabaciones disponibles pronto</h1>
               <p className="mb-6 text-slate-600 text-base md:text-lg">Estamos preparando las grabaciones del congreso.</p>
               <div className="gap-3 grid grid-cols-1 sm:grid-cols-2">
                  <div className="flex justify-center items-center gap-2 bg-white/60 px-4 py-3 border border-blue-100 rounded-xl">
                     <Bell className="w-5 h-5 text-blue-700" />
                     <span className="text-slate-700 text-sm md:text-base">Te avisaremos apenas estén listas</span>
                  </div>
                  <div className="flex justify-center items-center gap-2 bg-white/60 px-4 py-3 border border-blue-100 rounded-xl">
                     <Mail className="w-5 h-5 text-blue-700" />
                     <span className="text-slate-700 text-sm md:text-base">Recibirás un correo con el acceso</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
