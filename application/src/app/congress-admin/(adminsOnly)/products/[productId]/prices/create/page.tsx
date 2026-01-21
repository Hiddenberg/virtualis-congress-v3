import { CircleDollarSignIcon } from "lucide-react";
import AdminSubPageHeader from "@/components/congress-admin/AdminSubPageHeader";
import GoBackButton from "@/components/global/GoBackButton";
import { getCongressProductById } from "@/features/congresses/services/congressProductsServices";

export default async function AdminCreateProductPricePage({ params }: { params: Promise<{ productId: string }> }) {
   const { productId } = await params;

   const product = await getCongressProductById(productId);
   if (!product) {
      return (
         <div className="p-6">
            <h1 className="font-bold text-gray-900 text-2xl">Producto no encontrado</h1>
         </div>
      );
   }

   return (
      <div>
         <GoBackButton
            backURL={`/congress-admin/products/${productId}/prices`}
            backButtonText="Volver a precios"
            className="mb-4"
         />
         <AdminSubPageHeader
            title={`Agregar precio para ${product.name}`}
            Icon={CircleDollarSignIcon}
            description={`Agrega un nuevo precio para el producto "${product.name}"`}
         />
      </div>
   );
}
