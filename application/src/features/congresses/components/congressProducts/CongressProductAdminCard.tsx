import { CircleDollarSignIcon, GlobeIcon, HashIcon, TagIcon, VideoIcon } from "lucide-react";
import { LinkButton } from "@/components/global/Buttons";
import { getCongressProductPrices } from "../../services/congressProductPricesServices";
import { CongressProductRecord } from "../../types/congressProductsTypes";

function getProductTypeIcon(productType: string) {
   if (productType.includes("online") || productType.includes("access")) {
      return GlobeIcon;
   }
   if (productType.includes("recording")) {
      return VideoIcon;
   }
   return TagIcon;
}

function getProductTypeColor(productType: string) {
   if (productType.includes("online") || productType.includes("access")) {
      return {
         bg: "bg-blue-50",
         text: "text-blue-700",
         ring: "ring-blue-600/20",
      };
   }
   if (productType.includes("recording")) {
      return {
         bg: "bg-purple-50",
         text: "text-purple-700",
         ring: "ring-purple-600/20",
      };
   }
   return {
      bg: "bg-gray-50",
      text: "text-gray-700",
      ring: "ring-gray-600/20",
   };
}

async function ProductPricesSection({ productId }: { productId: string }) {
   const productPrices = await getCongressProductPrices(productId);

   return (
      <div className="mt-6 pt-6 border-gray-200 border-t">
         <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-900 text-base">Precios Configurados</h2>
            <span
               className={`px-2 py-1 rounded-md text-xs font-medium ${productPrices.length > 0 ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"}`}
            >
               {productPrices.length} {productPrices.length === 1 ? "precio" : "precios"}
            </span>
         </div>
         {productPrices.length > 0 ? (
            <div className="gap-3 grid grid-cols-1">
               {productPrices.map((price) => (
                  <div
                     key={price.id}
                     className="flex justify-between items-center bg-gray-50 px-3 py-2 border border-gray-200 rounded-lg"
                  >
                     <span className="font-medium text-gray-900 text-sm">{price.name}</span>
                  </div>
               ))}
            </div>
         ) : (
            <div className="flex flex-col justify-center items-center bg-gray-50 py-6 border border-gray-200 border-dashed rounded-lg">
               <CircleDollarSignIcon className="mb-2 w-8 h-8 text-gray-400" />
               <p className="text-gray-500 text-sm text-center">No hay precios configurados</p>
               <p className="mt-1 text-gray-400 text-xs text-center">
                  Agrega precios para que los usuarios puedan comprar este producto
               </p>
            </div>
         )}
      </div>
   );
}

export default function CongressProductAdminCard({ product }: { product: CongressProductRecord }) {
   const ProductIcon = getProductTypeIcon(product.productType);
   const typeColors = getProductTypeColor(product.productType);

   return (
      <div className="flex flex-col bg-white shadow-sm hover:shadow-md p-6 border border-gray-200 rounded-xl h-full transition-all duration-200">
         <div className="flex items-start gap-4 mb-4">
            <div className={`flex items-center justify-center shrink-0 w-12 h-12 rounded-lg ${typeColors.bg}`}>
               <ProductIcon className={`w-6 h-6 ${typeColors.text}`} />
            </div>
            <div className="flex-1 min-w-0">
               <h3 className="mb-2 font-semibold text-gray-900 text-lg line-clamp-2 leading-snug">{product.name}</h3>
               <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{product.description}</p>
            </div>
         </div>

         <div className="flex flex-wrap items-center gap-2 mb-4">
            <span
               className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ring-1 ring-inset ${typeColors.bg} ${typeColors.text} ${typeColors.ring}`}
            >
               <TagIcon className="w-3 h-3" />
               {product.productType}
            </span>
         </div>

         <div className="flex flex-col gap-2 mb-4">
            <div className="flex items-center gap-2 text-gray-500">
               <HashIcon className="w-3.5 h-3.5" />
               <span className="font-mono text-xs">{product.id}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
               <CircleDollarSignIcon className="w-3.5 h-3.5" />
               <span className="font-mono text-xs truncate">{product.stripeProductId}</span>
            </div>
         </div>

         <ProductPricesSection productId={product.id} />

         <div className="mt-6 pt-6 border-gray-200 border-t">
            <LinkButton href={`/congress-admin/products/${product.id}/prices`} variant="blue" className="justify-center w-full">
               <CircleDollarSignIcon className="size-4" />
               Administrar precios
            </LinkButton>
         </div>
      </div>
   );
}
