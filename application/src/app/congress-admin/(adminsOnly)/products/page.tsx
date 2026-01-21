import CongressProductAdminCard from "@/features/congresses/components/congressProducts/CongressProductAdminCard";
import CreateDefaultProductsButton from "@/features/congresses/components/congressProducts/CreateDefaultProductsButton";
import { getAllCongressProducts } from "@/features/congresses/services/congressProductsServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";

export default async function AdminProductsPage() {
   const congress = await getLatestCongress();
   const products = await getAllCongressProducts(congress.id);

   return (
      <div>
         <h1 className="font-bold text-gray-900 text-2xl">Productos del congreso {congress.title}</h1>
         <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            {products.length > 0 ? (
               products.map((product) => <CongressProductAdminCard key={product.id} product={product} />)
            ) : (
               <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500 text-sm">No hay productos para este congreso</p>
                  <CreateDefaultProductsButton />
               </div>
            )}
         </div>
      </div>
   );
}
