"use client";

import type { CongressRegistrationRecord } from "@/features/congresses/types/congressRegistrationTypes";
import { useRegistrationAnalyticsData } from "../hooks/useRegistrationAnalyticsData";
import type { RegistrationAnalyticsRecord } from "../types/registrationAnalyticsTypes";
import ChartCard from "./ChartCard";
import CountriesBarChart from "./CountriesBarChart";
import DistributionPieChart from "./DistributionPieChart";
import EmptyState from "./EmptyState";
import RegistrationsByDayChart from "./RegistrationsByDayChart";

interface CongressRegistrationAnalyticsDashboardProps {
   congressRegistrationAnalytics: RegistrationAnalyticsRecord[];
   allCongressRegistrations: CongressRegistrationRecord[];
}

export default function CongressRegistrationAnalyticsDashboard({
   congressRegistrationAnalytics,
   allCongressRegistrations,
}: CongressRegistrationAnalyticsDashboardProps) {
   const { stats, registrationsByDay, browserData, deviceData, osData, countryData, cityData, hasData } =
      useRegistrationAnalyticsData({
         congressRegistrationAnalytics,
         allCongressRegistrations,
      });

   return (
      <div className="space-y-8">
         {/* <RegistrationStatsGrid
            total={stats.total}
            regular={stats.regular}
            courtesy={stats.courtesy}
            withAnalytics={stats.withAnalytics}
         /> */}

         {!hasData ? (
            <EmptyState />
         ) : (
            <div className="gap-6 grid grid-cols-1 lg:grid-cols-2">
               <ChartCard
                  title="Registros por día"
                  description="Evolución de inscripciones al congreso"
                  className="lg:col-span-2"
               >
                  <RegistrationsByDayChart data={registrationsByDay} />
               </ChartCard>

               {browserData.length > 0 && (
                  <ChartCard title="Navegadores" description="Distribución de navegadores utilizados al registrarse">
                     <DistributionPieChart data={browserData} totalCount={stats.withAnalytics} />
                  </ChartCard>
               )}

               {deviceData.length > 0 && (
                  <ChartCard title="Tipo de dispositivo" description="Dispositivos usados durante el registro">
                     <DistributionPieChart data={deviceData} totalCount={stats.withAnalytics} />
                  </ChartCard>
               )}

               {osData.length > 0 && (
                  <ChartCard title="Sistemas operativos" description="SO detectados en los dispositivos">
                     <DistributionPieChart data={osData} totalCount={stats.withAnalytics} />
                  </ChartCard>
               )}

               {cityData.length > 0 && (
                  <ChartCard
                     title="Ciudades de origen"
                     description="Top 10 ciudades desde donde se registraron los usuarios"
                     className="lg:col-span-2"
                  >
                     <CountriesBarChart data={cityData} totalCount={stats.withAnalytics} barColor="#0ea5e9" />
                  </ChartCard>
               )}

               {countryData.length > 0 && (
                  <ChartCard
                     title="Países de origen"
                     description="Top 10 países desde donde se registraron los usuarios"
                     className="lg:col-span-2"
                  >
                     <CountriesBarChart data={countryData} totalCount={stats.withAnalytics} />
                  </ChartCard>
               )}
            </div>
         )}
      </div>
   );
}
