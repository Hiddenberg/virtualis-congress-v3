import { ArrowUpRight, MessageSquare, Play } from "lucide-react";
import Image from "next/image";
import bayerLogo from "@/assets/bayer-logo.png";
import bayerVideoImage from "@/assets/bayer-video.png";

export default function BayerCard() {
   return (
      <div className="flex flex-col md:flex-row gap-6 w-full mx-auto p-4 bg-[#E1F7FF] rounded-3xl">
         <div className="md:w-1/2 relative rounded-3xl overflow-hidden">
            <Image
               src={bayerVideoImage}
               alt="Bayer conference presentation"
               width={600}
               height={400}
               className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
               <button className="bg-white bg-opacity-80 rounded-full p-4 hover:bg-opacity-100 transition-all">
                  <Play className="w-12 h-12 text-primary" />
               </button>
            </div>
         </div>
         <div className="md:w-1/2 bg-blue-50 rounded-3xl p-6 relative">
            <button className="absolute top-4 right-4 bg-green-400 text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-green-500 transition-colors">
               <MessageSquare className="w-4 h-4" />
               <span>Contactar con un representante</span>
            </button>
            <div className="bg-white rounded-lg p-2 inline-block mb-4">
               <Image
                  src={bayerLogo}
                  alt="Bayer logo"
                  width={120}
                  height={60}
               />
            </div>
            <h2 className="text-3xl font-bold text-primary mb-2 flex items-center">
               Bayer
               <ArrowUpRight className="w-6 h-6 ml-2" />
            </h2>
            <p className="text-gray-700 text-lg font-semibold">
               Presentamos nuestras nuevas soluciones farmacéuticas con
               beneficios exclusivos para los asistentes del congreso.
            </p>
         </div>
      </div>
   );
}
