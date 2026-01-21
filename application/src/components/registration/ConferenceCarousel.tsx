"use client";
import Image from "next/image";
import { useState } from "react";
import CarruselImagen1 from "@/assets/CarruselConferencia1.png";
import CarruselImagen2 from "@/assets/CarruselConferencia2.png";
import CarruselImagen3 from "@/assets/CarruselConferencia3.png";

export default function ConferenceCarousel() {
   const [currentSlide, setCurrentSlide] = useState(0);

   const slides = [
      {
         title: "Conferencias en Vivo con Expertos",
         description:
            "Participa en sesiones dinámicas donde podrás hacer preguntas en tiempo real. Al finalizar cada ponencia, se abrirá un espacio de Q&A con el conferencista para profundizar en los temas que más te interesen.",
         image: CarruselImagen1,
      },
      {
         title: "Acceso Global y Traducción Simultánea",
         description:
            "Únete desde cualquier parte del mundo y conecta con profesionales de distintos países. Gracias al sistema de traducción integrada, no tendrás barreras de idioma para disfrutar plenamente cada sesión.",
         image: CarruselImagen2,
      },
      {
         title: "Replays On-Demand",
         description:
            "¿Te perdiste un horario? Sin problema. Todas las conferencias quedarán disponibles para que las veas cuando quieras. Tendrás la flexibilidad de repasar el contenido a tu ritmo y desde cualquier dispositivo.",
         image: CarruselImagen3,
      },
      {
         title: "Certificación con Valor Curricular",
         description:
            "Al completar tu participación, obtendrás un certificado avalado por el American College of Physicians. Demuestra tu compromiso con la formación continua y eleva tu perfil profesional.",
         image: CarruselImagen3,
      },
      {
         title: "Organización de Alto Nivel",
         description:
            "Contamos con un comité científico que ha seleccionado cuidadosamente cada tema y ponente, garantizando información relevante y actualizada. Mantente al tanto de los últimos avances y mejores prácticas en Medicina Interna.",
         image: CarruselImagen3,
      },
   ];

   return (
      <div className="relative mx-auto rounded-3xl w-full h-[35rem] overflow-hidden">
         {/* Background Image */}
         <Image src={slides[currentSlide].image} alt="" className="absolute inset-0 w-full h-full object-cover" />

         <div className="relative flex flex-col justify-end p-7 w-full h-full text-white">
            <div className="inline-block mb-6">
               <span className="px-6 py-2 border border-white rounded-full text-sm">Qué encontrarás</span>
            </div>

            <h2 className="mb-4 font-bold text-2xl">{slides[currentSlide].title}</h2>

            <p className="mb-8 text-lg">{slides[currentSlide].description}</p>

            {/* Progress Indicators */}
            <div className="flex gap-2">
               {slides.map((_, index) => (
                  <button
                     key={index}
                     onClick={() => setCurrentSlide(index)}
                     className="p-4 px-2"
                     aria-label={`Go to slide ${index + 1}`}
                  >
                     <span
                        className={`block h-1 w-10 rounded-full transition-all duration-300 ${
                           index === currentSlide ? "w-12 bg-white" : "w-12 bg-gray-500"
                        }`}
                     />
                  </button>
               ))}
            </div>
         </div>
      </div>
   );
}
