interface Presentation {
   organization: OrganizationRecord["id"];
   name: string;
   file: File | string;
   hasVideo: boolean;
}

type PresentationRecord = DBRecordItem<Presentation>;

interface PresentationSlide {
   organization: OrganizationRecord["id"];
   presentation: PresentationRecord["id"];
   slideIndex: number;
   image: File | string;
}
type PresentationSlideRecord = DBRecordItem<PresentationSlide>;
