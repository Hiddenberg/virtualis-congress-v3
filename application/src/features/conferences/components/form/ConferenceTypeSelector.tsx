"use client";

import Select from "react-select";

interface Option {
   value: CongressConference["conferenceType"];
   label: string;
}

interface ConferenceTypeSelectorProps {
   value: CongressConference["conferenceType"];
   onChange: (value: CongressConference["conferenceType"]) => void;
}

export function ConferenceTypeSelector({ value, onChange }: ConferenceTypeSelectorProps) {
   const options: Option[] = [
      {
         value: "in-person",
         label: "Presencial",
      },
      {
         value: "livestream",
         label: "En vivo",
      },
      {
         value: "pre-recorded",
         label: "Grabada",
      },
      {
         value: "simulated_livestream",
         label: "Simulado en vivo",
      },
      {
         value: "break",
         label: "Descanso",
      },
   ];

   const selected = options.find((opt) => opt.value === value) || null;

   return (
      <Select<Option, false>
         instanceId="conference-type-select"
         classNamePrefix="vc-select"
         options={options}
         value={selected}
         onChange={(opt) => {
            if (!opt) return;
            onChange(opt.value);
         }}
         placeholder="Selecciona un tipo"
         isSearchable={false}
         styles={{
            control: (base, state) => ({
               ...base,
               minHeight: 38,
               borderRadius: 8,
               borderColor: state.isFocused ? "#2563eb" : "#d1d5db",
               boxShadow: state.isFocused ? "0 0 0 2px rgba(37,99,235,0.2)" : "none",
               ":hover": {
                  borderColor: state.isFocused ? "#2563eb" : "#9ca3af",
               },
               backgroundColor: "#ffffff",
               cursor: "pointer",
            }),
            valueContainer: (base) => ({
               ...base,
               padding: "2px 8px",
            }),
            singleValue: (base) => ({
               ...base,
               color: "#111827",
            }),
            placeholder: (base) => ({
               ...base,
               color: "#6b7280",
            }),
            menu: (base) => ({
               ...base,
               borderRadius: 8,
               overflow: "hidden",
            }),
            menuList: (base) => ({
               ...base,
               paddingTop: 0,
               paddingBottom: 0,
            }),
            option: (base, state) => ({
               ...base,
               padding: 10,
               fontSize: 14,
               backgroundColor: state.isFocused ? "#eff6ff" : state.isSelected ? "#dbeafe" : "#ffffff",
               color: state.isFocused ? "#1d4ed8" : "#111827",
               cursor: "pointer",
            }),
         }}
      />
   );
}

export default ConferenceTypeSelector;
