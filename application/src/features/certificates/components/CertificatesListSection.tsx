"use client";

import Image from "next/image";

const mockCertificateUrls = [
   "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1744506500/7008cfcc-eaab-4a55-ba80-4d8244f2cd02.png",
   "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1744506485/71d096be-755d-425f-b661-c209c04a8c6a.png",
   "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1744506465/e9c1e880-f947-49f3-bbdd-210fa0a2ccc6.png",
   "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1744506450/1eaf0fc8-154b-469d-9d0b-0eea6928ad6d.png",
   "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1744506436/f0268854-fc7b-4669-a97e-51ebd3211346.png",
   "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1744506421/5de8521b-cf36-4b0f-a4d3-570dfb63acb7.png",
];

export default function CertificatesListSection() {
   return (
      <div className="opacity-70 mt-8">
         <p className="mb-4 font-bold text-xl">Tus Próximos Certificados Podrían Verse Así</p>

         <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`}>
            {mockCertificateUrls.map((imgUrl) => (
               <div key={imgUrl} className="block select-none">
                  <Image src={imgUrl} alt="Certificate" width={842} height={596} className="rounded-lg" />
               </div>
            ))}
         </div>
      </div>
   );
}
