interface RealtimePresentationState {
   organization: OrganizationRecord["id"];
   presentation: PresentationRecord["id"];
   currentSlideIndex: number;
   isHidden: boolean;
   userControlling?: UserRecord["id"];
}

type RealtimePresentationStateRecord = DBRecordItem<RealtimePresentationState>;
