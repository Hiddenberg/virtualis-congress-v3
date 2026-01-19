// import { createNewCoordinatorUser, getUserByEmail, updateUserRole } from "@/services/userServices";
// import { NextResponse } from "next/server";

// export async function GET () {
//    const newCoordinators = [
//       {
//          "name": "BLANCA AURORA MENA VELA",
//          "email": "blanca.mena@gmail.com"
//       },
//       {
//          "name": "IRMA ARCHUNDIA RIVEROS",
//          "email": "dra.archundia@gmail.com"
//       },
//       {
//          "name": "ALFREDO TORRES VILORIA",
//          "email": "alfed.torr75@gmail.com"
//       },
//       {
//          "name": "EVA PERRUSQUIA FRIAS",
//          "email": "evamd70@hotmail.com"
//       },
//       {
//          "name": "JORGE OSCAR GARCÍA MENDEZ",
//          "email": "jgarciam@hotmail.com"
//       },
//       {
//          "name": "VIRGINIA HIPOLITA SANCHEZ HERNANDEZ",
//          "email": "vickysanmd@yahoo.com"
//       },
//       {
//          "name": "CRISTINA GUERRERO DE LEON",
//          "email": "cguerrero18@hotmail.com"
//       },
//       {
//          "name": "ALMA NELLY RODRIGUEZ ALCOCER",
//          "email": "almanelly90@gmail.com"
//       },
//       {
//          "name": "DIEGO LUIS CARRILLO PEREZ",
//          "email": "djiego51@gmail.com"
//       },
//       {
//          "name": "Dra. Rosalía García Peña",
//          "email": "dra_rgp@hotmail.com"
//       },
//       {
//          "name": "JUAN CARLOS ANDA GARAY",
//          "email": "estumed@hotmail.com"
//       },
//       {
//          "name": "Dra. Irma Ceja",
//          "email": "docluisa@gmail.com"
//       },
//       {
//          "name": "MARIA DEL ROSARIO MUÑOZ",
//          "email": "charom66@hotmail.com"
//       },
//       {
//          "name": "ANGEL GONZALEZ ROMERO",
//          "email": "agr_6@hotmail.com"
//       }
//    ]

//    const updatedUsers = []
//    const skippedUsers = []
//    const createdUsers = []

//    for (const newCoordinator of newCoordinators) {
//       const existingUser = await getUserByEmail(newCoordinator.email)

//       if (existingUser && existingUser.role !== "coordinator") {
//          await updateUserRole(existingUser.id, "coordinator")
//          console.log(`User ${existingUser.name} updated from ${existingUser.role} to coordinator`)
//          updatedUsers.push({
//             id: existingUser.id,
//             name: existingUser.name,
//             previousRole: existingUser.role,
//             newRole: "coordinator"
//          })
//          continue
//       }

//       if (existingUser && existingUser.role === "coordinator") {
//          console.log(`User ${existingUser.name} is already a coordinator`)
//          skippedUsers.push({
//             id: existingUser.id,
//             name: existingUser.name,
//             email: existingUser.email
//          })
//          continue
//       }

//       if (!existingUser) {
//          const newCoordinatorUser = await createNewCoordinatorUser({
//             coordinatorName: newCoordinator.name,
//             coordinatorEmail: newCoordinator.email
//          })
//          console.log(`User ${newCoordinator.name} created as coordinator`)
//          createdUsers.push({
//             id: newCoordinatorUser.id,
//             name: newCoordinator.name,
//             email: newCoordinator.email
//          })
//       }
//    }

//    return NextResponse.json({
//       updatedUsers,
//       skippedUsers,
//       createdUsers
//    })
// }
