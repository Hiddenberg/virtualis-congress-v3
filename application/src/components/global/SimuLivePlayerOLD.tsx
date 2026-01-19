// "use client"

// import {
//    useEffect, useRef, useState, useCallback, useMemo, memo
// } from "react"
// import MuxPlayer from "@mux/mux-player-react"
// import { ConferenceVideoAsset } from "@/types/congress"
// import { RecordModel } from "pocketbase"

// import { getServerTime } from "@/actions/timeActions"
// import {
//    Play, Volume2, VolumeX, AlertTriangle
// } from "lucide-react"

// import ConferenceFinishedScreen from "@/components/conferenceStageScreens/ConferenceFinishedScreen"
// import WaitingToStartScreen from "@/components/conferenceStageScreens/WaitingToStartScreen"

// export interface SimuLivePlayerProps {
//    conferenceStartTime: string
//    presentationMuxAssets: (ConferenceVideoAsset & RecordModel)[] | null
//    conferenceMuxAssets: (ConferenceVideoAsset & RecordModel)[] | null
//    conferenceData: CongressConference & RecordModel
//    presentationDuration: number
//    conferenceDuration: number
// }

// // Create a memoized MuxPlayer component to prevent re-renders
// const MemoizedMuxPlayer = memo(
//    ({
//       playbackId,
//       startTime,
//       autoPlay,
//       muted,
//       streamType,
//       metadata,
//       onSeeking,
//       onSeeked,
//       onEnded,
//       onError,
//       onLoadStart,
//       onPlay,
//       onPause
//    }: {
//       playbackId: string;
//       startTime: number;
//       autoPlay: "any" | "muted" | "play" | undefined;
//       muted: boolean;
//       streamType: "on-demand" | "live" | undefined;
//       metadata: {
//          phase: "waiting" | "presentation" | "conference" | "ended";
//          offset: number;
//          type: string;
//       };
//       onSeeking: (event: Event) => void;
//       onSeeked: (event: Event) => void;
//       onEnded: () => void;
//       onError: (event: Event) => void;
//       onLoadStart?: () => void;
//       onPlay?: () => void;
//       onPause?: () => void;
//    }) => {
//       return (
//          <MuxPlayer
//             playbackId={playbackId}
//             streamType={streamType}
//             startTime={startTime}
//             autoPlay={autoPlay}
//             muted={muted}
//             className="w-full h-full"
//             primaryColor="#ffffff"
//             secondaryColor="#000000"
//             accentColor="#fa50b5"
//             style={{
//                '--controls': 'none',
//                // Add explicit dimensions for Safari
//                width: '100%',
//                height: '100%',
//                display: 'block' // Force block display for Safari
//             } as React.CSSProperties}
//             metadata={metadata}
//             onError={onError}
//             onSeeking={onSeeking}
//             onSeeked={onSeeked}
//             onEnded={onEnded}
//             onLoadStart={onLoadStart}
//             onPlay={onPlay}
//             onPause={onPause}
//          />
//       );
//    },
//    (prevProps, nextProps) => {
//       // Only re-render if these specific props change
//       return (
//          prevProps.playbackId === nextProps.playbackId &&
//          prevProps.muted === nextProps.muted &&
//          Math.abs(prevProps.startTime - nextProps.startTime) < 5 // Only re-render for significant time changes
//       );
//    }
// );

// // Add display name
// MemoizedMuxPlayer.displayName = 'MemoizedMuxPlayer';

// export default function SimuLivePlayer ({
//    conferenceStartTime,
//    presentationMuxAssets,
//    conferenceMuxAssets,
//    conferenceData,
//    presentationDuration,
//    conferenceDuration
// }: SimuLivePlayerProps) {
//    const [currentTime, setCurrentTime] = useState<Date | null>(null)
//    const [serverTimeDiff, setServerTimeDiff] = useState<number>(0) // Time difference between server and client
//    const [isLive, setIsLive] = useState(false)
//    const [currentPhase, setCurrentPhase] = useState<"waiting" | "presentation" | "conference" | "ended">("waiting")
//    const [timeOffset, setTimeOffset] = useState(0)
//    const [activeAssets, setActiveAssets] = useState<(ConferenceVideoAsset & RecordModel)[] | null>(null)
//    const [soundEnabled, setSoundEnabled] = useState(false)
//    const [userInteracted, setUserInteracted] = useState(false)
//    const [hasError, setHasError] = useState(false)
//    const [errorMessage, setErrorMessage] = useState("")
//    // New state to track if countdown is active
//    const [countdownActive, setCountdownActive] = useState(true)

