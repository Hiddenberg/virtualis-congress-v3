import { getAllCongressProductsWithPrices } from "@/features/congresses/services/congressProductsServices";
import type { CongressRecord } from "@/features/congresses/types/congressTypes";
import ImportantNotes from "./ImportantNotes";
import InPersonAccessSection from "./InPersonAccessSection";
import OnlineAccessSection from "./OnlineAccessSection";
import RecordingsSection from "./RecordingsSection";
import RegistrationCTA from "./RegistrationCTA";
import SectionHeader from "./SectionHeader";

interface GenericPricesSectionProps {
   congress: CongressRecord;
   userId?: string;
}

export default async function GenericPricesSection({ congress, userId }: GenericPricesSectionProps) {
   const productsWithPrices = await getAllCongressProductsWithPrices(congress.id);

   // Group products by type
   const onlineAccessProduct = productsWithPrices.find(
      (p) => p.product.productType === "congress_online_access" && p.prices.length > 0,
   );
   const inPersonAccessProduct = productsWithPrices.find(
      (p) => p.product.productType === "congress_in_person_access" && p.prices.length > 0,
   );
   const recordingsProduct = productsWithPrices.find(
      (p) => p.product.productType === "congress_recordings" && p.prices.length > 0,
   );

   // Don't render if there are no products with prices
   if (!onlineAccessProduct && !inPersonAccessProduct && !recordingsProduct) {
      return null;
   }

   return (
      <div className="bg-white py-16">
         <div className="mx-auto px-4 container">
            <SectionHeader
               title="Cuotas de Recuperación"
               subtitle="Elige la modalidad que mejor se adapte a tus necesidades"
            />

            {onlineAccessProduct && <OnlineAccessSection product={onlineAccessProduct} />}

            {congress.modality === "hybrid" && inPersonAccessProduct && (
               <InPersonAccessSection congress={congress} product={inPersonAccessProduct} />
            )}

            {recordingsProduct && <RecordingsSection product={recordingsProduct} />}

            <ImportantNotes
               congress={congress}
               onlineAccessProduct={onlineAccessProduct}
               inPersonAccessProduct={inPersonAccessProduct}
               recordingsProduct={recordingsProduct}
            />

            <RegistrationCTA userId={userId} />
         </div>
      </div>
   );
}
