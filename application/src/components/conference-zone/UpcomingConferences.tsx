"use client";

import { Clock } from "lucide-react";
import { nanoid } from "nanoid";
import { useState } from "react";

type Event = {
   date: string;
   month: string;
   title: string;
   time: string;
};

const events: Event[] = [
   {
      date: "16",
      month: "Oct",
      title: "Innovación en Terapias Genéticas",
      time: "18:00 h",
   },
   {
      date: "17",
      month: "Oct",
      title: "Innovación en Terapias Genéticas",
      time: "17:00 h",
   },
   {
      date: "18",
      month: "Oct",
      title: "Avances en Nanotecnología Médica",
      time: "16:30 h",
   },
   {
      date: "19",
      month: "Oct",
      title: "Inteligencia Artificial en Diagnósticos",
      time: "19:00 h",
   },
];

function EventCard({ event }: { event: Event }) {
   return (
      <div className="flex items-center space-x-4 py-4">
         <div className="w-14 text-center shrink-0">
            <div className="font-bold text-3xl">{event.date}</div>
            <div className="text-gray-500 text-sm">{event.month}</div>
         </div>
         <div className="grow">
            <h3 className="font-semibold text-lg">{event.title}</h3>
            <div className="flex items-center bg-green-600 mt-1 px-3 py-1 rounded-full w-fit text-white text-sm">
               <Clock className="mr-1 w-4 h-4" />
               {event.time}
            </div>
         </div>
      </div>
   );
}

export default function UpcomingConferences() {
   const [currentPage, setCurrentPage] = useState(0);
   const eventsPerPage = 2;
   const totalPages = Math.ceil(events.length / eventsPerPage);

   const currentEvents = events.slice(currentPage * eventsPerPage, (currentPage + 1) * eventsPerPage);

   return (
      <div className="bg-[#F8F8F8] mx-auto p-6 rounded-xl w-full overflow-hidden">
         <h2 className="mb-4 font-bold text-2xl">Próximas</h2>
         <div className="divide-y divide-gray-200">
            {currentEvents.map((event, index) => (
               <EventCard key={`${event.title}-${index}`} event={event} />
            ))}
         </div>
         <div className="flex justify-center space-x-2 mt-4">
            {[...Array(totalPages)].map((_, index) => (
               <button
                  type="button"
                  key={nanoid()}
                  onClick={() => setCurrentPage(index)}
                  className={`w-2 h-2 rounded-full ${index === currentPage ? "bg-blue-500" : "bg-gray-300"}`}
               />
            ))}
         </div>
      </div>
   );
}
