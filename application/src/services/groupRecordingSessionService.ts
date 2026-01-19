import { session } from "@/data/sessionTests";

export async function getGroupRecordingSession(sessionId: string) {
   if (sessionId === session.id) return session;

   return null;
}
