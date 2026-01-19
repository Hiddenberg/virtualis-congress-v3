export default async function backendFetcher<T>(url: string): Promise<T> {
   const res = await fetch(url, {
      cache: "no-store",
   });
   // if (!res.ok) throw new Error(`Request failed: ${res.status}`)
   const body = await res.json();
   if (!body?.success) throw new Error(body?.errorMessage || "Unknown error");
   return body.data as T;
}
