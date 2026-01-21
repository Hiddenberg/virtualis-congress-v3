import { ShoppingCartIcon } from "lucide-react";
import CongressProductAdminCard from "@/features/congresses/components/congressProducts/CongressProductAdminCard";
import CreateDefaultProductsButton from "@/features/congresses/components/congressProducts/CreateDefaultProductsButton";
import { getAllCongressProducts } from "@/features/congresses/services/congressProductsServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";

export default async function AdminProductsPage() {
   const congress = await getLatestCongress();
   const products = await getAllCongressProducts(congress.id);

   return (
      <div>
         <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
               <div className="flex justify-center items-center bg-sky-50 rounded-lg w-12 h-12">
                  <ShoppingCartIcon className="w-6 h-6 text-sky-600" />
               </div>
               <div>
                  <h1 className="font-bold text-gray-900 text-3xl">Productos del Congreso</h1>
                  <p className="mt-1 text-gray-600 text-base">{congress.title}</p>
               </div>
            </div>
            <p className="mt-4 text-gray-600 text-sm leading-relaxed">
               Administra los productos y precios disponibles para este congreso. Cada producto puede tener múltiples opciones de
               precio.
            </p>
         </div>

         {products.length > 0 ? (
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
               {products.map((product) => (
                  <CongressProductAdminCard key={product.id} product={product} />
               ))}
            </div>
         ) : (
            <div className="bg-white shadow-sm p-8 border border-gray-200 rounded-xl">
               <div className="flex flex-col justify-center items-center text-center">
                  <div className="flex justify-center items-center bg-gray-100 mb-4 rounded-full w-16 h-16">
                     <ShoppingCartIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-900 text-lg">No hay productos configurados</h3>
                  <p className="mb-6 max-w-md text-gray-600 text-sm">
                     Comienza creando los productos por defecto para este congreso. Podrás personalizarlos y agregar precios
                     después.
                  </p>
                  <CreateDefaultProductsButton />
               </div>
            </div>
         )}
      </div>
   );
}
