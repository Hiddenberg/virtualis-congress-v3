// "use client"

// import { useGroupRecorderContext } from "@/contexts/GroupRecorderContext"
// import { GroupRecorder } from "@/types/groupRecorder"
// import { Circle } from "lucide-react"

// function ParticipantItem ({ participant }: {participant: GroupRecorder.ParticipantState}) {
//    const {
//       displayName,
//       hasJoined,
//       role
//    } = participant

//    return (
//       <div className="flex items-center gap-2">
//          <Circle strokeWidth={8}
//             className={`size-3 overflow-visible ${hasJoined ? "text-green-500" : "text-gray-500"}`}
//          />

//          <span className={`${!hasJoined ? "text-gray-300" : ""}`}>{displayName}</span>

//          <span className="text-gray-300">{role}</span>
//       </div>
//    )
// }

// export default function ParticipantsList () {
//    const { sessionState: { participantStates } } = useGroupRecorderContext()

//    return (
//       <div className="space-y-4">
//          {participantStates.map((participant) => (
//             <ParticipantItem participant={participant}
//                key={participant.id}
//             />
//          ))}
//       </div>
//    )
// }
