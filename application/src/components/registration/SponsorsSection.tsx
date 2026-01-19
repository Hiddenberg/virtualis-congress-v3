import Image from "next/image";
import Patrocinador1 from "@/assets/Patrocinador1.png";
import Patrocinador2 from "@/assets/Patrocinador2.png";
import Patrocinador3 from "@/assets/Patrocinador3.png";
import Patrocinador4 from "@/assets/Patrocinador4.png";
import Patrocinador5 from "@/assets/Patrocinador5.png";
import Patrocinador6 from "@/assets/Patrocinador6.png";
import Patrocinador7 from "@/assets/Patrocinador7.png";
import Patrocinador8 from "@/assets/Patrocinador8.png";

export default function SponsorsSection() {
   const logos = [
      {
         image: Patrocinador1,
      },
      {
         image: Patrocinador2,
      },
      {
         image: Patrocinador3,
      },
      {
         image: Patrocinador4,
      },
      {
         image: Patrocinador5,
      },
      {
         image: Patrocinador6,
      },
      {
         image: Patrocinador7,
      },
      {
         image: Patrocinador8,
      },
   ];

   return (
      <div>
         <h1 className="pb-5 text-blue-900 text-xl">Patrocinadores</h1>
         <div className="gap-4 grid grid-cols-4">
            {logos.map((logo, index) => (
               <div
                  key={index}
                  className="flex justify-center items-center bg-white p-4 rounded-lg"
               >
                  <Image
                     src={logo.image}
                     alt=""
                     className="w-full max-w-20 h-auto object-contain"
                  />
               </div>
            ))}
         </div>
      </div>
   );
}
