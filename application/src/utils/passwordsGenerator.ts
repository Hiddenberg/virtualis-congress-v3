import { randomBytes } from "crypto";

/**
 * Generates a secure random password using cryptographic random values.
 * @param length - The desired length of the password (default: 15).
 * @returns A string containing the generated password.
 */
export function generateRandomPassword(length: number = 15): string {
   // Define the character set (uppercase, lowercase, digits, symbols).
   const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";

   // Generate a random byte array of the desired length.
   const byteArray = randomBytes(length);

   // Map each random byte to a character in the charset.
   let password = "";
   for (let i = 0; i < length; i++) {
      // Use the remainder of division by chars.length to ensure it is a valid index
      password += chars.charAt(byteArray[i] % chars.length);
   }

   return password;
}

export function generateRandomString() {
   const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
   let firstPart = "";
   let secondPart = "";

   // Generate the first 3 letters
   for (let i = 0; i < 3; i++) {
      firstPart += letters.charAt(Math.floor(Math.random() * letters.length));
   }

   // Generate the second 3 letters
   for (let i = 0; i < 3; i++) {
      secondPart += letters.charAt(Math.floor(Math.random() * letters.length));
   }

   // Combine them with a dash
   return `${firstPart}-${secondPart}`;
}
