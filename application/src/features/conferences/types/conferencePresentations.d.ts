export interface ConferencePresentation {
   organization: OrganizationRecord["id"];
   congress: CongressRecord["id"];
   conference: CongressConferenceRecord["id"];
   presentation: PresentationRecord["id"];
}
