import { getCongressProductPrices } from "@/features/congresses/services/congressPricesServices";
import { getCongressProductById } from "@/features/congresses/services/congressProductsServices";

export default async function AdminProductPricesPage({ params }: { params: Promise<{ productId: string }> }) {
   const { productId } = await params;
   const product = await getCongressProductById(productId);
   if (!product) {
      return (
         <div className="p-6">
            <h1 className="font-bold text-gray-900 text-2xl">Producto no encontrado</h1>
         </div>
      );
   }

   const productPrices = await getCongressProductPrices(productId);

   return (
      <div>
         <h1 className="font-bold text-gray-900 text-2xl">{product.name}</h1>
         <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            {productPrices.length > 0 ? (
               productPrices.map((price) => (
                  <div key={price.id}>
                     <h2 className="font-bold text-gray-900 text-xl">{price.name}</h2>
                  </div>
               ))
            ) : (
               <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500 text-sm">No hay precios para este producto</p>
               </div>
            )}
         </div>
      </div>
   );
}
