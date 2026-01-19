import {
   ArrowRight,
   ChevronDown,
   Presentation,
   Ticket,
   Trophy,
} from "lucide-react";

type PromoCardProps = {
   title: string;
   description: string;
   icon: React.ReactNode;
};

function PromoCard({ title, description, icon }: PromoCardProps) {
   return (
      <div className="bg-[#10384F] text-white rounded-3xl p-6 flex flex-col h-full">
         <div className="flex items-center mb-4">
            <div className="bg-white p-2 rounded-full mr-4">{icon}</div>
            <h2 className="text-xl font-bold">{title}</h2>
         </div>
         <p className="flex-grow mb-4">{description}</p>
         <button className="self-end bg-green-400 hover:bg-green-500 text-white rounded-full p-2 transition-colors">
            <ArrowRight className="w-6 h-6" />
         </button>
      </div>
   );
}

export default function BayerActivities() {
   return (
      <div className="w-full mx-auto py-4">
         <div className="flex justify-between gap-10 mb-8">
            <PromoCard
               title="¡Descubre tus Descuentos Exclusivos!"
               description="Accede a ofertas y descuentos especiales en productos farmacéuticos de Bayer, solo para asistentes del congreso."
               icon={<Ticket className="w-6 h-6 text-[#10384F]" />}
            />
            <PromoCard
               title="Participa en nuestro Sorteo"
               description="Participa y gana productos Bayer exclusivos. ¡Descubre más aquí!"
               icon={<Trophy className="w-6 h-6 text-[#10384F]" />}
            />
            <PromoCard
               title="Explora Nuestras Charlas Exclusivas"
               description="Infórmate sobre nuestras sesiones en vivo y descubre las soluciones más innovadoras de Bayer. Haz clic aquí para conocer más y registrarte."
               icon={<Presentation className="w-6 h-6 text-[#10384F]" />}
            />
         </div>
         <div className="text-center">
            <button className="text-primary hover:text-primary-dark font-medium flex items-center justify-center mx-auto transition-colors">
               Conocer más
               <ChevronDown className="w-4 h-4 ml-1" />
            </button>
         </div>
      </div>
   );
}
