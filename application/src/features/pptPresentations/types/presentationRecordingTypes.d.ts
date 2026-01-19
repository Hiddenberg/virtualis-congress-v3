interface PresentationRecordingSlideChange {
   slideIndex: number;
   timestamp: number;
}

interface PresentationDrawingEventLine {
   x1: number;
   y1: number;
   x2: number;
   y2: number;
}

type PresentationDrawingEventType = "add" | "clear";

interface PresentationDrawingEvent {
   type: PresentationDrawingEventType;
   slideIndex: number;
   timestamp: number;
   line?: PresentationDrawingEventLine;
}

interface PresentationRecording {
   organization: OrganizationRecord["id"];
   presentation: PresentationRecord["id"];
   slideChanges: PresentationRecordingSlideChange[];
   drawingEvents?: PresentationDrawingEvent[];
}
type PresentationRecordingRecord = DBRecordItem<PresentationRecording>;
