import { GroupRecorder } from "@/types/groupRecorder";

export const users: GroupRecorder.Participant[] = [
   {
      id: "dfgdfgdfg",
      speakerCode: "FSD-IOJ",
      displayName: "DR. Julio Cid",
      role: "participant",
   },
   {
      id: "bgtrfd",
      speakerCode: "MQY-SDL",
      displayName: "ING. Victor Pazaran",
      role: "host",
   },
];

export const session = {
   id: "FSD-IOJ-MQY-SDL",
   sessionName: "Pruebas grabación grupal",
   usersInvited: users,
};
