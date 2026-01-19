import { Stream } from "@zoom/videosdk";

namespace GroupRecorder {
   interface Participant {
      id: string;
      speakerCode: string;
      displayName: string;
      role: "host" | "manager" | "participant";
   }

   interface ParticipantState extends Participant {
      zoomId: number | null;
      hasJoined: boolean;
      isTalking: boolean;
      isSharingScreen: boolean;
      isSharingVideo: boolean;
      isMuted: boolean;
   }

   /* ------------------ States ------------------ */
   interface ScreenShareState {
      active: boolean;
      userSharing: ParticipantState | null;
      isLocal: boolean;
   }

   interface RecordingState {
      recordingStartTime: Date;
      recordingEndTime: Date;
      isRecordingActive: boolean;
      isRecordingPaused: boolean;
      isRecordingFinished: boolean;
   }

   interface SessionState {
      sessionStatus:
         | "Initializing"
         | "In_Preview"
         | "In_session"
         | "Recording"
         | "Finished";
      sessionName: string;
      inSession: boolean;
      sessionId: string;
      sessionStartTime: Date;

      currentUserId: string | null;

      audioDevices: MediaDeviceInfo[];
      videoDevices: MediaDeviceInfo[];
      speakerDevices: MediaDeviceInfo[];
      videoDeviceSelected: MediaDeviceInfo | null;
      audioDeviceSelected: MediaDeviceInfo | null;
      speakerDeviceSelected: MediaDeviceInfo | null;

      participantStates: ParticipantState[];

      sessionStream: typeof Stream | null;
      connectionState:
         | "Fail"
         | "Reconnecting"
         | "Connected"
         | "Closed"
         | "Not_Connected";
   }

   type AppState =
      | PreviewState
      | ScreenShareState
      | RecordingState
      | SessionState;
}
