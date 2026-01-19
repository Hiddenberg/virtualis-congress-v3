// "use client"

// import { LinkIcon, MessagesSquareIcon } from 'lucide-react';
// import React from 'react';
// import LiveControlButtons from './LiveControlButtons';
// import LiveStatusBadge from './LiveStatusBadge';
// import { useZoomSession } from '@/contexts/ZoomSessionContext';
// import { LinkButton } from '../global/Buttons';
// import { useParams } from 'next/navigation';
// // import GoToAttendantViewButton from './GoToAttendantViewButton';

// interface QnAHeaderProps {
//    speakerName: string;
//    conferenceTitle: string;
//    shortDescription?: string;
//    isClosingConference?: boolean;
// }

// function HeaderInfo ({
//    speakerName, conferenceTitle, shortDescription, isClosingConference
// }: QnAHeaderProps) {

//    if (isClosingConference) {
//       return (
//          <div className='pr-4'>
//             <div className="space-y-1">
//                <p className="flex items-center gap-2 font-semibold text-blue-600 text-sm">
//                   <MessagesSquareIcon className="size-4" /> Sesión de clausura en vivo
//                </p>
//                <h1 className="font-bold text-2xl leading-tight">Clausura del Congreso Internacional de Medicina Interna</h1>
//             </div>
//          </div>
//       )
//    }

//    return (
//       <div className='pr-4'>
//          <div className="space-y-1">
//             <p className="flex items-center gap-2 font-semibold text-blue-600 text-sm">
//                <MessagesSquareIcon className="size-4" /> Sala de Preguntas
//             </p>
//             <h1 className="font-bold text-2xl leading-tight">{speakerName}</h1>
//             <p className="text-gray-600 text-base">{conferenceTitle}</p>
//          </div>
//          {shortDescription && <p className="text-gray-500 text-sm">{shortDescription}</p>}
//       </div>
//    )
// }

// export function GoToAttendantConferenceViewButton () {
//    const { conferenceId } = useParams()

//    return (
//       <LinkButton href={`/QnA-transmission/${conferenceId}/attendant-view`}
//          target='_blank'
//       >
//          <LinkIcon className='size-4' />
//          Ver conferencia como asistente
//       </LinkButton>
//    )
// }

// export default function QnAHeader ({
//    speakerName, conferenceTitle, shortDescription, isClosingConference
// }: QnAHeaderProps) {
//    const { sessionId } = useZoomSession();

//    return (
//       <div className="justify-center items-center grid grid-cols-3 bg-white p-2 *:grow-0">
//          <HeaderInfo speakerName={speakerName}
//             conferenceTitle={conferenceTitle}
//             shortDescription={shortDescription}
//             isClosingConference={isClosingConference}
//          />
//          <div className='space-y-4'>
//             <LiveStatusBadge />
//             <div className='flex justify-center gap-2'>
//                {/* <GoToAttendantViewButton /> */}
//                <GoToAttendantConferenceViewButton />
//             </div>
//          </div>
//          <LiveControlButtons sessionId={sessionId} />
//       </div>
//    );
// }
