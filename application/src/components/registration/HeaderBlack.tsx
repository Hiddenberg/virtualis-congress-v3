import Link from "next/link";
import { LogoutButton } from "./AuthHeader";

function HeaderLinks() {
   return (
      <nav className="hidden md:flex items-center gap-4 font-semibold">
         <Link href="/registro">Información</Link>
         <LogoutButton />
         {/* <Link href="/registro#expositores">Expositores</Link> */}
         {/* <Link className="bg- bg-yellow-400 px-4 py-2 rounded-xl text-white transition-colors" href="/">Contacto</Link> */}
      </nav>
   );
}

function HeaderLogo() {
   return (
      <div className="flex justify-center md:justify-start space-x-1 text-xl">
         <h1 className="text-black">
            Virtualis <strong>Congress</strong>
         </h1>
      </div>
   );
}

export default function HeaderBlack() {
   return (
      <div className="flex justify-center md:justify-between items-center mb-4 w-full">
         <HeaderLogo />
         <div className="w-full flex justify-end md:hidden">
            <LogoutButton />
         </div>
         <HeaderLinks />
      </div>
   );
}
