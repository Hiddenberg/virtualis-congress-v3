// "use client"

// import {
//    useEffect, useRef, useState
// } from "react";
// import MuxPlayer from "@mux/mux-player-react";
// import { useQnARealtimeLivestreamStatus } from "@/contexts/QnARealtimeLivestreamStatusContext";
// import {
//    AlertCircle, Calendar, Clock, Pause, Play, PlayCircle, SkipForward, Video, Volume2, VolumeX, X
// } from "lucide-react";
// import { LinkButton } from "../Buttons";
// import { getLivestreamSessionZoomLinkAction } from "@/actions/livestreamActions";
// import { useParams } from "next/navigation";

// export default function LiveVideoPlayer ({ playbackId }: { playbackId: string }) {
//    const { attendantStatus } = useQnARealtimeLivestreamStatus();
//    const [soundEnabled, setSoundEnabled] = useState(false);
//    const [userInteracted, setUserInteracted] = useState(false);
//    const playerRef = useRef<HTMLDivElement | null>(null);
//    const [zoomLink, setZoomLink] = useState<string | null>(null);

//    const { conferenceId } = useParams()

//    useEffect(() => {
//       if (attendantStatus === "moved_to_zoom") {
//          const getZoomLink = async () => {
//             console.log("getting zoom link")
//             console.log(conferenceId)
//             if (!conferenceId) {
//                return
//             }

//             const {
//                success, zoomLink
//             } = await getLivestreamSessionZoomLinkAction(conferenceId as string)

//             if (!success) {
//                alert("Error al obtener el enlace de Zoom")
//                return
//             }

//             if (zoomLink) {
//                setZoomLink(zoomLink)
//             }
//          }

//          getZoomLink()
//       }
//    }, [attendantStatus, conferenceId])

//    const statusMessages = {
//       scheduled: {
//          title: "Transmisión programada",
//          description: "La transmisión comenzará en la fecha y hora programada. Vuelva a esta página en el momento indicado.",
//          icon: <Calendar className="w-12 h-12 text-blue-500" />
//       },
//       preparing: {
//          title: "Preparando transmisión",
//          description: "Estamos configurando todo para iniciar la transmisión. Por favor, espere un momento.",
//          icon: <Clock className="w-12 h-12 text-blue-500" />
//       },
//       streaming: {
//          title: "En vivo",
//          description: "Transmisión en directo. Disfrute del contenido.",
//          icon: <PlayCircle className="w-12 h-12 text-green-500" />
//       },
//       paused: {
//          title: "Transmisión en pausa",
//          description: "La transmisión está en pausa momentáneamente. Volveremos en breve.",
//          icon: <Pause className="w-12 h-12 text-amber-500" />
//       },
//       ended: {
//          title: "Transmisión finalizada",
//          description: "La transmisión ha terminado. Pronto estará disponible la grabación.",
//          icon: <AlertCircle className="w-12 h-12 text-amber-500" />
//       },
//       canceled: {
//          title: "Transmisión cancelada",
//          description: "Lamentamos informar que esta transmisión ha sido cancelada.",
//          icon: <X className="w-12 h-12 text-red-500" />
//       },
//       skipped: {
//          title: "Transmisión omitida",
//          description: "Esta conferencia no tendrá una sesión de preguntas y respuestas.",
//          icon: <SkipForward className="w-12 h-12 text-slate-500" />
//       },
//       moved_to_zoom: {
//          title: "Trasladado a Zoom",
//          description: "Esta sesión se realizará a través de Zoom. Por favor, ingrese al enlace de Zoom para ver la sesión.",
//          icon: <AlertCircle className="w-12 h-12 text-blue-500" />
//       },
//       error: {
//          title: "Error en la transmisión",
//          description: "Ha ocurrido un problema con la transmisión. Estamos trabajando para solucionarlo.",
//          icon: <AlertCircle className="w-12 h-12 text-red-500" />
//       }
//    };

//    // Default to 'preparing' if status is not recognized or null
//    const currentStatus = attendantStatus && attendantStatus in statusMessages ? attendantStatus : "preparing";
//    const message = statusMessages[currentStatus as keyof typeof statusMessages];

