import { useQuery } from "@tanstack/react-query";

export function useCountryCode() {
   const { isPending, data, error } = useQuery<CountryCodeResponse>({
      queryKey: ["countryCode"],
      queryFn: () => fetch("/api/country-code").then((res) => res.json()),
   });

   if (process.env.NODE_ENV === "development") {
      return {
         isPending,
         countryCode: "MX",
         error,
      };
   }

   return {
      isPending,
      countryCode: data?.countryCode ?? null,
      error,
   };
}
