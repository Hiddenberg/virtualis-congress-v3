"use client"

import uiToolkit, { SuspensionViewValue } from "@zoom/videosdk-ui-toolkit"
import { useSearchParams } from "next/navigation"
import {
   useEffect, useRef, useState
} from "react"
import toast from "react-hot-toast"
import { useZoomSession } from "../contexts/ZoomSessionContext"
import { getZoomTokenAction } from "../serverActions/ZoomSessionActions"

import "@/app/zoomStyles.css"
import { User } from "lucide-react"
import { useGlobalPopUpContext } from "@/features/globalPopUp/context/GlobalPopUpContext"

function UsernameInput ({ onUserNameSubmit }: { onUserNameSubmit: (username: string) => void }) {
   const [username, setUsername] = useState<string>("")
   const [errorMessage, setErrorMessage] = useState<string | null>(null)

   const { closePopUp } = useGlobalPopUpContext()

   const handleUserNameSubmit = (event?: React.FormEvent) => {
      event?.preventDefault()
      const trimmedUserName = username.trim()
      if (trimmedUserName.length < 2) {
         setErrorMessage("Por favor ingresa tu nombre")
         return
      }
      onUserNameSubmit(trimmedUserName)
      closePopUp()
   }

   const isDisabled = username.trim().length < 2

   return (
      <div className="mx-auto w-full max-w-md">
         <h2 className="font-semibold text-gray-900 text-xl">¿Cómo te llamas?</h2>
         <p className="mt-1 text-gray-600">Ingresa tu nombre para unirte a la transmisión.</p>

         <form className="mt-6" onSubmit={handleUserNameSubmit}>
            <label htmlFor="username" className="block font-medium text-gray-700 text-sm">Nombre</label>
            <div className="relative mt-2">
               <span className="left-3 absolute inset-y-0 flex items-center text-gray-400">
                  <User size={18} />
               </span>
               <input
                  id="username"
                  name="username"
                  type="text"
                  autoFocus
                  autoComplete="name"
                  className={`!w-full !rounded-xl !border bg-white py-3 !px-4 !pl-10 !text-gray-900 !placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errorMessage ? "border-red-500" : "!border-gray-300"}`}
                  placeholder="Escribe tu nombre"
                  value={username}
                  onChange={(e) => {
                     setUsername(e.target.value)
                     if (errorMessage) setErrorMessage(null)
                  }}
                  aria-invalid={!!errorMessage}
                  aria-describedby={errorMessage ? "username-error" : undefined}
               />
            </div>
            {errorMessage && (
               <p id="username-error" className="mt-2 text-red-600 text-sm">{errorMessage}</p>
            )}

            <div className="flex justify-end items-center gap-3 mt-6">
               <button
                  type="button"
                  onClick={() => {
                     closePopUp()
                  }}
                  className="text-gray-600 hover:text-gray-800"
               >
                  Cancelar
               </button>
               <button
                  type="submit"
                  disabled={isDisabled}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white disabled:cursor-not-allowed"
               >
                  Continuar
               </button>
            </div>
            <p className="mt-3 text-gray-500 text-xs">Este nombre será visible para otros participantes.</p>
         </form>
      </div>
   )
}



export default function ZoomCallInterface ({
   initialUsername,
   setIsLoading,
   allowScreenShare = false,
   className = "",
   isHostByDefault = false,
}: {
   initialUsername?: string
   setIsLoading?: (isLoading: boolean) => void
   allowScreenShare?: boolean
   className?: string
   isHostByDefault?: boolean
}) {
   const [userName, setUserName] = useState<string | undefined>(initialUsername)
   const containerRef = useRef<HTMLDivElement>(null)
   const sessionJoinedRef = useRef(false)
   const {
      setSessionId, sessionName, sessionKey
   } = useZoomSession()

   const isHostParam = useSearchParams()
      .get("ishost")
   const isHost = isHostByDefault === true ? true : isHostParam === "true"

   console.log("isHost", isHost)

   const { showInPopUp } = useGlobalPopUpContext()

   useEffect(() => {
      if (sessionJoinedRef.current) return // If the session is already joined, don't join again

      const initiZoom = async () => {
         setIsLoading?.(true)
         if (!userName) {
            showInPopUp(
               <UsernameInput onUserNameSubmit={setUserName} />
            )
            return
         }

         const {
            errorMessage, token
         } = await getZoomTokenAction(sessionName, userName, sessionKey, isHost ? "host" : "participant")
         if (errorMessage) {
            console.error("Error getting zoom token", errorMessage)
            toast.error(errorMessage)
            return
         }

         if (!token) {
            console.error("Error getting zoom token", token)
            toast.error("Error getting zoom token")
            return
         }

         if (!containerRef.current) {
            console.error("No container found")
            return
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
                  enable: false
               },
               invite: {
                  enable: false
               },
               theme: {
                  enable: true,
                  defaultTheme: "light"
               },
               phone: {
                  enable: false
               },
               subsession: {
                  enable: false
               },
               feedback: {
                  enable: false
               },
               settings: {
                  enable: isHost
               },
               troubleshoot: {
                  enable: false
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
                  enable: false
               },
               share: {
                  enable: allowScreenShare,
               },
               chat: {
                  enable: false,
                  enableEmoji: false
               },
               users: {
                  enable: false,
               }
            },
         })

         uiToolkit.onSessionJoined(async () => {
            console.log("Session joined")
            // Store the session ID in context
            const sessionInfo = uiToolkit.getSessionInfo()
            if (sessionInfo?.sessionId) {
               setSessionId(sessionInfo.sessionId)
            }

            // Mark session as successfully joined.
            sessionJoinedRef.current = true
            setIsLoading?.(false)
         })

         uiToolkit.onSessionDestroyed(() => {
            setIsLoading?.(false)
         })

         uiToolkit.onSessionClosed(() => {
            setSessionId(null)
            console.log("Session closed")
            sessionJoinedRef.current = false
            setIsLoading?.(false)
         })
      }

      initiZoom()

      window.addEventListener('pagehide', () => {
         uiToolkit.leaveSession()
         setSessionId(null)
      })
   }, [userName, sessionKey, sessionName, setSessionId, isHost, setIsLoading, allowScreenShare, showInPopUp])

   return (
      <div ref={containerRef}
         id="sessionContainer"
         className={`!rounded-3xl !aspect-video ${className}`}
      />
   )
}