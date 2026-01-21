import { Eye } from "lucide-react";
import Image from "next/image";
import conferenceImage2 from "@/assets/conference-image2.jpeg";

type SessionCardProps = {
   title: string;
   viewers: number;
};

function SessionCard({ title, viewers }: SessionCardProps) {
   return (
      <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-md p-2">
         <Image
            src={conferenceImage2}
            alt={title}
            width={120}
            height={90}
            className="object-cover w-30 h-20 round-lg overflow-hidden"
         />
         <div className="flex-grow p-4">
            <h3 className="text-sm font-semibold mb-2">{title}</h3>
            <div className="flex items-center bg-yellow-400 text-yellow-800 rounded-full px-2 py-1 text-xs font-semibold w-fit">
               <Eye className="w-3 h-3 mr-1" />
               {viewers}
            </div>
         </div>
      </div>
   );
}

export default function ConferencesSection() {
   const sessions = [
      {
         title: "Innovación en Terapias Genéticas",
         viewers: 657,
         imageUrl: "/placeholder.svg?height=90&width=120&text=Speaker",
      },
      {
         title: "Regulación de Fármacos en la Era Digital",
         viewers: 657,
         imageUrl: "/placeholder.svg?height=90&width=120&text=Speaker",
      },
      {
         title: "Regulación de Fármacos en la Era Digital",
         viewers: 657,
         imageUrl: "/placeholder.svg?height=90&width=120&text=Speaker",
      },
   ];

   return (
      <div className="w-full mx-auto bg-gray-100 p-6 rounded-xl">
         <h2 className="text-2xl font-bold mb-4">En vivo</h2>
         <div className="space-y-4">
            {sessions.map((session, index) => (
               <SessionCard key={index} title={session.title} viewers={session.viewers} />
            ))}
         </div>
         <div className="flex justify-center mt-4 space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <div className="w-2 h-2 rounded-full bg-gray-300" />
            <div className="w-2 h-2 rounded-full bg-gray-300" />
         </div>
      </div>
   );
}
