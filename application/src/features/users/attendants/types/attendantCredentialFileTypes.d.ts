interface AttendantCredentialFile {
   organization: OrganizationRecord["id"];
   user: UserRecord["id"];
   fileType: string;
   file: File | string;
}
type AttendantCredentialFileRecord = DBRecordItem<AttendantCredentialFile>;
