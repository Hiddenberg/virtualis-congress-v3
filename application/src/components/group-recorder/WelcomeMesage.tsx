// "use client"

// import { useGroupRecorderContext } from "@/contexts/GroupRecorderContext";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";

// function LoadingSpinner () {
//    return (
//       <div className="flex flex-col justify-center items-center gap-4">
//          <h1>Cargando</h1>
//          <div className="border-gray-900 border-t-2 border-b-2 rounded-full w-16 h-16 animate-spin" />
//       </div>
//    )
// }

// function WelcomeMessage () {
//    const [isLoading, setIsLoading] = useState(false);
//    const [speakerCode, setSpeakerCode] = useState("");
//    const { initZoomClient } = useGroupRecorderContext()
//    const urlParams = useSearchParams()

//    const speakerCodeIsEmpty = speakerCode === "";

//    const {
//       sessionState: { sessionName }, setCurrentUser, currentUser
//    } = useGroupRecorderContext();

//    useEffect(() => {
//       async function getUserWithSpeakerCode (speakerCode: string) {
//          await setCurrentUser(speakerCode);
//          setIsLoading(false);
//       }

//       const urlSpeakerCode = urlParams.get("speakerCode")
//       if (urlSpeakerCode) {
//          getUserWithSpeakerCode(urlSpeakerCode)
//       }
//    },[setCurrentUser, urlParams])

//    const handleSubmit = async () => {
//       setIsLoading(true);
//       await setCurrentUser(speakerCode);
//       setIsLoading(false);
//    }

//    if (isLoading) {
//       return (
//          <div className="space-y-4 bg-white shadow-sm p-10 px-14 border-2 rounded-xl text-center">
//             <LoadingSpinner />
//          </div>
//       )
//    }

//    if (!currentUser) {
//       return (
//          <div className="space-y-4 bg-white shadow-sm p-10 px-14 border-2 rounded-xl text-center">
//             <h1 className="font-semibold text-2xl">
//                Hola
//             </h1>
//             <p>Ingresa tu código de participación para unirte.</p>
//             <input
//                type="text"
//                placeholder="Código de participación"
//                className="px-4 py-3 border border-black rounded-xl w-full"
//                value={speakerCode}
//                onChange={(e) => setSpeakerCode(e.target.value)}
//             />

//             <button onClick={handleSubmit}
//                disabled={speakerCodeIsEmpty}
//                className="bg-black disabled:bg-gray-400 p-4 px-6 rounded-xl font-semibold text-white transition-colors">
//                Entrar
//             </button>
//          </div>
//       )
//    }

//    if (currentUser !== null) {
//       return (
//          <div className="space-y-4 bg-white shadow-sm p-10 px-14 border-2 rounded-xl text-center">
//             <h2 className="font-semibold text-2xl">¡Bienvenido!</h2>

//             <h3 className="font-semibold text-xl">Hola {currentUser.displayName}</h3>
//             <p className="text-muted-foreground">
//                Gracias por unirte para grabar a la sesión: <strong>{sessionName}</strong>.
//                <br />
//                Estamos muy contentos de tenerte aquí.
//             </p>
//             <button
//                onClick={() => {setIsLoading(true); initZoomClient()}}
//                className="bg-black p-4 px-6 rounded-xl font-semibold text-white">
//                Iniciar
//             </button>
//          </div>
//       )
//    }
// }

// export default WelcomeMessage;
