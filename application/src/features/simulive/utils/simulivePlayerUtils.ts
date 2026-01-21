import { addSecond } from "@formkit/tempo";

export interface SimuliveData {
   startDateTime: string;
   serverTime: string;
   durationSeconds: number;
   speakerPresentationRecording: SimpleRecordingRecord | null;
}

export function getSimuliveVariables(simuliveData: SimuliveData) {
   const serverTimeDate = new Date(simuliveData.serverTime);
   const startDateTimeDate = new Date(simuliveData.startDateTime);

   // Add the duration of the speaker presentation recording to the total duration if it exists
   const speakerPresentationDurationSeconds = simuliveData.speakerPresentationRecording?.durationSeconds ?? 0;
   const totalDurationSeconds = speakerPresentationDurationSeconds + simuliveData.durationSeconds;
   const speakerPresentationEndDate = addSecond(simuliveData.startDateTime, speakerPresentationDurationSeconds);
   const endDateTimeDate = addSecond(simuliveData.startDateTime, totalDurationSeconds);
   const timeVideoShouldStart =
      (serverTimeDate.getTime() - (startDateTimeDate.getTime() + speakerPresentationDurationSeconds * 1000)) / 1000;

   const timeSpeakerPresentationShouldStart = (serverTimeDate.getTime() - startDateTimeDate.getTime()) / 1000;

   return {
      serverTimeDate,
      startDateTimeDate,
      endDateTimeDate,
      timeVideoShouldStart,
      speakerPresentationEndDate,
      timeSpeakerPresentationShouldStart,
   };
}
