"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/global/Buttons";
import { deleteRecordingsCampaign } from "../serverActions/recordingsSyncActions";

export default function DeleteRecordingsCampagin() {
   const [campaignId, setCampaignId] = useState("");
   const [isDeleting, startTransition] = useTransition();

   const handleDelete = () => {
      startTransition(async () => {
         const response = await deleteRecordingsCampaign(campaignId);
         if (!response.success) {
            toast.error(response.errorMessage);
         } else {
            toast.success("Campaign deleted successfully");
         }
      });
   };

   return (
      <div className="flex flex-col gap-2">
         <h1>Delete Recordings Campagin</h1>

         <input
            type="text"
            placeholder="Campaign ID"
            value={campaignId}
            className="p-2 border border-gray-300 rounded-md"
            onChange={(e) => setCampaignId(e.target.value)}
         />
         <Button loading={isDeleting} onClick={handleDelete}>
            Delete
         </Button>
      </div>
   );
}
