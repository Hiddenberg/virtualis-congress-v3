"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image, { StaticImageData } from "next/image";
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
         <Image
            src={participant.image}
            alt={participant.name}
            className="shadow-lg rounded-lg w-full h-full object-cover"
         />
         {isActive && (
            <button className="bottom-4 left-4 absolute bg-primary bg-white hover:bg-primary/90 px-4 py-2 rounded-full font-semibold text-green-800 text-primary-foreground text-sm transition-colors">
               Ver CV
            </button>
         )}
      </div>
   );
}

function ExpositorsCarousel() {
   const [activeIndex, setActiveIndex] = useState(0);

   const nextSlide = () => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % participants.length);
   };

   const prevSlide = () => {
      setActiveIndex(
         (prevIndex) =>
            (prevIndex - 1 + participants.length) % participants.length,
      );
   };

   return (
      <div className="mx-auto px-4 py-8 w-full h-max">
         <div className="relative">
            <div className="flex justify-center items-center space-x-4 overflow-hidden">
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
               className="top-1/2 left-0 absolute bg-black/50 p-2 rounded-full text-white -translate-y-1/2 transform"
            >
               <ChevronLeft className="w-6 h-6" />
            </button>
            <button
               onClick={nextSlide}
               className="top-1/2 right-0 absolute bg-black/50 p-2 rounded-full text-white -translate-y-1/2 transform"
            >
               <ChevronRight className="w-6 h-6" />
            </button>
         </div>
         <div className="mt-6 text-center">
            <h2 className="font-bold text-2xl">
               {participants[activeIndex].name}
            </h2>
            <p className="text-muted-foreground">
               {participants[activeIndex].title}
            </p>
            <div className="flex justify-center space-x-2 mt-2">
               {participants.map((_, index) => (
                  <div
                     key={index}
                     className={`w-2 h-2 rounded-full ${
                        index === activeIndex ? "bg-primary" : "bg-gray-300"
                     }`}
                  />
               ))}
            </div>
         </div>
      </div>
   );
}

export default function ExpositorsCarouselSection() {
   return (
      <div>
         <div className="flex justify-between">
            <h1 className="text-blue-900 text-xl md:text-2xl">Expositores</h1>
            {/* <div className="flex gap-5">
               <button className="border rounded-xl"><ArrowLeftIcon /></button>
               <button className="border rounded-xl"><ArrowRightIcon /></button>
            </div> */}
         </div>
         <ExpositorsCarousel />
      </div>
   );
}
