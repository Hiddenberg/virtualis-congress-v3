// "use client"

// import pbClient from "@/libs/pbClient"
// import { LivestreamSession } from "@/types/congress"
// import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections"
// import { RecordModel } from "pocketbase"
// import {
//    createContext, useContext, useEffect, useState
// } from "react"

// function useRealtimeQnALivestreamStatus ({
//    livestreamSessionId, initialStatus, initialAttendantStatus
// }: {livestreamSessionId: string, initialStatus: LivestreamSession["status"], initialAttendantStatus: LivestreamSession["attendantStatus"]}) {
//    const [livestreamStatus, setLivestreamStatus] = useState<LivestreamSession["status"]>(initialStatus)
//    const [attendantStatus, setAttendantStatus] = useState<LivestreamSession["attendantStatus"]>(initialAttendantStatus)

//    useEffect(() => {
//       if (!livestreamSessionId) {
//          alert("Livestream session ID is required")
//          return
//       }

//       let unsubscribe: (() => void) | undefined

//       const setupRealtimeSubscription = async () => {
//          unsubscribe = await pbClient
//             .collection(PB_COLLECTIONS.LIVESTREAM_SESSIONS)
//             .subscribe<LivestreamSession & RecordModel>(livestreamSessionId, (event) => {
//                console.log(event)

//                if (event.action === "update") {
//                   const updatedSession = event.record
//                   setLivestreamStatus(updatedSession.status)
//                   setAttendantStatus(updatedSession.attendantStatus)
//                }
//             })
//       }

//       setupRealtimeSubscription()

//       return () => {
//          if (unsubscribe) {
//             unsubscribe()
//          }
//       }
//    }, [livestreamSessionId])

//    return {
//       livestreamStatus,
//       attendantStatus
//    }
// }

// const QnARealtimeLivestreamStatusContext = createContext<ReturnType<typeof useRealtimeQnALivestreamStatus> | null>(null)

// export function QnARealtimeLivestreamStatusProvider ({
//    children, livestreamSessionId, initialStatus, initialAttendantStatus
// }: {children: React.ReactNode, livestreamSessionId: string, initialStatus: LivestreamSession["status"], initialAttendantStatus: LivestreamSession["attendantStatus"]}) {
//    return (
//       <QnARealtimeLivestreamStatusContext.Provider value={useRealtimeQnALivestreamStatus({
//          livestreamSessionId,
//          initialStatus,
//          initialAttendantStatus
//       })}
//       >
//          {children}
//       </QnARealtimeLivestreamStatusContext.Provider>
//    )
// }

// export function useQnARealtimeLivestreamStatus () {
//    const context = useContext(QnARealtimeLivestreamStatusContext)
//    if (!context) {
//       throw new Error("useQnARealtimeLivestreamStatus must be used within a QnARealtimeLivestreamStatusProvider")
//    }
//    return context
// }
