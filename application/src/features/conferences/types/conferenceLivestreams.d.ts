interface ConferenceLivestream {
   organization: OrganizationRecord["id"];
   congress: CongressRecord["id"];
   conference: CongressConferenceRecord["id"];
   livestreamSession: LivestreamSessionRecord["id"];
}
type ConferenceLivestreamRecord = DBRecordItem<ConferenceLivestream>;