//    const totalDuration = presentationDuration + conferenceDuration

//    const animationFrameRef = useRef<number | null>(null)
//    const playerRefs = useRef<(HTMLDivElement | null)[]>([])
//    const conferenceStartRef = useRef<Date>(new Date(conferenceStartTime))
//    const lastTimeOffsetRef = useRef<number>(0)
//    const syncsPerformedRef = useRef<number>(0)
//    const countdownTimerRef = useRef<number | null>(null)

//    // Debug logging
//    useEffect(() => {
//       console.log("[SimuLivePlayer] Durations:", {
//          presentationDuration,
//          conferenceDuration,
//          totalDuration,
//          phase: currentPhase,
//          timeOffset,
//          presentationAssets: presentationMuxAssets?.length || 0,
//          conferenceAssets: conferenceMuxAssets?.length || 0
//       });
//    }, [presentationDuration, conferenceDuration, totalDuration, currentPhase, timeOffset, presentationMuxAssets, conferenceMuxAssets]);

//    // Validate assets and durations
//    useEffect(() => {
//       // Check if we have valid presentation assets if presentation duration > 0
//       if (presentationDuration > 0 && (!presentationMuxAssets || presentationMuxAssets.length === 0)) {
//          console.warn("[SimuLivePlayer] Warning: Presentation duration > 0 but no presentation assets available");
//       }

//       // Check if we have valid conference assets if conference duration > 0
//       if (conferenceDuration > 0 && (!conferenceMuxAssets || conferenceMuxAssets.length === 0)) {
//          console.warn("[SimuLivePlayer] Warning: Conference duration > 0 but no conference assets available");
//       }

//       // Check if we have at least one set of assets
//       if ((!presentationMuxAssets || presentationMuxAssets.length === 0) && (!conferenceMuxAssets || conferenceMuxAssets.length === 0)) {
//          setHasError(true);
//          setErrorMessage("No se encontraron videos para esta conferencia.");
//       }
//    }, [presentationMuxAssets, conferenceMuxAssets, presentationDuration, conferenceDuration]);

//    // Define a function to synchronize all players
//    const synchronizePlayers = useCallback(() => {
//       if (!activeAssets || !isLive) return

//       try {
//          const assetsToDisplay = getVideoAssetsToDisplay(activeAssets)
//          if (assetsToDisplay.length <= 1) return // No need to sync if only one video

//          // Find all Mux player elements
//          const players = playerRefs.current
//             .map(ref => ref?.querySelector('mux-player') as HTMLMediaElement)
//             .filter(Boolean)

//          if (players.length <= 1) return

//          // Get reference player (typically camera/combined)
//          const referencePlayer = players.find((_, idx) => {
//             const asset = assetsToDisplay[idx]
//             return asset && (asset.videoType === "camera" || asset.videoType === "combined")
//          }) || players[0]

//          if (!referencePlayer) return

//          // Sync all other players to the reference player
//          const refTime = referencePlayer.currentTime

//          players.forEach(player => {
//             if (player === referencePlayer) return

//             // Only sync if drift is more than 0.2 seconds
//             if (Math.abs(player.currentTime - refTime) > 0.2) {
//                player.currentTime = refTime
//                syncsPerformedRef.current++
//                console.log(`[SimuLivePlayer] Synced player to ${refTime.toFixed(2)}s (sync #${syncsPerformedRef.current})`)
//             }
//          })
//       } catch (error) {
//          console.error("[SimuLivePlayer] Error in synchronizePlayers:", error)
//       }
//    }, [activeAssets, isLive])

//    // Initial setup of the conference based on current time
//    const initializeConferenceState = useCallback((currentDateTime: Date) => {
//       try {
//          const conferenceStart = conferenceStartRef.current
//          const timeDiff = currentDateTime.getTime() - conferenceStart.getTime()

//          console.log("[SimuLivePlayer] Initial time difference:", timeDiff / 1000, "seconds since start")

//          // If the conference hasn't started yet
//          if (timeDiff < 0) {
//             setCurrentPhase("waiting")
//             setIsLive(false)
//             setCountdownActive(true)
//             return
//          }

//          // Conference has started - disable countdown timer
//          setCountdownActive(false)
//          setIsLive(true)

