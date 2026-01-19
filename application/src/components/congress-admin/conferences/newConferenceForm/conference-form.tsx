// "use client"

// import {
//    useState, useTransition, type FormEvent
// } from "react"
// import { Save } from "lucide-react"
// import { DateTimePicker } from "./date-time-picker"
// import { SpeakerSelector } from "./speaker-selector"
// import { PresenterSelector } from "./presenter-selector"
// import { ConferenceTypeSelector } from "./conference-type-selector"
// import { NewConferenceData } from "@/features/conferences/services/conferenceServices"
// import { createConferenceAction } from "@/features/conferences/actions/conferenceActions"

// export interface ConferenceFormProps {
//   speakers: Speaker[]
//   presenters: Presenter[]
// }

// export interface Speaker {
//   id: string
//   name: string
// }

// export interface Presenter {
//   id: string
//   name: string
// }

// export function ConferenceForm ({
//    speakers, presenters
// }: ConferenceFormProps) {
//    const initialState: NewConferenceData = {
//       title: "",
//       shortDescription: "",
//       startTime: "",
//       endTime: "",
//       // speakerIds: [],
//       conferenceType: "individual",
//       // presenter: "",
//    }
//    const [formData, setFormData] = useState<NewConferenceData>(initialState)

//    const [submitting, startTransition] = useTransition()

//    const handleSubmit = (e: FormEvent) => {
//       e.preventDefault()
//       startTransition(async () => {

//          const newConference = await createConferenceAction({
//             ...formData,
//             startTime: new Date(formData.startTime)
//                .toISOString(),
//             endTime: new Date(formData.endTime)
//                .toISOString(),
//          })
//          if (newConference && newConference.errorMessage) {
//             alert(newConference.errorMessage)
//          }

//          setFormData(initialState)
//       })
//    }

//    const updateFormData = (field: keyof NewConferenceData, value: NewConferenceData[keyof NewConferenceData]) => {
//       setFormData((prev: NewConferenceData) => ({
//          ...prev,
//          [field]: value
//       }))
//    }

//    return (
//       <form onSubmit={handleSubmit}
//          className="space-y-6 bg-white shadow-sm p-6 border border-gray-200 rounded-lg"
//       >
//          <header className="mb-6 pb-4 border-gray-200 border-b">
//             <h2 className="font-semibold text-gray-800 text-xl">Create New Conference</h2>
//             <p className="text-gray-500 text-sm">Fill in the details to schedule a new conference</p>
//          </header>

//          <fieldset className="flex flex-col gap-1">
//             <label htmlFor="title"
//                className="font-medium text-sm"
//             >
//                Conference Title <span className="text-red-500">*</span>
//             </label>
//             <input
//                id="title"
//                type="text"
//                value={formData.title}
//                onChange={(e) => updateFormData("title", e.target.value)}
//                required
//                placeholder="Enter conference title"
//                className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//             />
//          </fieldset>

//          <fieldset className="flex flex-col gap-1">
//             <label htmlFor="shortDescription"
//                className="font-medium text-sm"
//             >
//                Short Description
//             </label>
//             <textarea
//                id="shortDescription"
//                value={formData.shortDescription}
//                onChange={(e) => updateFormData("shortDescription", e.target.value)}
//                placeholder="Enter short description"
//                className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//                rows={4}
//             />
//          </fieldset>

//          <div className="gap-4 grid md:grid-cols-2">
//             <DateTimePicker
//                id="startTime"
//                label="Start Time *"
//                value={formData.startTime}
//                onChange={(value) => updateFormData("startTime", value)}
//                required
//             />

//             <DateTimePicker
//                id="endTime"
//                label="End Time *"
//                value={formData.endTime}
//                onChange={(value) => updateFormData("endTime", value)}
//                required
//             />
//          </div>

//          <SpeakerSelector
//             speakers={speakers}
//             selectedIds={formData.speakerIds}
//             onChange={(ids) => updateFormData("speakerIds", ids)}
//             required
//          />

//          <ConferenceTypeSelector
//             value={formData.conferenceType}
//             onChange={(value) => updateFormData("conferenceType", value)}
//             required
//          />

//          <PresenterSelector
//             presenters={presenters}
//             selectedId={formData.presenter || null}
//             onChange={(id) => updateFormData("presenter", id)}
//          />

//          <div className="flex justify-end pt-4">
//             <button
//                type="submit"
//                disabled={submitting}
//                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-white transition-colors"
//             >
//                <Save className="w-4 h-4" />
//                <span>{submitting ? "Creating..." : "Create Conference"}</span>
//             </button>
//          </div>
//       </form>
//    )
// }

