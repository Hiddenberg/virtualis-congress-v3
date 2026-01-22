import { X } from "lucide-react";
import type React from "react";
import type { GlobalPopUpOptions } from "../context/GlobalPopUpContext";

interface PopUpProps {
   children: React.ReactNode;
   onClose: () => void;
   options?: GlobalPopUpOptions;
}

export default function PopUp({ children, onClose, options }: PopUpProps) {
   return (
      <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 !m-0">
         <div className="relative bg-white shadow-lg p-6 rounded-lg w-full max-w-screen-xl max-h-[90vh] overflow-y-auto">
            {options?.hasCloseButton !== false && (
               <button
                  type="button"
                  onClick={onClose}
                  className="top-2 right-2 absolute text-gray-500 hover:text-gray-700"
                  aria-label="Close"
               >
                  <X size={24} />
               </button>
            )}
            {children}
         </div>
      </div>
   );
}
