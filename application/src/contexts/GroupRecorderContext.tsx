// "use client"

// import { getZoomTokenAction } from "@/serverActions/getZoomTokenAction";
// import { getGroupRecordingSession } from "@/services/groupRecordingSessionService";
// import { GroupRecorder } from "@/types/groupRecorder";
// import ZoomVideo from "@zoom/videosdk";
// import { useParams, useRouter } from "next/navigation";
// import {
//    createContext, useCallback, useContext, useEffect, useReducer, useRef
// } from "react";

// function stateUpdater<T> (
//    prevState: T,
//    update: Partial<T> | ((prevState: T) => Partial<T>)
// ): T {
//    const updateValue = typeof update === "function" ? update(prevState) : update;
//    return {
//       ...prevState,
//       ...updateValue
//    };
// }

// // Define your initial states (using your defined interfaces)
// const initialRecorderState: GroupRecorder.SessionState = {
//    sessionStatus: "Initializing",
//    sessionName: "",
//    currentUserId: null,
//    audioDevices: [],
//    videoDevices: [],
//    speakerDevices: [],
//    audioDeviceSelected: null,
//    videoDeviceSelected: null,
//    speakerDeviceSelected: null,
//    inSession: false,
//    sessionId: "",
//    sessionStartTime: new Date(),
//    participantStates: [],
//    sessionStream: null,
//    connectionState: "Not_Connected",
// };

// const initialRecordingState: GroupRecorder.RecordingState = {
//    recordingStartTime: new Date(),
//    recordingEndTime: new Date(),
//    isRecordingActive: false,
//    isRecordingPaused: false,
//    isRecordingFinished: false,
// };

// const initialScreenShareState: GroupRecorder.ScreenShareState = {
//    active: false,
//    userSharing: null,
//    isLocal: false,
// };

// const initialParticipantState: GroupRecorder.ParticipantState = {
//    id: "",
//    zoomId: null,
//    speakerCode: "",
//    displayName: "",
//    role: "participant",
//    hasJoined: false,
//    isTalking: false,
//    isSharingScreen: false,
//    isSharingVideo: false,
//    isMuted: false,
// }

// function useGroupRecorderState () {
//    const [sessionState, updateSessionState] = useReducer(
//       stateUpdater<GroupRecorder.SessionState>,
//       initialRecorderState
//    );

//    const [recordingState, updateRecordingState] = useReducer(
//       stateUpdater<GroupRecorder.RecordingState>,
//       initialRecordingState
//    );
//    const [screenShareState, updateScreenShareState] = useReducer(
//       stateUpdater<GroupRecorder.ScreenShareState>,
//       initialScreenShareState
//    );

//    console.log(updateRecordingState, updateScreenShareState)

//    const router = useRouter()
//    const { sessionId } = useParams()

//    const zoomClientRef = useRef(ZoomVideo.createClient());
//    const zoomClient = zoomClientRef.current;

//    const currentUser = sessionState.participantStates.find((participant) => participant.id === sessionState.currentUserId) ?? null;

//    useEffect(() => {
//       const getSessionInfo = async () => {
//          const sessionInfo = await getGroupRecordingSession(sessionId as string);
//          if (sessionInfo === null) return;

//          const initialParticipantStates = sessionInfo.usersInvited.map((participant) => {
//             return {
//                ...initialParticipantState,
//                ...participant
//             }
//          })
//          updateSessionState({
//             sessionId: sessionInfo.id,
//             sessionName: sessionInfo.sessionName,
//             participantStates: initialParticipantStates,
//          })
//       }

//       getSessionInfo();
//    }, [sessionId])

//    async function initZoomClient () {
//       /* checking compatibility */
//       const isCompatible = ZoomVideo.checkSystemRequirements()
//       if (!isCompatible.audio) {
//          alert("Your browser does not support audio, please use a compatible browser like google chrome.");
//          return;
//       }
//       if (!isCompatible.video) {
//          alert("Your browser does not support video, please use a compatible browser like google chrome.");
//          return;
//       }
//       if (!isCompatible.screen) {
//          alert("Your browser does not support screen sharing, please use a compatible browser like google chrome.");
//          return;
//       }

//       /* initializing the client */
//       ZoomVideo.preloadDependentAssets()
//       await zoomClient.init("es-MX", "Global", {
//          patchJsMedia: true,
//          leaveOnPageUnload: true,
//          stayAwake: true
//       })

//       /* Getting devices */
//       const allDevices = await ZoomVideo.getDevices()
//       const audioDevices = allDevices.filter((device) => device.kind === "audioinput")
//       const videoDevices = allDevices.filter((device) => device.kind === "videoinput")
//       const speakerDevices = allDevices.filter((device) => device.kind === "audiooutput")

//       updateSessionState({
//          sessionStatus: "In_Preview",
//          audioDevices: audioDevices,
//          videoDevices: videoDevices,
//          speakerDevices: speakerDevices,
//          videoDeviceSelected: videoDevices[0],
//          audioDeviceSelected: audioDevices[0],
//          speakerDeviceSelected: speakerDevices[0],
//       })

//       router.push(`/group-recorder/${sessionId}/preview`)
//    }

//    function setVideoDeviceSelected (deviceId: string) {
//       const videoDevice = sessionState.videoDevices.find((device) => device.deviceId === deviceId)
//       if (!videoDevice) return;

//       updateSessionState({
//          videoDeviceSelected: videoDevice,
//       })
//    }

//    function setAudioDeviceSelected (deviceId: string) {
//       const audioDevice = sessionState.audioDevices.find((device) => device.deviceId === deviceId)
//       if (!audioDevice) return;

