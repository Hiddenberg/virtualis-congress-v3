interface CongressConference {
   organization: (Organization & RecordModel)["id"];
   congress: (Congress & RecordModel)["id"];
   title: string;
   shortDescription?: string;
   startTime: string;
   endTime: string;
   conferenceType:
      | "in-person"
      | "livestream"
      | "pre-recorded"
      | "simulated_livestream"
      | "break";
   status: "scheduled" | "active" | "finished" | "canceled";
}
type CongressConferenceRecord = DBRecordItem<CongressConference>;
