// "use client"

// // import { Share2, Heart, Eye } from 'lucide-react'
// import dynamic from 'next/dynamic'

// const DynamicZoomSessionInterface = dynamic(() => import("@/components/QnA-transmission/ZoomSessionInterface"), {
//    ssr: false,
// })

// export default function VideoPlayerSections ({ conferenceTitle }: { conferenceTitle: string }) {
//    return (
//       <div className="mx-auto p-4 w-full">
//          <DynamicZoomSessionInterface sessionName={conferenceTitle} />
//          {/* <h1 className="mb-4 font-bold text-2xl">
//             Nanotecnología en la Administración de Medicamentos: Retos y Oportunidades
//          </h1> */}
//          {/* <div className="flex justify-between items-center mb-4">
//             <div className="flex items-center space-x-4">
//                <button className="text-gray-600 hover:text-gray-800">
//                   <Share2 className="w-5 h-5" />
//                </button>
//                <div className="flex items-center">
//                   <Heart className="mr-1 w-5 h-5 text-red-500" />
//                   <span className="text-gray-600 text-sm">83</span>
//                </div>
//                <div className="flex items-center">
//                   <Eye className="mr-1 w-5 h-5 text-gray-500" />
//                   <span className="text-gray-600 text-sm">657</span>
//                </div>
//             </div>
//          </div> */}
//       </div>
//    )
// }
