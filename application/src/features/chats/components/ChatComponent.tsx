"use client";

import { ArrowUp, HelpCircle, MessageCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { ClientResponseError, RecordModel } from "pocketbase";
import { useCallback, useEffect, useRef, useState } from "react";
import { useOrganizationContext } from "@/features/organizations/context/OrganizationContext";
import { useStaggeredAuthContext } from "@/features/staggeredAuth/context/StaggeredAuthContext";
import pbClient from "@/libs/pbClient";
import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";

type Message = {
   id: string;
   sender: string;
   content: string;
   isCurrentUser: boolean;
   isQuestion: boolean;
   timestamp: Date;
};

function useRealtimeMessages() {
   const [messages, setMessages] = useState<Message[]>([]);
   // const [userIp, setUserIp] = useState<string | null>(null)
   const { conferenceId } = useParams();
   const { user } = useStaggeredAuthContext();
   const { organization } = useOrganizationContext();
   const isLoadingMessagesRef = useRef(false);
   // Keep track of message IDs we've already processed
   const processedMessageIds = useRef(new Set<string>());
   // Keep track of whether the initial messages have been loaded
   const initialMessagesLoaded = useRef(false);

   if (!organization) {
      throw new Error("Organization is required");
   }

   // Format a record into our Message type
   const formatMessage = useCallback(
      (
         record: ChatMessage &
            RecordModel & {
               expand?: { user?: { name: string; id: string } };
            },
      ): Message => {
         return {
            id: record.id,
            sender: record.userName || "",
            content: record.messageText,
            isCurrentUser: user ? record.user === user.id : false,
            isQuestion: record.isQuestion,
            timestamp: new Date(record.created),
         };
      },
      [user],
   );

   // Add a message to our state only if it's not already there
   const addUniqueMessage = useCallback((newMessage: Message) => {
      if (processedMessageIds.current.has(newMessage.id)) {
         return false; // Message already exists
      }

      processedMessageIds.current.add(newMessage.id);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      return true;
   }, []);

   // Remove a message from our state
   const removeMessage = useCallback((messageId: string) => {
      setMessages((prevMessages) =>
         prevMessages.filter((msg) => msg.id !== messageId),
      );
      processedMessageIds.current.delete(messageId);
   }, []);

   const loadInitialMessages = useCallback(async () => {
      if (
         !conferenceId ||
         isLoadingMessagesRef.current ||
         initialMessagesLoaded.current
      )
         return;

      isLoadingMessagesRef.current = true;

      try {
         const records = await pbClient
            .collection(PB_COLLECTIONS.CHAT_MESSAGES)
            .getFullList<ChatMessage & RecordModel>({
               filter: `organization = "${organization.id}" && conference = "${conferenceId}"`,
               sort: "created",
               expand: "user",
            });

         // Reset the processed IDs and messages state
         processedMessageIds.current.clear();
         const formattedMessages: Message[] = [];

         // Process each message and add to our array
         for (const record of records) {
            const message = formatMessage(record);
            processedMessageIds.current.add(message.id);
            formattedMessages.push(message);
         }

         // Update state with all initial messages at once
         setMessages(formattedMessages);
         initialMessagesLoaded.current = true;
      } catch (error) {
         console.error("Error loading initial messages:", error);
      } finally {
         isLoadingMessagesRef.current = false;
      }
   }, [conferenceId, organization.id, formatMessage]);

   useEffect(() => {
      // Reset state when conferenceId changes
      setMessages([]);
      processedMessageIds.current.clear();
      initialMessagesLoaded.current = false;
   }, [conferenceId, organization.id]);

   useEffect(() => {
      let unsubscribe: (() => void) | null = null;

      const setSubscription = async () => {
         // Get user IP for message sending
         // const userIpInfo = await getUserIpInfoAction()
         // if (userIpInfo) {
         //    setUserIp(userIpInfo.ip)
         // }

         // Load initial messages
         await loadInitialMessages();

         // Subscribe to real-time updates
         unsubscribe = await pbClient
            .collection(PB_COLLECTIONS.CHAT_MESSAGES)
            .subscribe<ChatMessage & RecordModel>(
               "*",
               (event) => {
                  // Handle different event types
                  switch (event.action) {
                     case "create":
                        // Add new message
                        const newMessage = formatMessage(event.record);
                        addUniqueMessage(newMessage);
                        break;

                     case "delete":
                        // Remove deleted message
                        removeMessage(event.record.id);
                        break;

                     case "update":
                        // Handle message updates (e.g., edited messages)
                        removeMessage(event.record.id); // Remove old version
                        const updatedMessage = formatMessage(event.record);
                        addUniqueMessage(updatedMessage); // Add updated version
                        break;
                  }
               },
               {
                  filter: `organization = "${organization.id}" && conference = "${conferenceId}"`,
                  expand: "user",
               },
            );
      };

      setSubscription();

      return () => {
         if (unsubscribe) {
            unsubscribe();
         }
      };
   }, [
      conferenceId,
      organization.id,
      formatMessage,
      addUniqueMessage,
      removeMessage,
      loadInitialMessages,
   ]);

   const sendMessage = useCallback(
      async (newMessage: string, isQuestion: boolean) => {
         if (!conferenceId) {
            alert("Class ID is required");
            return;
         }

         try {
            const newMsg: ChatMessage = {
               organization: organization.id,
               conference: conferenceId as string,
               user: user?.id,
               userName: user?.name,
               messageText: newMessage,
               isQuestion,
               userIp: "",
            };

            await pbClient
               .collection(PB_COLLECTIONS.CHAT_MESSAGES)
               .create(newMsg);
            // Note: We don't add the message to the UI here - we'll let the subscription handle it
         } catch (error) {
            if (error instanceof ClientResponseError) {
               console.error("Error sending message:", error.message);
               alert(`Error sending message: ${error.message}`);
            } else {
               console.error("Error sending message:", error);
               alert("Error sending message. Please try again later.");
            }
         }
      },
      [conferenceId, user?.id, user?.name, organization.id],
   );

   return {
      messages,
      sendMessage,
   };
}

export default function ChatComponent() {
   const [newMessage, setNewMessage] = useState("");
   const [isQuestion, setIsQuestion] = useState(false);
   const { messages, sendMessage } = useRealtimeMessages();
   const messagesEndRef = useRef<HTMLDivElement>(null);
   const messagesContainerRef = useRef<HTMLDivElement>(null);
   const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if (newMessage.trim() === "") return;

      sendMessage(newMessage, isQuestion);
      setNewMessage("");
      setIsQuestion(false);
   };

   useEffect(() => {
      // Scroll to bottom when new messages arrive
      // messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })

      // Scroll to bottom of messages container
      if (messagesContainerRef.current) {
         messagesContainerRef.current.scrollTop =
            messagesContainerRef.current.scrollHeight;
      }
   }, [messages]);

   return (
      <div>
         {/* Messages Container */}
         <div className="bg-gradient-to-b from-stone-50 to-white mb-4 p-4 border border-stone-200 rounded-xl">
            <div
               ref={messagesContainerRef}
               className="space-y-3 pr-2 h-80 overflow-y-auto"
               style={{
                  scrollbarWidth: "thin",
               }}
            >
               {messages.length === 0 ? (
                  <div className="flex justify-center items-center h-full text-stone-500">
                     <div className="text-center">
                        <MessageCircle className="mx-auto mb-2 w-12 h-12 text-stone-400" />
                        <p className="text-sm">No hay mensajes aún</p>
                        <p className="text-xs">
                           Sé el primero en enviar un mensaje
                        </p>
                     </div>
                  </div>
               ) : (
                  messages.map((message) => (
                     <div
                        key={message.id}
                        className={`flex ${message.isCurrentUser ? "justify-end" : "justify-start"}`}
                     >
                        <div
                           className={`max-w-xs p-3 rounded-xl shadow-sm ${
                              message.isQuestion
                                 ? "bg-gradient-to-r from-amber-100 to-amber-200 border border-amber-300"
                                 : message.isCurrentUser
                                   ? "bg-gradient-to-r from-stone-700 to-stone-800 text-white"
                                   : "bg-white border border-stone-200"
                           }`}
                        >
                           {!message.isCurrentUser && (
                              <div className="flex items-center gap-2 mb-2">
                                 <span className="font-semibold text-stone-700 text-sm">
                                    {message.sender}
                                 </span>
                                 {message.isQuestion && (
                                    <HelpCircle className="w-4 h-4 text-amber-600" />
                                 )}
                              </div>
                           )}
                           <p
                              className={`text-sm ${message.isCurrentUser && !message.isQuestion ? "text-white" : "text-stone-700"}`}
                           >
                              {message.content}
                           </p>
                        </div>
                     </div>
                  ))
               )}
               <div ref={messagesEndRef} />
            </div>
         </div>

         {/* Input Form */}
         <form onSubmit={handleSendMessage} className="space-y-3">
            {/* Question Toggle */}
            <div className="flex items-center">
               <label className="flex items-center cursor-pointer">
                  <input
                     type="checkbox"
                     checked={isQuestion}
                     onChange={() => setIsQuestion(!isQuestion)}
                     className="mr-2 border-stone-300 rounded focus:ring-amber-500 w-4 h-4 text-amber-600"
                  />
                  <span className="flex items-center gap-1 text-stone-600 text-sm">
                     <HelpCircle className="w-4 h-4" />
                     Marcar como pregunta
                  </span>
               </label>
            </div>

            {/* Message Input */}
            <div className="flex items-center gap-2">
               <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Envía un mensaje..."
                  className="flex-1 p-3 border border-stone-300 focus:border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-500 transition-all duration-200"
               />
               <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-gradient-to-r from-stone-700 hover:from-stone-800 disabled:from-stone-300 to-stone-800 hover:to-stone-900 disabled:to-stone-400 p-3 px-8 rounded-xl text-white transition-all duration-200 disabled:cursor-not-allowed"
               >
                  <ArrowUp className="w-5 h-5" />
               </button>
            </div>
         </form>
      </div>
   );
}
