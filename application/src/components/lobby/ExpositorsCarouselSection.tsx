"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { useState } from "react";
import expositorImage1 from "@/assets/expositor1.png";
import expositorImage2 from "@/assets/expositor2.jpeg";
import expositorImage3 from "@/assets/expositor3.png";
import expositorImage4 from "@/assets/expositor4.png";
import expositorImage5 from "@/assets/expositor5.png";

type Participant = {
   id: number;
   name: string;
   title: string;
   image: StaticImageData;
};

const participants: Participant[] = [
   {
      id: 1,
      name: "Dra. Ana Gómez Martínez",
      title: "Directora de Investigación en Farmacología",
      image: expositorImage2,
   },
   {
      id: 2,
      name: "Dr. Carlos Rodríguez",
      title: "Investigador Senior en Neurociencia",
      image: expositorImage1,
   },
   {
      id: 3,
      name: "Prof. Eduardo Sánchez",
      title: "Catedrático de Bioquímica",
      image: expositorImage3,
   },
   {
      id: 4,
      name: "Dr. Miguel Fernández",
      title: "Jefe de Oncología Clínica",
      image: expositorImage4,
   },
   {
      id: 5,
      name: "Dra. Laura Martín",
      title: "Investigadora en Genética Molecular",
      image: expositorImage5,
   },
];

function ParticipantCard({
   participant,
   isActive,
   onClick,
}: {
   participant: Participant;
   isActive: boolean;
   onClick: () => void;
}) {
   return (
      <div
         className={`relative transition-all duration-300 ease-in-out cursor-pointer w-56 h-80
        ${isActive ? "scale-105 z-10" : "scale-90 opacity-70"}`}
         onClick={onClick}
      >
         <Image src={participant.image} alt={participant.name} className="w-full h-full object-cover rounded-lg shadow-lg" />
         {isActive && (
            <button className="absolute bg-white text-green-800 bottom-4 left-4 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors">
               Ver CV
            </button>
         )}
      </div>
   );
}

export default function ExpositorsCarouselSection() {
   const [activeIndex, setActiveIndex] = useState(0);

   const nextSlide = () => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % participants.length);
   };

   const prevSlide = () => {
      setActiveIndex((prevIndex) => (prevIndex - 1 + participants.length) % participants.length);
   };

   return (
      <div className="w-full h-max mx-auto px-4 py-8">
         <div className="relative">
            <div className="flex items-center justify-center space-x-4 overflow-hidden">
               {participants.map((participant, index) => (
                  <ParticipantCard
                     key={participant.id}
                     participant={participant}
                     isActive={index === activeIndex}
                     onClick={() => setActiveIndex(index)}
                  />
               ))}
            </div>
            <button
               onClick={prevSlide}
               className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
            >
               <ChevronLeft className="w-6 h-6" />
            </button>
            <button
               onClick={nextSlide}
               className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
            >
               <ChevronRight className="w-6 h-6" />
            </button>
         </div>
         <div className="text-center mt-6">
            <h2 className="text-2xl font-bold">{participants[activeIndex].name}</h2>
            <p className="text-muted-foreground">{participants[activeIndex].title}</p>
            <div className="flex justify-center space-x-2 mt-2">
               {participants.map((_, index) => (
                  <div key={index} className={`w-2 h-2 rounded-full ${index === activeIndex ? "bg-primary" : "bg-gray-300"}`} />
               ))}
            </div>
         </div>
      </div>
   );
}
