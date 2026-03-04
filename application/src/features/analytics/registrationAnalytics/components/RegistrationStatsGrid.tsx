import { BarChart3, Monitor, Users } from "lucide-react";
import StatCard from "./StatCard";

interface RegistrationStatsGridProps {
   total: number;
   regular: number;
   courtesy: number;
   withAnalytics: number;
}

export default function RegistrationStatsGrid({ total, regular, courtesy, withAnalytics }: RegistrationStatsGridProps) {
   return (
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
         <StatCard title="Total registrados" value={total} icon={Users} color="bg-blue-50 text-blue-600" />
         <StatCard title="Registro regular" value={regular} icon={BarChart3} color="bg-emerald-50 text-emerald-600" />
         <StatCard title="Cortesía" value={courtesy} icon={Users} color="bg-violet-50 text-violet-600" />
         <StatCard title="Con datos de analytics" value={withAnalytics} icon={Monitor} color="bg-amber-50 text-amber-600" />
      </div>
   );
}
