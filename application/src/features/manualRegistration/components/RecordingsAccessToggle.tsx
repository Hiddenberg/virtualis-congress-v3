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
      <div>
         <label className="flex items-start gap-3 cursor-pointer">
            <input
               type="checkbox"
               checked={grantRecordingsAccess}
               onChange={(e) => setGrantRecordingsAccess(e.target.checked)}
               className="mt-1 border-gray-300 rounded focus:ring-blue-500 w-4 h-4 text-blue-600"
            />
            <div>
               <span className="font-medium text-gray-700 text-sm">Otorgar acceso a grabaciones</span>
               {isPaidSelected && (
                  <p className="mt-1 text-gray-600 text-xs">
                     Para usuarios ya pagados, solo se puede agregar acceso a grabaciones
                  </p>
               )}
            </div>
         </label>
      </div>
   );
}
