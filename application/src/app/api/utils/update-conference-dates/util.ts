// import { TEMP_CONSTANTS } from "@/data/tempConstants";
// import pbServerClient from "@/libs/pbServerClient";
// import { getAllCongressConferences } from "@/services/conferenceServices";
// import { CongressConference } from "@/types/congress";
// import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";
// import { addDay, diffDays } from "@formkit/tempo";

// export async function GET() {
//    const oldCongressDateMX = new Date("2025-03-20T08:00:00-06:00");
//    const newCongressDateMX = new Date("2025-04-10T08:00:00-06:00");
//    const newCongressDateUTC = new Date(newCongressDateMX.toISOString())
//    const daysOfDifference = diffDays(newCongressDateMX, oldCongressDateMX)

//    const allConferences = await getAllCongressConferences(TEMP_CONSTANTS.CONGRESS_ID)

//    let conferencesSkipped = 0
//    let conferencesUpdated = 0
//    allConferences.forEach(conference => {
//       const oldMXStartTime = new Date(conference.startTime.replace("Z", "-06:00"))
//       const oldUTCStartTime = new Date(oldMXStartTime.toISOString())
//       const newUTCStartTime = addDay(oldUTCStartTime, daysOfDifference)

//       const oldMXEndTime = new Date(conference.endTime.replace("Z", "-06:00"))
//       const oldUTCEndTime = new Date(oldMXEndTime.toISOString())
//       const newUTCEndTime = addDay(oldUTCEndTime, daysOfDifference)

//       // if the conference is after the new congress date, skip it
//       const wasUpdated =  oldUTCStartTime >= newCongressDateUTC
//       if (wasUpdated) {
//          console.log("skipping", conference.id)
//          conferencesSkipped++
//          return
//       }

//       pbServerClient.collection(PB_COLLECTIONS.CONGRESS_CONFERENCES).update(conference.id, {
//          startTime: newUTCStartTime.toISOString(),
//          endTime: newUTCEndTime.toISOString(),
//       } satisfies Partial<CongressConference>)
//          .then(updatedConference => {
//             console.log("updated", updatedConference.id)
//             console.log("old", conference.startTime, conference.endTime)
//             console.log("new", updatedConference.startTime, updatedConference.endTime)
//             conferencesUpdated++
//          })
//    })

//    return Response.json({
//       message: "updated",
//       conferencesUpdated,
//       conferencesSkipped
//    })
// }

