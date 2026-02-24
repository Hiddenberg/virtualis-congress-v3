"use client";

import { format } from "@formkit/tempo";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import type { CongressConference, CongressConferenceRecord } from "@/features/conferences/types/conferenceTypes";

const statusBadgeClasses: Record<CongressConference["status"], string> = {
   scheduled: "bg-blue-100 text-blue-700 ring-blue-200",
   active: "bg-green-50 text-green-700 ring-green-200",
   finished: "bg-red-50 text-red-700 ring-red-200",
   canceled: "bg-red-50 text-red-700 ring-red-200",
};

interface DateGroup {
   date: string;
   label: string;
   conferences: CongressConferenceRecord[];
   isToday: boolean;
   isTomorrow: boolean;
}

function groupConferencesByDate(conferences: CongressConferenceRecord[]): DateGroup[] {
   const today = new Date();
   const todayDate = format({
      date: today,
      format: "YYYY-MM-DD",
      tz: "America/Mexico_City",
      locale: "es-MX",
   });

   const tomorrow = new Date(today);
   tomorrow.setDate(tomorrow.getDate() + 1);
   const tomorrowDate = format({
      date: tomorrow,
      format: "YYYY-MM-DD",
      tz: "America/Mexico_City",
      locale: "es-MX",
   });

   const grouped = new Map<string, CongressConferenceRecord[]>();

   for (const conf of conferences) {
      const confDate = format({
         date: conf.startTime,
         format: "YYYY-MM-DD",
         tz: "America/Mexico_City",
         locale: "es-MX",
      });
      if (!grouped.has(confDate)) {
         grouped.set(confDate, []);
      }
      grouped.get(confDate)?.push(conf);
   }

   const sortedDates = Array.from(grouped.keys()).sort();

   return sortedDates.map((date) => {
      const isToday = date === todayDate;
      const isTomorrow = date === tomorrowDate;

      let label: string;
      if (isToday) {
         label = "Hoy";
      } else if (isTomorrow) {
         label = "Mañana";
      } else {
         // biome-ignore lint/style/useTemplate: false positive
         const dateObj = new Date(date + "T00:00:00");
         label = format({
            date: dateObj,
            format: "ddd D MMM",
            tz: "America/Mexico_City",
            locale: "es-MX",
         });
      }

      return {
         date,
         label,
         conferences: grouped.get(date) || [],
         isToday,
         isTomorrow,
      };
   });
}

function ConferenceItem({
   conf,
   basePath,
   isSelected,
}: {
   conf: CongressConferenceRecord;
   basePath: string;
   isSelected: boolean;
}) {
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
                  {format({
                     date: conf.startTime,
                     format: "h:mm A",
                     tz: "America/Mexico_City",
                     locale: "es-MX",
                  })}
               </span>
            </div>
         </div>
      </Link>
   );
}

export default function DirectorSidebarList({
   conferences,
   basePath = "/congress-admin/congress-director",
}: {
   conferences: CongressConferenceRecord[];
   basePath?: string;
}) {
   const pathname = usePathname();
   const [showFinished, setShowFinished] = useState(false);

   const { filteredConferences, dateGroups, defaultTab } = useMemo(() => {
      const filtered = showFinished
         ? conferences
         : conferences.filter((conf) => conf.status !== "finished" && conf.status !== "canceled");

      const groups = groupConferencesByDate(filtered);

      const today = new Date();
      const todayDate = format({
         date: today,
         format: "YYYY-MM-DD",
         tz: "America/Mexico_City",
         locale: "es-MX",
      });

      let defaultTabValue = "todas";

      const todayGroup = groups.find((g) => g.isToday);
      if (todayGroup && todayGroup.conferences.length > 0) {
         defaultTabValue = todayGroup.date;
      } else if (groups.length > 0) {
         const futureDates = groups.filter((g) => g.date >= todayDate);
         if (futureDates.length > 0) {
            defaultTabValue = futureDates[0].date;
         } else {
            defaultTabValue = groups[groups.length - 1].date;
         }
      }

      return {
         filteredConferences: filtered,
         dateGroups: groups,
         defaultTab: defaultTabValue,
      };
   }, [conferences, showFinished]);

   const [activeTab, setActiveTab] = useState(defaultTab);

   const visibleDateTabs = useMemo(() => {
      const today = new Date();
      const todayDate = format({
         date: today,
         format: "YYYY-MM-DD",
         tz: "America/Mexico_City",
         locale: "es-MX",
      });

      const closestDates = dateGroups.filter((g) => g.date >= todayDate).slice(0, 3);

      if (closestDates.length === 0 && dateGroups.length > 0) {
         return dateGroups.slice(-2);
      }

      return closestDates;
   }, [dateGroups]);

   const activeConferences = useMemo(() => {
      if (activeTab === "todas") {
         return filteredConferences;
      }
      return dateGroups.find((g) => g.date === activeTab)?.conferences || [];
   }, [activeTab, filteredConferences, dateGroups]);

   const finishedCount = useMemo(() => {
      return conferences.filter((c) => c.status === "finished" || c.status === "canceled").length;
   }, [conferences]);

   return (
      <div>
         <div className="flex justify-between items-center mt-3 mb-2">
            <div className="flex flex-wrap gap-1">
               {visibleDateTabs.map((group) => (
                  <button
                     key={group.date}
                     type="button"
                     onClick={() => setActiveTab(group.date)}
                     className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                        activeTab === group.date
                           ? "bg-blue-100 text-blue-700 ring-1 ring-blue-200"
                           : "text-gray-600 hover:bg-gray-100"
                     }`}
                  >
                     {group.label} ({group.conferences.length})
                  </button>
               ))}
               <button
                  type="button"
                  onClick={() => setActiveTab("todas")}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                     activeTab === "todas" ? "bg-blue-100 text-blue-700 ring-1 ring-blue-200" : "text-gray-600 hover:bg-gray-100"
                  }`}
               >
                  Todas ({filteredConferences.length})
               </button>
            </div>

            {finishedCount > 0 && (
               <button
                  type="button"
                  onClick={() => setShowFinished(!showFinished)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  title={showFinished ? "Ocultar terminadas" : "Mostrar terminadas"}
               >
                  {showFinished ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
               </button>
            )}
         </div>

         <div className="space-y-1 max-h-[calc(100vh-400px)] overflow-y-auto">
            {activeConferences.length === 0 ? (
               <p className="py-4 text-gray-500 text-sm text-center">
                  No hay conferencias {activeTab !== "todas" && "para este día"}
               </p>
            ) : (
               activeConferences.map((conf) => {
                  const isSelected = pathname.startsWith(`${basePath}/${conf.id}`);
                  return <ConferenceItem key={conf.id} conf={conf} basePath={basePath} isSelected={isSelected} />;
               })
            )}
         </div>
      </div>
   );
}
