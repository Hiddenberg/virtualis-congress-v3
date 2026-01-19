/// <reference path="../pb_data/types.d.ts" />

/**
 * 
 * @param {core.MailerRecordEvent} e 
 * @returns 
 */
function addOrganizationAsSender(e) {
   console.log("OTP sent")

   if (!e.record) {
      e.next()
      return;
   }
   // @ts-ignore
   $app.expandRecord(e.record, ["organization"], null)
   const organizationName = e.record.expandedOne("organization").getString("name")

   if (!e.message) {
      e.next()
      return
   }

   e.message.from.name = organizationName.toUpperCase()
   e.message.html = e.message.html.replaceAll(/\{ORGANIZATION_NAME\}/g, organizationName)

   e.next()
}

onMailerRecordOTPSend(addOrganizationAsSender)
onMailerRecordVerificationSend(addOrganizationAsSender)
onMailerRecordEmailChangeSend(addOrganizationAsSender)