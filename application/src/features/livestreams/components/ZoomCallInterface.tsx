"use client";

import uiToolkit, { type SuspensionViewValue } from "@zoom/videosdk-ui-toolkit";
import { User } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
// import "@/app/zoomStyles.css";
import "@zoom/videosdk-ui-toolkit/dist/videosdk-ui-toolkit.css";
import { Button } from "@/components/global/Buttons";
import { useGlobalPopUpContext } from "@/features/globalPopUp/context/GlobalPopUpContext";
import { useZoomSession } from "../contexts/ZoomSessionContext";
import { getZoomTokenAction } from "../serverActions/ZoomSessionActions";

function UsernameInput({ onUserNameSubmit }: { onUserNameSubmit: (username: string) => void }) {
   const [username, setUsername] = useState<string>("");
   const [errorMessage, setErrorMessage] = useState<string | null>(null);

   const { closePopUp } = useGlobalPopUpContext();

   const handleUserNameSubmit = (event?: React.FormEvent) => {
      event?.preventDefault();
      const trimmedUserName = username.trim();
      if (trimmedUserName.length < 2) {
         setErrorMessage("Por favor ingresa tu nombre (mínimo 2 caracteres)");
         return;
      }
      onUserNameSubmit(trimmedUserName);
      closePopUp();
   };

   const isDisabled = username.trim().length < 2;

   return (
      <div className="flex-col! gap-6! flex!">
         <div className="text-center!">
            <div className="justify-center! items-center! bg-blue-100! mx-auto! mb-4! p-3! rounded-full! w-16! h-16! flex!">
               <User className="size-10! text-blue-600!" />
            </div>
            <h3 className="mb-2! font-bold! text-2xl! text-gray-900!">¡Bienvenido!</h3>
            <p className="text-gray-600! leading-relaxed!">Ingresa tu nombre para unirte a la transmisión en vivo</p>
         </div>

         <form onSubmit={handleUserNameSubmit} className="flex-col! gap-6! flex!">
            <div className="items-center! relative! flex!">
               <div className="left-3! text-gray-400! absolute!">
                  <User size={20} />
               </div>
               <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                     setUsername(e.target.value);
                     setErrorMessage(null);
                  }}
                  placeholder="Tu nombre"
                  className="py-4! pr-4! pl-12! border-2! border-gray-200! !focus:border-blue-500 rounded-xl! !focus:outline-none !focus:ring-2 !focus:ring-blue-500 w-full! text-base! transition-all!"
               />
            </div>

            {errorMessage && <p className="text-red-600! text-sm!">{errorMessage}</p>}

            <Button
               type="submit"
               variant="blue"
               disabled={isDisabled}
               className="justify-center! items-center! bg-blue-500! hover:bg-blue-600! py-4! rounded-xl! w-full! font-semibold! text-lg! text-white! transition-all! duration-300! flex!"
            >
               Unirse a la transmisión
            </Button>
         </form>
      </div>
   );
}

export default function ZoomCallInterface({
   initialUsername,
   setIsLoading,
   allowScreenShare = false,
   className = "",
   isHostByDefault = false,
}: {
   initialUsername?: string;
   setIsLoading?: (isLoading: boolean) => void;
   allowScreenShare?: boolean;
   className?: string;
   isHostByDefault?: boolean;
}) {
   const [userName, setUserName] = useState<string | undefined>(initialUsername);
   const containerRef = useRef<HTMLDivElement>(null);
   const sessionJoinedRef = useRef(false);
   const { setSessionId, sessionName, sessionKey } = useZoomSession();

   const isHostParam1 = useSearchParams().get("ishost");
   const isHostParam2 = useSearchParams().get("ishost");

   const isHost = isHostByDefault === true ? true : isHostParam1 === "true" || isHostParam2 === "true";

   console.log("isHost", isHost);

   const { showInPopUp } = useGlobalPopUpContext();

   useEffect(() => {
      if (sessionJoinedRef.current) return; // If the session is already joined, don't join again

      const initiZoom = async () => {
         if (!userName) {
            setIsLoading?.(false);
            showInPopUp(<UsernameInput onUserNameSubmit={setUserName} />);
            return;
         }
         setIsLoading?.(true);

         const { errorMessage, token } = await getZoomTokenAction(
            sessionName,
            userName,
            sessionKey,
            isHost ? "host" : "participant",
         );
         if (errorMessage) {
            console.error("Error getting zoom token", errorMessage);
            toast.error(errorMessage);
            return;
         }

         if (!token) {
            console.error("Error getting zoom token", token);
            toast.error("Error getting zoom token");
            return;
         }

         if (!containerRef.current) {
            console.error("No container found");
            return;
         }

         uiToolkit.joinSession(containerRef.current, {
            sessionName,
            userName: userName,
            sessionIdleTimeoutMins: 60 * 6, // 6 hours
            videoSDKJWT: token,
            language: "es",
            featuresOptions: {
               virtualBackground: {
                  enable: true,
                  allowVirtualBackgroundUpload: true,
               },
               caption: {
                  enable: false,
               },
               invite: {
                  enable: false,
               },
               theme: {
                  enable: true,
                  defaultTheme: "light",
               },
               phone: {
                  enable: false,
               },
               subsession: {
                  enable: false,
               },
               feedback: {
                  enable: false,
               },
               settings: {
                  enable: isHost,
               },
               troubleshoot: {
                  enable: false,
               },
               header: {
                  enable: false,
               },
               viewMode: {
                  enable: true,
                  defaultViewMode: "gallery" as SuspensionViewValue,
                  viewModes: ["minimized", "speaker", "gallery"] as SuspensionViewValue[],
               },
               audio: {
                  enable: true,
                  backgroundNoiseSuppression: true,
               },
               leave: {
                  enable: false,
               },
               share: {
                  enable: allowScreenShare,
               },
               chat: {
                  enable: false,
                  enableEmoji: false,
               },
               users: {
                  enable: isHost,
               },
            },
         });

         uiToolkit.onSessionJoined(async () => {
            console.log("Session joined");
            // Store the session ID in context
            const sessionInfo = uiToolkit.getSessionInfo();
            if (sessionInfo?.sessionId) {
               setSessionId(sessionInfo.sessionId);
            }

            // Mark session as successfully joined.
            sessionJoinedRef.current = true;
            setIsLoading?.(false);
         });

         uiToolkit.onSessionDestroyed(() => {
            setIsLoading?.(false);
         });

         uiToolkit.onSessionClosed(() => {
            setSessionId(null);
            console.log("Session closed");
            sessionJoinedRef.current = false;
            setIsLoading?.(false);
         });
      };

      initiZoom();

      window.addEventListener("pagehide", () => {
         uiToolkit.leaveSession();
         setSessionId(null);
      });
   }, [userName, sessionKey, sessionName, setSessionId, isHost, setIsLoading, allowScreenShare, showInPopUp]);

   return <div ref={containerRef} id="sessionContainer" className={`rounded-3xl! aspect-video! ${className}`} />;
}
