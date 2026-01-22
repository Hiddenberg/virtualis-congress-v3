"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { nanoid } from "nanoid";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export interface CarouselSponsor {
   name: string;
   logoURL: string;
   url?: string;
   background: "dark" | "light";
}

export default function SponsorCarousel({
   sponsors,
   title,
   sponsorsPerPage = 3,
}: {
   sponsors: CarouselSponsor[];
   title?: string;
   sponsorsPerPage?: number;
}) {
   const [currentPage, setCurrentPage] = useState(0);
   const [isAnimating, setIsAnimating] = useState(false);
   const totalPages = Math.ceil(sponsors.length / sponsorsPerPage);

   const nextPage = useCallback(() => {
      setIsAnimating(true);
      setTimeout(() => {
         setCurrentPage((prev) => (prev + 1) % totalPages);
         setIsAnimating(false);
      }, 300); // Match this with the CSS transition duration
   }, [totalPages]);

   const prevPage = useCallback(() => {
      setIsAnimating(true);
      setTimeout(() => {
         setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
         setIsAnimating(false);
      }, 300); // Match this with the CSS transition duration
   }, [totalPages]);

   useEffect(() => {
      const interval = setInterval(() => {
         nextPage();
      }, 10000);

      return () => clearInterval(interval);
   }, [nextPage]);

   const currentSponsors = sponsors.slice(currentPage * sponsorsPerPage, (currentPage + 1) * sponsorsPerPage);

   return (
      <div className="bg-gray-100 mx-auto px-4 py-3 rounded-xl w-full">
         {title && <h2 className={`text-2xl font-bold text-center mb-6 transition-opacity duration-300`}>{title}</h2>}
         <div className="relative">
            <div className="flex justify-between items-center">
               <button
                  type="button"
                  onClick={prevPage}
                  className="top-1/2 left-0 z-10 absolute bg-white hover:bg-gray-100 shadow-md p-2 rounded-full transition-colors -translate-y-1/2 transform"
               >
                  <ChevronLeft className="size-6 text-gray-600" />
               </button>
               <div className="flex justify-center items-center space-x-10 w-full overflow-hidden">
                  {currentSponsors.map((sponsor, index) => (
                     <Link
                        key={`${sponsor.name}-${index}`}
                        href={sponsor.url || "#"}
                        target={sponsor.url ? "_blank" : undefined}
                        className={`size-36 ${sponsor.background === "dark" ? "bg-gray-800" : "bg-white"} ${sponsor.url ? "cursor-pointer" : "cursor-default pointer-events-none"} rounded-lg shadow-md flex items-center justify-center p-4 transition-all duration-300 ${
                           isAnimating ? "opacity-0 transform translate-x-full" : "opacity-100 transform translate-x-0"
                        }`}
                     >
                        <Image
                           src={sponsor.logoURL}
                           alt={sponsor.name}
                           width={120}
                           height={60}
                           className="max-w-full max-h-full object-contain"
                        />
                     </Link>
                  ))}
               </div>
               <button
                  type="button"
                  onClick={nextPage}
                  className="top-1/2 right-0 z-10 absolute bg-white hover:bg-gray-100 shadow-md p-2 rounded-full transition-colors -translate-y-1/2 transform"
               >
                  <ChevronRight className="size-6 text-gray-600" />
               </button>
            </div>
         </div>
         <div className="flex justify-center space-x-2 mt-6">
            {[...Array(totalPages)].map((_, index) => (
               <div key={nanoid()} className={`size-2 rounded-full ${index === currentPage ? "bg-blue-500" : "bg-gray-300"}`} />
            ))}
         </div>
      </div>
   );
}
