interface Congress {
   organization: OrganizationRecord["id"];
   title: string;
   startDate: string;
   finishDate: string;
   status: "active" | "finished";
   modality: "online" | "hybrid";
   showEndOfDayMessage: boolean;
   showClosingConferenceBanner: boolean;
}

type CongressRecord = DBRecordItem<Congress>;
