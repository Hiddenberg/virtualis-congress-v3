import { getConferencesStatus } from "@/features/conferences/services/conferenceServices";

export default async function ConferencesStatusBar() {
   const {
      pendingConferences,
      pendingPresentations,
      totalConferences,
      totalPresentations,
      recordedConferences,
      recordedPresentations,
   } = await getConferencesStatus();

   return (
      <div className="top-0 z-10 sticky bg-blue-50 shadow-md mb-6 border border-blue-100 rounded-xl w-full overflow-hidden">
         <div className="flex py-4 w-full">
            {/* Conferences Section */}
            <div className="flex-1 px-6 border-r border-blue-100">
               <div className="text-center">
                  <h3 className="mb-3 font-semibold text-blue-700 text-lg">
                     Conferencias
                  </h3>
                  <div className="flex justify-around">
                     <StatItem
                        value={totalConferences}
                        label="Total"
                        bgColor="bg-blue-100"
                        textColor="text-blue-700"
                     />
                     <StatItem
                        value={pendingConferences}
                        label="Pendiente"
                        bgColor="bg-amber-50"
                        textColor="text-amber-600"
                     />
                     <StatItem
                        value={recordedConferences}
                        label="Grabado"
                        bgColor="bg-green-50"
                        textColor="text-green-700"
                     />
                  </div>
               </div>
            </div>

            {/* Presentations Section */}
            <div className="flex-1 px-6">
               <div className="text-center">
                  <h3 className="mb-3 font-semibold text-purple-700 text-lg">
                     Presentaciones
                  </h3>
                  <div className="flex justify-around">
                     <StatItem
                        value={totalPresentations}
                        label="Total"
                        bgColor="bg-purple-100"
                        textColor="text-purple-700"
                     />
                     <StatItem
                        value={pendingPresentations}
                        label="Pendiente"
                        bgColor="bg-amber-50"
                        textColor="text-amber-600"
                     />
                     <StatItem
                        value={recordedPresentations}
                        label="Grabado"
                        bgColor="bg-green-50"
                        textColor="text-green-700"
                     />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

type StatItemProps = {
   value: number;
   label: string;
   bgColor: string;
   textColor: string;
};

function StatItem({ value, label, bgColor, textColor }: StatItemProps) {
   return (
      <div
         className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg ${bgColor} shadow-sm`}
      >
         <span className={`text-2xl font-bold ${textColor}`}>{value}</span>
         <span className="font-medium text-gray-600 text-xs">{label}</span>
      </div>
   );
}
