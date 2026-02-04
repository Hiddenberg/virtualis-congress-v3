"use client";

import dynamic from "next/dynamic";

const DynamicZoomCallInterface = dynamic(() => import("@/features/livestreams/components/ZoomCallInterface"), {
   ssr: false,
});

export default DynamicZoomCallInterface;
