"use client";

import html2Canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/global/Buttons";
import type { CertificateDesign } from "../types/certificatesTypes";

// Custom hook to maintain aspect ratio
const useAspectRatio = (aspectRatio: number) => {
   const containerRef = useRef<HTMLDivElement>(null);
   const [dimensions, setDimensions] = useState({
      width: 0,
      height: 0,
   });

   useEffect(() => {
      const updateDimensions = () => {
         if (!containerRef.current) return;

         const parentWidth =
            containerRef.current.parentElement?.clientWidth ||
            window.innerWidth;
         const maxWidth = 842; // Max width (A4 landscape)

         // Calculate responsive width (100% of parent, up to maxWidth)
         const width = Math.min(parentWidth, maxWidth);

         // Calculate height based on aspect ratio
         const height = width / aspectRatio;

         setDimensions({
            width,
            height,
         });
      };

      // Initial calculation
      updateDimensions();

      // Create ResizeObserver to detect container size changes
      const resizeObserver = new ResizeObserver(() => {
         updateDimensions();
      });

      const currentParentElement = containerRef.current?.parentElement;

      if (currentParentElement) {
         resizeObserver.observe(currentParentElement);
      }

      // Also listen for window resize as a fallback
      window.addEventListener("resize", updateDimensions);

      return () => {
         if (currentParentElement) {
            resizeObserver.unobserve(currentParentElement);
         }
         resizeObserver.disconnect();
         window.removeEventListener("resize", updateDimensions);
      };
   }, [aspectRatio]);

   return {
      containerRef,
      dimensions,
   };
};

// Calculate dynamic scale based on container width
const calculateDynamicScale = (width: number) => {
   // Base scale is 2 at maximum width (842px for A4 landscape)
   const baseScale = 2;
   // Reference width is 842px (A4 landscape)
   const referenceWidth = 842;

   // Calculate increase factor (inverse relationship with width)
   // As width decreases, scale increases
   // Minimum width threshold to avoid excessive scaling
   const minWidth = 300;

   if (width <= minWidth) {
      // Maximum scale at minimum width (e.g., 4 at 300px)
      return 4;
   }

   // Linear interpolation between baseScale at referenceWidth and 4 at minWidth
   const scaleFactor =
      baseScale +
      ((referenceWidth - width) / (referenceWidth - minWidth)) *
         (4 - baseScale);

   // Round to 2 decimal places and ensure scale is at least baseScale
   return Math.max(baseScale, Math.round(scaleFactor * 100) / 100);
};

function CertificateDesignContainer({
   certificateDesign,
   displayName,
}: {
   certificateDesign: CertificateDesign;
   displayName: string;
}) {
   // A4 aspect ratio is 1.414 (width:height), but for landscape it's the inverse
   const { containerRef, dimensions } = useAspectRatio(1.414);
   const [fontSize, setFontSize] = useState("24px");
   const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

   // Calculate font size based on container width and name length
   useEffect(() => {
      const updateFontSize = () => {
         const containerWidth = dimensions.width;
         const nameLength = displayName.length;

         // Base size as percentage of container width
         let basePercentage = 0.06; // 6% of container width

         // Adjust based on name length
         if (nameLength > 40) {
            basePercentage = 0.045; // 4.5% for very long names
         } else if (nameLength > 30) {
            basePercentage = 0.05; // 5%
         } else if (nameLength > 25) {
            basePercentage = 0.055; // 5.5%
         } else if (nameLength > 20) {
            basePercentage = 0.058; // 5.8%
         }

         // Calculate actual pixel size based on container width
         const calculatedSize = Math.round(
            containerWidth *
               basePercentage *
               certificateDesign.nameFontSizeMultiplier,
         );
         setFontSize(`${calculatedSize}px`);
      };

      // Update font size when dimensions change
      updateFontSize();
   }, [
      dimensions.width,
      displayName,
      certificateDesign.nameFontSizeMultiplier,
   ]);

   // Function to generate PDF
   const generatePDF = async () => {
      const element = containerRef.current;

      if (!element) {
         console.error("Certificate container not found");
         return;
      }

      setIsGeneratingPDF(true);

      try {
         // Calculate dynamic scale based on current container width
         const dynamicScale = calculateDynamicScale(dimensions.width);

         const canvas = await html2Canvas(element, {
            scale: dynamicScale,
            useCORS: true,
            logging: false,
         });

         const data = canvas.toDataURL("image/jpeg", 1.0);

         const pdf = new jsPDF({
            unit: "px",
            orientation: "landscape",
            hotfixes: ["px_scaling"],
            format: "a4",
         });

         const imgProperties = pdf.getImageProperties(data);

         const pdfWidth = pdf.internal.pageSize.width;
         const pdfHeight =
            (imgProperties.height * pdfWidth) / imgProperties.width;

         pdf.addImage(data, "JPEG", 0, 0, pdfWidth, pdfHeight);
         pdf.save(
            `certificado_${displayName.replace(/\s+/g, "_").toLowerCase()}.pdf`,
         );
      } catch (error) {
         console.error("Error generating PDF:", error);
      } finally {
         setIsGeneratingPDF(false);
      }
   };

   // Calculate vertical position for the name (centered by default)
   const verticalPosition = certificateDesign.nameYPosition;
   // Calculate horizontal position for the name (centered by default)
   const horizontalPosition = certificateDesign.nameXPosition;

   return (
      <div className="flex flex-col items-center gap-4 w-full">
         <div
            id="certificate-container"
            ref={containerRef}
            className="relative bg-white rounded-lg overflow-hidden"
            style={{
               width: `${dimensions.width}px`,
               height: `${dimensions.height}px`,
            }}
         >
            <Image
               src={certificateDesign.backgroundURL}
               alt="Certificate Template"
               fill
               sizes="(max-width: 842px) 100vw, 842px"
               className="object-cover"
               priority
            />
            <div className="absolute inset-0 flex pointer-events-none">
               <div
                  className="absolute px-4 w-[80%] max-w-[500px] text-center"
                  style={{
                     top: `${verticalPosition}%`,
                     left: `${horizontalPosition}%`,
                     transform: `translateY(-${verticalPosition}%) translateX(-${horizontalPosition}%)`,
                  }}
               >
                  <h1
                     className="font-serif font-semibold text-center uppercase tracking-wide"
                     style={{
                        fontSize,
                        lineHeight: "1.2",
                        textShadow: "0px 0px 1px rgba(0,0,0,0.1)",
                        color: certificateDesign.nameColor,
                     }}
                  >
                     {displayName}
                  </h1>
               </div>
            </div>
         </div>

         <Button
            onClick={generatePDF}
            disabled={isGeneratingPDF}
            className="!bg-purple-400 hover:!bg-purple-500 text-white"
         >
            {isGeneratingPDF ? "Generando PDF..." : "Descargar PDF"}
         </Button>
      </div>
   );
}

export default function CertificateComponent({
   certificateDesign,
   displayName,
}: {
   certificateDesign: CertificateDesign;
   displayName: string;
}) {
   return (
      <div className="flex justify-center w-full">
         <CertificateDesignContainer
            certificateDesign={certificateDesign}
            displayName={displayName}
         />
      </div>
   );
}
