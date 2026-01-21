import type { Metadata } from "next";
import Image from "next/image";
import VirtualisLogo from "@/assets/virtualisLogo.svg";

function RecordingsHeader() {
   return (
      <div className="flex justify-center items-center py-3">
         <div className="flex items-end gap-2 select-none">
            <Image src={VirtualisLogo} className="w-32" alt="Virtualis Logo" />
            <span className="block font-light text-2xl leading-none">Recordings</span>
         </div>
      </div>
   );
}

export const metadata: Metadata = {
   title: "Virtualis Recordings",
   description: "Recordings",
};

export default function RecordingsLayout({ children }: { children: React.ReactNode }) {
   return (
      <div className="mx-auto max-w-screen-2xl min-h-dvh">
         <RecordingsHeader />
         {children}
      </div>
   );
}
