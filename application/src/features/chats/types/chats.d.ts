// Chat
interface ChatMessage {
   organization: OrganizationRecord["id"];
   conference: ClassRecord["id"];
   user?: UserRecord["id"];
   userName?: string;
   messageText: string;
   isQuestion: boolean;
   userIp: string;
}

interface ChatBanned {
   organization: (Organization & RecordModel)["id"];
   user: (User & RecordModel)["id"];
   bannedIp: string;
}
