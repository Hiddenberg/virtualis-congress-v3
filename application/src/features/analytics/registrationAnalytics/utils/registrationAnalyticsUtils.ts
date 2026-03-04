import type { CongressRegistrationRecord } from "@/features/congresses/types/congressRegistrationTypes";
import type { RegistrationAnalyticsRecord } from "../types/registrationAnalyticsTypes";

export const CHART_COLORS = [
   "#0ea5e9", // sky-500
   "#8b5cf6", // violet-500
   "#10b981", // emerald-500
   "#f59e0b", // amber-500
   "#ef4444", // red-500
   "#ec4899", // pink-500
   "#6366f1", // indigo-500
   "#14b8a6", // teal-500
];

export function formatDate(dateStr: string) {
   const d = new Date(dateStr);
   return d.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
}

export function getRegistrationsByDay(registrations: CongressRegistrationRecord[]) {
   const byDay = new Map<string, number>();
   for (const r of registrations) {
      const date = (r as { created?: string }).created;
      if (!date) continue;
      const key = date.slice(0, 10);
      byDay.set(key, (byDay.get(key) ?? 0) + 1);
   }
   const sorted = [...byDay.entries()].sort(([a], [b]) => a.localeCompare(b));
   return sorted.map(([date, count]) => ({
      date: formatDate(date),
      fullDate: date,
      registrations: count,
   }));
}

export function groupByField<T>(items: T[], getKey: (item: T) => string) {
   const map = new Map<string, number>();
   for (const item of items) {
      const key = getKey(item) || "Desconocido";
      map.set(key, (map.get(key) ?? 0) + 1);
   }
   return [...map.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

export function normalizeDeviceType(deviceType?: string) {
   if (!deviceType) return "No especificado";
   const lower = deviceType.toLowerCase();
   if (lower.includes("mobile") || lower.includes("phone")) return "Móvil";
   if (lower.includes("tablet")) return "Tablet";
   if (lower.includes("desktop") || lower.includes("console")) return "Escritorio";
   return deviceType;
}

export function getRegistrationStats(registrations: CongressRegistrationRecord[], analytics: RegistrationAnalyticsRecord[]) {
   const total = registrations.length;
   const regular = registrations.filter((r) => r.registrationType === "regular").length;
   const courtesy = registrations.filter((r) => r.registrationType === "courtesy").length;
   const inPerson = registrations.filter((r) => r.attendanceModality === "in-person").length;
   const virtual = registrations.filter((r) => r.attendanceModality === "virtual").length;
   const withAnalytics = analytics.length;

   return {
      total,
      regular,
      courtesy,
      inPerson,
      virtual,
      withAnalytics,
   };
}
