"use client";

import { Clock } from "lucide-react";
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
         <div className="flex-shrink-0 w-14 text-center">
            <div className="text-3xl font-bold">{event.date}</div>
            <div className="text-sm text-gray-500">{event.month}</div>
         </div>
         <div className="flex-grow">
            <h3 className="text-lg font-semibold">{event.title}</h3>
            <div className="flex items-center mt-1 text-sm text-white bg-green-600 rounded-full px-3 py-1 w-fit">
               <Clock className="w-4 h-4 mr-1" />
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
      <div className="w-full mx-auto bg-[#F8F8F8] rounded-xl overflow-hidden p-6">
         <h2 className="text-2xl font-bold mb-4">Próximas</h2>
         <div className="divide-y divide-gray-200">
            {currentEvents.map((event, index) => (
               <EventCard key={index} event={event} />
            ))}
         </div>
         <div className="flex justify-center mt-4 space-x-2">
            {[...Array(totalPages)].map((_, index) => (
               <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-2 h-2 rounded-full ${index === currentPage ? "bg-blue-500" : "bg-gray-300"}`}
               />
            ))}
         </div>
      </div>
   );
}
