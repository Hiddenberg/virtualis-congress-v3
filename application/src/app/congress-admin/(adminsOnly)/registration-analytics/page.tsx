import { ChartBarIcon } from "lucide-react";
import AdminSubPageHeader from "@/components/congress-admin/AdminSubPageHeader";
import CongressRegistrationAnalyticsDashboard from "@/features/analytics/registrationAnalytics/components/CongressRegistrationAnalyticsDashboard";
import { getAllRegistrationAnalyticsByCongressId } from "@/features/analytics/registrationAnalytics/services/registrationAnalyticsServices";
import { getAllCongressRegistrations } from "@/features/congresses/services/congressRegistrationServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";

export default async function RegistrationAnalyticsPage() {
   const congress = await getLatestCongress();
   const allCongressRegistrations = await getAllCongressRegistrations();
   const congressRegistrationAnalytics = await getAllRegistrationAnalyticsByCongressId(congress.id);

   return (
      <div>
         <AdminSubPageHeader
            title="Análiticas de registros al congreso"
            Icon={ChartBarIcon}
            description="Conoce a detalle las estadísticas de registro al congreso"
         />

         <CongressRegistrationAnalyticsDashboard
            congressRegistrationAnalytics={congressRegistrationAnalytics}
            allCongressRegistrations={allCongressRegistrations}
         />
      </div>
   );
}
