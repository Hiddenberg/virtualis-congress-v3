// // import {
// //    isUserACPMember, isUserCMIMAffiliated,isUserGeneralMedic, isUserInternalMedSpecialist, isUserMedStudent, isUserMedStudentWithoutCredential, isUserResident
// // } from "./userServices"

// type PriceType = "foreigner" | "free" | "250" | "500" | "1000" | "1500" | "2000"
// function getPrice (priceLabel: PriceType) {
//    const testPriceIds: Record<PriceType, string> = {
//       "foreigner": "price_1Qv87sDlXWif0zgzHRUP5ngc",
//       "free": "price_1Qw7kRDlXWif0zgzsaToSnT1",
//       "250": "price_1Qw7m4DlXWif0zgzb350zhm5",
//       "500": "price_1Qv7zjDlXWif0zgzAhpVPx1x",
//       "1000": "price_1Qv80JDlXWif0zgzjJRQxMh8",
//       "1500": "price_1Qw7s3DlXWif0zgzRuvgIBRJ",
//       "2000": "price_1QtfCKDlXWif0zgz2PxXOPjj"
//    }

//    const prodPriceIds: Record<PriceType, string> = {
//       "foreigner": "price_1Qw8hdDlXWif0zgzTHDfKR7A",
//       "free": "price_1Qw8hdDlXWif0zgz5QA83dxJ",
//       "250": "price_1Qw8hdDlXWif0zgzVbu7yUOS",
//       "500": "price_1Qw8hdDlXWif0zgzuEQJjiJV",
//       "1000": "price_1Qw8hdDlXWif0zgzuzeAHmP4",
//       "1500": "price_1Qw8hdDlXWif0zgzibsTUIl3",
//       "2000": "price_1Qw8hdDlXWif0zgzQpE0vgdt"
//    }

//    if (process.env.NODE_ENV === "production") {
//       return prodPriceIds[priceLabel]
//    }

//    return testPriceIds[priceLabel]
// }

// export async function getStripePriceForAttendee (userId: string, userRole: User["role"], countryCode: string | null) {
//    if (
//       userRole === "admin" ||
//       userRole === "super_admin" ||
//       userRole === "coordinator" ||
//       userRole === "speaker"
//    ) {
//       console.log(`discount applied for ${userId} as admin, super admin, coordinator or speaker`)
//       return getPrice("500")
//    }

//    const isForeigner = countryCode !== "MX"
//    if (isForeigner) {
//       console.log(`foreign price applied to ${userId} as they are not from Mexico`)
//       return getPrice("foreigner")
//    }

//    // check if the user variables
//    const isACPMember = await isUserACPMember(userId)
//    const isMedStudent = await isUserMedStudent(userId)
//    const isResident = await isUserResident(userId)
//    const isCMIMAffiliated = await isUserCMIMAffiliated(userId)
//    const isGeneralMedic = await isUserGeneralMedic(userId)
//    const isInternalMedSpecialist = await isUserInternalMedSpecialist(userId)
//    const isMedStudentWithoutCredential = await isUserMedStudentWithoutCredential(userId)

//    if ((isACPMember && isMedStudent) || (isACPMember && isResident)) {
//       console.log(`discount applied for ${userId} as ACP member and student or resident`)
//       return getPrice("free")
//    }

//    if (!isACPMember && isMedStudent) {
//       console.log(`discount applied for ${userId} as student and no ACP member`)
//       return getPrice("250")
//    }

//    if ((!isACPMember && isResident) || (isACPMember && isInternalMedSpecialist) || isMedStudentWithoutCredential) {
//       console.log(`discount applied for ${userId} as resident or internal medic specialist`)
//       return getPrice("500")
//    }

//    if (isCMIMAffiliated) {
//       console.log(`discount applied for ${userId} as affiliated with CMIM`)
//       return getPrice("1000")
//    }

//    if (isGeneralMedic) {
//       console.log(`discount applied for ${userId} as general medic`)
//       return getPrice("1500")
//    }

//    console.log(`no discount applied for ${userId}`)
//    return getPrice("2000")
// }
