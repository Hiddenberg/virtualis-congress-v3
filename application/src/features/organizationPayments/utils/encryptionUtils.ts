import crypto from "node:crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = 16;

if (!ENCRYPTION_KEY) {
   throw new Error("ENCRYPTION_KEY is not set");
}

export function encrypt(text: string) {
   if (!ENCRYPTION_KEY) {
      throw new Error("ENCRYPTION_KEY is not set");
   }

   if (ENCRYPTION_KEY.length > 32) {
      throw new Error("ENCRYPTION_KEY is too long (max 32 characters)");
   }

   const iv = crypto.randomBytes(IV_LENGTH);
   const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY.substring(0, 32), iv);
   let encrypted = cipher.update(text, "utf8", "base64");
   encrypted += cipher.final("base64");
   return `${iv.toString("base64")}:${encrypted}`;
}

export function decrypt(encryptedText: string) {
   if (!ENCRYPTION_KEY) {
      throw new Error("ENCRYPTION_KEY is not set");
   }

   const [ivStr, encrypted] = encryptedText.split(":");
   const iv = Buffer.from(ivStr, "base64");
   const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
   let decrypted = decipher.update(encrypted, "base64", "utf8");
   decrypted += decipher.final("utf8");
   return decrypted;
}
