import PartnerCard, { type Partner } from "./PartnerCard";

interface PartnersGridProps {
   partners: Partner[];
}

export default function PartnersGrid({ partners }: PartnersGridProps) {
   return (
      <section className="px-6 md:px-10 pb-10">
         <div className="gap-4 grid grid-cols-1 md:grid-cols-4">
            {partners.map((p, idx) => (
               <PartnerCard key={p.id} {...p} isLarge={idx < 2} />
            ))}
         </div>
      </section>
   );
}
