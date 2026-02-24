import "server-only";

import { getConferenceRecordings } from "@/features/conferences/services/conferenceRecordingsServices";
import {
   getAllCampaignRecordings,
   getAllSimpleRecordingCampaigns,
} from "@/features/simpleRecordings/services/recordingCampaignsServices";
import type { SimpleRecordingRecord } from "@/features/simpleRecordings/types/recordingsTypes";
import type { CongressConferenceRecord } from "../../types/conferenceTypes";
import CampaignRecordingsLinker from "./campaigns/CampaignRecordingsLinker";

export default async function RecordingsManager({ conferenceId }: { conferenceId: CongressConferenceRecord["id"] }) {
   const [linkedRecordings, campaigns] = await Promise.all([
      getConferenceRecordings(conferenceId),
      getAllSimpleRecordingCampaigns(),
   ]);

   const recordingsByCampaign = Object.fromEntries(
      await Promise.all(
         campaigns.map(async (c) => {
            const recs = await getAllCampaignRecordings(c.id);
            return [c.id, recs];
         }),
      ),
   ) as Record<string, SimpleRecordingRecord[]>;

   return (
      <CampaignRecordingsLinker
         conferenceId={conferenceId}
         campaigns={campaigns}
         recordingsByCampaign={recordingsByCampaign}
         initiallyLinkedRecordingId={linkedRecordings[0]?.id}
      />
   );
}
