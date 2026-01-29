import { Check, DollarSign } from "lucide-react";
import { useMemo } from "react";
import type { ProductPriceRecord } from "@/features/congresses/types/congressProductPricesTypes";
import type { CongressProductWithPrices } from "@/features/congresses/types/congressProductsTypes";

interface ProductPriceSelectorProps {
   modality: "in-person" | "virtual" | "";
   congressProducts: CongressProductWithPrices[];
   selectedPriceId: string;
   setSelectedPriceId: (value: string) => void;
   customPrice: string;
   setCustomPrice: (value: string) => void;
   isPaidSelected: boolean;
}

export function ProductPriceSelector({
   modality,
   congressProducts,
   selectedPriceId,
   setSelectedPriceId,
   customPrice,
   setCustomPrice,
   isPaidSelected,
}: ProductPriceSelectorProps) {
   const availableProducts = useMemo(() => {
      if (!modality) return [];

      const productType = modality === "virtual" ? "congress_online_access" : "congress_in_person_access";

      return congressProducts.filter((cp) => cp.product.productType === productType);
   }, [modality, congressProducts]);

   const allPrices = useMemo(() => {
      return availableProducts.flatMap((product) =>
         product.prices.map((price) => ({
            ...price,
            productName: product.product.name,
         })),
      );
   }, [availableProducts]);

   const formatPrice = (price: ProductPriceRecord) => {
      const amount = price.priceAmount;
      const currency = price.currency.toUpperCase();
      return `${amount.toLocaleString()} ${currency}`;
   };

   const handlePriceSelect = (priceId: string) => {
      setSelectedPriceId(priceId);
      setCustomPrice("");
   };

   const handleCustomPriceSelect = () => {
      setSelectedPriceId("custom");
   };

   if (isPaidSelected) {
      return null;
   }

   if (!modality) {
      return (
         <div className="bg-blue-50 p-4 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">Selecciona una modalidad para ver los precios disponibles</p>
         </div>
      );
   }

   if (allPrices.length === 0) {
      return (
         <div className="bg-amber-50 p-4 border border-amber-200 rounded-lg">
            <p className="text-amber-800 text-sm">No hay productos disponibles para esta modalidad</p>
         </div>
      );
   }

   return (
      <div>
         <div className="block mb-3 font-medium text-gray-700 text-sm">Selecciona el Precio</div>

         <div className="space-y-2">
            {allPrices.map((price) => (
               <button
                  key={price.id}
                  type="button"
                  onClick={() => handlePriceSelect(price.id)}
                  disabled={isPaidSelected}
                  className={`
                     w-full p-4 rounded-lg border-2 transition-all text-left
                     ${selectedPriceId === price.id ? "border-blue-500 bg-blue-50" : isPaidSelected ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}
                  `}
               >
                  <div className="flex justify-between items-center gap-3">
                     <div className="flex-1">
                        <div className="flex items-center gap-2">
                           {selectedPriceId === price.id && (
                              <div className="flex justify-center items-center bg-blue-500 rounded-full w-5 h-5 shrink-0">
                                 <Check size={12} className="text-white" />
                              </div>
                           )}
                           <div className="font-medium text-gray-900">{price.name}</div>
                        </div>
                        {price.requiresCredentialValidation && (
                           <div className="bg-amber-100 mt-1 px-2 py-0.5 rounded w-fit text-amber-700 text-xs">
                              Requiere validación de credenciales
                           </div>
                        )}
                     </div>
                     <div className="font-semibold text-gray-900 text-lg">{formatPrice(price)}</div>
                  </div>
               </button>
            ))}

            {/* Custom Price Option */}
            <div
               className={`
                  p-4 rounded-lg border-2 transition-all
                  ${selectedPriceId === "custom" ? "border-blue-500 bg-blue-50" : isPaidSelected ? "border-gray-200 bg-gray-50" : "border-gray-200"}
               `}
            >
               <button
                  type="button"
                  onClick={handleCustomPriceSelect}
                  disabled={isPaidSelected}
                  className="flex justify-between items-center gap-3 mb-3 w-full text-left"
               >
                  <div className="flex items-center gap-2">
                     {selectedPriceId === "custom" && (
                        <div className="flex justify-center items-center bg-blue-500 rounded-full w-5 h-5 shrink-0">
                           <Check size={12} className="text-white" />
                        </div>
                     )}
                     <DollarSign size={16} className="text-gray-600" />
                     <span className="font-medium text-gray-900">Precio Personalizado</span>
                  </div>
               </button>

               {selectedPriceId === "custom" && (
                  <div className="space-y-2">
                     <input
                        type="number"
                        value={customPrice}
                        onChange={(e) => setCustomPrice(e.target.value)}
                        placeholder="Ingresa el monto"
                        disabled={isPaidSelected}
                        className="px-4 py-2 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full transition-colors"
                        min="0"
                        step="0.01"
                     />
                     <p className="text-gray-600 text-xs">Ingresa el monto total en la moneda seleccionada</p>
                  </div>
               )}
            </div>
         </div>

         {isPaidSelected && (
            <p className="flex items-center gap-1 mt-2 text-amber-600 text-xs">
               No se puede cambiar el precio de usuarios ya pagados
            </p>
         )}
      </div>
   );
}