//    // Handle enabling sound for the player
//    const handleEnableSound = () => {
//       setUserInteracted(true);
//       setSoundEnabled(true);

//       try {
//          if (playerRef.current) {
//             const player = playerRef.current.querySelector('mux-player') as HTMLMediaElement;
//             if (player) {
//                player.muted = false;
//                if (player.paused) {
//                   player.play()
//                      .catch(err => console.error('Error playing after unmute:', err));
//                }
//             }
//          }
//       } catch (error) {
//          console.error("Error enabling sound:", error);
//       }
//    };

//    // Handle toggling sound
//    const handleToggleSound = () => {
//       const newSoundState = !soundEnabled;
//       setSoundEnabled(newSoundState);

//       try {
//          if (playerRef.current) {
//             const player = playerRef.current.querySelector('mux-player') as HTMLMediaElement;
//             if (player) {
//                player.muted = !newSoundState;
//             }
//          }
//       } catch (error) {
//          console.error("Error toggling sound:", error);
//       }
//    };

//    return (
//       <div className="bg-slate-50 shadow-sm border border-slate-200 rounded-lg w-full overflow-hidden">
//          {attendantStatus === "streaming" ? (
//             <div className="relative">
//                {userInteracted && (
//                   <div className="top-2 right-2 z-10 absolute">
//                      <button
//                         onClick={handleToggleSound}
//                         className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-full text-white"
//                      >
//                         {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
//                         <span>{soundEnabled ? "Silenciar" : "Activar sonido"}</span>
//                      </button>
//                   </div>
//                )}
//                <div
//                   ref={playerRef}
//                   className="relative bg-black rounded-lg aspect-video overflow-hidden"
//                >
//                   <MuxPlayer
//                      className="rounded-lg w-full aspect-video overflow-hidden"
//                      playbackId={playbackId}
//                      defaultStreamType="live"
//                      autoPlay={"any"}
//                      muted={!soundEnabled}
//                      onCanPlay={() => {
//                         console.log("can play");
//                      }}
//                      style={{
//                         '--controls': 'none'
//                      } as React.CSSProperties}
//                   />

//                   {!userInteracted && (
//                      <div
//                         className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 cursor-pointer"
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
//                </div>
//             </div>
//          ) : (
//             <div className="flex flex-col justify-center items-center space-y-4 p-6 py-16 h-full text-center">
//                {message.icon}
//                <h2 className="font-semibold text-slate-800 text-xl">{message.title}</h2>
//                <p className="max-w-md text-slate-600">{message.description}</p>
//                {currentStatus === "preparing" && (
//                   <div className="mt-4">
//                      <div className="bg-slate-200 rounded-full w-48 h-1 overflow-hidden">
//                         <div className="bg-blue-500 rounded-full h-full animate-pulse"
//                            style={{
//                               width: '60%'
//                            }}
//                         />
//                      </div>
//                   </div>
//                )}
//                {currentStatus === "scheduled" && (
//                   <div className="bg-blue-50 mt-2 px-4 py-2 rounded-md text-blue-700 text-sm">
//                      Regrese en el horario programado para ver la transmisión en vivo
//                   </div>
//                )}
//                {currentStatus === "canceled" && (
//                   <div className="flex flex-col items-center gap-4">
//                      <div className="bg-red-50 mt-2 px-4 py-2 rounded-md text-red-700 text-sm">
//                         La sesión de preguntas y respuestas ha sido cancelada debido a problemas técnicos. Por favor, consulte el programa continuar viendo el resto de las conrferencias.
//                      </div>
//                   </div>
//                )}

//                {currentStatus === "moved_to_zoom" && zoomLink && (
//                   <LinkButton href={zoomLink}
//                      target="_blank"
//                      variant="blue"
//                      className="w-max"
//                   >
//                      <Video className="w-4 h-4" />
//                      Ingresar a la sesión de preguntas y respuestas en Zoom
//                   </LinkButton>
//                )}
//                { currentStatus !== "preparing" && (
//                   <LinkButton href={`/lobby`}
//                      className="w-max"
//                   >
//                      Volver al lobby
//                   </LinkButton>
//                )}
//             </div>
//          )}
//       </div>
//    );
// }
