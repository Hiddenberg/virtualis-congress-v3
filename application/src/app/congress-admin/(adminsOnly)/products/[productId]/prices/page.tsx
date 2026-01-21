import { CircleDollarSignIcon, PlusIcon } from "lucide-react";
import AdminSubPageHeader from "@/components/congress-admin/AdminSubPageHeader";
import { LinkButton } from "@/components/global/Buttons";
import GenericExpandableSection from "@/components/global/GenericExpandableSection";
import GoBackButton from "@/components/global/GoBackButton";
import AdminProductPriceCard from "@/features/congresses/components/congressProducts/AdminProductPriceCard";
import { getCongressProductPrices } from "@/features/congresses/services/congressProductPricesServices";
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

   const activeProductPrices = productPrices.filter((price) => !price.archived);
   const archivedProductPrices = productPrices.filter((price) => price.archived);

   return (
      <div>
         <GoBackButton backURL="/congress-admin/products" backButtonText="Volver a productos" className="mb-4" />
         <AdminSubPageHeader
            title={`Precios para ${product.name}`}
            Icon={CircleDollarSignIcon}
            description={`Administra los precios disponibles para el producto "${product.name}"`}
            sideElement={
               <LinkButton
                  href={`/congress-admin/products/${productId}/prices/create`}
                  variant="blue"
                  className="justify-center w-full"
               >
                  <PlusIcon className="size-4" />
                  Agregar precio
               </LinkButton>
            }
         />

         {productPrices.length > 0 ? (
            <div className="space-y-6">
               <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {activeProductPrices.map((price) => (
                     <AdminProductPriceCard key={price.id} price={price} />
                  ))}
               </div>

               <GenericExpandableSection title={`Precios archivados (${archivedProductPrices.length})`}>
                  <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                     {archivedProductPrices.map((price) => (
                        <AdminProductPriceCard key={price.id} price={price} />
                     ))}
                  </div>
               </GenericExpandableSection>
            </div>
         ) : (
            <div className="bg-white shadow-sm p-12 border border-gray-200 rounded-xl">
               <div className="flex flex-col justify-center items-center text-center">
                  <div className="flex justify-center items-center bg-gray-100 mb-4 rounded-full w-16 h-16">
                     <CircleDollarSignIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-900 text-lg">No hay precios configurados</h3>
                  <p className="mb-6 max-w-md text-gray-600 text-sm">
                     Comienza agregando el primer precio para este producto. Los usuarios podrán seleccionar entre las diferentes
                     opciones de precio disponibles.
                  </p>
                  <LinkButton
                     href={`/congress-admin/products/${productId}/prices/create`}
                     variant="blue"
                     className="justify-center"
                  >
                     <CircleDollarSignIcon className="size-4" />
                     Agregar primer precio
                  </LinkButton>
               </div>
            </div>
         )}
      </div>
   );
}
