/* eslint-disable @next/next/no-img-element */
"use client";

// import { Button } from "@/components/global/Buttons"
import {
   ChevronLeft,
   ChevronRight,
   // Grid3X3
} from "lucide-react";
import { useCallback, useState } from "react";
import type { SlideImage } from "../services/convertapiServices";

interface SlidesShowerProps {
   slideImages: SlideImage[];
}

export default function SlidesShower({ slideImages }: SlidesShowerProps) {
   const [currentSlide, setCurrentSlide] = useState(0);
   // const [isFullscreen, setIsFullscreen] = useState(false)
   // const [zoom, setZoom] = useState(1)
   // const [showThumbnails, setShowThumbnails] = useState(true)
   // const startTimeRef = useRef<number | null>(null)
   // const slideDurationRefs = useRef<{
   //    slideIndex: number,
   //    startTime: number
   // }[]>([])
   // const [recordingSlides, setRecordingSlides] = useState(false)
   // const [slideshowPlaying, setSlideshowPlaying] = useState(false)

   // useEffect(() => {
   //    if (recordingSlides) {
   //       if (startTimeRef.current === null) {
   //          startTimeRef.current = Date.now()
   //          console.log("startTimeRef.current", startTimeRef.current)
   //       }

   //       const diffMs = Date.now() - startTimeRef.current

   //       slideDurationRefs.current.push({
   //          slideIndex: currentSlide,
   //          startTime: diffMs
   //       })

   //       console.log("slideDurationRefs.current", slideDurationRefs.current)
   //    }
   // }, [recordingSlides, currentSlide])

   // Navigation functions
   const goToNextSlide = useCallback(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
   }, [slideImages.length]);

   const goToPrevSlide = useCallback(() => {
      setCurrentSlide((prev) => (prev - 1 + slideImages.length) % slideImages.length);
   }, [slideImages.length]);

   const goToSlide = useCallback((index: number) => {
      setCurrentSlide(index);
   }, []);

   // Keyboard navigation
   // useEffect(() => {
   //    const handleKeyDown = (event: KeyboardEvent) => {
   //       switch (event.key) {
   //       case 'ArrowRight':
   //       case ' ':
   //          event.preventDefault()
   //          goToNextSlide()
   //          break
   //       case 'ArrowLeft':
   //          event.preventDefault()
   //          goToPrevSlide()
   //          break
   //       case 'Escape':
   //          setIsFullscreen(false)
   //          setSlideshowPlaying(false)
   //          break
   //       case 'f':
   //       case 'F':
   //          setIsFullscreen(!isFullscreen)
   //          break
   //       }
   //    }

   //    window.addEventListener('keydown', handleKeyDown)
   //    return () => window.removeEventListener('keydown', handleKeyDown)
   // }, [goToNextSlide, goToPrevSlide, isFullscreen])

   // Fullscreen handling
   // const toggleFullscreen = () => {
   //    setIsFullscreen(!isFullscreen)
   // }

   // Zoom functions
   // const zoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3))
   // const zoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5))

   // Download function
   // const downloadSlide = async (slideImage: SlideImage) => {
   //    try {
   //       const response = await fetch(slideImage.url)
   //       const blob = await response.blob()
   //       const url = window.URL.createObjectURL(blob)
   //       const a = document.createElement('a')
   //       a.style.display = 'none'
   //       a.href = url
   //       a.download = slideImage.fileName
   //       document.body.appendChild(a)
   //       a.click()
   //       window.URL.revokeObjectURL(url)
   //       document.body.removeChild(a)
   //    } catch (error) {
   //       console.error('Error downloading slide:', error)
   //    }
   // }

   if (slideImages.length === 0) {
      return (
         <div className="py-12 text-center">
            <p className="text-gray-500">No hay diapositivas para mostrar</p>
         </div>
      );
   }

   const currentSlideImage = slideImages[currentSlide];

   return (
      <div className={`bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden max-w-3xl mx-auto`}>
         {/* Header with controls */}
         <div className="bg-gray-50 p-4 border-gray-200 border-b">
            <div className="flex justify-between items-center">
               <div className="flex items-center gap-4">
                  <h2 className="font-bold text-gray-900 text-xl">Diapositiva Convertida</h2>
                  <span className="text-gray-500 text-sm">
                     {currentSlide + 1} de {slideImages.length}
                  </span>
               </div>

               <div className="flex items-center gap-2">
                  {/* Thumbnails toggle */}
                  {/* <Button
                     onClick={() => setShowThumbnails(!showThumbnails)}
                     variant="outline"
                     className="!px-3 !py-2"
                     title="Mostrar/ocultar miniaturas"
                  >
                     <Grid3X3 className="w-4 h-4" />
                  </Button> */}

                  {/* Zoom controls */}
                  <div className="flex items-center gap-1 border rounded-lg">
                     {/* <Button
                        onClick={zoomOut}
                        variant="none"
                        className="hover:bg-gray-100 !px-2 !py-1"
                        disabled={zoom <= 0.5}
                     >
                        <ZoomOut className="w-4 h-4" />
                     </Button> */}
                     {/* <span className="px-2 font-medium text-sm">{Math.round(zoom * 100)}%</span> */}
                     {/* <Button
                        onClick={zoomIn}
                        variant="none"
                        className="hover:bg-gray-100 !px-2 !py-1"
                        disabled={zoom >= 3}
                     >
                        <ZoomIn className="w-4 h-4" />
                     </Button> */}
                     {/* <Button
                        onClick={resetZoom}
                        variant="none"
                        className="hover:bg-gray-100 !px-2 !py-1"
                        title="Restablecer zoom"
                     >
                        <RotateCcw className="w-4 h-4" />
                     </Button> */}
                  </div>

                  {/* Fullscreen toggle */}
                  {/* <Button
                     onClick={toggleFullscreen}
                     variant="outline"
                     className="!px-3 !py-2"
                     title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                  >
                     {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  </Button> */}
               </div>
            </div>
         </div>

         {/* Main slide viewer */}
         <div className="relative bg-gray-900">
            <div className={`flex items-center justify-center h-[600px]`}>
               {/* Previous button */}
               <button
                  onClick={goToPrevSlide}
                  className="left-4 z-10 absolute bg-black/50 hover:bg-black/70 p-3 rounded-full text-white hover:scale-110 transition-all duration-200"
                  disabled={slideImages.length <= 1}
               >
                  <ChevronLeft className="w-6 h-6" />
               </button>

               {/* Slide image */}
               <div className="relative max-w-full max-h-full overflow-hidden">
                  <img
                     src={currentSlideImage.url}
                     alt={`Diapositiva ${currentSlide + 1}`}
                     className="max-w-full max-h-full object-contain transition-transform duration-300"
                     // style={{
                     //    transform: `scale(${zoom})`
                     // }}
                  />

                  {/* Slide counter overlay */}
                  <div className="right-4 bottom-4 absolute bg-black/70 px-3 py-1 rounded-full text-white text-sm">
                     {currentSlide + 1} / {slideImages.length}
                  </div>
               </div>

               {/* Next button */}
               <button
                  onClick={goToNextSlide}
                  className="right-4 z-10 absolute bg-black/50 hover:bg-black/70 p-3 rounded-full text-white hover:scale-110 transition-all duration-200"
                  disabled={slideImages.length <= 1}
               >
                  <ChevronRight className="w-6 h-6" />
               </button>
            </div>
         </div>

         {/* Thumbnails navigation */}
         <div className="bg-gray-50 p-4 border-gray-200 border-t">
            <div className="flex gap-3 pb-2 overflow-x-auto">
               {slideImages.map((slide, index) => (
                  <button
                     key={slide.fileName}
                     onClick={() => goToSlide(index)}
                     className={`flex-shrink-0 relative border-2 rounded-lg overflow-hidden transition-all duration-200 hover:scale-105 ${
                        index === currentSlide ? "border-yellow-400 shadow-lg" : "border-gray-300 hover:border-gray-400"
                     }`}
                  >
                     <img src={slide.url} alt={`Miniatura ${index + 1}`} className="w-24 h-16 object-cover" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                        <span className="bottom-1 left-1 absolute font-medium text-white text-xs">{index + 1}</span>
                     </div>
                     {index === currentSlide && (
                        <div className="-top-1 -right-1 absolute bg-yellow-400 border border-white rounded-full w-3 h-3" />
                     )}
                  </button>
               ))}
            </div>
         </div>

         {/* Keyboard shortcuts help */}
         {/* <div className="bg-gray-50 px-4 py-2 border-gray-200 border-t">
            <p className="text-gray-500 text-xs text-center">
               <strong>Atajos de teclado:</strong> ← → (navegación) | Espacio (siguiente) | F (pantalla completa) | Esc (salir)
            </p>
         </div> */}
      </div>
   );
}
