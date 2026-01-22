import CertificatesBanner from "./CertificatesBanner";
import RecordingsBanner from "./RecordingsBanner";

function ConferenceCardsSection() {
   return (
      <div className="p-4 w-full">
         <div className="flex md:flex-row flex-col gap-4">
            {/* Left Card */}
            {/* <PreEventWelcomeCard /> */}
            <div className="space-y-4 w-full">
               <RecordingsBanner />
               <CertificatesBanner />
            </div>
            {/* <div className="relative rounded-xl md:w-2/3 overflow-hidden">
               <Image className="absolute w-full h-full object-center object-cover" src={} alt="background" />
               <div className="relative flex flex-col justify-between bg-black bg-opacity-20 p-6 h-64">
                  <div>
                     <span className="inline-block bg-green-500 px-2 py-1 rounded-full font-semibold text-white text-xs">
                Asistiendo
                     </span>
                  </div>
                  <div>
                     <h2 className="font-bold text-white text-2xl">Congreso ACP México</h2>
                     <p className="text-white text-xl">Febrero 2025</p>
                  </div>
               </div>
            </div> */}

            {/* Right Card */}
            {/* <CountdownCard date={new Date("2025-04-10T14:00:00.000Z")} /> */}
            {/* <div className="bg-linear-to-r from-[#008066] to-[#E5F3D2] rounded-xl md:w-1/3 overflow-hidden">
               <div className="relative flex flex-col justify-between p-6 h-64">
                  <div className="top-4 right-4 absolute">
                     <div className="flex justify-center items-center bg-white bg-opacity-20 rounded-full w-12 h-12">
                        <Play className="w-6 h-6 text-white" />
                     </div>
                  </div>
                  <div className="mt-auto">
                     <h3 className="mb-2 font-bold text-white text-2xl">Conferencias &gt;</h3>
                     <p className="text-white text-sm">
                Revisa las conferencias a las que te has inscrito y accede a más actividades disponibles.
                     </p>
                  </div>
               </div>
            </div> */}
         </div>
      </div>
   );
}

export default ConferenceCardsSection;
