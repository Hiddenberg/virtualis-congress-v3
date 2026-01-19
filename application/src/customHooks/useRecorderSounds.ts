"use client";
import useSound from "use-sound";

async function sleep(ms: number) {
   return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function useRecorderSounds() {
   const [playStartRecorderSound] = useSound("/sounds/start-recording.mp3");
   const [playStopRecorderSound] = useSound("/sounds/recording-off.mp3", {
      sprite: {
         stopSound: [270, 3000],
      },
   });
   const [playTimeNotificationSound] = useSound(
      "/sounds/time-notification.mp3",
   );
   const [playErrorAlertSound] = useSound("/sounds/error-alert.mp3");

   const playInmediateStartRecorderSound = async () => {
      playStartRecorderSound();
      await sleep(150);
      playStartRecorderSound();
   };

   const playDelayedRecorderSounds = async (times: number = 5) => {
      for (let i = 0; i < times; i++) {
         playTimeNotificationSound({
            playbackRate: 1,
         });
         await sleep(1000);
      }
   };

   const playStoppedRecorderSounds = async () => {
      playStopRecorderSound({
         id: "stopSound",
      });
      await sleep(120);
      playStopRecorderSound({
         id: "stopSound",
      });
   };

   const playTimeReminderSounds = async () => {
      playTimeNotificationSound({
         playbackRate: 0.8,
      });
      await sleep(200);
      playTimeNotificationSound({
         playbackRate: 1,
      });
   };

   return {
      playStoppedRecorderSounds,
      playDelayedRecorderSounds,
      playTimeReminderSounds,
      playInmediateStartRecorderSound,
      playErrorAlertSound,
   };
}
