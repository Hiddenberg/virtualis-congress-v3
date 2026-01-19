"use client";
import papaparse from "papaparse";
import type { RecordModel } from "pocketbase";
import { useState } from "react";
import { Button } from "@/components/global/Buttons";
import pbClient from "@/libs/pbClient";
import type { ACPMemberData } from "@/types/congress";
import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";

export default function CSVUploadForm() {
   const [isValid, setIsValid] = useState<boolean | null>(null);
   const [csvRows, setCsvRows] = useState<Record<string, string>[]>([]);
   const [isUpdating, setIsUpdating] = useState(false);
   const [updateComplete, setUpdateComplete] = useState(false);
   const [membersAdded, setMembersAdded] = useState<
      { acpId: string; name: string }[]
   >([]);

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (!file) {
         return;
      }

      if (file.type !== "text/csv") {
         alert("El archivo debe ser un archivo CSV");
         return;
      }

      papaparse.parse(file, {
         header: true,
         skipEmptyLines: true,
         complete: (results, file) => {
            console.log("[CSVUploadForm] Parse results:", results);
            console.log("[CSVUploadForm] File object:", file);

            const rows = results.data as Record<string, string>[];

            const firstRow = rows[0];

            const rowKeys = Object.keys(firstRow);

            const requiredKeys = [
               "FirstName",
               "LastName",
               "CustomerID",
               "Email",
               "BirthYear",
               "City",
               "MemberClass",
            ];

            const missingColumns = requiredKeys.filter(
               (key) => !rowKeys.includes(key),
            );

            if (missingColumns.length > 0) {
               setIsValid(false);
               alert(
                  "Faltan las siguientes columnas: " +
                     missingColumns.join(", "),
               );
               return;
            }

            const cleanedRows = rows.map((row) => {
               const cleanACPID = row["CustomerID"].replace(/^0+/, "");
               return {
                  ...row,
                  CustomerID: cleanACPID,
               };
            });

            setIsValid(true);
            setCsvRows(cleanedRows);
         },
      });
   };

   const handleUpdateDatabase = async () => {
      if (!isValid) return;

      setIsUpdating(true);
      setUpdateComplete(false);
      const allACPMemberIds = await pbClient
         .collection(PB_COLLECTIONS.ACP_MEMBERS_DATA)
         .getFullList<ACPMemberData & RecordModel>({
            fields: "acpID",
         });

      const membersToUpdate = csvRows.filter(
         (row) =>
            !allACPMemberIds.some(
               (member) => member.acpID === row["CustomerID"],
            ),
      );

      if (membersToUpdate.length === 0) {
         setIsUpdating(false);
         setUpdateComplete(true);
         alert("No hay miembros nuevos que agregar");
         return;
      }

      const membersAdded = [];
      for (const newMember of membersToUpdate) {
         const newMemberData: ACPMemberData = {
            acpID: newMember["CustomerID"],
            fullName: `${newMember["FirstName"]} ${newMember["LastName"]}`,
            email: newMember["Email"],
            age: newMember["BirthYear"]
               ? 2025 - parseInt(newMember["BirthYear"])
               : 0,
            city: newMember["City"],
            acpMemberClass: newMember["MemberClass"],
            isBlackListed: false,
         };

         try {
            await pbClient
               .collection(PB_COLLECTIONS.ACP_MEMBERS_DATA)
               .create(newMemberData);
            membersAdded.push({
               acpId: newMemberData.acpID,
               name: newMemberData.fullName,
            });
            console.log(`[CSVUploadForm] Member added ${newMemberData.acpID}`);
         } catch (error) {
            const err = error as Error;
            alert(err.message);
         }
      }

      setMembersAdded(membersAdded);
      setUpdateComplete(true);

      setIsUpdating(false);
   };

   return (
      <div>
         <div className="mb-8">
            <h1>Upload CSV</h1>

            <input onChange={handleFileChange} type="file" accept=".csv" />

            {isValid === true && <p className="text-green-400">CSV Valido</p>}
            {isValid === false && <p className="text-red-400">CSV no valido</p>}
         </div>

         <Button
            onClick={handleUpdateDatabase}
            disabled={!isValid || isUpdating}
            variant="dark"
         >
            {isUpdating ? "Updating..." : "Update Database"}
         </Button>

         {updateComplete && (
            <div className="mt-8">
               <h2>{membersAdded.length} Members added</h2>
               <ul>
                  {membersAdded.map((member, index) => (
                     <li key={`${member.acpId}-${index}`}>
                        ACPID: {member.acpId} - {member.name}
                     </li>
                  ))}
               </ul>
            </div>
         )}
      </div>
   );
}
