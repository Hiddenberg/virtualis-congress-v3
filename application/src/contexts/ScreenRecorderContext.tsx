/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { UpChunk } from "@mux/upchunk";
import { useParams, useSearchParams } from "next/navigation";
import {
   createContext,
   useCallback,
   useEffect,
   useRef,
   useState,
   useTransition,
} from "react";
import {
   completeUploadAction,
   createMuxUploadUrlAction,
} from "@/actions/muxActions";
import {
   addPerformanceMetricsToRecordingAction,
   updateRecordingStatusAction,
} from "@/actions/recordingActions";
import { createVideoAssetAction } from "@/actions/videoAssetActions";
import useRecorderSounds from "@/customHooks/useRecorderSounds";
import { deleteAllVideoAssetsForRecordingAction } from "@/features/conferences/actions/conferenceActions";
import {
   completeRecordingUploadAction,
   updateRecordingAction,
} from "@/features/simpleRecordings/serverActions/recordingsActions";
import {
   checkBrowserCompatibility,
   initializePerformanceMetrics,
   logPerformanceEvent,
   type PerformanceMetrics,
} from "@/utils/performanceMetrics";

type RecorderState =
   | "settingUp"
   | "testRecording"
   | "readyToRecord"
   | "recording"
   | "paused"
   | "stopped"
   | "uploading"
   | "uploaded";

