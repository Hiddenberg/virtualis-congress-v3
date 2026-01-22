import { ArrowRight, ChevronDown, Presentation, Ticket, Trophy } from "lucide-react";

type PromoCardProps = {
   title: string;
   description: string;
   icon: React.ReactNode;
};

function PromoCard({ title, description, icon }: PromoCardProps) {
   return (
      <div className="flex flex-col bg-[#10384F] p-6 rounded-3xl h-full text-white">
         <div className="flex items-center mb-4">
            <div className="bg-white mr-4 p-2 rounded-full">{icon}</div>
            <h2 className="font-bold text-xl">{title}</h2>
         </div>
         <p className="mb-4 grow">{description}</p>
         <button type="button" className="self-end bg-green-400 hover:bg-green-500 p-2 rounded-full text-white transition-colors">
            <ArrowRight className="w-6 h-6" />
         </button>
      </div>
   );
}

export default function BayerActivities() {
   return (
      <div className="mx-auto py-4 w-full">
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
            <button
               type="button"
               className="flex justify-center items-center mx-auto font-medium text-primary hover:text-primary-dark transition-colors"
            >
               Conocer más
               <ChevronDown className="ml-1 w-4 h-4" />
            </button>
         </div>
      </div>
   );
}
