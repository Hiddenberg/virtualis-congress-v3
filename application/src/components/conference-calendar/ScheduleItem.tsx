// "use client"

// import { get30MinIntervals } from "@/utils/timeUtils"
// import {
//    LinkIcon, Megaphone, Mic2, Pencil
// } from "lucide-react"
// import { CopyButton } from "../global/Buttons"
// import type { RecordModel } from "pocketbase"
// import type { ConferenceWithSpeakerNamesAndPhones } from "@/features/conferences/services/conferenceServices"
// import type { ConferenceRecording } from "@/types/congress"
// import { usePathname } from "next/navigation"
// import Link from "next/link"

// export default function ScheduleItem ({
//    conference,
//    conferenceRecordings,
// }: {
//   conference: ConferenceWithSpeakerNamesAndPhones & RecordModel
//   conferenceRecordings: (ConferenceRecording & RecordModel)[]
// }) {
//    const slots = get30MinIntervals(conference.startTime, conference.endTime)
//    const path = usePathname()
//    const isAdminView = path.startsWith("/congress-admin")

//    // Calculate height based on time slots
//    const regularHeight = 13 // rem
//    const regularMargin = 1 // rem
//    const totalHeight = slots === 1 ? regularHeight : regularHeight * slots + (regularMargin * slots - 1)

//    return (
//       <div
//          className="relative flex flex-col gap-3 bg-blue-100 shadow-sm hover:shadow p-5 border border-blue-200 rounded-3xl w-[40rem] overflow-y-auto transition-shadow"
//          style={{
//             height: `${totalHeight}rem`
//          }}
//       >
//          {/* Edit button */}
//          {isAdminView && (
//             <Link
//                href={`/congress-admin/conferences/${conference.id}/edit`}
//                className="top-3 right-3 absolute bg-white/80 hover:bg-white shadow-sm p-2 rounded-full transition-colors"
//                aria-label="Edit conference"
//             >
//                <Pencil className="size-4 text-blue-600" />
//             </Link>
//          )}

//          {/* Title and description */}
//          <div className="mb-1">
//             <h2 className="font-bold text-blue-900 text-lg capitalize">{conference.title}</h2>
//             <p className="mt-1 text-blue-800/80 text-sm">{conference.shortDescription}</p>
//          </div>

//          {/* Speakers section */}
//          <div className="flex flex-wrap gap-3 text-sm">
//             <div className="flex items-center gap-2">
//                <div className="flex justify-center items-center bg-white shadow-sm rounded-full size-7">
//                   <Megaphone className="size-4 text-blue-600" />
//                </div>
//                <span className="font-semibold text-blue-900">Ponente:</span>
//             </div>
//             {conference.speakers.map((speaker, index) => (
//                <div key={index}
//                   className="flex items-center"
//                >
//                   <span className="bg-white shadow-sm px-3 py-1 rounded-full text-blue-800 capitalize">{speaker}</span>
//                </div>
//             ))}
//          </div>

//          {/* Presenter section - only for admin view */}
//          {isAdminView && conference.presenter && (
//             <div className="flex flex-wrap items-center gap-3 text-sm">
//                <div className="flex items-center gap-2">
//                   <div className="flex justify-center items-center bg-white shadow-sm rounded-full size-7">
//                      <Mic2 className="size-4 text-blue-600" />
//                   </div>
//                   <span className="font-semibold text-blue-900">Presentador:</span>
//                </div>
//                <span className="bg-white shadow-sm px-3 py-1 rounded-full text-blue-800 capitalize">
//                   {conference.presenter}
//                </span>
//             </div>
//          )}

//          {/* Recording links section - only for admin view */}
//          {isAdminView && conferenceRecordings.length > 0 && (
//             <div className="mt-2">
//                <div className="flex items-center gap-2 mb-2 text-sm">
//                   <div className="flex justify-center items-center bg-white shadow-sm rounded-full size-7">
//                      <LinkIcon className="size-4 text-blue-600" />
//                   </div>
//                   <span className="font-semibold text-blue-900">Links de grabación:</span>
//                </div>

//                <div className="space-y-3">
//                   {conferenceRecordings.map((recording) => (
//                      <div key={recording.id}
//                         className="bg-white/70 shadow-sm p-3 rounded-2xl"
//                      >
//                         <div className="flex flex-wrap gap-2 mb-2">
//                            <p className="font-semibold text-blue-900 text-sm">
//                               {recording.recordingType === "conference" ? "Conferencia" : "Presentación"}
//                            </p>

//                            <div className="flex flex-wrap gap-2">
//                               <p
//                                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
//                                     recording.status === "available" ? "bg-green-100 text-green-800" : "bg-blue-200 text-blue-800"
//                                  }`}
//                               >
//                                  {recording.status === "available" ? "Grabada" : "Pendiente"}
//                               </p>

//                               <p
//                                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
//                                     recording.invitationEmailSent ? "bg-green-100 text-green-800" : "bg-blue-200 text-blue-800"
//                                  }`}
//                               >
//                                  {recording.invitationEmailSent ? "Invitación enviada" : "Invitación no enviada"}
//                               </p>

//                               <p
//                                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
//                                     recording.invitationEmailOpened ? "bg-green-100 text-green-800" : "bg-blue-200 text-blue-800"
//                                  }`}
//                               >
//                                  {recording.invitationEmailOpened ? "Invitación abierta" : "Invitación no abierta"}
//                               </p>
//                            </div>
//                         </div>

//                         <div className="flex items-center gap-2 bg-blue-50 p-2 border border-blue-100 rounded-lg">
//                            <a
//                               className="flex-1 text-blue-700 hover:text-blue-900 text-xs hover:underline truncate"
//                               href={recording.recordingUrl}
//                               target="_blank"
//                               rel="noreferrer"
//                            >
//                               {recording.recordingUrl}
//                            </a>
//                            <CopyButton text={recording.recordingUrl} />
//                         </div>
//                      </div>
//                   ))}
//                </div>
//             </div>
//          )}
//       </div>
//    )
// }

