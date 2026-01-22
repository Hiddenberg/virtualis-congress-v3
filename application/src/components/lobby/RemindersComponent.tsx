"use client";

import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { nanoid } from "nanoid";
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
      <div className="bg-[#F8F8F8] shadow-md mx-auto p-6 rounded-lg w-1/3">
         <div className="flex justify-between items-center mb-4">
            <h2 className="flex items-center font-semibold text-xl">
               <Clock className="mr-2" /> Recordatorios
            </h2>
            <div className="flex space-x-2">
               <button type="button" onClick={prevPage} className="bg-gray-200 hover:bg-gray-300 p-1 rounded-full">
                  <ChevronLeft className="w-6 h-6" />
               </button>
               <button type="button" onClick={nextPage} className="bg-gray-200 hover:bg-gray-300 p-1 rounded-full">
                  <ChevronRight className="w-6 h-6" />
               </button>
            </div>
         </div>
         <div className="space-y-4">
            {currentReminders.map((reminder) => (
               <div key={reminder.id} className="flex items-start">
                  <div className="shrink-0 w-12 text-center">
                     <div className="font-bold text-2xl">{reminder.date.split(" ")[0]}</div>
                     <div className="text-gray-500 text-sm">{reminder.date.split(" ")[1]}</div>
                  </div>
                  <div className="flex-grow ml-4">
                     <h3 className="font-medium text-sm">{reminder.title}</h3>
                     <div className="inline-flex items-center bg-primary mt-1 px-2.5 py-0.5 rounded-full font-medium text-primary-foreground text-xs">
                        <Clock className="mr-1 w-3 h-3" />
                        {reminder.time}
                     </div>
                  </div>
               </div>
            ))}
         </div>
         <div className="flex justify-center space-x-2 mt-4">
            {[...Array(totalPages)].map((_, index) => (
               <div key={nanoid()} className={`w-2 h-2 rounded-full ${index === currentPage ? "bg-primary" : "bg-gray-300"}`} />
            ))}
         </div>
      </div>
   );
}