//          // Calculate which phase we're in and the time offset
//          if (timeDiff < presentationDuration * 1000) {
//             // Skip presentation phase if we don't have presentation assets
//             if (!presentationMuxAssets || presentationMuxAssets.length === 0) {
//                // Go directly to conference phase if we have conference assets
//                if (conferenceMuxAssets && conferenceMuxAssets.length > 0) {
//                   console.log("[SimuLivePlayer] Skipping presentation phase (no assets)")
//                   setCurrentPhase("conference")
//                   setActiveAssets(conferenceMuxAssets)
//                   setTimeOffset(0)
//                   lastTimeOffsetRef.current = 0
//                } else {
//                   console.error("[SimuLivePlayer] No presentation or conference assets available")
//                   setHasError(true)
//                   setErrorMessage("No se encontraron videos para esta fase de la conferencia.")
//                   setIsLive(false)
//                }
//             } else {
//                // We're in the presentation phase with assets
//                console.log("[SimuLivePlayer] Starting in presentation phase")
//                setCurrentPhase("presentation")
//                setActiveAssets(presentationMuxAssets)

//                const newOffset = Math.floor(timeDiff / 1000)
//                setTimeOffset(newOffset)
//                lastTimeOffsetRef.current = newOffset
//             }
//          } else if (timeDiff < totalDuration * 1000) {
//             // Skip conference phase if we don't have conference assets
//             if (!conferenceMuxAssets || conferenceMuxAssets.length === 0) {
//                console.log("[SimuLivePlayer] Ending early (no conference assets)")
//                setCurrentPhase("ended")
//                setIsLive(false)
//             } else {
//                // We're in the conference phase with assets
//                console.log("[SimuLivePlayer] Starting in conference phase")
//                setCurrentPhase("conference")
//                setActiveAssets(conferenceMuxAssets)

//                const newOffset = Math.floor((timeDiff - presentationDuration * 1000) / 1000)
//                setTimeOffset(newOffset)
//                lastTimeOffsetRef.current = newOffset
//             }
//          } else {
//             // The conference has ended
//             console.log("[SimuLivePlayer] Conference has already ended")
//             setCurrentPhase("ended")
//             setIsLive(false)
//          }
//       } catch (error) {
//          console.error("[SimuLivePlayer] Error in initializeConferenceState:", error)
//          setHasError(true)
//          setErrorMessage("Error al sincronizar el estado de la conferencia.")
//       }
//    }, [presentationDuration, presentationMuxAssets, conferenceMuxAssets, totalDuration]);

//    // Initialize time and check if the conference is live
//    useEffect(() => {
//       const initializeTime = async () => {
//          try {
//             // Reset error state on initialization
//             setHasError(false)
//             setErrorMessage("")

//             // Get server time and calculate the difference with the client time
//             const serverTimeString = await getServerTime()
//             const serverTime = new Date(serverTimeString)
//             const clientTime = new Date()

//             // Set conference start reference
//             conferenceStartRef.current = new Date(conferenceStartTime)

//             // Calculate difference between server time and client time in milliseconds
//             const diff = serverTime.getTime() - clientTime.getTime()
//             setServerTimeDiff(diff)

//             // Use server time initially
//             setCurrentTime(serverTime)

//             // Initial setup of conference state
//             initializeConferenceState(serverTime)
//          } catch (error) {
//             console.error("[SimuLivePlayer] Error initializing time:", error)
//             setHasError(true)
//             setErrorMessage("Error al sincronizar con el servidor. Por favor, recarga la página.")
//          }
//       }

//       initializeTime()

//       const currentCountdownTimer = countdownTimerRef.current;

//       // Cleanup function
//       return () => {
//          if (animationFrameRef.current) {
//             cancelAnimationFrame(animationFrameRef.current)
//          }
//          if (currentCountdownTimer) {
//             clearTimeout(currentCountdownTimer)
//          }
//       }
//    }, [conferenceStartTime, initializeConferenceState])

//    // Only update time for countdown before the conference starts
//    useEffect(() => {
//       // Only run this effect if we're in the waiting phase and countdown is active
//       if (currentPhase !== "waiting" || !countdownActive || hasError) {
//          return
//       }

//       // Clear any existing animation frame
//       if (animationFrameRef.current) {
//          cancelAnimationFrame(animationFrameRef.current)
//       }

//       let lastTimestamp = 0
//       let accumulatedTime = 0

