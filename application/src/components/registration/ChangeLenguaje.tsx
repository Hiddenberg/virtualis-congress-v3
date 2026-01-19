import Image from "next/image";
import LogoMexico from "@/assets/bandera-mexico.svg";

export default function ChangeLenguaje() {
   return (
      <div className="flex border rounded-xl h-10">
         <Image src={LogoMexico} alt="" />
         <select className="rounded-xl">
            <option value="es-MX">es-MX</option>
            <option value="en-US">en-US</option>
         </select>
      </div>
   );
}
