"use client";

import DemoChat from "@/components/partners-demo/conference/regular/DemoChat";
// import { useState } from "react";

// const tabs = ["Cámaras", "Presentación", "Encuestas"] as const;

export default function RightPanel() {
   // const [active, setActive] = useState<typeof tabs[number]("Cámaras");

   return (
      <aside className="bg-white p-4 border border-gray-200 rounded-2xl">
         {/* <div className="flex gap-2">
            {tabs.map((t) => (
               <button
                  key={t}
                  onClick={() => setActive(t)}
                  className={`rounded-full px-4 py-2 text-sm ${active === t ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"}`}
               >
                  {t}
               </button>
            ))}
         </div> */}

         <div className="mb-4">
            <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden">
               <div className="bg-[url('https://res.cloudinary.com/dnx2lg7vb/image/upload/v1759195525/8176c0e4-4e47-4d31-a0aa-78a40fdb404e.webp')] bg-cover bg-center w-full aspect-[4/5]" />
            </div>
         </div>

         <DemoChat />
      </aside>
   );
}
