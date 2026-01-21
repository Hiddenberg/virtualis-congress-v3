"use client";

import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useState } from "react";

type Reminder = {
   id: number;
   date: string;
   title: string;
   time: string;
};

const reminders: Reminder[] = [
   {
      id: 1,
      date: "24 Oct",
      title: "El paciente hipertenso hospitalizado, ¿debo...",
      time: "08:00 h",
   },
   {
      id: 2,
      date: "24 Oct",
      title: "Trastornos del movimiento, retos e...",
      time: "09:00 h",
   },
   {
      id: 3,
      date: "24 Oct",
      title: "Prevención secundaria en EVC",
      time: "09:35 h",
   },
   {
      id: 4,
      date: "24 Oct",
      title: "Casos clínicos de alergia para el inter...",
      time: "10:10 h",
   },
];

export default function RemindersComponent() {
   const [currentPage, setCurrentPage] = useState(0);
   const remindersPerPage = 4;
   const totalPages = Math.ceil(reminders.length / remindersPerPage);

   const nextPage = () => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
   };

   const prevPage = () => {
      setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
   };

   const currentReminders = reminders.slice(currentPage * remindersPerPage, (currentPage + 1) * remindersPerPage);

   return (
      <div className="w-1/3 mx-auto bg-[#F8F8F8] rounded-lg shadow-md p-6">
         <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
               <Clock className="mr-2" /> Recordatorios
            </h2>
            <div className="flex space-x-2">
               <button onClick={prevPage} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300">
                  <ChevronLeft className="w-6 h-6" />
               </button>
               <button onClick={nextPage} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300">
                  <ChevronRight className="w-6 h-6" />
               </button>
            </div>
         </div>
         <div className="space-y-4">
            {currentReminders.map((reminder) => (
               <div key={reminder.id} className="flex items-start">
                  <div className="flex-shrink-0 w-12 text-center">
                     <div className="text-2xl font-bold">{reminder.date.split(" ")[0]}</div>
                     <div className="text-sm text-gray-500">{reminder.date.split(" ")[1]}</div>
                  </div>
                  <div className="ml-4 flex-grow">
                     <h3 className="text-sm font-medium">{reminder.title}</h3>
                     <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {reminder.time}
                     </div>
                  </div>
               </div>
            ))}
         </div>
         <div className="flex justify-center mt-4 space-x-2">
            {[...Array(totalPages)].map((_, index) => (
               <div key={index} className={`w-2 h-2 rounded-full ${index === currentPage ? "bg-primary" : "bg-gray-300"}`} />
            ))}
         </div>
      </div>
   );
}
