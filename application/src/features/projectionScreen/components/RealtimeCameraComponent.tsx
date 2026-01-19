"use client";

import { CameraIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface RealtimeCameraProps {
   deviceId?: string;
   width?: number;
   height?: number;
   mirror?: boolean;
   className?: string;
   onReady?: (stream: MediaStream) => void;
   onError?: (error: Error) => void;
}

export default function RealtimeCameraComponent(props: RealtimeCameraProps) {
   const {
      deviceId,
      width = 1280,
      height = 720,
      mirror = false,
      className = "",
      onReady,
      onError,
   } = props;

   const videoRef = useRef<HTMLVideoElement | null>(null);
   const streamRef = useRef<MediaStream | null>(null);

   const [status, setStatus] = useState<
      "idle" | "loading" | "streaming" | "error"
   >("idle");
   const [errorMessage, setErrorMessage] = useState<string | null>(null);

   // Devices handling
   const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>(
      [],
   );
   const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(
      undefined,
   );
   const [isDeviceMenuOpen, setIsDeviceMenuOpen] = useState(false);

   const stopStream = () => {
      const activeStream = streamRef.current;
      if (!activeStream) return;
      activeStream.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
   };

   const startStream = async () => {
      if (
         typeof navigator === "undefined" ||
         !navigator.mediaDevices?.getUserMedia
      ) {
         const err = new Error("El navegador no soporta captura de cámara.");
         setStatus("error");
         setErrorMessage(err.message);
         onError?.(err);
         return;
      }

      try {
         setStatus("loading");
         setErrorMessage(null);

         const constraints: MediaStreamConstraints = {
            video: {
               width: {
                  ideal: width,
               },
               height: {
                  ideal: height,
               },
               deviceId: selectedDeviceId
                  ? {
                       exact: selectedDeviceId,
                    }
                  : undefined,
            },
            audio: false,
         };

         const stream = await navigator.mediaDevices.getUserMedia(constraints);
         streamRef.current = stream;

         if (videoRef.current) {
            videoRef.current.srcObject = stream;
            // play must be called after setting srcObject
            await videoRef.current.play().catch(() => undefined);
         }

         setStatus("streaming");
         onReady?.(stream);

         // Refresh device list and persist current camera
         try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videos = devices.filter((d) => d.kind === "videoinput");
            setAvailableCameras(videos);
            const trackDeviceId = stream.getVideoTracks()?.[0]?.getSettings()
               ?.deviceId as string | undefined;
            if (!selectedDeviceId && trackDeviceId) {
               setSelectedDeviceId(trackDeviceId);
               try {
                  localStorage.setItem(
                     "vc.selectedCameraDeviceId",
                     trackDeviceId,
                  );
               } catch {}
            }
         } catch {}
      } catch (err) {
         const error =
            err instanceof Error
               ? err
               : new Error("No se pudo iniciar la cámara.");
         setStatus("error");
         setErrorMessage(error.message);
         onError?.(error);
      }
   };

   // Initialize selected device from prop or localStorage
   useEffect(() => {
      if (deviceId) {
         setSelectedDeviceId(deviceId);
         return;
      }
      try {
         const saved =
            typeof window !== "undefined"
               ? localStorage.getItem("vc.selectedCameraDeviceId")
               : null;
         if (saved) setSelectedDeviceId(saved);
      } catch {}
   }, [deviceId]);

   // Start/stop stream when selection or size changes
   useEffect(() => {
      startStream();
      return () => {
         stopStream();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [selectedDeviceId, width, height]);

   // Keep camera list up to date and handle device removal
   useEffect(() => {
      if (
         typeof navigator === "undefined" ||
         !navigator.mediaDevices?.enumerateDevices
      )
         return;
      const handleDeviceChange = async () => {
         try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videos = devices.filter((d) => d.kind === "videoinput");
            setAvailableCameras(videos);
            if (
               selectedDeviceId &&
               !videos.some((d) => d.deviceId === selectedDeviceId)
            ) {
               const fallback = videos[0]?.deviceId;
               setSelectedDeviceId(fallback);
               if (fallback) {
                  try {
                     localStorage.setItem(
                        "vc.selectedCameraDeviceId",
                        fallback,
                     );
                  } catch {}
               }
            }
         } catch {}
      };
      // Subscribe
      const mediaDevices = navigator.mediaDevices;
      if (typeof mediaDevices.addEventListener === "function") {
         mediaDevices.addEventListener(
            "devicechange",
            handleDeviceChange as EventListener,
         );
      }
      // Initial population
      handleDeviceChange();
      return () => {
         if (typeof mediaDevices.removeEventListener === "function") {
            mediaDevices.removeEventListener(
               "devicechange",
               handleDeviceChange as EventListener,
            );
         }
      };
   }, [selectedDeviceId]);

   return (
      <div
         className={`relative rounded-xl border border-slate-300 bg-black/30 ${className}`}
      >
         {/* Camera selector */}
         <div className="-top-6 right-0 z-10 absolute">
            <div className="relative">
               <button
                  onClick={() => setIsDeviceMenuOpen((v) => !v)}
                  className="inline-flex justify-center items-center bg-white/90 hover:bg-white shadow-sm px-2.5 py-1 border border-slate-300 rounded-md font-medium text-slate-800 text-xs"
                  title="Cambiar cámara"
               >
                  <CameraIcon className="w-4 h-4" />
               </button>
               {isDeviceMenuOpen && (
                  <div className="right-0 absolute bg-white shadow-lg mt-1 border border-slate-200 rounded-md w-56 max-h-60 overflow-auto">
                     <div className="py-1">
                        {availableCameras.length === 0 && (
                           <div className="px-3 py-2 text-slate-600 text-xs">
                              No hay cámaras disponibles
                           </div>
                        )}
                        {availableCameras.map((cam, idx) => {
                           const label = cam.label || `Cámara ${idx + 1}`;
                           const isSelected = cam.deviceId === selectedDeviceId;
                           return (
                              <button
                                 key={cam.deviceId || `${idx}`}
                                 onClick={() => {
                                    setSelectedDeviceId(cam.deviceId);
                                    setIsDeviceMenuOpen(false);
                                    try {
                                       localStorage.setItem(
                                          "vc.selectedCameraDeviceId",
                                          cam.deviceId,
                                       );
                                    } catch {}
                                 }}
                                 className={`w-full text-left px-3 py-2 text-xs ${isSelected ? "bg-slate-100 text-slate-900" : "text-slate-700 hover:bg-slate-50"}`}
                              >
                                 {label}
                              </button>
                           );
                        })}
                     </div>
                  </div>
               )}
            </div>
         </div>
         <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            className={`block w-full aspect-video object-cover ${mirror ? "-scale-x-100" : ""}`}
         />

         {/* Overlay messages */}
         {status !== "streaming" && (
            <div className="absolute inset-0 flex justify-center items-center bg-black/30">
               <div className="bg-white/90 px-4 py-3 rounded-lg text-slate-800 text-center">
                  {status === "loading" && (
                     <p className="font-medium text-sm">
                        Solicitando acceso a la cámara…
                     </p>
                  )}
                  {status === "idle" && (
                     <p className="font-medium text-sm">Preparando cámara…</p>
                  )}
                  {status === "error" && (
                     <div className="space-y-2">
                        <p className="font-medium text-sm">
                           No se pudo acceder a la cámara.
                        </p>
                        {errorMessage && (
                           <p className="text-slate-600 text-xs">
                              {errorMessage}
                           </p>
                        )}
                        <button
                           onClick={startStream}
                           className="inline-flex justify-center items-center bg-white hover:bg-slate-50 mt-1 px-3 py-1.5 border border-slate-300 rounded-md font-medium text-slate-800 text-xs"
                        >
                           Reintentar
                        </button>
                     </div>
                  )}
               </div>
            </div>
         )}
      </div>
   );
}
