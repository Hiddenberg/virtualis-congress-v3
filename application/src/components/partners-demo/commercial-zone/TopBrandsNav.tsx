import Link from "next/link";

interface TopBrandsNavProps {
   active?: string;
}

const brands = [
   {
      label: "Todos",
      href: "/partners-demo/commercial-zone",
   },
   {
      label: "Abbott",
      href: "/partners-demo/commercial-zone/partner/abbott",
   },
   {
      label: "Sanfer",
      href: "/partners-demo/commercial-zone/partner/sanfer",
   },
   {
      label: "Johnson & Johnson",
   },
   {
      label: "Roche",
   },
   {
      label: "Merck & Co.",
   },
   {
      label: "Sanofi",
   },
   {
      label: "AstraZeneca",
   },
   {
      label: "Novartis",
   },
   {
      label: "AbbVie",
   },
];

export default function TopBrandsNav({ active = "Todos" }: TopBrandsNavProps) {
   return (
      <nav className="px-6 md:px-10">
         <ul className="flex items-center gap-2 py-3 w-full overflow-x-auto whitespace-nowrap">
            {brands.map((b) => {
               const isActive = b.label === active;
               const isDisabled = !b.href;
               const className = [
                  "px-4 py-2 rounded-full text-sm transition-colors",
                  isActive ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                  isDisabled ? "opacity-60 pointer-events-none" : "",
               ].join(" ");
               const content = <span>{b.label}</span>;
               return (
                  <li key={b.label}>
                     {b.href ? (
                        <Link className={className} href={b.href}>
                           {content}
                        </Link>
                     ) : (
                        <span className={className}>{content}</span>
                     )}
                  </li>
               );
            })}
         </ul>
      </nav>
   );
}
