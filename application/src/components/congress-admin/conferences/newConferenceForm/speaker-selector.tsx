// "use client"

// import { useState } from "react"
// import {
//    Users, X, Check, ChevronDown
// } from "lucide-react"
// import { Speaker } from "./conference-form"

// interface SpeakerSelectorProps {
//   speakers: Speaker[]
//   selectedIds: string[]
//   onChange: (selectedIds: string[]) => void
//   required?: boolean
// }

// export function SpeakerSelector ({
//    speakers, selectedIds, onChange, required = false
// }: SpeakerSelectorProps) {
//    const [isOpen, setIsOpen] = useState(false)

//    const toggleSpeaker = (id: string) => {
//       if (selectedIds.includes(id)) {
//          onChange(selectedIds.filter((speakerId) => speakerId !== id))
//       } else {
//          onChange([...selectedIds, id])
//       }
//    }

//    const selectedSpeakers = speakers.filter((speaker) => selectedIds.includes(speaker.id))

//    return (
//       <fieldset className="flex flex-col gap-1">
//          <label className="font-medium text-sm">Speakers {required && <span className="text-red-500">*</span>}</label>
//          <div className="relative">
//             <button
//                type="button"
//                onClick={() => setIsOpen(!isOpen)}
//                className="flex justify-between items-center px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full text-left"
//                aria-haspopup="listbox"
//                aria-expanded={isOpen}
//             >
//                <div className="flex items-center gap-2">
//                   <Users className="w-4 h-4 text-gray-400" />
//                   <span>
//                      {selectedSpeakers.length === 0
//                         ? "Select speakers"
//                         : `${selectedSpeakers.length} speaker${selectedSpeakers.length > 1 ? "s" : ""} selected`}
//                   </span>
//                </div>
//                <ChevronDown className="w-4 h-4 text-gray-400" />
//             </button>

//             {isOpen && (
//                <ul
//                   className="z-10 absolute bg-white ring-opacity-5 shadow-lg mt-1 py-1 rounded-md focus:outline-none ring-1 ring-black w-full max-h-60 overflow-auto"
//                   role="listbox"
//                >
//                   {speakers.map((speaker) => (
//                      <li
//                         key={speaker.id}
//                         role="option"
//                         aria-selected={selectedIds.includes(speaker.id)}
//                         onClick={() => toggleSpeaker(speaker.id)}
//                         className={`flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-blue-50 ${
//                            selectedIds.includes(speaker.id) ? "bg-blue-50" : ""
//                         }`}
//                      >
//                         <span>{speaker.name}</span>
//                         {selectedIds.includes(speaker.id) && <Check className="w-4 h-4 text-blue-500" />}
//                      </li>
//                   ))}
//                   {speakers.length === 0 && <li className="px-3 py-2 text-gray-500">No speakers available</li>}
//                </ul>
//             )}
//          </div>

//          {selectedSpeakers.length > 0 && (
//             <div className="flex flex-wrap gap-2 mt-2">
//                {selectedSpeakers.map((speaker) => (
//                   <span
//                      key={speaker.id}
//                      className="inline-flex items-center bg-blue-100 px-2.5 py-0.5 rounded-full font-medium text-blue-800 text-xs"
//                   >
//                      {speaker.name}
//                      <button
//                         type="button"
//                         onClick={() => toggleSpeaker(speaker.id)}
//                         className="inline-flex justify-center items-center hover:bg-blue-200 ml-1.5 rounded-full w-4 h-4 text-blue-400 hover:text-blue-600"
//                      >
//                         <X className="w-3 h-3" />
//                         <span className="sr-only">Remove {speaker.name}</span>
//                      </button>
//                   </span>
//                ))}
//             </div>
//          )}
//       </fieldset>
//    )
// }