//       const updateCountdown = (timestamp: number) => {
//          // Calculate time delta since last frame
//          const delta = lastTimestamp ? timestamp - lastTimestamp : 0
//          lastTimestamp = timestamp

//          // Accumulate time and only update state on ~1 second intervals
//          accumulatedTime += delta

//          // Only update time state every ~1000ms to avoid too many re-renders
//          if (accumulatedTime >= 1000) {
//             accumulatedTime = 0 // Reset accumulated time

//             // Use client time but adjust for the calculated server-client time difference
//             const clientNow = new Date()
//             const adjustedTime = new Date(clientNow.getTime() + serverTimeDiff)

//             // Update time state
//             setCurrentTime(adjustedTime)

//             // Calculate absolute time since conference start
//             const conferenceStart = conferenceStartRef.current
//             const timeDiff = conferenceStart.getTime() - adjustedTime.getTime()

//             // If the countdown has finished, start the conference
//             if (timeDiff <= 0) {
//                console.log("[SimuLivePlayer] Countdown finished, starting conference")
//                setCountdownActive(false)
//                initializeConferenceState(adjustedTime)
//                return
//             }
//          }

//          // Continue animation loop only if we're still counting down
//          if (countdownActive) {
//             animationFrameRef.current = requestAnimationFrame(updateCountdown)
//          }
//       }

//       // Start animation loop
//       animationFrameRef.current = requestAnimationFrame(updateCountdown)

//       // Cleanup
//       return () => {
//          if (animationFrameRef.current) {
//             cancelAnimationFrame(animationFrameRef.current)
//          }
//       }
//    }, [currentPhase, countdownActive, hasError, serverTimeDiff, initializeConferenceState])

//    // Add event listeners to Mux players for better synchronization
//    useEffect(() => {
//       if (!activeAssets || !isLive) return

//       const handleTimeUpdate = () => {
//          synchronizePlayers()
//       }

//       const assetsToDisplay = getVideoAssetsToDisplay(activeAssets)

//       setTimeout(() => {
//          playerRefs.current.forEach((ref, index) => {
//             if (!ref) return

//             const player = ref.querySelector('mux-player') as HTMLMediaElement
//             if (!player) return

//             // Add event listeners only if we have multiple videos
//             if (assetsToDisplay.length > 1) {
//                // Check if this is a reference player (camera or combined)
//                const asset = assetsToDisplay[index]
//                if (asset && (asset.videoType === "camera" || asset.videoType === "combined")) {
//                   player.addEventListener('timeupdate', handleTimeUpdate)
//                }
//             }
//          })
//       }, 1000) // Short delay to ensure players are mounted

//       // Cleanup
//       return () => {
//          playerRefs.current.forEach(ref => {
//             if (!ref) return
//             const player = ref.querySelector('mux-player') as HTMLMediaElement
//             if (player) {
//                player.removeEventListener('timeupdate', handleTimeUpdate)
//             }
//          })
//       }
//    }, [activeAssets, isLive, synchronizePlayers])

//    // Helper function to determine which video assets to display
//    const getVideoAssetsToDisplay = (assets: (ConferenceVideoAsset & RecordModel)[] | null) => {
//       if (!assets || assets.length === 0) return []

//       // Check if there's a combined asset
//       const combinedAsset = assets.find(asset => asset.videoType === "combined")
//       if (combinedAsset) return [combinedAsset]

//       // Otherwise use camera and screen if available
//       const result = []
//       const cameraAsset = assets.find(asset => asset.videoType === "camera")
//       const screenAsset = assets.find(asset => asset.videoType === "screen")

//       // Add screen first, then camera to ensure screen is displayed on the left
//       if (screenAsset) result.push(screenAsset)
//       if (cameraAsset) result.push(cameraAsset)

//       // If we have no assets at all, log warning
//       if (result.length === 0) {
//          console.warn("[SimuLivePlayer] No valid video assets found in:", assets)
//       }

//       return result
//    }

//    // Handle enabling sound for all players
//    const handleEnableSound = useCallback(() => {
//       setUserInteracted(true)
//       setSoundEnabled(true)

//       try {
//          const assetsToDisplay = activeAssets ? getVideoAssetsToDisplay(activeAssets) : [];
//          const hasMultipleVideos = assetsToDisplay.length >= 2;

//          // Process each player
//          playerRefs.current.forEach((ref, index) => {
//             if (!ref) return;

