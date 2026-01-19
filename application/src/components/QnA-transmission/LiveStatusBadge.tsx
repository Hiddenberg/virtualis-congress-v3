// "use client"
// // import { useQnARealtimeLivestreamStatus } from "@/contexts/QnARealtimeLivestreamStatusContext"
// import {
//    RadioIcon, PauseCircleIcon, CircleDashedIcon, SquareIcon, CalendarIcon, XCircleIcon, SkipForwardIcon, VideoIcon
// } from "lucide-react"
// import { useParams } from "next/navigation"
// import { useRouter } from "next/navigation"
// import { useEffect } from "react"

// export default function LiveStatusBadge () {
//    const { livestreamStatus } = useQnARealtimeLivestreamStatus()
//    const router = useRouter()
//    const { conferenceId } = useParams()

//    useEffect(() => {
//       if (livestreamStatus === "ended") {
//          router.push(`/QnA-transmission/${conferenceId}/session-finished`)
//       }
//    }, [livestreamStatus, conferenceId, router])

//    if (livestreamStatus === "scheduled") {
//       return (
//          <div className="flex justify-center items-center gap-2 bg-blue-100 shadow-md p-2 border border-blue-500 rounded-full">
//             <CalendarIcon className="size-6 text-blue-800" />
//             <p className="text-blue-800">Programado</p>
//          </div>
//       )
//    }

//    if (livestreamStatus === "preparing") {
//       return (
//          <div className="flex justify-center items-center gap-2 bg-yellow-100 shadow-md p-2 border border-yellow-500 rounded-full">
//             <CircleDashedIcon className="size-6 text-yellow-800 animate-pulse" />
//             <p className="text-yellow-800">Preparando</p>
//          </div>
//       )
//    }

//    if (livestreamStatus === "streaming") {
//       return (
//          <div className="flex justify-center items-center gap-2 bg-green-500 shadow-md p-2 border border-green-800 rounded-full text-white">
//             <RadioIcon className="size-6 animate-pulse" />
//             <p>Transmitiendo</p>
//          </div>
//       )
//    }

//    if (livestreamStatus === "paused") {
//       return (
//          <div className="flex justify-center items-center gap-2 bg-yellow-500 shadow-md p-2 border border-yellow-700 rounded-full text-white">
//             <PauseCircleIcon className="size-6" />
//             <p className="text-white">En Pausa</p>
//          </div>
//       )
//    }

//    if (livestreamStatus === "ended") {
//       return (
//          <div className="flex justify-center items-center gap-2 bg-red-500 shadow-md p-2 border border-red-700 rounded-full text-white">
//             <SquareIcon className="size-6" />
//             <p>Sesión finalizada</p>
//          </div>
//       )
//    }

//    if (livestreamStatus === "canceled") {
//       return (
//          <div className="flex justify-center items-center gap-2 bg-gray-500 shadow-md p-2 border border-gray-700 rounded-full text-white">
//             <XCircleIcon className="size-6" />
//             <p>Cancelado</p>
//          </div>
//       )
//    }

//    if (livestreamStatus === "skipped") {
//       return (
//          <div className="flex justify-center items-center gap-2 bg-purple-500 shadow-md p-2 border border-purple-700 rounded-full text-white">
//             <SkipForwardIcon className="size-6" />
//             <p>Omitido</p>
//          </div>
//       )
//    }

//    if (livestreamStatus === "moved_to_zoom") {
//       return (
//          <div className="flex justify-center items-center gap-2 bg-blue-500 shadow-md p-2 border border-blue-700 rounded-full text-white">
//             <VideoIcon className="size-6" />
//             <p>Movido a Zoom</p>
//          </div>
//       )
//    }

//    // Default fallback
//    return (
//       <div className="flex justify-center items-center gap-2 bg-gray-100 shadow-md p-2 border border-gray-300 rounded-full">
//          <CircleDashedIcon className="size-6 text-gray-800" />
//          <p className="text-gray-800">Estado Desconocido</p>
//       </div>
//    )
// }
