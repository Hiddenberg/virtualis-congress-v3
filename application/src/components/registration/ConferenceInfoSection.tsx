import { Suspense } from "react";
import ConferencesDataProvider from "./ConferencesDataProvider";
import ConferencesLoadingSkeleton from "./ConferencesLoadingSkeleton";
import EventInfoCard from "./EventInfoCard";

function InfoText() {
   return (
      <div className="">
         <p>
            En este congreso virtual, ampliarás tus conocimientos con las
            últimas tendencias en Medicina Interna. Ya viste cómo funciona la
            plataforma en el video: conferencias en vivo con chat interactivo,
            espacio de preguntas al final de cada sesión y una biblioteca
            On-Demand para no perderte nada.
         </p>
         {/* <p>
            Ahora, es el momento de conocer más detalles y asegurarte de obtener el máximo provecho de cada ponencia. Prepárate para compartir experiencias con colegas de todo el mundo, mientras aprendes de especialistas que lideran la innovación en el área.
         </p> */}
      </div>
   );
}

function ConferenceInfoSection() {
   return (
      <div
         id="info"
         className="md:items-end md:gap-4 space-y-6 md:grid md:grid-cols-3 bg-gray-100 px-4 md:px-10 pt-16 pb-6 transition-colors"
      >
         <div>
            <div className="md:hidden mb-2 pt-4 font-medium text-black text-xl md:text-2xl leading-relaxed">
               <InfoText />
            </div>
            <EventInfoCard />
         </div>
         <div className="md:space-y-10 md:col-span-2">
            <div className="hidden md:block pt-4 font-medium text-black text-xl md:text-2xl leading-relaxed">
               <InfoText />
            </div>
            <Suspense fallback={<ConferencesLoadingSkeleton />}>
               <ConferencesDataProvider />
            </Suspense>
         </div>
      </div>
   );
}

export default ConferenceInfoSection;
