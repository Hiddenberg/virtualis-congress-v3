"use client";

import { HelpCircle, MessageCircle } from "lucide-react";
import type { RecordModel } from "pocketbase";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useOrganizationContext } from "@/features/organizations/context/OrganizationContext";
import pbClient from "@/libs/pbClient";
import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";

interface ChatMessageRecord extends RecordModel {
   organization: string;
   conference: string;
   user?: string | null;
   userName?: string | null;
   messageText: string;
   isQuestion: boolean;
}

interface Message {
   id: string;
   sender: string;
   text: string;
   isQuestion: boolean;
   createdAt: Date;
}

function useConferenceMessages(conferenceId: string | null) {
   const { organization } = useOrganizationContext();
   const [messages, setMessages] = useState<Message[]>([]);
   const processedIds = useRef(new Set<string>());
   const loadedRef = useRef(false);

   const toMsg = useCallback(
      (rec: ChatMessageRecord): Message => ({
         id: rec.id,
         sender: rec.userName ?? "",
         text: rec.messageText,
         isQuestion: rec.isQuestion,
         createdAt: new Date(rec.created),
      }),
      [],
   );

   const add = useCallback((m: Message) => {
      if (processedIds.current.has(m.id)) return;
      processedIds.current.add(m.id);
      setMessages((prev) => [...prev, m]);
   }, []);

   const remove = useCallback((id: string) => {
      processedIds.current.delete(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
   }, []);

   useEffect(() => {
      setMessages([]);
      processedIds.current.clear();
      loadedRef.current = false;
   }, []);

   useEffect(() => {
      if (!conferenceId || !organization) return;

      let unsub: (() => void) | null = null;

      const run = async () => {
         // initial load
         if (!loadedRef.current) {
            const records = await pbClient
               .collection(PB_COLLECTIONS.CHAT_MESSAGES)
               .getFullList<ChatMessageRecord>({
                  filter: `organization = "${organization.id}" && conference = "${conferenceId}"`,
                  sort: "created",
               });
            for (const r of records) {
               processedIds.current.add(r.id);
            }
            setMessages(records.map(toMsg));
            loadedRef.current = true;
         }

         // realtime subscribe
         unsub = await pbClient
            .collection(PB_COLLECTIONS.CHAT_MESSAGES)
            .subscribe<ChatMessageRecord>(
               "*",
               (evt) => {
                  switch (evt.action) {
                     case "create":
                        add(toMsg(evt.record));
                        break;
                     case "delete":
                        remove(evt.record.id);
                        break;
                     case "update":
                        remove(evt.record.id);
                        add(toMsg(evt.record));
                        break;
                  }
               },
               {
                  filter: `organization = "${organization.id}" && conference = "${conferenceId}"`,
               },
            );
      };

      run();
      return () => {
         if (unsub) unsub();
      };
   }, [conferenceId, organization, add, remove, toMsg]);

   return messages;
}

export default function SelfContainedRealtimeChatViewer({
   conferenceId,
}: {
   conferenceId: string;
}) {
   const messages = useConferenceMessages(conferenceId);
   const containerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (containerRef.current) {
         containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
   }, []);

   const grouped = useMemo(() => messages, [messages]);

   return (
      <div className="w-full h-full">
         <div className="bg-white/80 shadow-sm p-4 border border-stone-200 rounded-2xl h-full">
            <div
               ref={containerRef}
               className="space-y-3 pr-2 h-full overflow-y-auto"
               style={{
                  scrollbarWidth: "thin",
               }}
            >
               {grouped.length === 0 ? (
                  <div className="flex justify-center items-center h-full text-stone-500">
                     <div className="text-center">
                        <MessageCircle className="mx-auto mb-2 w-12 h-12 text-stone-400" />
                        <p className="text-sm">No hay mensajes aún</p>
                     </div>
                  </div>
               ) : (
                  grouped.map((msg) => (
                     <div key={msg.id} className="flex justify-start">
                        <div
                           className={`max-w-sm p-3 rounded-xl border shadow-sm ${msg.isQuestion ? "bg-amber-50 border-amber-200" : "bg-white border-stone-200"}`}
                        >
                           <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-stone-700 text-xl">
                                 {msg.sender}
                              </span>
                              {msg.isQuestion && (
                                 <HelpCircle className="w-4 h-4 text-amber-600" />
                              )}
                           </div>
                           <p className="font-bold text-stone-700 text-lg">
                              {msg.text}
                           </p>
                        </div>
                     </div>
                  ))
               )}
            </div>
         </div>
      </div>
   );
}
