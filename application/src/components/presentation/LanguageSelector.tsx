"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const languages = [
   {
      code: "es-MX",
      language: "Español",
      region: "Hispanoamérica",
      welcome: "Bienvenido",
      url: "/presentation/es-MX",
   },
   {
      code: "en-US",
      language: "English",
      region: "United States / Canada",
      welcome: "Welcome",
      url: "/presentation/en-US",
   },
   {
      code: "pt-BR",
      language: "Português",
      region: "Brasil",
      welcome: "Bem-vindo",
      url: "/presentation/pt-BR",
   },
];

export default function LanguageSelect() {
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const [selectedLanguage, _setSelectedLanguage] = useState<string | null>(null);
   const [hoveredLanguage, setHoveredLanguage] = useState<string | null>(null);

   return (
      <div className="mx-auto w-full max-w-2xl text-center">
         <div className="space-y-4">
            <h2 className="mb-8 h-20 font-light text-white/80 text-xl">
               {hoveredLanguage
                  ? languages.find((l) => l.code === hoveredLanguage)?.welcome
                  : selectedLanguage
                    ? languages.find((l) => l.code === selectedLanguage)?.welcome
                    : "Selecciona el lenguaje / Select your language / Selecione o idioma"}
            </h2>

            <div className="flex flex-col gap-4">
               {languages.map((lang) => (
                  <Link
                     key={lang.code}
                     href={lang.url}
                     onMouseEnter={() => setHoveredLanguage(lang.code)}
                     onMouseLeave={() => setHoveredLanguage(null)}
                     className={`
                  group relative w-full py-6 px-8 rounded-xl transition-all duration-300
                  ${selectedLanguage === lang.code ? "bg-white text-[#1C1C1C]" : "bg-transparent text-white/90 hover:bg-white/10"}
                  border border-white/20 hover:border-white/40
                `}
                  >
                     <div className="flex justify-between items-center">
                        <div className="flex items-center">
                           {/* <div className="mr-4 rounded-full w-10 h-10 overflow-hidden">
                              <img
                                 src={`/placeholder.svg?height=40&width=40&text=${lang.code}`}
                                 alt={`${lang.language} flag`}
                                 className="w-full h-full object-cover"
                              />
                           </div> */}
                           <div className="text-left">
                              <span className="block font-medium text-xl">{lang.language}</span>
                              <span
                                 className={`text-sm ${selectedLanguage === lang.code ? "text-[#1C1C1C]/70" : "text-white/60"}`}
                              >
                                 {lang.region}
                              </span>
                           </div>
                        </div>
                        <ArrowRight
                           className={`
                      h-5 w-5 transform transition-transform duration-300
                      ${selectedLanguage === lang.code ? "translate-x-0" : "-translate-x-4 opacity-0"}
                      ${hoveredLanguage === lang.code ? "translate-x-0 opacity-100" : ""}
                    `}
                        />
                     </div>
                  </Link>
               ))}
            </div>
         </div>

         {selectedLanguage && (
            <div className="opacity-0 mt-12 animate-fade-in">
               <button
                  type="button"
                  className="inline-flex items-center bg-white hover:bg-white/90 px-8 py-3 rounded-full font-medium text-[#1C1C1C] transition-colors duration-200"
               >
                  Continue
                  <ArrowRight className="ml-2 w-4 h-4" />
               </button>
            </div>
         )}
      </div>
   );
}
