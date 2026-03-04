"use client";

import { useMemo } from "react";
import type { CongressRegistrationRecord } from "@/features/congresses/types/congressRegistrationTypes";
import type { RegistrationAnalyticsRecord } from "../types/registrationAnalyticsTypes";
import {
   CHART_COLORS,
   getRegistrationStats,
   getRegistrationsByDay,
   groupByField,
   normalizeDeviceType,
} from "../utils/registrationAnalyticsUtils";

interface UseRegistrationAnalyticsDataParams {
   congressRegistrationAnalytics: RegistrationAnalyticsRecord[];
   allCongressRegistrations: CongressRegistrationRecord[];
}

export function useRegistrationAnalyticsData({
   congressRegistrationAnalytics,
   allCongressRegistrations,
}: UseRegistrationAnalyticsDataParams) {
   const stats = useMemo(
      () => getRegistrationStats(allCongressRegistrations, congressRegistrationAnalytics),
      [allCongressRegistrations, congressRegistrationAnalytics],
   );

   const registrationsByDay = useMemo(() => getRegistrationsByDay(allCongressRegistrations), [allCongressRegistrations]);

   const browserData = useMemo(
      () => groupByField(congressRegistrationAnalytics, (a) => a.browser ?? ""),
      [congressRegistrationAnalytics],
   );

   const deviceData = useMemo(
      () => groupByField(congressRegistrationAnalytics, (a) => normalizeDeviceType(a.deviceType)),
      [congressRegistrationAnalytics],
   );

   const osData = useMemo(() => groupByField(congressRegistrationAnalytics, (a) => a.os ?? ""), [congressRegistrationAnalytics]);

   const countryData = useMemo(
      () => groupByField(congressRegistrationAnalytics, (a) => a.country ?? "").slice(0, 10),
      [congressRegistrationAnalytics],
   );

   const cityData = useMemo(
      () => groupByField(congressRegistrationAnalytics, (a) => a.city ?? "").slice(0, 10),
      [congressRegistrationAnalytics],
   );

   const attendanceData = useMemo(
      () =>
         [
            { name: "Presencial", value: stats.inPerson, fill: CHART_COLORS[0] },
            { name: "Virtual", value: stats.virtual, fill: CHART_COLORS[1] },
            {
               name: "Sin especificar",
               value: stats.total - stats.inPerson - stats.virtual,
               fill: "#9ca3af",
            },
         ].filter((d) => d.value > 0),
      [stats.inPerson, stats.virtual, stats.total],
   );

   const hasData = allCongressRegistrations.length > 0;

   return {
      stats,
      registrationsByDay,
      browserData,
      deviceData,
      osData,
      countryData,
      cityData,
      attendanceData,
      hasData,
   };
}
