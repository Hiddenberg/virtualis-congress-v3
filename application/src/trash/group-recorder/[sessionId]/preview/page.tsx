// "use client"

// import CameraPreviewSection from "@/components/group-recorder/preview/CameraPreviewSection";
// import JoinSessionButton from "@/components/group-recorder/preview/JoinSessionButton";
// import {
//    CameraSelector, MediaSelectors, MicSelector, SpeakerSelector
// } from "@/components/group-recorder/preview/MediaSelectors";
// import { useGroupRecorderContext } from "@/contexts/GroupRecorderContext";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// function GroupRecorderPreviewPage () {
//    const {
//       sessionState: {
//          sessionStatus, sessionId
//       }
//    } = useGroupRecorderContext();
//    const router = useRouter()
//    useEffect(() => {
//       if (sessionStatus !== "In_Preview") {
//          router.replace(`/group-recorder/${sessionId}/`)
//       }
//    }, [router, sessionStatus, sessionId])

//    if (sessionStatus !== "In_Preview") {
//       return <h1>Loading...</h1>
//    }

//    return (
//       <div>
//          <div className="mb-4">
//             <h1 className="font-semibold text-2xl">Vista Previa</h1>
//             <p className="">Asegurate de elegir el microfono y cámara correctos antes de iniciar la sesión.</p>
//          </div>

//          <div className="space-y-4">
//             <CameraPreviewSection />

//             <MediaSelectors>
//                <CameraSelector />
//                <MicSelector />
//                <SpeakerSelector />
//             </MediaSelectors>

//             <JoinSessionButton />
//          </div>
//       </div>
//    );
// }

// export default GroupRecorderPreviewPage;
