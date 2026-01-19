import { Loader2 } from "lucide-react";

export default function GlobalLoadingPage() {
   return (
      <div className="z-50 fixed inset-0 flex justify-center items-center w-screen h-screen">
         <div className="flex justify-center items-center w-full max-w-screen-xl">
            <Loader2 className="to-blue-500 size-20 animate-spin" />
         </div>
      </div>
   );
}
