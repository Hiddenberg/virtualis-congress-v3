interface ConferenceRecording {
   organization: OrganizationRecord["id"];
   congress: CongressRecord["id"];
   conference: CongressConferenceRecord["id"];
   recording: SimpleRecordingRecord["id"];
}
type ConferenceRecordingRecord = DBRecordItem<ConferenceRecording>;
