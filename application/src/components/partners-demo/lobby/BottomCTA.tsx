import { Store } from "lucide-react";
import Link from "next/link";

export default function BottomCTA() {
   return (
      <div className="px-6 md:px-10 py-10">
         <div className="mx-auto max-w-md">
            <Link
               href="/partners-demo/commercial-zone"
               className="flex justify-center items-center gap-3 bg-white hover:bg-gray-50 shadow-sm px-4 py-3 border border-gray-200 rounded-xl font-medium text-gray-800 text-sm transition-colors"
            >
               <Store size={18} /> Ir a Zona Comercial
            </Link>
         </div>
      </div>
   );
}
