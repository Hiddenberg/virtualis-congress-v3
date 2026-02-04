"use client";

export default function ProjectionScreenCallInterface({
   initialUsername,
   className,
}: {
   initialUsername: string;
   className: string;
}) {
   return (
      <div className={className}>
         <div className="flex items-center gap-2">
            <div className="bg-gray-200 rounded-full w-10 h-10"></div>
            <div className="font-medium text-lg">{initialUsername}</div>
         </div>
      </div>
   );
}