function useScreenRecorderContext({
   isPresentation,
   isSimpleRecording,
}: {
   isPresentation: boolean;
   isSimpleRecording?: boolean;
}) {
   const [recorderState, setRecorderState] =
      useState<RecorderState>("settingUp");
   const [secondsRecorded, setSecondsRecorded] = useState(0);

   const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
   const [audioDeviceSelected, setAudioDeviceSelected] =
      useState<MediaDeviceInfo | null>(null);

   const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
   const [videoDeviceSelected, setVideoDeviceSelected] =
      useState<MediaDeviceInfo | null>(null);

   const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

   // Add permission tracking states
   const [micPermission, setMicPermission] = useState<
      "prompt" | "granted" | "denied"
   >("prompt");
   const [cameraPermission, setCameraPermission] = useState<
      "prompt" | "granted" | "denied"
   >("prompt");
   const [permissionError, setPermissionError] = useState<string | null>(null);

   const [screenStream, setScreenStream] = useState<MediaStream | null>(null);

   const [cameraVideoUrl, setCameraVideoUrl] = useState<string | null>(null);
   const [screenVideoUrl, setScreenVideoUrl] = useState<string | null>(null);

   const cameraRecorderRef = useRef<MediaRecorder | null>(null);
   const screenRecorderRef = useRef<MediaRecorder | null>(null);

   const cameraChunksRef = useRef<BlobPart[]>([]);
   const screenChunksRef = useRef<BlobPart[]>([]);

   const cameraVideoRef = useRef<HTMLVideoElement | null>(null);
   const screenVideoRef = useRef<HTMLVideoElement | null>(null);

   const [cameraBlob, setCameraBlob] = useState<Blob | null>(null);
   const [screenBlob, setScreenBlob] = useState<Blob | null>(null);

   const [isUploadingToMux, startTransition] = useTransition();
   const [cameraUploadProgress, setCameraUploadProgress] = useState(0);
   const [screenUploadProgress, setScreenUploadProgress] = useState(0);
   const [isCameraUploadCompleted, setIsCameraUploadCompleted] =
      useState(false);
   const [isScreenUploadCompleted, setIsScreenUploadCompleted] =
      useState(false);

   // Use refs to track upload state to avoid closure issues
   const cameraUploadCompletedRef = useRef(false);
   const screenUploadCompletedRef = useRef(false);

   const { recordingId } = useParams();
   const language = useSearchParams().get("language");

   const {
      playInmediateStartRecorderSound,
      playStoppedRecorderSounds,
      playDelayedRecorderSounds,
      playTimeReminderSounds,
      playErrorAlertSound,
   } = useRecorderSounds();

   const [isDelayedRecordingStarted, setIsDelayedRecordingStarted] =
      useState(false);
   const timeNotificationIntervalRef = useRef<NodeJS.Timeout | null>(null);

   // Add performance monitoring
   const [performanceMetrics, setPerformanceMetrics] =
      useState<PerformanceMetrics>(initializePerformanceMetrics());

   // Function to log performance metrics
   function logPerformanceMetrics(action: string, data?: any) {
      logPerformanceEvent(
         action,
         new Date(performanceMetrics.initTime).getTime(),
         data,
         (updatedMetrics: Partial<PerformanceMetrics>) => {
            setPerformanceMetrics((prev) => ({
               ...prev,
               ...updatedMetrics,
            }));
         },
      );
   }

   const isSharingScreen = screenStream !== null;
   const isRecording = recorderState === "recording";
   const isPaused = recorderState === "paused";
   const isStopped = recorderState === "stopped";
   const isUploading = recorderState === "uploading";
   const isUploaded = recorderState === "uploaded";

   useEffect(() => {
      async function getDevices() {
         logPerformanceMetrics("Starting device initialization");
         console.log(
            "[ScreenRecorderContext] isUploadingToMux state:",
            isUploadingToMux,
         );

         // Check browser compatibility first
         const compatibility = checkBrowserCompatibility(language);
         if (!compatibility.compatible) {
            setPermissionError(
               compatibility.message || "Browser compatibility issue detected",
            );
            setRecorderState("settingUp");
            return;
         }

         // getting permissions
         try {
            logPerformanceMetrics("Requesting permissions");
            // Check for permissions first
            const permissions = await Promise.all([
               navigator.permissions.query({
                  name: "microphone" as PermissionName,
               }),
               navigator.permissions.query({
                  name: "camera" as PermissionName,
               }),
            ]);

            setMicPermission(permissions[0].state);
            setCameraPermission(permissions[1].state);

            // Set up permission state change listeners
            permissions[0].onchange = () =>
               setMicPermission(permissions[0].state);
            permissions[1].onchange = () =>
               setCameraPermission(permissions[1].state);

            // Use our new helper with timeout and retry
            logPerformanceMetrics("Initializing camera");
            const cameraStartTime = Date.now();
            const cameraStream = await getUserMediaWithTimeout({
               audio: true,
               video: true,
            });
            logPerformanceMetrics("Camera initialized", {
               timeToInitCamera: Date.now() - cameraStartTime,
            });
            setPerformanceMetrics((prev) => ({
               ...prev,
               cameraStartTime: cameraStartTime.toString(),
            }));

            const devices = await navigator.mediaDevices.enumerateDevices();
            const audioDevices = devices.filter(
               (device) => device.kind === "audioinput",
            );
            const videoDevices = devices.filter(
               (device) => device.kind === "videoinput",
            );

            setAudioDevices(audioDevices);
            setVideoDevices(videoDevices);

            setAudioDeviceSelected(audioDevices[0]);
            setVideoDeviceSelected(videoDevices[0]);

            setCameraStream(cameraStream);
            setPermissionError(null);
            setRecorderState("readyToRecord");
            logPerformanceMetrics("Setup complete");
         } catch (error: any) {
            console.error(error);
            // Handle permission errors specifically
            if (
               error.name === "NotAllowedError" ||
               error.name === "PermissionDeniedError"
            ) {
               setPermissionError(
                  language === "en-US"
                     ? "Permission to access microphone and camera was denied. Please allow access in your browser settings and refresh the page."
                     : "El permiso para acceder al micrófono y la cámara fue denegado. Por favor, permita el acceso en la configuración de su navegador y actualice la página.",
               );
            } else if (error.message && error.message.includes("Timeout")) {
               // Special handling for timeout errors
               setPermissionError(
                  language === "en-US"
                     ? "Your device took too long to start the camera. This is common on older computers. Try closing other applications and refresh the page."
                     : "Su dispositivo tardó demasiado en iniciar la cámara. Esto es común en computadoras más antiguas. Intente cerrar otras aplicaciones y actualice la página.",
               );
            } else {
               setPermissionError(
                  language === "en-US"
                     ? `Error accessing media devices: ${error.message}`
                     : `Error al acceder a los dispositivos multimedia: ${error.message}`,
               );
            }
            // Set permissions to denied if there was an error
            setMicPermission("denied");
            setCameraPermission("denied");
            setRecorderState("settingUp");
         }
      }
      getDevices();
   }, [language]);

   const [isInitialTestCompleted, setIsInitialTestCompleted] = useState(false);

   useEffect(() => {
      const isInitialTestCompleted = localStorage.getItem(
         "isInitialTestCompleted",
      );
      if (isInitialTestCompleted || isPresentation) {
         setIsInitialTestCompleted(true);
      }
   }, [isPresentation]);

   const recorderStateRef = useRef(recorderState);
   useEffect(() => {
      recorderStateRef.current = recorderState;
   }, [recorderState]);

   // Add beforeunload event handler to prevent accidental navigation while recording or uploading
   useEffect(() => {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
         // Only show confirmation dialog if recording or uploading
         if (recorderState === "recording" || recorderState === "uploading") {
            // Standard way to show a confirmation dialog
            e.preventDefault();

            // The message is often ignored by browsers and replaced with a generic one,
            // but we set it anyway for browsers that might display it
            const message =
               language === "en-US"
                  ? "You are currently recording or uploading. If you leave now, your progress will be lost."
                  : "Actualmente estás grabando o subiendo un video. Si sales ahora, perderás todo el progreso.";

            e.returnValue = message;
            return message;
         }
      };

      // Add the event listener
      window.addEventListener("beforeunload", handleBeforeUnload);

      // Clean up the event listener when component unmounts
      return () => {
         window.removeEventListener("beforeunload", handleBeforeUnload);
      };
   }, [recorderState, language]);

   async function stopScreenShare() {
      // Stop all tracks in the screen stream
      screenStream?.getTracks().forEach((track) => {
         // Only stop video tracks or audio tracks that don't come from the camera stream
         // This prevents stopping the microphone audio when we stop screen sharing
         if (
            track.kind === "video" ||
            (track.kind === "audio" &&
               !cameraStream?.getAudioTracks().some((at) => at.id === track.id))
         ) {
            track.stop();
            console.log(
               `[ScreenRecorderContext] Stopped ${track.kind} track: ${track.label}`,
            );
         }
      });

      // Update performance metrics when screen sharing stops
      setPerformanceMetrics((prev) => ({
         ...prev,
         isSharingScreen: false,
      }));

      logPerformanceMetrics("Screen sharing stopped");

      setScreenStream(null);
   }

   async function startScreenShare() {
      try {
         logPerformanceMetrics("Starting screen share");
         const screenStartTime = Date.now();

         // First get the screen stream without audio
         let screenOnlyStream: MediaStream;
         try {
            screenOnlyStream = await navigator.mediaDevices.getDisplayMedia({
               video: true,
               audio: false,
            });
         } catch (error: any) {
            console.error("Screen sharing error:", error);
            logPerformanceMetrics("Screen share error", {
               error: error.message,
               name: error.name,
               attemptsMade: error.attemptsMade,
            });

            return;
         }

         // If we have a camera stream, we'll combine its audio with the screen video
         let combinedStream: MediaStream;

         if (cameraStream && cameraStream.getAudioTracks().length > 0) {
            // Create a new MediaStream with screen video and camera audio
            combinedStream = new MediaStream();

            // Add the screen video track
            screenOnlyStream.getVideoTracks().forEach((track) => {
               combinedStream.addTrack(track);
               console.log(
                  "[ScreenRecorderContext] Added screen video track to combined stream",
               );
            });

            // Add the camera's audio track
            cameraStream.getAudioTracks().forEach((track) => {
               combinedStream.addTrack(track);
               console.log(
                  "[ScreenRecorderContext] Added camera audio track to combined stream",
               );
            });

            logPerformanceMetrics(
               "Combined stream created with screen video and microphone audio",
            );
         } else {
            // If we don't have camera audio, just use the screen stream as is
            combinedStream = screenOnlyStream;
            console.log(
               "[ScreenRecorderContext] No audio track available, using screen-only stream",
            );
         }

         logPerformanceMetrics("Screen share initialized", {
            timeToInitScreen: Date.now() - screenStartTime,
            hasAudio: combinedStream.getAudioTracks().length > 0,
         });

         // Update performance metrics when screen sharing starts
         setPerformanceMetrics((prev) => ({
            ...prev,
            screenStartTime: screenStartTime.toString(),
            isSharingScreen: true,
         }));

         setScreenStream(combinedStream);

         const screenTrack = combinedStream.getVideoTracks()[0];
         screenTrack.onended = () => {
            console.log("[ScreenRecorderContext] Screen track ended");
            logPerformanceMetrics("Screen track ended");
            if (recorderStateRef.current !== "recording") {
               stopScreenShare();
               return;
            }

            if (recorderStateRef.current === "recording") {
               playErrorAlertSound();
               alert(
                  language === "en-US"
                     ? "The recording stopped when the screen was stopped"
                     : "La grabación se detuvo al dejar de compartir la pantalla",
               );
               stopRecording();
               return;
            }
         };
      } catch (error: any) {
         console.error("Screen sharing error:", error);
         logPerformanceMetrics("Screen share error", {
            error: error.message,
            name: error.name,
            attemptsMade: error.attemptsMade,
         });

         // Don't play error sound for explicit user cancellations
         if (error.name !== "UserCanceledError") {
            playErrorAlertSound();
         }

         // If the user explicitly canceled, don't show error alerts
         if (error.name === "UserCanceledError" || error.userCanceled) {
            console.log("User canceled screen sharing, not showing error");
            return;
         }

         // Specific error message for older browsers/systems
         let errorMessage =
            language === "en-US"
               ? "Unable to share screen. "
               : "No se puede compartir la pantalla. ";

         if (
            error.name === "NotSupportedError" ||
            !navigator.mediaDevices.getDisplayMedia
         ) {
            errorMessage +=
               language === "en-US"
                  ? "Your browser or operating system may be too old to support screen sharing. Try updating your browser or using Chrome."
                  : "Es posible que su navegador o sistema operativo sea demasiado antiguo para admitir el compartir pantalla. Intente actualizar su navegador o usar Chrome.";
         } else if (error.name === "NotAllowedError") {
            errorMessage +=
               language === "en-US"
                  ? "Permission to share screen was denied."
                  : "Se denegó el permiso para compartir la pantalla.";
         } else if (error.message && error.message.includes("Timeout")) {
            // Special handling for timeout errors
            errorMessage +=
               language === "en-US"
                  ? "Your device took too long to start screen sharing. This is common on older computers. Try closing other applications and refresh the page."
                  : "Su dispositivo tardó demasiado en iniciar el uso compartido de pantalla. Esto es común en computadoras más antiguas. Intente cerrar otras aplicaciones y actualice la página.";
         } else {
            errorMessage += error.message;
         }

         alert(errorMessage);
         alert(`Error Details:\n${JSON.stringify(error)}`);
      }
   }

   async function changeAudioInputDevice(deviceId: string) {
      const audioDevice = audioDevices.find(
         (device) => device.deviceId === deviceId,
      );
      if (audioDevice) {
         setAudioDeviceSelected(audioDevice);

         try {
            const newCameraStream = await getUserMediaWithTimeout({
               audio: {
                  deviceId: deviceId
                     ? {
                          exact: deviceId,
                       }
                     : undefined,
               },
               video: {
                  deviceId: videoDeviceSelected?.deviceId
                     ? {
                          exact: videoDeviceSelected.deviceId,
                       }
                     : undefined,
               },
            });

            setCameraStream(newCameraStream);
         } catch (error: any) {
            console.error("Error changing audio device:", error);
            playErrorAlertSound();

            let errorMessage =
               language === "en-US"
                  ? "Failed to switch audio device. "
                  : "No se pudo cambiar el dispositivo de audio. ";

            if (error.message && error.message.includes("Timeout")) {
               errorMessage +=
                  language === "en-US"
                     ? "Your device took too long to respond. Try closing other applications."
                     : "Su dispositivo tardó demasiado en responder. Intente cerrar otras aplicaciones.";
            } else {
               errorMessage += error.message;
            }

            alert(errorMessage);
         }
      }
   }

   async function changeVideoInputDevice(deviceId: string) {
      const videoDevice = videoDevices.find(
         (device) => device.deviceId === deviceId,
      );
      if (videoDevice) {
         setVideoDeviceSelected(videoDevice);

         try {
            const newCameraStream = await getUserMediaWithTimeout({
               audio: {
                  deviceId: audioDeviceSelected?.deviceId
                     ? {
                          exact: audioDeviceSelected.deviceId,
                       }
                     : undefined,
               },
               video: {
                  deviceId: deviceId
                     ? {
                          exact: deviceId,
                       }
                     : undefined,
               },
            });

            setCameraStream(newCameraStream);
         } catch (error: any) {
            console.error("Error changing video device:", error);
            playErrorAlertSound();

            let errorMessage =
               language === "en-US"
                  ? "Failed to switch video device. "
                  : "No se pudo cambiar el dispositivo de video. ";

            if (error.message && error.message.includes("Timeout")) {
               errorMessage +=
                  language === "en-US"
                     ? "Your device took too long to respond. Try closing other applications."
                     : "Su dispositivo tardó demasiado en responder. Intente cerrar otras aplicaciones.";
            } else {
               errorMessage += error.message;
            }

            alert(errorMessage);
         }
      }
   }

   const startRecording = useCallback(async () => {
      // Check if permissions are granted before recording
      if (micPermission !== "granted" || cameraPermission !== "granted") {
         const permError =
            language === "en-US"
               ? "Cannot start recording without microphone and camera permissions."
               : "No se puede iniciar la grabación sin los permisos de micrófono y cámara.";

         setPermissionError(permError);
         playErrorAlertSound();
         return;
      }

      if (isSimpleRecording) {
         const recordingUpdateResponse = await updateRecordingAction(
            recordingId as string,
            {
               status: "recording",
            },
         );

         if (!recordingUpdateResponse.success) {
            alert(recordingUpdateResponse.errorMessage);
            return;
         }
      } else {
         const { error: updateRecordingStatusError } =
            await updateRecordingStatusAction(
               recordingId as string,
               "recording",
            );
         if (updateRecordingStatusError) {
            alert(
               "Error updating recording status: " + updateRecordingStatusError,
            );
            return;
         }
      }

      // Update performance metrics to track recording attempts
      setPerformanceMetrics((prev) => ({
         ...prev,
         recordingAttempts: (prev.recordingAttempts || 0) + 1,
         recordingDuration: 0,
      }));

      let options: any = {};

      // Prioritize more widely supported formats for better compatibility with older systems
      if (MediaRecorder.isTypeSupported("video/webm; codecs=vp9")) {
         options = {
            mimeType: "video/webm; codecs=vp9",
         };
         console.log("Using webm with vp9");
      } else if (MediaRecorder.isTypeSupported("video/mp4")) {
         options = {
            mimeType: "video/mp4",
         };
         console.log("Using mp4 format");
      } else if (MediaRecorder.isTypeSupported("video/webm")) {
         options = {
            mimeType: "video/webm",
         };
         console.log("Using webm format");
      } else if (MediaRecorder.isTypeSupported("video/webm; codecs=vp8")) {
         options = {
            mimeType: "video/webm; codecs=vp8",
         };
         console.log("Using webm with vp8");
      } else {
         console.error("No suitable mimetype found for this device");
         alert(
            language === "en-US"
               ? "Your browser doesn't support any compatible video format. Please try a different browser like Chrome or Firefox."
               : "Su navegador no admite ningún formato de video compatible. Intente con un navegador diferente como Chrome o Firefox.",
         );
         return;
      }

      cameraRecorderRef.current = new MediaRecorder(cameraStream!, options);

      cameraRecorderRef.current.ondataavailable = (event) => {
         if (event.data.size > 0) {
            cameraChunksRef.current.push(event.data);
         }
      };

      cameraRecorderRef.current.onstop = () => {
         const cameraBlob = new Blob(cameraChunksRef.current, {
            type: options.mimeType.split(";")[0],
         });
         const blobUrl = URL.createObjectURL(cameraBlob);
         setCameraBlob(cameraBlob);
         setCameraVideoUrl(blobUrl);
         cameraChunksRef.current = [];

         if (!isSharingScreen) {
            setRecorderState("stopped");
         }
      };

      cameraRecorderRef.current.start();
      if (isSharingScreen) {
         screenRecorderRef.current = new MediaRecorder(screenStream!, options);

         screenRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
               screenChunksRef.current.push(event.data);
            }
         };

         screenRecorderRef.current.onstop = () => {
            const screenBlob = new Blob(screenChunksRef.current, {
               type: options.mimeType.split(";")[0],
            });
            setScreenBlob(screenBlob);
            setScreenVideoUrl(URL.createObjectURL(screenBlob));
            screenChunksRef.current = [];
            setRecorderState("stopped");
         };

         screenRecorderRef.current.start();
      }

      playInmediateStartRecorderSound();
      timeNotificationIntervalRef.current = setInterval(
         () => {
            playTimeReminderSounds();
         },
         1000 * 60 * 5,
      );

      setRecorderState("recording");
   }, [
      language,
      recordingId,
      cameraStream,
      screenStream,
      micPermission,
      isSharingScreen,
      cameraPermission,
      cameraRecorderRef,
      screenRecorderRef,
      isSimpleRecording,
      playErrorAlertSound,
      playTimeReminderSounds,
      playInmediateStartRecorderSound,
   ]);

   const startDelayedRecording = useCallback(
      (delayMs: number) => {
         if (isDelayedRecordingStarted) return;
         setIsDelayedRecordingStarted(true);

         setTimeout(() => {
            playDelayedRecorderSounds();
         }, delayMs - 5000);

         setTimeout(() => {
            startRecording();
            setIsDelayedRecordingStarted(false);
         }, delayMs);
      },
      [playDelayedRecorderSounds, startRecording, isDelayedRecordingStarted],
   );

   const stopRecording = useCallback(async () => {
      setPerformanceMetrics((prev) => ({
         ...prev,
         recordingDuration: secondsRecorded,
      }));

      cameraRecorderRef.current!.stop();
      cameraStream?.getTracks().forEach((track) => track.stop());

      if (isSharingScreen) {
         screenRecorderRef.current!.stop();
         screenStream?.getTracks().forEach((track) => track.stop());
      }

      clearInterval(timeNotificationIntervalRef.current!);
      playStoppedRecorderSounds();
   }, [
      cameraRecorderRef,
      cameraStream,
      isSharingScreen,
      screenRecorderRef,
      screenStream,
      playStoppedRecorderSounds,
      secondsRecorded,
   ]);

   async function resetRecorder() {
      console.log("[ScreenRecorderContext] Current language:", language);
      const confirmation = window.confirm(
         language === "en-US"
            ? "Are you sure you want to reset the recorder?, the current video will be lost."
            : "¿Estás seguro de que quieres reiniciar el grabador?, el video actual se perderá.",
      );

      if (confirmation) {
         window.location.reload();
      }
   }

   function downloadVideos() {
      const extension = MediaRecorder.isTypeSupported("video/webm")
         ? "webm"
         : "mp4";
      const cameraAnchor = document.createElement("a");

      cameraAnchor.href = cameraVideoUrl!;
      cameraAnchor.download = `camera.${extension}`;
      cameraAnchor.click();

      if (screenVideoUrl) {
         const screenAnchor = document.createElement("a");
         screenAnchor.href = screenVideoUrl!;
         screenAnchor.download = `screen.${extension}`;
         screenAnchor.click();
      }
   }

   // Helper function to check if all required uploads are complete
   const checkAndSetUploaded = useCallback(() => {
      console.log("[ScreenRecorderContext] Checking upload status:", {
         camera: cameraUploadCompletedRef.current,
         screen: screenUploadCompletedRef.current,
         isSharingScreen,
      });

      if (cameraUploadCompletedRef.current) {
         if (
            !isSharingScreen ||
            (isSharingScreen && screenUploadCompletedRef.current)
         ) {
            console.log(
               "[ScreenRecorderContext] All uploads complete, setting state to uploaded",
            );
            setRecorderState("uploaded");
         }
      }
   }, [isSharingScreen]);

   const uploadVideos = useCallback(() => {
      setRecorderState("uploading");

      startTransition(async () => {
         if (isSimpleRecording) {
            // Change the recording status to uploading
            const updateRecordingResponse = await updateRecordingAction(
               recordingId as string,
               {
                  status: "uploading",
               },
            );

            if (!updateRecordingResponse.success) {
               alert(updateRecordingResponse.errorMessage);
               return;
            }

            // upload the video to the server
            const cameraMuxUploadUrl = await createMuxUploadUrlAction(
               recordingId as string,
               isSimpleRecording,
            );

            if (cameraMuxUploadUrl.error) {
               await updateRecordingAction(recordingId as string, {
                  status: "error",
                  errorMessage: cameraMuxUploadUrl.error,
               });
               alert(cameraMuxUploadUrl.error);
            }

            if (!cameraBlob) {
               await updateRecordingAction(recordingId as string, {
                  status: "error",
                  errorMessage: "No video blob found",
               });
               alert("No video blob found");
               return;
            }

            if (!cameraMuxUploadUrl.url) {
               await updateRecordingAction(recordingId as string, {
                  status: "error",
                  errorMessage: "No upload URL found",
               });
               alert("No upload URL found");
               return;
            }

            const videoFile = new File([cameraBlob], "camera.webm", {
               type: "video/webm",
            });
            console.log(
               "[ScreenRecorderContext] Video file created:",
               videoFile,
            );

            const cameraUpload = UpChunk.createUpload({
               file: videoFile,
               endpoint: cameraMuxUploadUrl.url,
               dynamicChunkSize: true,
            });

            cameraUpload.on("progress", (progress) => {
               console.log(
                  "[ScreenRecorderContext] Camera upload progress:",
                  progress,
               );
               setCameraUploadProgress(Math.round(progress.detail));
            });

            cameraUpload.on("success", async (err) => {
               console.log(
                  "[ScreenRecorderContext] Camera upload success:",
                  err,
               );
               await completeRecordingUploadAction(
                  recordingId as string,
                  cameraMuxUploadUrl.id,
               );
               setIsCameraUploadCompleted(true);
               cameraUploadCompletedRef.current = true;

               // Check if we can mark as uploaded
               checkAndSetUploaded();
            });

            cameraUpload.on("error", async (error) => {
               alert(error.detail);
               await updateRecordingAction(recordingId as string, {
                  status: "error",
                  errorMessage: error.detail,
               });
            });
            return;
         }

         await addPerformanceMetricsToRecordingAction(
            recordingId as string,
            performanceMetrics,
         );

         if (!recordingId) {
            alert(
               language === "en-US"
                  ? "The conference was not found"
                  : "No se ha encontrado la conferencia",
            );
            return;
         }

         const { error: updateRecordingStatusError } =
            await updateRecordingStatusAction(
               recordingId as string,
               "uploading",
            );
         const { error: deleteVideoAssetsError } =
            await deleteAllVideoAssetsForRecordingAction(recordingId as string);

         if (updateRecordingStatusError) {
            alert(updateRecordingStatusError);
            return;
         }

         if (deleteVideoAssetsError) {
            alert(deleteVideoAssetsError);
            return;
         }

         const cameraUploadUrl = await createMuxUploadUrlAction(
            recordingId as string,
         );

         if (cameraUploadUrl.error) {
            alert(cameraUploadUrl.error);
         }
         if (!cameraUploadUrl.url) {
            alert(
               "Error:" + language === "en-US"
                  ? "Could not create upload URL"
                  : "No se pudo crear la URL de subida",
            );
            return;
         }

         const { videoAsset: cameraVideoAsset, error: cameraVideoAssetError } =
            await createVideoAssetAction(
               recordingId as string,
               cameraUploadUrl.id,
               "camera",
            );

         if (!cameraVideoAsset) {
            alert(cameraVideoAssetError);
            return;
         }

         const videoFile = new File([cameraBlob!], "camera.webm", {
            type: "video/webm",
         });
         console.log("[ScreenRecorderContext] Video file created:", videoFile);

         const cameraUpload = UpChunk.createUpload({
            file: videoFile,
            endpoint: cameraUploadUrl.url,
            dynamicChunkSize: true,
         });

         cameraUpload.on("progress", (progress) => {
            console.log(
               "[ScreenRecorderContext] Camera upload progress:",
               progress,
            );
            setCameraUploadProgress(Math.round(progress.detail));
         });

         cameraUpload.on("success", async (err) => {
            console.log("[ScreenRecorderContext] Camera upload success:", err);
            await completeUploadAction(
               cameraUploadUrl.id,
               recordingId as string,
               cameraVideoAsset.id,
            );
            setIsCameraUploadCompleted(true);
            cameraUploadCompletedRef.current = true;

            // Check if we can mark as uploaded
            checkAndSetUploaded();
         });

         cameraUpload.on("error", (error) => {
            alert(error.detail);
         });

         if (isSharingScreen) {
            const screenUploadUrl = await createMuxUploadUrlAction(
               recordingId as string,
            );

            if (screenUploadUrl.error) {
               alert(screenUploadUrl.error);
            }
            if (!screenUploadUrl.url) {
               alert(
                  language === "en-US"
                     ? "No se ha encontrado la URL de subida"
                     : "No se ha encontrado la URL de subida",
               );
               return;
            }

            const {
               videoAsset: screenVideoAsset,
               error: screenVideoAssetError,
            } = await createVideoAssetAction(
               recordingId as string,
               screenUploadUrl.id,
               "screen",
            );

            if (!screenVideoAsset) {
               alert(screenVideoAssetError);
               return;
            }

            const screenFile = new File([screenBlob!], "screen.webm", {
               type: "video/webm",
            });
            const screenUpload = UpChunk.createUpload({
               file: screenFile,
               endpoint: screenUploadUrl.url,
               dynamicChunkSize: true,
            });

            screenUpload.on("progress", (progress) => {
               console.log(
                  "[ScreenRecorderContext] Screen upload progress:",
                  progress,
               );
               setScreenUploadProgress(Math.round(progress.detail));
            });

            screenUpload.on("success", async (err) => {
               console.log(
                  "[ScreenRecorderContext] Screen upload success:",
                  err,
               );

               await completeUploadAction(
                  screenUploadUrl.id,
                  recordingId as string,
                  screenVideoAsset.id,
               );
               setIsScreenUploadCompleted(true);
               screenUploadCompletedRef.current = true;

               // Check if we can mark as uploaded
               checkAndSetUploaded();
            });

            screenUpload.on("error", (error) => {
               alert(error.detail);
            });
         }
      });
   }, [
      recordingId,
      cameraBlob,
      screenBlob,
      isSharingScreen,
      language,
      performanceMetrics,
      checkAndSetUploaded,
   ]);

   // Add a function to request permissions again
   async function requestPermissions() {
      setRecorderState("settingUp");
      setPermissionError(null);

      try {
         const cameraStream = await getUserMediaWithTimeout({
            audio: true,
            video: true,
         });
         const devices = await navigator.mediaDevices.enumerateDevices();
         const audioDevices = devices.filter(
            (device) => device.kind === "audioinput",
         );
         const videoDevices = devices.filter(
            (device) => device.kind === "videoinput",
         );

         setAudioDevices(audioDevices);
         setVideoDevices(videoDevices);

         setAudioDeviceSelected(audioDevices[0]);
         setVideoDeviceSelected(videoDevices[0]);

         setCameraStream(cameraStream);
         setMicPermission("granted");
         setCameraPermission("granted");
         setRecorderState("readyToRecord");
      } catch (error: any) {
         console.error(error);
         if (
            error.name === "NotAllowedError" ||
            error.name === "PermissionDeniedError"
         ) {
            setPermissionError(
               language === "en-US"
                  ? "Permission to access microphone and camera was denied. Please allow access in your browser settings and refresh the page."
                  : "El permiso para acceder al micrófono y la cámara fue denegado. Por favor, permita el acceso en la configuración de su navegador y actualice la página.",
            );
         } else if (error.message && error.message.includes("Timeout")) {
            // Special handling for timeout errors
            setPermissionError(
               language === "en-US"
                  ? "Your device took too long to start the camera. This is common on older computers. Try closing other applications and refresh the page."
                  : "Su dispositivo tardó demasiado en iniciar la cámara. Esto es común en computadoras más antiguas. Intente cerrar otras aplicaciones y actualice la página.",
            );
         } else {
            setPermissionError(
               language === "en-US"
                  ? `Error accessing media devices: ${error.message}`
                  : `Error al acceder a los dispositivos multimedia: ${error.message}`,
            );
         }
      }
   }

   function getVideoConstraintsForDevice() {
      // Always use high quality video settings as required
      return {
         width: {
            ideal: 1280,
         },
         height: {
            ideal: 720,
         },
         frameRate: {
            ideal: 30,
         },
      };
   }

   // Add a helper function for getUserMedia with timeout and retry
   async function getUserMediaWithTimeout(
      constraints: MediaStreamConstraints,
      timeoutMs = 10000,
      retries = 3,
   ): Promise<MediaStream> {
      // Apply device-appropriate video constraints if not specified
      if (constraints.video === true) {
         constraints.video = getVideoConstraintsForDevice();
      }

      let lastError;

      for (let attempt = 0; attempt <= retries; attempt++) {
         try {
            // Create a promise that rejects after timeoutMs
            const timeoutPromise = new Promise<MediaStream>((_, reject) => {
               setTimeout(() => {
                  reject(
                     new Error(
                        language === "en-US"
                           ? "Timeout starting video source. Your device might be too slow or the camera is busy."
                           : "Se agotó el tiempo de espera al iniciar la fuente de video. Su dispositivo podría estar funcionando lentamente o la cámara podría estar siendo utilizada por otra aplicación.",
                     ),
                  );
               }, timeoutMs);
            });

            // Race between the media request and the timeout
            return await Promise.race([
               navigator.mediaDevices.getUserMedia(constraints),
               timeoutPromise,
            ]);
         } catch (error: any) {
            console.error(`getUserMedia attempt ${attempt + 1} failed:`, error);
            lastError = error;

            // If this wasn't the last attempt, wait before retrying
            if (attempt < retries) {
               await new Promise((resolve) => setTimeout(resolve, 1000));
               console.log(`Retrying getUserMedia, attempt ${attempt + 2}...`);
            }
         }
      }

      // If we got here, all attempts failed
      throw lastError;
   }

   const startTestRecording = useCallback(() => {
      if (isInitialTestCompleted) return;
      startRecording();
      setTimeout(() => {
         stopRecording();
         const soundInterval = setInterval(() => {
            playStoppedRecorderSounds();
         }, 500);

         setTimeout(() => {
            alert(
               language === "en-US"
                  ? "The test has ended. Please confirm to continue"
                  : "La prueba ha terminado. Por favor confirma para continuar",
            );
            clearInterval(soundInterval);
         }, 1500);
      }, 10000);
   }, [
      isInitialTestCompleted,
      startRecording,
      stopRecording,
      language,
      playStoppedRecorderSounds,
   ]);

   const confirmTestRecording = useCallback(() => {
      localStorage.setItem("isInitialTestCompleted", "true");
      window.location.reload();
   }, []);

   return {
      recorderState,
      audioDevices,
      audioDeviceSelected,
      videoDevices,
      videoDeviceSelected,
      cameraVideoUrl,
      screenVideoUrl,
      cameraStream,
      screenStream,
      isSharingScreen,
      isRecording,
      isPaused,
      isStopped,
      isUploading,
      isUploaded,
      secondsRecorded,
      cameraVideoRef,
      screenVideoRef,
      isDelayedRecordingStarted,
      micPermission,
      cameraPermission,
      permissionError,
      performanceMetrics,
      isPresentation,
      isInitialTestCompleted,
      cameraUploadProgress,
      screenUploadProgress,
      isCameraUploadCompleted,
      isScreenUploadCompleted,
      setSecondsRecorded,
      startScreenShare,
      stopScreenShare,
      startTestRecording,
      changeAudioInputDevice,
      changeVideoInputDevice,
      startRecording,
      startDelayedRecording,
      stopRecording,
      resetRecorder,
      downloadVideos,
      uploadVideos,
      requestPermissions,
      logPerformanceMetrics,
      confirmTestRecording,
   };
}

export const ScreenRecorderContext = createContext(
   {} as ReturnType<typeof useScreenRecorderContext>,
);

export const ScreenRecorderContextProvider = ({
   children,
   isPresentation,
   isSimpleRecording,
}: {
   children: React.ReactNode;
   isPresentation: boolean;
   isSimpleRecording?: boolean;
}) => {
   const value = useScreenRecorderContext({
      isPresentation,
      isSimpleRecording,
   });
   return (
      <ScreenRecorderContext.Provider value={value}>
         {children}
      </ScreenRecorderContext.Provider>
   );
};
