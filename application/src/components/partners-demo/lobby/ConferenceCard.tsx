import { Clock, User, Video } from "lucide-react";
import Link from "next/link";

export interface ConferenceInfo {
   id: string;
   time: string;
   duration: string;
   title: string;
   speaker: string;
   color?: "blue" | "green" | "purple" | "pink";
   link?: string;
}

const COLOR_MAP = {
   blue: "bg-blue-50 border-blue-100",
   green: "bg-emerald-50 border-emerald-100",
   purple: "bg-violet-50 border-violet-100",
   pink: "bg-pink-50 border-pink-100",
} as const;

export default function ConferenceCard({ time, duration, title, speaker, color = "blue", link }: ConferenceInfo) {
   if (link) {
      return (
         <Link href={link} className={`relative flex h-full flex-col rounded-2xl border p-4 shadow-sm ${COLOR_MAP[color]}`}>
            <div className="inline-flex items-center gap-2 bg-white/70 shadow-sm backdrop-blur px-3 py-1 rounded-full w-max text-gray-700 text-xs">
               <Video size={14} /> Conferencia en Vivo
            </div>
            <div className="flex items-center gap-3 mt-3 text-gray-800">
               <Clock size={18} className="opacity-80" />
               <p className="font-semibold text-2xl tracking-tight">{time}</p>
               <span className="opacity-70 text-sm">/ {duration} hrs</span>
            </div>
            <h3 className="mt-3 font-medium text-gray-900 text-sm md:text-base line-clamp-2">{title}</h3>
            <div className="inline-flex items-center gap-2 mt-4 text-gray-700 text-sm">
               <User size={16} className="opacity-80" /> {speaker}
            </div>
         </Link>
      );
   }
   return (
      <div className={`relative flex h-full flex-col rounded-2xl border p-4 shadow-sm ${COLOR_MAP[color]}`}>
         <div className="inline-flex items-center gap-2 bg-white/70 shadow-sm backdrop-blur px-3 py-1 rounded-full w-max text-gray-700 text-xs">
            <Video size={14} /> Conferencia en Vivo
         </div>
         <div className="flex items-center gap-3 mt-3 text-gray-800">
            <Clock size={18} className="opacity-80" />
            <p className="font-semibold text-2xl tracking-tight">{time}</p>
            <span className="opacity-70 text-sm">/ {duration} hrs</span>
         </div>
         <h3 className="mt-3 font-medium text-gray-900 text-sm md:text-base line-clamp-2">{title}</h3>
         <div className="inline-flex items-center gap-2 mt-4 text-gray-700 text-sm">
            <User size={16} className="opacity-80" /> {speaker}
         </div>
      </div>
   );
}
