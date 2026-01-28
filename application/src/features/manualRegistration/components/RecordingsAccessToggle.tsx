import { Info, Video } from "lucide-react";

interface RecordingsAccessToggleProps {
   grantRecordingsAccess: boolean;
   setGrantRecordingsAccess: (value: boolean) => void;
   isPaidSelected: boolean;
}

export function RecordingsAccessToggle({
   grantRecordingsAccess,
   setGrantRecordingsAccess,
   isPaidSelected,
}: RecordingsAccessToggleProps) {
   return (
      <div
         className={`
            border-2 rounded-xl p-5 transition-all duration-200
            ${grantRecordingsAccess ? "border-purple-300 bg-purple-50" : "border-gray-200 bg-white hover:border-gray-300"}
         `}
      >
         <label className="flex items-start gap-4 cursor-pointer">
            <div className="shrink-0">
               <div
                  className={`
                     flex items-center justify-center rounded-lg w-12 h-12 transition-colors
                     ${grantRecordingsAccess ? "bg-purple-100" : "bg-gray-100"}
                  `}
               >
                  <Video className={`${grantRecordingsAccess ? "text-purple-600" : "text-gray-500"}`} size={24} />
               </div>
            </div>

            <div className="flex-1">
               <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">Dar Acceso a Grabaciones</span>
                  {grantRecordingsAccess && (
                     <span className="bg-purple-100 px-2 py-0.5 rounded-full font-medium text-purple-700 text-xs">Activado</span>
                  )}
               </div>
               <p className="text-gray-600 text-sm leading-relaxed">
                  {grantRecordingsAccess
                     ? "El usuario tendrá acceso a las grabaciones del congreso"
                     : "Habilita esta opción para otorgar acceso a las grabaciones"}
               </p>
               {isPaidSelected && (
                  <div className="flex items-start gap-2 bg-amber-50 mt-3 p-3 border border-amber-200 rounded-lg">
                     <Info size={14} className="mt-0.5 text-amber-600 shrink-0" />
                     <p className="text-amber-800 text-xs leading-relaxed">
                        Para usuarios ya pagados, solo se puede agregar acceso a grabaciones
                     </p>
                  </div>
               )}
            </div>

            <div className="shrink-0">
               <button
                  type="button"
                  onClick={(e) => {
                     e.preventDefault();
                     setGrantRecordingsAccess(!grantRecordingsAccess);
                  }}
                  className={`
                     relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                     ${grantRecordingsAccess ? "bg-purple-600" : "bg-gray-300"}
                  `}
               >
                  <span
                     className={`
                        inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform
                        ${grantRecordingsAccess ? "translate-x-7" : "translate-x-1"}
                     `}
                  />
               </button>
            </div>
         </label>
      </div>
   );
}
