// import SessionNotFound from "@/components/group-recorder/SessionNotFound";
// import GroupRecorderContextWrapper from "@/contexts/GroupRecorderContextWrapper";
// import { getGroupRecordingSession } from "@/services/groupRecordingSessionService";
// import { ReactNode } from "react";

// async function GroupRecorderLayout ({
//    children, params
// }: {children: ReactNode, params: Promise<{ sessionId: string }>}) {
//    const { sessionId } = await params;
//    const sessionInfo = await getGroupRecordingSession(sessionId);

//    if (sessionInfo === null) return <SessionNotFound/>;

//    return (
//       <GroupRecorderContextWrapper>
//          <div className="bg-gray-50 mx-auto px-10 py-6 border-x max-w-(--breakpoint-xl) min-h-screen">
//             {children}
//          </div>
//       </GroupRecorderContextWrapper>
//    );
// }

// export default GroupRecorderLayout;
