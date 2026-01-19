// import pbServerClient from "@/libs/pbServerClient";
// import { ACPMemberData } from "@/types/congress";
// import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";
// import { ClientResponseError, RecordModel } from "pocketbase";
// import papapars from "papaparse"
// import fs from "fs/promises"
// import validator from "validator"

// export async function GET() {
//    const members = await pbServerClient.collection(PB_COLLECTIONS.ACP_MEMBERS_DATA).getFullList<ACPMemberData & RecordModel>()

//    for (const member of members) {
//       await pbServerClient.collection(PB_COLLECTIONS.ACP_MEMBERS_DATA).delete(member.id)
//       console.log(`Deleted member ${member.acpID}`)
//    }
//    console.log("Deleted all members")

//    const membersFile = await fs.readFile("src/data/acp-members.csv", "utf8")
//    const csvData = papapars.parse(membersFile, {
//       header: true,
//       skipEmptyLines: true,
//    })

//    const membersData = csvData.data.map((member) => {
//       return {
//          fullName: `${member["FirstName"]} ${member["LastName"]}`,
//          acpID: member["CustomerID"],
//          email: member["Email"],
//          age: validator.isNumeric(member["BirthYear"]) ? 2025 - parseInt(member["BirthYear"]) : undefined,
//          city: member["City"],
//          acpMemberClass: member["MemberClass"]
//       }
//    })

//    const membersSkipped = []
//    for (const member of membersData) {
//       try {
//          const newMember = await pbServerClient.collection(PB_COLLECTIONS.ACP_MEMBERS_DATA).create(member)
//          console.log(`Member recraeted ${member.acpID}`)
//       } catch (error) {
//          if (error instanceof ClientResponseError) {
//             membersSkipped.push({
//                id: member.acpID,
//                error: error.data
//             })
//          }
//       }
//    }

//    console.log("Members skipped", membersSkipped)

//    return Response.json({
//       length: "members deleted"
//    }, {
//       status: 200,
//    })
// }
