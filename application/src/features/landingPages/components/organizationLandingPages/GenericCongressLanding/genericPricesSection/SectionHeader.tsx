interface SectionHeaderProps {
   title: string;
   subtitle?: string;
}

export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
   return (
      <div className="mb-12 text-center">
         <h2 className="mb-4 font-bold text-gray-900 text-4xl">{title}</h2>
         {subtitle && <p className="mx-auto max-w-2xl text-gray-600 text-lg">{subtitle}</p>}
      </div>
   );
}
