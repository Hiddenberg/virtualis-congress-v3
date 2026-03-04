import type { CongressRegistrationRecord } from "@/features/congresses/types/congressRegistrationTypes";
import type { RegistrationAnalyticsRecord } from "../types/registrationAnalyticsTypes";

export default function CongressRegistrationAnalyticsDashboard({
   congressRegistrationAnalytics,
   allCongressRegistrations,
}: {
   congressRegistrationAnalytics: RegistrationAnalyticsRecord[];
   allCongressRegistrations: CongressRegistrationRecord[];
}) {
   return <div>CongressRegistrationAnalyticsDashboard</div>;
}