//             const player = ref.querySelector('mux-player') as HTMLMediaElement;
//             if (player) {
//                // Determine if this is a camera video or the only video
//                const asset = assetsToDisplay[index];
//                if (!asset) return;

//                const isCamera = asset.videoType === "camera" || asset.videoType === "combined";

//                // Only unmute the camera video if there are multiple videos, or unmute the only video
//                if (!hasMultipleVideos || (hasMultipleVideos && isCamera)) {
//                   player.muted = false;
//                   if (player.paused) {
//                      player.play()
//                         .catch(err => console.error('[SimuLivePlayer] Error playing after unmute:', err));
//                   }
//                }
//             }
//          });
//       } catch (error) {
//          console.error("[SimuLivePlayer] Error enabling sound:", error);
//       }
//    }, [activeAssets])

//    // Handle toggling sound for all players
//    const handleToggleSound = useCallback(() => {
//       setSoundEnabled(!soundEnabled);

//       try {
//          const assetsToDisplay = activeAssets ? getVideoAssetsToDisplay(activeAssets) : [];
//          const hasMultipleVideos = assetsToDisplay.length >= 2;

//          // Find all Mux player elements
//          playerRefs.current.forEach((ref, index) => {
//             if (!ref) return;

//             const player = ref.querySelector('mux-player') as HTMLMediaElement;
//             if (player) {
//                // Determine if this is a camera video or the only video
//                const asset = assetsToDisplay[index];
//                if (!asset) return;

//                const isCamera = asset.videoType === "camera" || asset.videoType === "combined";

//                // Only toggle sound for camera video if there are multiple videos, or toggle the only video
//                if (!hasMultipleVideos || (hasMultipleVideos && isCamera)) {
//                   player.muted = soundEnabled;
//                }
//             }
//          });
//       } catch (error) {
//          console.error("[SimuLivePlayer] Error toggling sound:", error);
//       }
//    }, [activeAssets, soundEnabled])

//    // Helper function to detect Safari
//    const isSafari = useMemo(() => {
//       if (typeof window === 'undefined') return false;
//       return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
//    }, []);

//    useEffect(() => {
//       // Log browser information for debugging
//       console.log("[SimuLivePlayer] Browser detection:", {
//          userAgent: navigator?.userAgent,
//          isSafari,
//          platform: navigator?.platform,
//       });
//    }, [isSafari]);

//    // Memoize the video players to prevent unnecessary re-renders
//    const memoizedVideoPlayers = useMemo(() => {
//       if (hasError) return null
//       if (!isLive || !activeAssets) return null

//       try {
//          const assetsToDisplay = getVideoAssetsToDisplay(activeAssets)
//          if (assetsToDisplay.length === 0) {
//             console.warn("[SimuLivePlayer] No assets to display in renderVideoPlayers")
//             return (
//                <div className="bg-yellow-50 my-4 p-4 border border-yellow-200 rounded-lg">
//                   <div className="flex items-center">
//                      <AlertTriangle size={20}
//                         className="mr-2 text-yellow-600"
//                      />
//                      <p className="text-yellow-800">No se encontraron videos para esta fase de la conferencia.</p>
//                   </div>
//                </div>
//             )
//          }

//          const hasMultipleVideos = assetsToDisplay.length >= 2

//          // Initialize refs array with proper length
//          if (playerRefs.current.length !== assetsToDisplay.length) {
//             playerRefs.current = Array(assetsToDisplay.length)
//                .fill(null)
//          }

//          // Debug what we're about to render
//          console.log("[SimuLivePlayer] Rendering videos:", {
//             assetsCount: assetsToDisplay.length,
//             firstAsset: assetsToDisplay[0]?.muxPlaybackId,
//             phase: currentPhase,
//             timeOffset,
//             isSafari
//          });

//          return (
//             <div>
//                <div className="flex justify-end mb-2">
//                   {userInteracted ? (
//                      <button
//                         onClick={handleToggleSound}
//                         className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-full text-white"
//                      >
//                         {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
//                         <span>{soundEnabled ? "Silenciar" : "Activar sonido"}</span>
//                      </button>
//                   ) : (
//                      <button
//                         onClick={handleEnableSound}
//                         className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-full text-white"
//                      >
//                         <Play size={16} />
//                         <span>Activar sonido</span>
//                      </button>
//                   )}
//                </div>
//                <div className="relative flex gap-1 bg-black px-2 rounded-lg aspect-video g">
//                   {assetsToDisplay.map((asset, index) => {
//                      if (!asset || !asset.muxPlaybackId) {
//                         alert("Invalid asset or missing muxPlaybackId: " + JSON.stringify(asset))
//                         console.warn("[SimuLivePlayer] Invalid asset or missing muxPlaybackId:", asset)
//                         return null
//                      }

