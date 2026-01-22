// import {
//    useEffect, useState, useCallback
// } from "react"
// // import { diffSeconds } from "@formkit/tempo"
// import { Clock, Radio } from "lucide-react"

// // interface LiveClassWaitingPhaseProps {
// //    // currentServerTime: string
// // }

// export default function LiveClassWaitingPhase () {
//    const [timeRemaining, setTimeRemaining] = useState<{
//       days: number
//       hours: number
//       minutes: number
//       seconds: number
//    }>({
//       days: 0,
//       hours: 0,
//       minutes: 0,
//       seconds: 0
//    })

//    // const [initialOffset] = useState(() =>
//    //    Math.abs(diffSeconds(currentServerTime, classStartTime))
//    // )

//    const calculateTimeRemaining = useCallback(() => {
//       const now = new Date()
//       const classStart = new Date(classStartTime)
//       const totalSecondsRemaining = Math.max(0, Math.floor((classStart.getTime() - now.getTime()) / 1000))

//       if (totalSecondsRemaining <= 0) {
//          return {
//             days: 0,
//             hours: 0,
//             minutes: 0,
//             seconds: 0
//          }
//       }

//       const days = Math.floor(totalSecondsRemaining / 86400)
//       const hours = Math.floor((totalSecondsRemaining % 86400) / 3600)
//       const minutes = Math.floor((totalSecondsRemaining % 3600) / 60)
//       const seconds = totalSecondsRemaining % 60

//       return {
//          days,
//          hours,
//          minutes,
//          seconds
//       }
//    }, [classStartTime])

//    useEffect(() => {
//       setTimeRemaining(calculateTimeRemaining())

//       const timer = setInterval(() => {
//          const remaining = calculateTimeRemaining()
//          setTimeRemaining(remaining)

//          // Check if countdown has reached zero
//          if (remaining.days === 0 && remaining.hours === 0 &&
//              remaining.minutes === 0 && remaining.seconds === 0) {
//             clearInterval(timer)
//          }
//       }, 1000)

//       return () => clearInterval(timer)
//    }, [calculateTimeRemaining])

//    // Format time units to always have two digits
//    const formatTimeUnit = (value: number) => {
//       return value.toString()
//          .padStart(2, '0')
//    }

//    const isCountdownZero = timeRemaining.days === 0 &&
//                           timeRemaining.hours === 0 &&
//                           timeRemaining.minutes === 0 &&
//                           timeRemaining.seconds === 0

//    return (
//       <div className="flex flex-col justify-center items-center bg-linear-to-br from-amber-50 to-orange-50 p-8 w-full min-h-[500px]">
//          <div className="space-y-8 mx-auto w-full max-w-md text-center">
//             {isCountdownZero ? (
//                <div>
//                   <div className="bg-amber-100 mx-auto mb-6 p-4 rounded-full w-fit">
//                      <Radio className="w-12 h-12 text-amber-600 animate-pulse" />
//                   </div>

//                   <h2 className="mb-4 font-bold text-stone-900 text-2xl md:text-3xl">
//                      ¡La clase está por comenzar!
//                   </h2>

//                   <div className="space-y-4 bg-white/70 backdrop-blur-sm p-6 border border-amber-200 rounded-xl">
//                      <p className="text-stone-700 text-lg">
//                         El profesor está preparándose para iniciar la transmisión.
//                      </p>

//                      <p className="text-stone-600 text-sm md:text-base">
//                         Por favor, mantente en esta página. La transmisión comenzará en breve.
//                      </p>
//                   </div>
//                </div>
//             ) : (
//                <div>
//                   <div className="bg-amber-100 mx-auto mb-6 p-4 rounded-full w-fit">
//                      <Clock className="w-12 h-12 text-amber-600" />
//                   </div>

//                   <h2 className="mb-2 font-bold text-stone-900 text-2xl md:text-3xl">
//                      La clase comenzará pronto
//                   </h2>

//                   <p className="mb-6 text-stone-600 text-lg">Tiempo restante</p>

//                   <div className="gap-3 grid grid-cols-4 mb-6">
//                      <div className="flex flex-col items-center bg-white/70 backdrop-blur-sm p-4 border border-amber-200 rounded-xl">
//                         <span className="font-bold text-amber-700 text-2xl md:text-3xl">
//                            {formatTimeUnit(timeRemaining.days)}
//                         </span>
//                         <span className="mt-1 font-medium text-stone-600 text-xs md:text-sm">Días</span>
//                      </div>
//                      <div className="flex flex-col items-center bg-white/70 backdrop-blur-sm p-4 border border-amber-200 rounded-xl">
//                         <span className="font-bold text-amber-700 text-2xl md:text-3xl">
//                            {formatTimeUnit(timeRemaining.hours)}
//                         </span>
//                         <span className="mt-1 font-medium text-stone-600 text-xs md:text-sm">Horas</span>
//                      </div>
//                      <div className="flex flex-col items-center bg-white/70 backdrop-blur-sm p-4 border border-amber-200 rounded-xl">
//                         <span className="font-bold text-amber-700 text-2xl md:text-3xl">
//                            {formatTimeUnit(timeRemaining.minutes)}
//                         </span>
//                         <span className="mt-1 font-medium text-stone-600 text-xs md:text-sm">Minutos</span>
//                      </div>
//                      <div className="flex flex-col items-center bg-white/70 backdrop-blur-sm p-4 border border-amber-200 rounded-xl">
//                         <span className="font-bold text-amber-700 text-2xl md:text-3xl">
//                            {formatTimeUnit(timeRemaining.seconds)}
//                         </span>
//                         <span className="mt-1 font-medium text-stone-600 text-xs md:text-sm">Segundos</span>
//                      </div>
//                   </div>

//                   <div className="bg-white/70 backdrop-blur-sm p-4 border border-amber-200 rounded-xl">
//                      <p className="text-stone-700 text-sm md:text-base">
//                         Pronto podrás unirte a nuestra clase en vivo.
//                      </p>

//                      {/* {initialOffset > 600 && (
//                         <p className="mt-2 text-stone-600 text-sm">
//                            Te enviaremos un recordatorio 10 minutos antes de comenzar.
//                         </p>
//                      )} */}
//                   </div>
//                </div>
//             )}
//          </div>
//       </div>
//    )
// }
