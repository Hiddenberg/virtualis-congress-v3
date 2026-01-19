/**
 * Capitalizes the first letter of each word in a string
 * @param text - The string to capitalize
 * @returns The string with the first letter of each word capitalized
 */
export function capitalizeText(text: string) {
   // capitalize the first letter of each word
   return text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
}
