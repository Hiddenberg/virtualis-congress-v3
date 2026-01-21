"use client";

import { useState } from "react";
import AllSponsorsSection from "./AllSponsorsSection";
import BayerSponsorSection from "./BayerSponsorSection";

const companies = ["Todos", "Bayer", "Pfizer", "Johnson & Johnson", "Roche", "Merck & Co.", "Sanofi", "AstraZeneca", "Novartis"];

export default function SponsorSelector() {
   const [selectedTab, setSelectedTab] = useState("Todos");

   return (
      <div className="flex flex-col">
         <div className="w-full overflow-x-auto mb-2">
            <nav className="flex space-x-4 whitespace-nowrap">
               {companies.map((company) => (
                  <button
                     key={company}
                     onClick={() => setSelectedTab(company)}
                     className={`px-4 py-2 font-medium rounded-lg ${
                        selectedTab === company
                           ? "bg-[#272D29] text-white"
                           : "bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                     }`}
                  >
                     {company}
                  </button>
               ))}
            </nav>
         </div>

         {selectedTab === "Todos" && <AllSponsorsSection />}
         {selectedTab !== "Todos" && <BayerSponsorSection />}
      </div>
   );
}
