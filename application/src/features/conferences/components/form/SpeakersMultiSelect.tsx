"use client";

import Select from "react-select";

interface SpeakersMultiSelectProps {
   speakers: { id: string; name: string }[];
   valueIds: string[];
   onChange: (ids: string[]) => void;
}

export function SpeakersMultiSelect({
   speakers,
   valueIds,
   onChange,
}: SpeakersMultiSelectProps) {
   return (
      <Select
         isMulti
         isClearable
         placeholder="Selecciona ponentes para vincular"
         options={speakers.map((speaker) => ({
            value: speaker.id,
            label: speaker.name,
         }))}
         value={valueIds.map((id) => ({
            value: id,
            label: speakers.find((speaker) => speaker.id === id)?.name || id,
         }))}
         onChange={(options) => {
            const ids = (options || []).map(
               (opt) => (opt as { value: string; label: string }).value,
            );
            onChange(ids);
         }}
         classNamePrefix="react-select"
      />
   );
}

export default SpeakersMultiSelect;
