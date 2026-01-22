import { X } from "lucide-react";
import type React from "react";

interface PopUpProps {
   children: React.ReactNode;
   onClose: () => void;
   canBeClosed?: boolean;
}

export default function PopUp({ children, onClose, canBeClosed = true }: PopUpProps) {
   return (
      <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 !m-0">
         <div className="relative bg-white shadow-lg mx-4 md:mx-8 p-3 sm:p-4 md:p-6 rounded-lg w-full max-w-[95%] sm:max-w-[90%] md:max-w-screen-lg lg:max-w-screen-xl max-h-[90vh] overflow-y-auto">
            {canBeClosed && (
               <button
                  type="button"
                  onClick={onClose}
                  className="top-1 sm:top-2 right-1 sm:right-2 absolute text-gray-500 hover:text-gray-700"
                  aria-label="Close"
               >
                  <X size={24} className="sm:hidden" strokeWidth={3} />
                  <X size={28} className="hidden sm:block" strokeWidth={3} />
               </button>
            )}
            <div className="mt-2 sm:mt-4 p-1 sm:p-2 max-h-[70vh] sm:max-h-[75vh] md:max-h-[80vh] overflow-y-auto">{children}</div>
         </div>
      </div>
   );
}
