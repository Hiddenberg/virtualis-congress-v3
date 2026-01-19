export function formatVideoTime(totalSeconds: number) {
   const roundedSeconds = Math.floor(totalSeconds);

   // Calculate whole hours, minutes, and remaining seconds
   const hours = Math.floor(roundedSeconds / 3600);
   const minutes = Math.floor((roundedSeconds % 3600) / 60);
   const seconds = roundedSeconds % 60;

   // Format each component to be two digits (e.g., "00", "07", "13")
   const hh = String(hours).padStart(2, "0");
   const mm = String(minutes).padStart(2, "0");
   const ss = String(seconds).padStart(2, "0");

   return `${hh}:${mm}:${ss}`;
}
