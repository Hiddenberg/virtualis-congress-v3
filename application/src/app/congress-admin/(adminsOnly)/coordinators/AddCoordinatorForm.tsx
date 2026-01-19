"use client";

import { useState } from "react";
import { createNewCoordinatorUserAction } from "@/actions/userActions";

export function AddCoordinatorForm() {
   const [isOpen, setIsOpen] = useState(false);
   const [coordinatorName, setCoordinatorName] = useState("");
   const [coordinatorEmail, setCoordinatorEmail] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [success, setSuccess] = useState<string | null>(null);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      try {
         const result = await createNewCoordinatorUserAction({
            coordinatorName,
            coordinatorEmail,
         });

         if (result.error) {
            setError(result.error);
         } else {
            setSuccess(result.message || "Coordinator created successfully");
            setCoordinatorName("");
            setCoordinatorEmail("");
            setTimeout(() => {
               setIsOpen(false);
               setSuccess(null);
            }, 2000);
         }
      } catch (err) {
         setError("An unexpected error occurred");
         console.error(err);
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <div>
         <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
         >
            Add Coordinator
         </button>

         {isOpen && (
            <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
               <div className="bg-white shadow-xl p-6 rounded-lg w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                     <h2 className="font-bold text-xl">Add New Coordinator</h2>
                     <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-500 hover:text-gray-700"
                     >
                        ✕
                     </button>
                  </div>

                  {error && (
                     <div className="bg-red-100 mb-4 p-3 rounded-md text-red-700">
                        {error}
                     </div>
                  )}

                  {success && (
                     <div className="bg-green-100 mb-4 p-3 rounded-md text-green-700">
                        {success}
                     </div>
                  )}

                  <form onSubmit={handleSubmit}>
                     <div className="mb-4">
                        <label
                           htmlFor="coordinatorName"
                           className="block mb-1 font-medium text-gray-700 text-sm"
                        >
                           Full Name
                        </label>
                        <input
                           id="coordinatorName"
                           type="text"
                           required
                           value={coordinatorName}
                           onChange={(e) => setCoordinatorName(e.target.value)}
                           className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                     </div>

                     <div className="mb-4">
                        <label
                           htmlFor="coordinatorEmail"
                           className="block mb-1 font-medium text-gray-700 text-sm"
                        >
                           Email
                        </label>
                        <input
                           id="coordinatorEmail"
                           type="email"
                           required
                           value={coordinatorEmail}
                           onChange={(e) => setCoordinatorEmail(e.target.value)}
                           className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                     </div>

                     <div className="flex justify-end gap-2 mt-6">
                        <button
                           type="button"
                           onClick={() => setIsOpen(false)}
                           className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-gray-800"
                        >
                           Cancel
                        </button>
                        <button
                           type="submit"
                           disabled={isSubmitting}
                           className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 px-4 py-2 rounded-md text-white"
                        >
                           {isSubmitting ? "Creating..." : "Create Coordinator"}
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </div>
   );
}
