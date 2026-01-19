// "use client"

// import ParticipantDisplay from "@/components/group-recorder/session/ParticipantDisplay";
// import ParticipantsList from "@/components/group-recorder/session/ParticipantList";
// import ScreenShareDisplay from "@/components/group-recorder/session/ScreenShareDisplay";
// import SessionControlButtonsContainer from "@/components/group-recorder/session/SessionControlButtons";
// import { useGroupRecorderContext } from "@/contexts/GroupRecorderContext";
// import { ActiveSpeaker, ParticipantPropertiesPayload } from "@zoom/videosdk";
// import { useEffect, useRef } from "react";

// function GroupRecordingSessionPage () {
//    const videosContainerRef = useRef<HTMLDivElement>(null);
//    const {
//       sessionState: {
//          sessionName,
//          participantStates,
//       },
//       screenShareState,
//       zoomClient,
//       updateParticipantState

//    } = useGroupRecorderContext();

//    useEffect(() => {
//       function handleParticipantAdded (zoomUsersArray: ParticipantPropertiesPayload[]) {
//          console.log("[GroupRecorderSession] Participant added event")
//          console.log("[GroupRecorderSession] Zoom users array:", zoomUsersArray)
//          zoomUsersArray.forEach(userAdded => {
//             const localUserId = userAdded.userIdentity!
//             const participant = participantStates.find((participant) => participant.id === localUserId)

//             if (participant) {
//                // using userId since it's the same as the zoomId
//                updateParticipantState(localUserId, {
//                   hasJoined: true,
//                   zoomId: userAdded.userId,
//                })
//             }
//          })
//       }

//       function handleParticipantRemoved (zoomUsersArray: ParticipantPropertiesPayload[]) {
//          console.log("[GroupRecorderSession] Participant removed event")
//          console.log("[GroupRecorderSession] Zoom users array:", zoomUsersArray)
//          zoomUsersArray.forEach(userRemoved => {
//             const localUserId = userRemoved.userIdentity!
//             const participant = participantStates.find((participant) => participant.id === localUserId)

//             if (participant) {
//                updateParticipantState(localUserId, {
//                   hasJoined: false,
//                   zoomId: null,
//                   isSharingVideo: false,
//                   isMuted: false,
//                   isSharingScreen: false,
//                   isTalking: false
//                })
//             }
//          })
//       }

//       function handlePeerVideoStateChange ({
//          userId, action
//       }: {
//          action: "Start" | "Stop";
//          userId: number;
//       }) {
//          console.log("[GroupRecorderSession] Peer video state change event")
//          console.log("[GroupRecorderSession] UserId and action:", userId, action)
//          const localUser = zoomClient.getUser(userId)
//          if (!localUser) return;
//          const localUserId = localUser.userIdentity!

//          if (action === "Start") {
//             updateParticipantState(localUserId, {
//                isSharingVideo: true
//             })
//          } else if (action === "Stop") {
//             updateParticipantState(localUserId, {
//                isSharingVideo: false
//             })
//          }
//       }

//       function handleUserUpdated (zoomUserPropertiesArray: ParticipantPropertiesPayload[]) {
//          zoomUserPropertiesArray.forEach((userUpdated => {
//             const localUser = zoomClient.getUser(userUpdated.userId)
//             if (!localUser) return;
//             const localUserId = localUser.userIdentity!

//             updateParticipantState(localUserId, {
//                isMuted: userUpdated.muted ?? false,
//             })
//          }))
//       }

//       function handleActiveMicSpeaker (activeSpeakers: ActiveSpeaker[]) {
//          const activeSpeakerZoomIds = activeSpeakers.map((speaker) => speaker.userId)

//          participantStates.forEach((participant) => {
//             if (activeSpeakerZoomIds.includes(participant.zoomId!)) {
//                updateParticipantState(participant.id, {
//                   isTalking: true
//                })
//             } else {
//                updateParticipantState(participant.id, {
//                   isTalking: false
//                })
//             }
//          })
//       }

//       zoomClient.on("user-added", handleParticipantAdded)
//       zoomClient.on("user-removed", handleParticipantRemoved)
//       zoomClient.on("peer-video-state-change", handlePeerVideoStateChange)
//       zoomClient.on("user-updated", handleUserUpdated)
//       zoomClient.on("active-speaker", handleActiveMicSpeaker)

//       return () => {
//          zoomClient.off("user-added", handleParticipantAdded)
//          zoomClient.off("user-removed", handleParticipantRemoved)
//          zoomClient.off("peer-video-state-change", handlePeerVideoStateChange)
//          zoomClient.off("user-updated", handleUserUpdated)
//          zoomClient.off("active-speaker", handleActiveMicSpeaker)
//       }
//    }, [participantStates, zoomClient, updateParticipantState])

//    return (
//       <div>
//          <h1>Sesión: {sessionName}</h1>

//          <div className="space-y-4">
//             {/* @ts-expect-error html component */}
//             <video-player-container ref={videosContainerRef}>
//                {participantStates.map((participant) => {
//                   if (participant.hasJoined) {
//                      return (
//                         <ParticipantDisplay participant={participant}
//                            key={participant.id}
//                         />
//                      )
//                   }
//                   return null
//                })}

//                {
//                   screenShareState.active &&
//                   <ScreenShareDisplay />
//                }
//                {/* @ts-expect-error html component */}
//             </video-player-container>

//             <SessionControlButtonsContainer />
//          </div>

//          <ParticipantsList />
//       </div>
//    );
// }

// export default GroupRecordingSessionPage;
