// import papaparse from "papaparse"
// import fs from "fs/promises"
// import validator from "validator"
// import pbServerClient from "@/libs/pbServerClient"
// import PB_COLLECTIONS from "@/types/pocketbaseCollections"

// export async function GET() {
//    const initialTime = Date.now()
//    const membersFile = await fs.readFile("src/data/acp-members.csv", "utf8")

//    const csvData = papaparse.parse(membersFile, {
//       header: true,
//       skipEmptyLines: true,
//    })

//    const membersData = csvData.data.map((member) => {
//       return {
//          acpID: member["CustomerID"],
//          email: member["EMAIL"],
//          age: validator.isNumeric(member["BIRTH_YEAR"]) ? 2025 - parseInt(member["BIRTH_YEAR"]) : undefined,
//          city: member["CITY"],
//       }
//    })

//    // const updatePromisses = membersData.map(async(member) => {
//    //    const memberId = await pbServerClient.collection(PB_COLLECTIONS.ACP_MEMBERS_DATA).getFirstListItem(`acpID = '${member.acpID}'`)
//    //    await pbServerClient.collection(PB_COLLECTIONS.ACP_MEMBERS_DATA).update(memberId.id, member)

//    //    console.log(`Updated member ${member.acpID}`)
//    // })

//    // await Promise.all(updatePromisses)

//    for (const member of membersData) {
//       const memberId = await pbServerClient.collection(PB_COLLECTIONS.ACP_MEMBERS_DATA).getFirstListItem(`acpID = '${member.acpID}'`)
//       await pbServerClient.collection(PB_COLLECTIONS.ACP_MEMBERS_DATA).update(memberId.id, member)
//       console.log(`Updated member ${member.acpID}`)
//    }

//    console.log(`Finished updating ${membersData.length} members in ${Date.now() - initialTime}ms`)
//    return new Response(JSON.stringify({msg: "all records updated"}), {
//       headers: {
//          "Content-Type": "application/json",
//       },
//    })
// }