//                      const isCamera = asset.videoType === "camera" || asset.videoType === "combined"
//                      const isScreenVideo = asset.videoType === "screen"
//                      const isSingleVideo = assetsToDisplay.length === 1

//                      // Determine which videos should be muted:
//                      // - If it's screen video in a multi-video setup, it should always be muted
//                      // - If sound is not enabled, all videos should be muted
//                      // - Otherwise, only unmute camera or single videos
//                      const shouldMute = (!isSingleVideo && isScreenVideo) || !soundEnabled

//                      const getVideoStyle = () => {
//                         if (isSingleVideo) return "w-full"

//                         if (hasMultipleVideos) {
//                            if (isScreenVideo) return "w-4/5 flex-2"
//                            if (isCamera) return "w-1/5 flex-1"
//                         }
//                      }

//                      const handlePlayerEvent = (event: Event) => {
//                         // For sync events
//                         if (event.type === 'seeking' || event.type === 'seeked') {
//                            // Only trigger synchronization on reference player events
//                            if ((isCamera || isSingleVideo) && hasMultipleVideos) {
//                               synchronizePlayers()
//                            }
//                         }
//                      }

//                      console.log("*****[SimuLivePlayer] Rendering video player****", {
//                         muxPlaybackId: asset.muxPlaybackId,
//                         videoType: asset.videoType,
//                         timeOffset
//                      })
//                      return (
//                         <div key={asset.id}
//                            className={`flex ${getVideoStyle()}`}
//                         >
//                            <div
//                               className={`bg-green-500 rounded-lg aspect-video overflow-hidden w-full`}
//                               style={{
//                                  position: 'relative',
//                                  minHeight: '200px'
//                               }} // Force minimum height
//                               ref={(el) => {
//                                  playerRefs.current[index] = el
//                               }}
//                            >
//                               {/* Add fallback element for debug purposes */}
//                               <div
//                                  className="absolute inset-0 flex justify-center items-center bg-gray-800 text-white text-sm"
//                                  style={{
//                                     zIndex: 1
//                                  }}
//                               >
//                                  {asset.muxPlaybackId ? 'Cargando video...' : 'Error: ID de video no disponible'}
//                               </div>

//                               <div style={{
//                                  position: 'relative',
//                                  zIndex: 2,
//                                  width: '100%',
//                                  height: '100%'
//                               }}
//                               >
//                                  <MemoizedMuxPlayer
//                                     playbackId={asset.muxPlaybackId || ""}
//                                     streamType="on-demand"
//                                     startTime={timeOffset}
//                                     autoPlay="any"
//                                     muted={shouldMute}
//                                     onLoadStart={() => {
//                                        console.log("*****[SimuLivePlayer] MuxPlayer loaded****", {
//                                           muxPlaybackId: asset.muxPlaybackId,
//                                           videoType: asset.videoType
//                                        })
//                                     }}
//                                     onPlay={() => {
//                                        console.log("*****[SimuLivePlayer] MuxPlayer playing****", {
//                                           muxPlaybackId: asset.muxPlaybackId,
//                                           videoType: asset.videoType
//                                        })
//                                     }}
//                                     onPause={() => {
//                                        console.log("*****[SimuLivePlayer] MuxPlayer paused****", {
//                                           muxPlaybackId: asset.muxPlaybackId,
//                                           videoType: asset.videoType
//                                        })
//                                     }}
//                                     metadata={{
//                                        phase: currentPhase,
//                                        offset: timeOffset,
//                                        type: asset.videoType
//                                     }}
//                                     onError={(event) => {
//                                        console.error("[SimuLivePlayer] MuxPlayer error:", {
//                                           event,
//                                           muxPlaybackId: asset.muxPlaybackId,
//                                           videoType: asset.videoType,
//                                           isSafari
//                                        })
//                                     }}
//                                     onSeeking={handlePlayerEvent}
//                                     onSeeked={handlePlayerEvent}
//                                     onEnded={() => {
//                                        // Handle end of video - useful for phase transitions
//                                        if (currentPhase === "presentation" && isCamera) {
//                                           if (conferenceMuxAssets && conferenceMuxAssets.length > 0) {
//                                              console.log("[SimuLivePlayer] Presentation video ended, transitioning to conference")
//                                              setCurrentPhase("conference")
//                                              setActiveAssets(conferenceMuxAssets)
//                                              setTimeOffset(0)
//                                              lastTimeOffsetRef.current = 0
//                                           } else {
//                                              console.log("[SimuLivePlayer] Presentation ended with no conference assets, ending")
//                                              setCurrentPhase("ended")
//                                              setIsLive(false)
//                                           }
//                                        } else if (currentPhase === "conference" && isCamera) {
//                                           console.log("[SimuLivePlayer] Conference video ended")
//                                           setCurrentPhase("ended")
//                                           setIsLive(false)
//                                        }
//                                     }}
//                                  />
//                               </div>
//                            </div>
//                         </div>
//                      )
//                   })}