//       updateSessionState({
//          audioDeviceSelected: audioDevice,
//       })
//    }

//    function setSpeakerDeviceSelected (deviceId: string) {
//       const speakerDevice = sessionState.speakerDevices.find((device) => device.deviceId === deviceId)
//       if (!speakerDevice) return;

//       updateSessionState({
//          speakerDeviceSelected: speakerDevice,
//       })
//    }

//    async function setCurrentUser (speakerCode: string) {
//       const user = await getParticipant(speakerCode)

//       if (!user) {
//          alert("No se encontró el participante con ese código, por favor verifica que sea correcto.");
//          return;
//       }

//       updateSessionState({
//          currentUserId: user.id
//       })
//    }

//    async function joinSession () {
//       const sessionToken = await getZoomTokenAction(sessionState.sessionName, currentUser!.id, currentUser!.role, "host")
//       await zoomClient.join(sessionState.sessionName, sessionToken.token!, currentUser!.displayName)

//       /* Mark the users already in the session as joined */
//       const usersInSession = zoomClient.getAllUser()
//       const updatedParticipants = sessionState.participantStates.map((participant) => {
//          const userInSession = usersInSession.find((user) => user.userIdentity === participant.id)

//          if (userInSession) {
//             return {
//                ...participant,
//                hasJoined: true,
//                zoomId: userInSession.userId,
//                isSharingVideo: userInSession.bVideoOn ?? false,
//                isMuted: userInSession.muted ?? false,
//                isSharingScreen: userInSession.sharerOn ?? false,
//             }
//          }
//          return participant;
//       })

//       const zoomMediaStream = zoomClient.getMediaStream()
//       updateSessionState({
//          inSession: true,
//          sessionStatus: "In_session",
//          sessionStream: zoomMediaStream,
//          participantStates: updatedParticipants
//       })

//       await zoomMediaStream.startVideo({
//          cameraId: sessionState.videoDeviceSelected!.deviceId
//       })
//       await zoomMediaStream.startAudio({
//          microphoneId: sessionState.audioDeviceSelected!.deviceId
//       })

//       updateParticipantState(currentUser!.id, {
//          isSharingVideo: true
//       })

//       router.push(`/group-recorder/${sessionId}/session`)
//    }

//    async function leaveSession () {
//       await zoomClient.leave()
//       updateSessionState({
//          inSession: false,
//          sessionStatus: "Finished",
//          sessionStream: null,
//       })
//    }

//    function startScreenSharing () {
//       /* check if somebody else is sharing screen */
//       if (screenShareState.active && !screenShareState.isLocal) {
//          alert(`${screenShareState.userSharing!.displayName} ya está compartiendo pantalla, solo se puede compartir una pantalla a la vez.`)
//          return;
//       }

//       updateScreenShareState({
//          active: true,
//          isLocal: true,
//          userSharing: currentUser!
//       })
//    }

//    function stopScreenSharing () {
//       updateScreenShareState({
//          active: false,
//          isLocal: false,
//          userSharing: null
//       })
//    }

//    const updateParticipantState = useCallback(
//       (userId: string, participantState: Partial<GroupRecorder.ParticipantState>) => {
//          updateSessionState((prevState) => ({
//             // preserve other sessionState values by spreading prevState
//             ...prevState,
//             participantStates: prevState.participantStates.map((participant) =>
//                participant.id === userId ? {
//                   ...participant,
//                   ...participantState
//                } : participant
//             ),
//          }));
//       },
//       []
//    );

//    function setParticipantJoinedStatus (userId: string, joinedStatus: boolean) {
//       updateParticipantState(userId, {
//          hasJoined: joinedStatus
//       })
//    }

//    function setParticipantTalkingStatus (userId: string, talkingStatus: boolean) {
//       updateParticipantState(userId, {
//          isTalking: talkingStatus
//       })
//    }

//    function setParticipantMutedStatus (userId: string, mutedStatus: boolean) {
//       updateParticipantState(userId, {
//          isMuted: mutedStatus
//       })
//    }

//    function setParticipantScreenSharingStatus (userId: string, screenSharingStatus: boolean) {
//       updateParticipantState(userId, {
//          isSharingScreen: screenSharingStatus
//       })
//    }

//    function setParticipantVideoSharingStatus (userId: string, videoSharingStatus: boolean) {
//       updateParticipantState(userId, {
//          isSharingVideo: videoSharingStatus
//       })
//    }

//    return {
//       sessionState,
//       recordingState,
//       screenShareState,
//       zoomClient,
//       ZoomVideo,
//       currentUser,
//       initZoomClient,
//       setVideoDeviceSelected,
//       setAudioDeviceSelected,
//       setSpeakerDeviceSelected,
//       setCurrentUser,
//       joinSession,
//       setParticipantJoinedStatus,
//       leaveSession,
//       startScreenSharing,
//       stopScreenSharing,
//       setParticipantTalkingStatus,
//       setParticipantMutedStatus,
//       setParticipantScreenSharingStatus,
//       setParticipantVideoSharingStatus,
//       updateParticipantState
//    };
// }

// const GroupRecorderContext = createContext({
// } as ReturnType<typeof useGroupRecorderState>);

// export default function GroupRecorderContextProvider ({ children }: {children: React.ReactNode}) {
//    const groupRecorderState = useGroupRecorderState();

//    return (
//       <GroupRecorderContext.Provider value={groupRecorderState}>
//          {children}
//       </GroupRecorderContext.Provider>
//    );
// };

// export function useGroupRecorderContext () {
//    if (!GroupRecorderContext) {
//       throw new Error("useGroupRecorderContext must be used within a GroupRecorderContextProvider");
//    }

//    return useContext(GroupRecorderContext);
// }
