// import { useGroupRecorderContext } from "@/contexts/GroupRecorderContext"
// import {
//    Mic, Speaker, SwitchCamera
// } from "lucide-react"
// import { ReactNode } from "react"

// export function MediaSelectors ({ children }: {children: ReactNode}) {
//    return (
//       <div className="justify-center gap-2 grid grid-cols-3 [&_select]:rounded-xl [&_select]:w-full">
//          {children}
//       </div>
//    )
// }

// export function CameraSelector () {
//    const {
//       sessionState: {
//          videoDevices, videoDeviceSelected
//       }, setVideoDeviceSelected
//    } = useGroupRecorderContext()

//    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//       const newDeviceId = e.target.value
//       setVideoDeviceSelected(newDeviceId)
//    }

//    return (
//       <label className="p-4">
//          <div className="flex items-center mb-2">
//             <SwitchCamera className="mr-2 size-5" />
//             <span>Seleccionar Cámara</span>
//          </div>

//          <select className="p-2 border"
//             onChange={handleChange}
//             value={videoDeviceSelected?.deviceId}>
//             {videoDevices.map(device => (
//                <option key={device.deviceId}
//                   value={device.deviceId}>{device.label}</option>
//             ))}
//          </select>
//       </label>
//    )
// }

// export function MicSelector () {
//    const {
//       sessionState: {
//          audioDevices, audioDeviceSelected
//       }, setAudioDeviceSelected
//    } = useGroupRecorderContext()

//    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//       const newDeviceId = e.target.value
//       setAudioDeviceSelected(newDeviceId)
//    }

//    return (
//       <label className="p-4">
//          <div className="flex items-center mb-2">
//             <Mic className="mr-2 size-5" />
//             <span>Seleccionar Microfono</span>
//          </div>

//          <select className="p-2 border"
//             onChange={handleChange}
//             value={audioDeviceSelected!.deviceId}>
//             {audioDevices.map(device => (
//                <option key={device.deviceId}
//                   value={device.deviceId}>{device.label}</option>
//             ))}
//          </select>
//       </label>
//    )
// }

// export function SpeakerSelector () {
//    const {
//       sessionState: {
//          speakerDevices, speakerDeviceSelected
//       }, setSpeakerDeviceSelected
//    } = useGroupRecorderContext()

//    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//       const newDeviceId = e.target.value
//       setSpeakerDeviceSelected(newDeviceId)
//    }

//    return (
//       <label className="p-4">
//          <div className="flex items-center mb-2">
//             <Speaker className="mr-2 size-5" />
//             <span>Seleccionar Altavoz</span>
//          </div>

//          <select className="p-2 border"
//             onChange={handleChange}
//             value={speakerDeviceSelected!.deviceId}>
//             {speakerDevices.map(device => (
//                <option key={device.deviceId}
//                   value={device.deviceId}>{device.label}</option>
//             ))}
//          </select>
//       </label>
//    )
// }

