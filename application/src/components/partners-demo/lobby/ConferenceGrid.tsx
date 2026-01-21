import ConferenceCard, { type ConferenceInfo } from "./ConferenceCard";

interface ConferenceGridProps {
   items: ConferenceInfo[];
}

export default function ConferenceGrid({ items }: ConferenceGridProps) {
   return (
      <section id="conferencias" className="px-6 md:px-10">
         <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
            {items.map((conf, idx) => (
               <ConferenceCard key={conf.id} {...conf} color={(["blue", "green", "purple", "pink"] as const)[idx % 4]} />
            ))}
         </div>
      </section>
   );
}
