"use client";

import { Menu, X } from "lucide-react";

interface MobileMenuToggleProps {
   isCloseButton?: boolean;
}

export default function MobileMenuToggle({ isCloseButton = false }: MobileMenuToggleProps) {
   const toggleMenu = () => {
      const sidebar = document.getElementById("sidebar");
      if (isCloseButton) {
         sidebar?.classList.add("hidden");
      } else {
         sidebar?.classList.toggle("hidden");
      }
   };

   return (
      <button
         type="button"
         className={`text-indigo-700 ${isCloseButton ? "md:hidden" : ""}`}
         aria-label={isCloseButton ? "Close menu" : "Toggle menu"}
         id={isCloseButton ? undefined : "mobile-menu-toggle"}
         onClick={toggleMenu}
      >
         {isCloseButton ? <X size={24} /> : <Menu size={24} />}
      </button>
   );
}
