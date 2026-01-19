interface ConferenceQuestionPoll {
   organization: OrganizationRecord["id"];
   conference: CongressConferenceRecord["id"];
   questionPoll: QuestionPollRecord["id"];
}
type ConferenceQuestionPollRecord = DBRecordItem<ConferenceQuestionPoll>;
