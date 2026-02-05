import type * as React from "react";

declare global {
   namespace JSX {
      interface IntrinsicElements {
         "video-player-container": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      }
   }
}