//                   {/* Global overlay that covers the entire video container */}
//                   {!userInteracted && (
//                      <div
//                         className="z-10 absolute inset-0 flex justify-center items-center bg-blue-500 bg-opacity-50 cursor-pointer"
//                         onClick={handleEnableSound}
//                      >
//                         <div className="bg-white bg-opacity-90 p-4 rounded-full">
//                            <Play size={32}
//                               className="text-blue-600"
//                            />
//                         </div>
//                         <span className="absolute mt-20 font-medium text-white">
//                            Haz clic para activar el sonido
//                         </span>
//                      </div>
//                   )}

//                   {/* Safari-specific message */}
//                   {isSafari && (
//                      <div className="right-2 bottom-2 absolute bg-black bg-opacity-70 px-2 py-1 rounded text-white text-xs">
//                         Safari detectado
//                      </div>
//                   )}
//                </div>
//             </div>
//          )
//       } catch (error) {
//          console.error("[SimuLivePlayer] Error rendering video players:", error)
//          return (
//             <div className="bg-red-50 my-4 p-4 border border-red-200 rounded-lg">
//                <div className="flex items-center">
//                   <AlertTriangle size={20}
//                      className="mr-2 text-red-600"
//                   />
//                   <p className="text-red-800">Error al cargar los reproductores de video.</p>
//                </div>
//             </div>
//          )
//       }
//    }, [
//       activeAssets,
//       timeOffset,
//       isLive,
//       currentPhase,
//       soundEnabled,
//       userInteracted,
//       hasError,
//       synchronizePlayers,
//       handleToggleSound,
//       handleEnableSound,
//       conferenceMuxAssets,
//       isSafari
//    ]);

//    // Render status information - memoize this too
//    const memoizedStatusInfo = useMemo(() => {

//       // Handle error state
//       if (hasError) {
//          return (
//             <div className="flex flex-col justify-center items-center bg-red-50 mb-4 p-4 border border-red-200 rounded-lg aspect-video">
//                <div className="flex items-center">
//                   <AlertTriangle size={20}
//                      className="mr-2 text-red-600"
//                   />
//                   <h2 className="font-semibold text-red-800 text-lg">
//                      Error
//                   </h2>
//                </div>
//                <p className="mt-1 text-red-700">
//                   {errorMessage || "Ocurrió un error al cargar la transmisión."}
//                </p>
//             </div>
//          )
//       }

//       if (currentPhase === "waiting") {
//          return (
//             <WaitingToStartScreen
//                conferenceTitle={conferenceData.title}
//                startTime={conferenceStartTime}
//                serverTimeOffsetMs={serverTimeDiff}
//                onTimeOut={() => {
//                   setCountdownActive(false)
//                   const adjustedTime = new Date(Date.now() + serverTimeDiff)
//                   initializeConferenceState(adjustedTime)
//                }}
//             />
//          )
//       }

//       if (currentPhase === "ended") {
//          return (
//             <ConferenceFinishedScreen
//                conferenceTitle={conferenceData.title}
//                conferenceId={conferenceData.id}
//                startTime={conferenceStartTime}
//             />
//          )
//       }

//       return null
//    }, [currentPhase, hasError, errorMessage, conferenceStartTime, conferenceData, serverTimeDiff, initializeConferenceState]);

//    return (
//       <div className="flex flex-col gap-4">
//          {memoizedStatusInfo}
//          {memoizedVideoPlayers}
//       </div>
//    )
// }
