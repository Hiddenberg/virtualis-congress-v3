import { Award, User, Users, Video } from "lucide-react";
import type { CongressConference } from "@/features/conferences/types/conferenceTypes";

interface ConferenceTypeSelectorProps {
   value: CongressConference["conferenceType"];
   onChange: (value: CongressConference["conferenceType"]) => void;
   required?: boolean;
}

export function ConferenceTypeSelector({ value, onChange, required = false }: ConferenceTypeSelectorProps) {
   return (
      <fieldset className="flex flex-col gap-1">
         <legend className="font-medium text-sm">Conference Type {required && <span className="text-red-500">*</span>}</legend>
         <div className="gap-3 grid grid-cols-2 mt-1">
            <label
               className={`flex cursor-pointer items-center justify-center gap-2 rounded-md border p-3 text-sm transition-colors`}
            >
               <input
                  type="radio"
                  name="conferenceType"
                  value="individual"
                  // checked={value === "individual"}
                  // onChange={() => onChange("individual")}
                  required={required}
                  className="sr-only"
               />
               <User className="w-5 h-5" />
               <span>Individual</span>
            </label>

            <label
               className={`flex cursor-pointer items-center justify-center gap-2 rounded-md border p-3 text-sm transition-colors`}
            >
               <input
                  type="radio"
                  name="conferenceType"
                  value="group"
                  // checked={value === "group"}
                  // onChange={() => onChange("group")}
                  required={required}
                  className="sr-only"
               />
               <Users className="w-5 h-5" />
               <span>Group</span>
            </label>

            <label
               className={`flex cursor-pointer items-center justify-center gap-2 rounded-md border p-3 text-sm transition-colors ${
                  value === "livestream"
                     ? "border-blue-500 bg-blue-50 text-blue-700"
                     : "border-gray-300 bg-white hover:bg-gray-50"
               }`}
            >
               <input
                  type="radio"
                  name="conferenceType"
                  value="livestream"
                  checked={value === "livestream"}
                  onChange={() => onChange("livestream")}
                  required={required}
                  className="sr-only"
               />
               <Video className="w-5 h-5" />
               <span>Live</span>
            </label>

            <label
               className={`flex cursor-pointer items-center justify-center gap-2 rounded-md border p-3 text-sm transition-colors`}
            >
               <input
                  type="radio"
                  name="conferenceType"
                  value="closing_conference"
                  // checked={value === "closing_conference"}
                  // onChange={() => onChange("closing_conference")}
                  required={required}
                  className="sr-only"
               />
               <Award className="w-5 h-5" />
               <span>Closing Conference</span>
            </label>
         </div>
      </fieldset>
   );
}
