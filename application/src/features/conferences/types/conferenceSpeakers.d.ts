interface ConferenceSpeaker {
   organization: OrganizationRecord["id"];
   congress: CongressRecord["id"];
   conference: ConferenceRecord["id"];
   speaker: SpeakerRecord["id"];
}
type ConferenceSpeakerRecord = DBRecordItem<ConferenceSpeaker>;
