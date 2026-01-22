"use client";

import { useState } from "react";

export default function SubSectionSelector() {
   const [activeButton, setActiveButton] = useState("Mi Programa");

   const buttons = [
      {
         id: "program",
         label: "Mi Programa",
      },
      // { id: 'exhibitors', label: 'Expositores' },
      // { id: 'chat', label: 'Chat Público' },
   ];

   return (
      <div className="flex flex-col">
         <div className="flex space-x-2 p-4">
            {buttons.map((button) => (
               <button
                  type="button"
                  key={button.id}
                  onClick={() => setActiveButton(button.label)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                     activeButton === button.label ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
               >
                  {button.label}
               </button>
            ))}
         </div>
         {/* {activeButton === 'Mi Programa' && } */}
         {/* {activeButton === 'Expositores' && <ExpositorsCarouselSection />}
         {activeButton === 'Chat Público' && <ChatSection />} */}

         {/* <Link href="/commercial-zone" className="inline-flex justify-center items-center bg-white hover:bg-gray-50 mx-auto my-4 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 w-max font-medium text-teal-600 text-xl">
            <Store className="mr-2 size-10" />
            Ir a Zona Comercial
         </Link> */}
      </div>
   );
}
