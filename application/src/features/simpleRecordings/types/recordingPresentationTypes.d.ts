interface RecordingPresentation {
   organization: OrganizationRecord["id"];
   recording: SimpleRecordingRecord["id"];
   presentation: PresentationRecord["id"];
}
type RecordingPresentationRecord = DBRecordItem<RecordingPresentation>;
