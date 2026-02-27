"use client";

import { format } from "@formkit/tempo";
import { Download } from "lucide-react";
import Papa from "papaparse";
import { Button } from "@/components/global/Buttons";
import type { CongressUserRegistrationDetails } from "@/features/manualRegistration/services/manualRegistrationServices";

interface ExportToCsvButtonProps {
   registrationsDetails: CongressUserRegistrationDetails[];
}

export function ExportToCsvButton({ registrationsDetails }: ExportToCsvButtonProps) {
   const handleExport = () => {
      const sorted = [...registrationsDetails].sort((a, b) => {
         const aDate = new Date(a.congressRegistration.created).getTime();
         const bDate = new Date(b.congressRegistration.created).getTime();
         return bDate - aDate;
      });

      const rows = sorted.map((regDetail) => {
         const user = regDetail.user;
         const name = user?.name ?? "—";
         const email = user?.email ?? "—";
         const additionalEmails = [user?.additionalEmail1, user?.additionalEmail2].filter(Boolean).join(", ") || "—";
         const createdAt = new Date(regDetail.congressRegistration.created);
         const createdLabel = format({
            date: createdAt,
            format: "DD/MM/YYYY hh:mm A",
            locale: "es-MX",
            tz: "America/Mexico_City",
         });
         const pago = regDetail.hasPaid ? "Pagado" : "Pendiente";

         return {
            Nombre: name,
            Email: email,
            "Emails Adicionales": additionalEmails,
            Pago: pago,
            "Fecha de Registro": createdLabel,
         };
      });

      const csv = Papa.unparse(rows);
      const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `personas-registradas-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
   };

   return (
      <Button title="Exportar a CSV" onClick={handleExport} disabled={registrationsDetails.length === 0} variant="blue">
         <Download className="size-4" />
         Exportar CSV
      </Button>
   );
}
