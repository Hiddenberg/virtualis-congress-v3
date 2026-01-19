import { users } from "@/data/sessionTests";

export async function getParticipant(spkekerCode: string) {
   const user = users.find((user) => user.speakerCode === spkekerCode);

   if (user) return user;

   return null;
}
