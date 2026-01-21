"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const statusBadgeClasses: Record<CongressConference["status"], string> = {
   scheduled: "bg-blue-100 text-blue-700 ring-blue-200",
   active: "bg-green-50 text-green-700 ring-green-200",
   finished: "bg-red-50 text-red-700 ring-red-200",
   canceled: "bg-red-50 text-red-700 ring-red-200",
};

export default function DirectorSidebarList({
   conferences,
   basePath = "/congress-admin/congress-director",
}: {
   conferences: CongressConferenceRecord[];
   basePath?: string;
}) {
   const pathname = usePathname();

   return (
      <div className="space-y-1 mt-4">
         {conferences.map((conf) => {
            const isSelected = pathname.startsWith(`${basePath}/${conf.id}`);
            return (
               <Link key={conf.id} href={`${basePath}/${conf.id}`} className="block">
                  <div
                     className={`${isSelected ? "bg-blue-50 ring-1 ring-blue-200" : "hover:bg-gray-50"} px-2 py-1.5 rounded-md transition-colors`}
                  >
                     <p className="font-medium text-gray-900 text-sm truncate">{conf.title}</p>
                     <div className="flex items-center gap-2 text-gray-600 text-xs">
                        <span className={`px-1.5 py-0.5 rounded-full ring-1 font-medium ${statusBadgeClasses[conf.status]}`}>
                           <span className="capitalize">{conf.status}</span>
                        </span>
                        <span>•</span>
                        <span>
                           {new Date(conf.startTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                           })}
                        </span>
                     </div>
                  </div>
               </Link>
            );
         })}
      </div>
   );
}
