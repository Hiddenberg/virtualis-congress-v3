/* eslint-disable @next/next/no-img-element */

const COLORS_MAP = {
   green: "shadow-green-200 shadow-lg border-2 border-green-500",
   blue: "shadow-blue-200 shadow-lg border-2 border-blue-500",
   red: "shadow-red-200 shadow-lg border-2 border-red-500",
   yellow: "shadow-yellow-200 shadow-lg border-2 border-yellow-500",
   purple: "shadow-purple-200 shadow-lg border-2 border-purple-500",
   orange: "shadow-orange-200 shadow-lg border-2 border-orange-500",
   pink: "shadow-pink-200 shadow-lg border-2 border-pink-500",
};

export default function MainStage({ color }: { color: keyof typeof COLORS_MAP }) {
   return (
      <div className={`relative ${COLORS_MAP[color]} rounded-2xl aspect-video overflow-hidden`}>
         <div className="inline-flex top-4 left-4 z-10 absolute items-center gap-2 shadow px-3 py-1 rounded-full font-medium text-emerald-700 text-xs">
            <span className="place-items-center grid w-2 h-2">
               <span className="bg-emerald-500 rounded-full w-2 h-2 animate-pulse" />
            </span>
            En vivo
         </div>
         <img
            src="https://res.cloudinary.com/dnx2lg7vb/image/upload/v1759259449/29ae80ce-6afd-4576-8486-a45446d74969.webp"
            alt="Main stage"
            className="w-full h-full object-cover aspect-video"
         />
      </div>
   );
}
