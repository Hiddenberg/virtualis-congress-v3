import { CongressProductRecord } from "../../types/congressProductsTypes";

export default function CongressProductAdminCard({ product }: { product: CongressProductRecord }) {
   return (
      <div className="p-4 border border-gray-200 rounded-lg">
         <span className="text-gray-500 text-xs">id: {product.id}</span>
         <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 leading-snug">{product.name}</h3>
         <p className="mt-1 text-gray-600 text-sm line-clamp-2">{product.description}</p>
         <span className="text-gray-500 text-xs">Tipo: {product.productType}</span>
         <span className="text-gray-500 text-xs">Stripe Product ID: {product.stripeProductId}</span>
      </div>
   );
}
