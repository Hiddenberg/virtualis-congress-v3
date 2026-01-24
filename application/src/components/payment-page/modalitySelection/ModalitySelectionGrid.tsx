import { MonitorIcon, UsersIcon } from "lucide-react";
import ModalityCard from "./ModalityCard";

const ONLINE_FEATURES = [
   "Acceso en tiempo real a todas las ponencias",
   "Interacción con ponentes y asistentes",
   "Participa desde la comodidad de tu hogar u oficina",
];

const IN_PERSON_FEATURES = [
   "Experiencia completa en el lugar del evento",
   "Networking presencial con colegas",
   "Materiales físicos y recursos adicionales",
];

export default function ModalitySelectionGrid() {
   return (
      <div className="gap-4 sm:gap-6 grid md:grid-cols-2">
         <ModalityCard
            title="Modalidad en línea"
            description="Accede desde cualquier lugar del mundo"
            icon={MonitorIcon}
            features={ONLINE_FEATURES}
            href="/payment/prices/online"
            colorScheme="blue"
         />
         <ModalityCard
            title="Modalidad presencial"
            description="Asiste físicamente al evento"
            icon={UsersIcon}
            features={IN_PERSON_FEATURES}
            href="/payment/prices/in-person"
            colorScheme="green"
         />
      </div>
   );
}
