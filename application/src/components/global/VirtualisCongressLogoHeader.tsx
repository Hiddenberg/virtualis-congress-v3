import Image from "next/image";

export default function VirtualisCongressLogoHeader() {
   return (
      <div className="flex justify-center items-center p-4 w-full">
         <Image
            src="https://res.cloudinary.com/dnx2lg7vb/image/upload/t_300px/v1741919524/virtualis_congress_logo_qlmh6h.png"
            className="w-52"
            width={2000}
            height={249}
            alt="Virtualis Congress Logo"
         />
      </div>
   );
}
