interface UserPurchase {
   organization: OrganizationRecord["id"];
   user: UserRecord["id"];
   congress: CongressRecord["id"];
   productType: "virtual_congress" | "in-person_congress" | "recordings_access";
}
