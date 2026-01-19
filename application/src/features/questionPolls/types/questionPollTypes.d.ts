interface QuestionPoll {
   organization: OrganizationRecord["id"];
   congress: CongressRecord["id"];
   question: string;
   status: "inactive" | "active" | "finished";
}
type QuestionPollRecord = DBRecordItem<QuestionPoll>;

interface QuestionPollOption {
   organization: OrganizationRecord["id"];
   questionPoll: QuestionPollRecord["id"];
   text: string;
}
type QuestionPollOptionRecord = DBRecordItem<QuestionPollOption>;

interface QuestionPollAnswer {
   organization: OrganizationRecord["id"];
   questionPoll: QuestionPollRecord["id"];
   user?: UserRecord["id"];
   optionSelected: QuestionPollOptionRecord["id"];
}
type QuestionPollAnswerRecord = DBRecordItem<QuestionPollAnswer>;
