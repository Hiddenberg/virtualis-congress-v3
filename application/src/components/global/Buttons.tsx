"use client";
import { Check, Copy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const baseButtonClassName = `flex items-center justify-center gap-2 w-max rounded-lg px-4 py-2 text-center font-semibold transition-colors disabled:bg-gray-200 disabled:text-gray-500`;
const variantClasses = {
   primary: "bg-yellow-400 hover:bg-amber-400 text-black",
   destructive: "bg-red-500 hover:bg-red-600 text-white",
   green: "bg-green-500 hover:bg-green-600 text-white",
   secondary: `bg-white hover:bg-gray-100 text-black`,
   white: `bg-white hover:bg-gray-100 text-black`,
   dark: "bg-[#222] hover:bg-gray-700 text-white",
   outline: `bg-transparent`,
   text: `bg-transparent text-yellow-400 hover:text-amber-400 disabled:text-gray-200 disabled:hover:text-gray-200`,
   blue: "bg-blue-500 hover:bg-blue-600 text-white",
   purple: "bg-indigo-400/90 hover:bg-indigo-500/90 text-white",
   purpleDark: "bg-indigo-600 hover:bg-indigo-700 text-white",
   amber: "bg-amber-500 hover:bg-amber-600 text-white",
   golden:
      "bg-gradient-to-b from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-600 text-white transition-all duration-500",
   none: "",
};
const loadingClasses = "animate-pulse cursor-not-allowed";

export type ButtonVariant = keyof typeof variantClasses;

interface ButtonProps {
   children: React.ReactNode;
   title?: string;
   className?: string;
   disabled?: boolean;
   variant?: ButtonVariant;
   type?: "button" | "submit" | "reset";
   loading?: boolean;
   onClick?: () => void;
}

export function Button({
   children,
   title,
   className,
   disabled,
   variant = "primary",
   type = "button",
   loading,
   onClick,
}: ButtonProps) {
   return (
      <button
         title={title}
         className={`${baseButtonClassName} ${variantClasses[variant]} ${loading ? loadingClasses : ""} ${className}`}
         onClick={onClick}
         disabled={disabled || loading}
         type={type}
      >
         {children}
      </button>
   );
}

interface LinkButtonProps extends ButtonProps {
   href: string;
   target?: "_blank" | "_self" | "_parent" | "_top";
}
export function LinkButton({
   children,
   className,
   href,
   variant = "primary",
   target,
   title,
   disabled,
}: LinkButtonProps) {
   if (disabled) {
      return (
         <button
            title={title}
            disabled
            className={`${baseButtonClassName} ${variantClasses[variant]} ${className}`}
         >
            {children}
         </button>
      );
   }

   return (
      <Link
         title={title}
         href={href}
         target={target}
         className={`${baseButtonClassName} ${variantClasses[variant]} ${className}`}
      >
         {children}
      </Link>
   );
}

export function CopyButton({ text }: { text: string }) {
   const [isCopied, setIsCopied] = useState(false);

   const handleCopy = () => {
      navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => {
         setIsCopied(false);
      }, 2000);
   };

   return (
      <button
         onClick={handleCopy}
         className="flex justify-center items-center bg-gray-100 hover:bg-gray-200 rounded-full w-7 h-7 hover:scale-105 active:scale-95 transition-all duration-200"
      >
         {isCopied ? (
            <Check strokeWidth={2.5} className="w-4 h-4 text-green-600" />
         ) : (
            <Copy strokeWidth={2.5} className="w-4 h-4 text-gray-600" />
         )}
      </button>
   );
}
