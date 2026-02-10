import GoBackButton from "@/components/global/GoBackButton";
import InPersonLocationCard from "@/components/payment-page/prices/InPersonLocationCard";
import InPersonPricesGrid from "@/components/payment-page/prices/InPersonPricesGrid";
import InPersonPricesHeader from "@/components/payment-page/prices/InPersonPricesHeader";
import { getInPersonCongressProductPrices } from "@/features/congresses/services/congressProductPricesServices";
import { getInPersonCongressProduct } from "@/features/congresses/services/congressProductsServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";

export default async function inPersonPricesPage() {
   const inPersonProduct = await getInPersonCongressProduct();

   if (!inPersonProduct) {
      throw new Error("In person product not found");
   }

   const congress = await getLatestCongress();
   const congressModality = congress.modality;
   const inPersonPrices = await getInPersonCongressProductPrices();

   if (inPersonPrices.length === 0) {
      throw new Error("In person prices not configured");
   }

   return (
      <div className="relative bg-linear-to-br from-green-50 via-white to-emerald-50 min-h-dvh">
         {/* Background decoration */}
         <div className="absolute inset-0 opacity-20 overflow-hidden pointer-events-none">
            <div className="top-10 right-10 absolute bg-green-300 blur-3xl rounded-full w-72 h-72" />
            <div className="bottom-10 left-10 absolute bg-emerald-300 blur-3xl rounded-full w-72 h-72" />
         </div>

         <div className="z-10 relative mx-auto p-4 sm:p-6 md:p-8 max-w-6xl min-h-dvh">
            {congressModality === "hybrid" && (
               <div className="mb-6">
                  <GoBackButton backURL="/payment" backButtonText="Volver a la selección de modalidad" />
               </div>
            )}

            <InPersonPricesHeader congressTitle={congress.title} />

            <GoBackButton className="mb-6" backURL="/" backButtonText="Volver a la página principal" />

            {congress.congressLocation && <InPersonLocationCard location={congress.congressLocation} />}

            <InPersonPricesGrid prices={inPersonPrices} />
         </div>
      </div>
   );
}
