"use client";

import { MailsIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { sendCampaignInvitationsAction } from "@/features/simpleRecordings/serverActions/recordingsActions";

interface SendCampaignInvitesButtonProps {
   campaignId: string;
   pendingCount: number;
}

export default function SendCampaignInvitesButton({ campaignId, pendingCount }: SendCampaignInvitesButtonProps) {
   const [isPending, startTransition] = useTransition();
   const [lastResult, setLastResult] = useState<string | null>(null);

   const onClick = () => {
      if (pendingCount === 0) return;
      const confirmed = window.confirm(`¿Enviar invitaciones a ${pendingCount} grabación(es) pendientes?`);
      if (!confirmed) return;

      startTransition(async () => {
         const res = await sendCampaignInvitationsAction(campaignId);
         if (res.success) {
            setLastResult(`Enviadas ${res.data?.sent} de ${res.data?.total}`);
         } else {
            setLastResult(res.errorMessage ?? "Ocurrió un error al enviar las invitaciones");
         }
      });
   };

   const disabled = isPending || pendingCount === 0;

   return (
      <div className="flex flex-col items-start gap-2">
         <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors border ${disabled ? "bg-gray-100 text-gray-400 border-gray-200" : "bg-blue-600 hover:bg-blue-700 text-white border-blue-700"}`}
            aria-disabled={disabled}
         >
            <MailsIcon className="size-4" />
            {isPending ? "Enviando..." : `Enviar todas las invitaciones (${pendingCount})`}
         </button>
         {lastResult && <span className="text-gray-500 text-xs">{lastResult}</span>}
      </div>
   );
}
