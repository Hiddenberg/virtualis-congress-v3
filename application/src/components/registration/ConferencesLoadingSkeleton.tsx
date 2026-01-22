import { nanoid } from "nanoid";

export default function ConferencesLoadingSkeleton() {
   return (
      <section className="px-4 md:px-10 py-12">
         <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
               <div className="bg-gray-200 mx-auto mb-4 rounded-lg w-80 h-10 animate-pulse" />
               <div className="bg-gray-200 mx-auto mb-8 rounded-lg w-96 h-6 animate-pulse" />

               {/* Day selector skeleton */}
               <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {[...Array(5)].map((_) => (
                     <div key={nanoid()} className="bg-gray-200 rounded-full w-24 h-10 animate-pulse" />
                  ))}
               </div>
            </div>

            <div className="gap-6 grid grid-cols-1 md:grid-cols-2 h-120 overflow-y-auto">
               {[...Array(4)].map((_) => (
                  <div key={nanoid()} className="bg-white shadow-sm p-6 border border-gray-200 rounded-xl">
                     <div className="bg-gray-200 mb-4 rounded-lg w-3/4 h-7 animate-pulse" />
                     <div className="bg-gray-200 mb-2 rounded-lg w-full h-4 animate-pulse" />
                     <div className="bg-gray-200 mb-6 rounded-lg w-4/5 h-4 animate-pulse" />

                     <div className="flex flex-col space-y-4">
                        {/* Time skeleton */}
                        <div className="flex items-center gap-2">
                           <div className="bg-gray-200 rounded-lg w-28 h-10 animate-pulse" />
                        </div>

                        {/* Duration skeleton */}
                        <div className="flex items-center gap-2">
                           <div className="bg-gray-200 rounded-lg w-40 h-6 animate-pulse" />
                        </div>

                        {/* Speakers skeleton */}
                        <div className="flex flex-col gap-2">
                           <div className="bg-gray-200 rounded-lg w-24 h-6 animate-pulse" />
                           <div className="flex flex-wrap gap-1 mt-1">
                              <div className="bg-gray-200 rounded-md w-20 h-6 animate-pulse" />
                              <div className="bg-gray-200 rounded-md w-24 h-6 animate-pulse" />
                              <div className="bg-gray-200 rounded-md w-16 h-6 animate-pulse" />
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
}
