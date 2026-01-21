"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";

interface ChatMessage {
   id: string;
   user: string;
   content: string;
   timestamp: string;
   isOwn?: boolean;
}

const INITIAL_MESSAGES: ChatMessage[] = [
   {
      id: "m1",
      user: "María P.",
      content: "¡Felicidades, doctor! Excelente ponencia, muy clara y útil.",
      timestamp: "Hace 3 min",
   },
   {
      id: "m2",
      user: "Carlos R.",
      content: "Me gustó mucho la explicación sobre los casos clínicos.",
      timestamp: "Hace 2 min",
   },
   {
      id: "m3",
      user: "Ana G.",
      content: "¿Podrían compartir las referencias mencionadas al final?",
      timestamp: "Hace 1 min",
   },
];

export default function DemoChat() {
   const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
   const [text, setText] = useState("");
   const endRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
      endRef.current?.scrollIntoView({
         behavior: "smooth",
      });
   }, []);

   const handleSend = (e: FormEvent) => {
      e.preventDefault();
      const trimmed = text.trim();
      if (!trimmed) return;
      const newMessage: ChatMessage = {
         id: `m-${Date.now()}`,
         user: "Tú",
         content: trimmed,
         timestamp: "Ahora",
         isOwn: true,
      };
      setMessages((prev) => [...prev, newMessage]);
      setText("");
   };

   return (
      <div className="flex flex-col border border-gray-200 rounded-2xl h-[420px] overflow-hidden">
         <div className="flex justify-between items-center px-4 py-2 border-gray-200 border-b">
            <h3 className="font-medium text-gray-800 text-sm">Chat público</h3>
            {/* <span className="text-gray-500 text-xs">Solo demo</span> */}
         </div>

         <div className="flex-1 space-y-3 px-4 py-3 overflow-y-auto">
            {messages.map((m) => (
               <div key={m.id} className={`flex ${m.isOwn ? "justify-end" : "justify-start"}`}>
                  <div
                     className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${m.isOwn ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"}`}
                  >
                     <div className={`mb-0.5 text-[11px] ${m.isOwn ? "text-white/80" : "text-gray-600"}`}>
                        {m.user} · {m.timestamp}
                     </div>
                     <div className="break-words whitespace-pre-wrap">{m.content}</div>
                  </div>
               </div>
            ))}
            <div ref={endRef} />
         </div>

         <form onSubmit={handleSend} className="flex items-center gap-2 px-3 py-2 border-gray-200 border-t">
            <input
               value={text}
               onChange={(e) => setText(e.target.value)}
               placeholder="Escribe un mensaje..."
               className="flex-1 px-3 py-2 border border-gray-200 focus:border-gray-300 rounded-lg outline-none placeholder:text-gray-400 text-sm"
            />
            <button
               type="submit"
               disabled={!text.trim()}
               className="bg-gray-900 disabled:opacity-50 px-3 py-2 rounded-lg font-medium text-white text-sm"
            >
               Enviar
            </button>
         </form>
      </div>
   );
}
