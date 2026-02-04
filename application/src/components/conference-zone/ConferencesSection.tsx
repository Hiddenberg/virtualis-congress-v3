import { Eye } from "lucide-react";
import Image from "next/image";
import conferenceImage2 from "@/assets/conference-image2.jpeg";

type SessionCardProps = {
   title: string;
   viewers: number;
};

function SessionCard({ title, viewers }: SessionCardProps) {
   return (
      <div className="flex items-center bg-white shadow-md p-2 rounded-lg overflow-hidden">
         <Image
            src={conferenceImage2}
            alt={title}
            width={120}
            height={90}
            className="w-30 h-20 object-cover overflow-hidden round-lg"
         />
         <div className="grow p-4">
            <h3 className="mb-2 font-semibold text-sm">{title}</h3>
            <div className="flex items-center bg-yellow-400 px-2 py-1 rounded-full w-fit font-semibold text-yellow-800 text-xs">
               <Eye className="mr-1 w-3 h-3" />
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
      <div className="bg-gray-100 mx-auto p-6 rounded-xl w-full">
         <h2 className="mb-4 font-bold text-2xl">En vivo</h2>
         <div className="space-y-4">
            {sessions.map((session) => (
               <SessionCard key={session.title} title={session.title} viewers={session.viewers} />
            ))}
         </div>
         <div className="flex justify-center space-x-2 mt-4">
            <div className="bg-blue-500 rounded-full w-2 h-2" />
            <div className="bg-gray-300 rounded-full w-2 h-2" />
            <div className="bg-gray-300 rounded-full w-2 h-2" />
         </div>
      </div>
   );
}
