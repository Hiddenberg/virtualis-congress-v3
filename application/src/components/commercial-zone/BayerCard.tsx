import { ArrowUpRight, MessageSquare, Play } from "lucide-react";
import Image from "next/image";
import bayerLogo from "@/assets/bayer-logo.png";
import bayerVideoImage from "@/assets/bayer-video.png";

export default function BayerCard() {
   return (
      <div className="flex md:flex-row flex-col gap-6 bg-[#E1F7FF] mx-auto p-4 rounded-3xl w-full">
         <div className="relative rounded-3xl md:w-1/2 overflow-hidden">
            <Image src={bayerVideoImage} alt="Bayer conference presentation" width={600} height={400} className="w-full h-auto" />
            <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-30">
               <button type="button" className="bg-white bg-opacity-80 hover:bg-opacity-100 p-4 rounded-full transition-all">
                  <Play className="w-12 h-12 text-primary" />
               </button>
            </div>
         </div>
         <div className="relative bg-blue-50 p-6 rounded-3xl md:w-1/2">
            <button
               type="button"
               className="top-4 right-4 absolute flex items-center space-x-2 bg-green-400 hover:bg-green-500 px-4 py-2 rounded-full text-white transition-colors"
            >
               <MessageSquare className="w-4 h-4" />
               <span>Contactar con un representante</span>
            </button>
            <div className="inline-block bg-white mb-4 p-2 rounded-lg">
               <Image src={bayerLogo} alt="Bayer logo" width={120} height={60} />
            </div>
            <h2 className="flex items-center mb-2 font-bold text-primary text-3xl">
               Bayer
               <ArrowUpRight className="ml-2 w-6 h-6" />
            </h2>
            <p className="font-semibold text-gray-700 text-lg">
               Presentamos nuestras nuevas soluciones farmacéuticas con beneficios exclusivos para los asistentes del congreso.
            </p>
         </div>
      </div>
   );
}
