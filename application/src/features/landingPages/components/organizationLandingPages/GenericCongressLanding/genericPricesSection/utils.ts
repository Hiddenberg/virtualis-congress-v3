export function formatPrice(amount: number, currency: "mxn" | "usd"): string {
   if (amount === 0) {
      return "Sin Costo";
   }

   return new Intl.NumberFormat(currency === "mxn" ? "es-MX" : "en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
   }).format(amount);
}

export function getPriceColorClasses(index: number) {
   const colors = [
      { gradient: "from-blue-500 to-blue-600", bg: "bg-blue-50", text: "text-blue-600" },
      { gradient: "from-green-500 to-green-600", bg: "bg-green-50", text: "text-green-600" },
      { gradient: "from-purple-500 to-purple-600", bg: "bg-purple-50", text: "text-purple-600" },
      { gradient: "from-orange-500 to-orange-600", bg: "bg-orange-50", text: "text-orange-600" },
      { gradient: "from-pink-500 to-pink-600", bg: "bg-pink-50", text: "text-pink-600" },
      { gradient: "from-teal-500 to-teal-600", bg: "bg-teal-50", text: "text-teal-600" },
   ];
   return colors[index % colors.length];
}

export function getCurrencyBadgeColor(currency: "mxn" | "usd") {
   return currency === "mxn"
      ? { bg: "bg-green-50", text: "text-green-700", ring: "ring-green-600/20" }
      : { bg: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-600/20" };
}
