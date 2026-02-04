"use client";

import dynamic from "next/dynamic";

const DynamicProjectionScreenCallInterface = dynamic(
   () => import("@/features/projectionScreen/components/ProjectionScreenCallInterface"),
   {
      ssr: false,
   },
);

export default DynamicProjectionScreenCallInterface;
