// "use client"

// import { useAuthContext } from "@/contexts/AuthContext"
// import { useZoomSession } from "@/contexts/ZoomSessionContext"
// import { getZoomTokenAction } from "@/serverActions/getZoomTokenAction"
// import uiToolkit, { SuspensionViewValue } from "@zoom/videosdk-ui-toolkit"
// import { Loader2 } from "lucide-react"
// import { useParams } from "next/navigation"
// import {
//    useEffect, useRef, useState
// } from "react"
// import PopUp from "../global/PopUp"
// import { Button } from "../global/Buttons"

// // Separate component for name input to prevent re-renders of the main component
// function NameInputPopup ({ onNameSubmit }: { onNameSubmit: (name: string) => void }) {
//    const [userName, setUserName] = useState<string>("")
//    const [nameError, setNameError] = useState("")

//    const handleNameSubmit = () => {
//       if (!userName.trim()) {
//          setNameError("Por favor ingresa tu nombre")
//          return
//       }
//       onNameSubmit(userName.trim())
//    }

//    return (
//       <PopUp onClose={() => {}}
//          canBeClosed={false}
//       >
//          <div className="flex flex-col gap-4 p-4">
//             <h2 className="font-semibold text-xl text-center">Ingresa tu nombre para unirte a la sesión</h2>
//             <input
//                type="text"
//                value={userName}
//                onChange={(e) => setUserName(e.target.value)}
//                placeholder="Tu nombre completo"
//                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                onKeyDown={(e) => {
//                   if (e.key === 'Enter') {
//                      handleNameSubmit()
//                   }
//                }}
//             />
//             {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
//             <Button onClick={handleNameSubmit}
//                className="w-full"
//             >
//                Unirse a la sesión
//             </Button>
//          </div>
//       </PopUp>
//    )
// }

// // Actual Zoom session component that only renders when we have a name
// function ZoomSession ({
//    sessionName, userName, isHost, conferenceId
// }: {
//    sessionName: string,
//    userName: string,
//    isHost: boolean,
//    conferenceId: string
// }) {
//    const [isLoading, setIsLoading] = useState(true)
//    const containerRef = useRef<HTMLDivElement>(null)
//    const sessionJoinedRef = useRef(false)
//    const { setSessionId } = useZoomSession()

//    useEffect(() => {
//       const initiZoom = async () => {
//          console.log("initiZoom with name:", userName)

//          const {
//             error, token
//          } = await getZoomTokenAction(sessionName, userName, conferenceId, isHost ? "host" : "participant")
//          if (!token) {
//             console.error("Error getting zoom token", error)
//             return
//          }

//          if (!containerRef.current) {
//             console.error("No container found")
//             return
//          }

//          uiToolkit.joinSession(containerRef.current, {
//             sessionName,
//             userName: userName,
//             sessionIdleTimeoutMins: 0,
//             videoSDKJWT: token,
//             language: "es",
//             featuresOptions: {
//                virtualBackground: {
//                   enable: false
//                },
//                caption: {
//                   enable: false
//                },
//                invite: {
//                   enable: false
//                },
//                theme: {
//                   enable: true,
//                   defaultTheme: "light"
//                },
//                phone: {
//                   enable: false
//                },
//                subsession: {
//                   enable: false
//                },
//                feedback: {
//                   enable: false
//                },
//                settings: {
//                   enable: isHost
//                },
//                troubleshoot: {
//                   enable: false
//                },
//                header: {
//                   enable: false
//                },
//                viewMode: {
//                   enable: false,
//                   defaultViewMode: "gallery" as SuspensionViewValue,
//                   viewModes: ["minimized", "speaker", "gallery"] as SuspensionViewValue[],
//                },
//                audio: {
//                   enable: true,
//                   backgroundNoiseSuppression: false,
//                }
//             }
//          })

//          uiToolkit.onSessionJoined(async () => {
//             console.log("Session joined")
//             // Store the session ID in context
//             const sessionInfo = uiToolkit.getSessionInfo()
//             if (sessionInfo?.sessionId) {
//                setSessionId(sessionInfo.sessionId)
//             }
//          })

//          uiToolkit.onSessionClosed(() => {
//             setSessionId(null)
//             console.log("Session closed")
//          })

//          // Mark session as successfully joined.
//          sessionJoinedRef.current = true
//          setIsLoading(false)
//       }

//       initiZoom()

//       const handleBeforeUnload = () => {
//          uiToolkit.leaveSession()
//       }
//       window.addEventListener('beforeunload', handleBeforeUnload)

//       return () => {
//          window.removeEventListener('beforeunload', handleBeforeUnload)
//          if (sessionJoinedRef.current) {
//             setSessionId(null) // Clear sessionId on unmount
//             uiToolkit.leaveSession()
//          }
//       }
//    }, [userName, conferenceId, sessionName, setSessionId, isHost])

//    return (
//       <>
//          {isLoading && (
//             <div className="flex justify-center items-center w-full aspect-video">
//                <Loader2 className="w-10 h-10 animate-spin" />
//             </div>
//          )}
//          <div ref={containerRef}
//             id="sessionContainer"
//             className={`relative rounded-3xl w-full aspect-video overflow-hidden ${isLoading ? "hidden" : ""}`}
//          />
//       </>
//    )
// }

// export default function ZoomSessionInterface ({ sessionName }: { sessionName: string }) {
//    const { user } = useAuthContext()
//    const { conferenceId } = useParams()
//    const [guestName, setGuestName] = useState<string | null>(null)

//    // If no conference ID, show an error
//    if (!conferenceId) {
//       return <div className="p-4 text-red-600 text-center">No se encontró la conferencia</div>
//    }

//    // Use authenticated user if available, otherwise use guest name
//    const effectiveUserName = user?.name || guestName
//    const isHost = user ? (user.role === "admin" || user.role === "coordinator" || user.role === "super_admin") : false

//    // If we don't have a name yet, show the popup
//    if (!effectiveUserName) {
//       return <NameInputPopup onNameSubmit={(name) => setGuestName(name)} />
//    }

//    // Only render the Zoom component when we have a name
//    return (
//       <ZoomSession
//          sessionName={sessionName}
//          userName={effectiveUserName}
//          isHost={isHost}
//          conferenceId={conferenceId as string}
//       />
//    )
// }
