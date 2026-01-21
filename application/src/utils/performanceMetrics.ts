/**
 * Performance metrics utilities for recording diagnostics and troubleshooting
 */

/**
 * Interface for tracking performance and diagnostic metrics during recording sessions
 */
export interface PerformanceMetrics {
   // Timestamps for key events
   initTime: string; // When the recorder was initialized
   cameraStartTime: string | null; // When camera access started
   screenStartTime: string | null; // When screen sharing started

   // Device and state information
   deviceInfo: string; // User agent information
   isSharingScreen: boolean; // If screen sharing is active

   // Additional diagnostic information
   browserName?: string; // Browser name extracted from user agent
   browserVersion?: string; // Browser version
   osName?: string; // Operating system name
   osVersion?: string; // OS version
   deviceMemory?: number; // Available device memory in GB (if available)
   connectionType?: string; // Network connection type (if available)

   // Media capabilities
   videoInputDevices?: number; // Number of video input devices available
   audioInputDevices?: number; // Number of audio input devices available
   supportedMimeTypes?: string[]; // Video formats supported by the browser

   // Error tracking
   lastErrorMessage?: string; // Last error message encountered
   lastErrorTime?: number; // Timestamp of the last error
   permissionDenials?: number; // Count of permission denials

   // Performance measurements
   timeToFirstFrame?: number; // Time until first video frame was displayed
   frameDropRate?: number; // Rate of dropped frames if measurable
   recordingDuration?: number; // Total recording duration
   uploadSpeed?: number; // Upload speed in Mbps

   // Session details
   sessionId?: string; // Unique session identifier
   recordingAttempts?: number; // Number of recording attempts in this session
}

/**
 * Generate a unique session ID for tracking user interactions
 */
export function generateSessionId(): string {
   return Date.now().toString() + "-" + Math.random().toString(36).substring(2, 9);
}

/**
 * Get browser information from user agent
 */
export function getBrowserInfo() {
   const ua = navigator.userAgent;
   let name = "Unknown";
   let version = "Unknown";

   // Chrome
   if (ua.indexOf("Chrome") > -1) {
      name = "Chrome";
      const match = ua.match(/Chrome\/(\d+\.\d+)/);
      if (match) version = match[1];
   }
   // Firefox
   else if (ua.indexOf("Firefox") > -1) {
      name = "Firefox";
      const match = ua.match(/Firefox\/(\d+\.\d+)/);
      if (match) version = match[1];
   }
   // Safari
   else if (ua.indexOf("Safari") > -1) {
      name = "Safari";
      const match = ua.match(/Version\/(\d+\.\d+)/);
      if (match) version = match[1];
   }
   // Edge
   else if (ua.indexOf("Edg") > -1) {
      name = "Edge";
      const match = ua.match(/Edg\/(\d+\.\d+)/);
      if (match) version = match[1];
   }

   return {
      name,
      version,
   };
}

/**
 * Get OS information from user agent
 */
export function getOSInfo() {
   const ua = navigator.userAgent;
   let name = "Unknown";
   let version = "Unknown";

   // Windows
   if (ua.indexOf("Windows") > -1) {
      name = "Windows";
      if (ua.indexOf("Windows NT 10") > -1) version = "10";
      else if (ua.indexOf("Windows NT 6.3") > -1) version = "8.1";
      else if (ua.indexOf("Windows NT 6.2") > -1) version = "8";
      else if (ua.indexOf("Windows NT 6.1") > -1) version = "7";
   }
   // Mac
   else if (ua.indexOf("Mac") > -1) {
      name = "MacOS";
      const match = ua.match(/Mac OS X (\d+[._]\d+)/);
      if (match) version = match[1].replace("_", ".");
   }
   // Linux
   else if (ua.indexOf("Linux") > -1) {
      name = "Linux";
   }

   return {
      name,
      version,
   };
}

/**
 * Get connection type information using the Network Information API
 */
export function getConnectionType() {
   const nav = navigator as Navigator & {
      connection?: {
         effectiveType?: string;
         type?: string;
      };
   };

   if (nav.connection) {
      return nav.connection.effectiveType || nav.connection.type || "unknown";
   }
   return "not-available";
}

/**
 * Get supported video mime types for the current browser
 */
export function getSupportedMimeTypes() {
   const types = ["video/webm", "video/webm; codecs=vp9", "video/webm; codecs=vp8", "video/mp4", "video/mp4; codecs=h264"];

   return types.filter((type) => MediaRecorder.isTypeSupported(type));
}

/**
 * Check browser compatibility for screen recording
 */
export function checkBrowserCompatibility(language: string | null) {
   // Check if getDisplayMedia is supported
   const isDisplayMediaSupported = navigator.mediaDevices && "getDisplayMedia" in navigator.mediaDevices;

   // Get browser info
   const userAgent = navigator.userAgent;
   const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
   const isMac = /Mac/.test(userAgent);
   const isOlderMac = isMac && /Intel Mac OS X 10[._](9|10|11|12|13)/.test(userAgent);

   // Extremely old Macs should warn about compatibility
   const isVeryOldMac = isMac && /Intel Mac OS X 10[._](9|10|11)/.test(userAgent);
   if (isVeryOldMac) {
      console.warn("Very old Mac detected, may experience performance issues");
      return {
         compatible: false,
         message:
            language === "en-US"
               ? "You're using a very old Mac OS X version. Screen sharing may not work properly. We recommend updating your operating system or using a different device."
               : "Está utilizando una versión muy antigua de Mac OS X. Es posible que el uso compartido de pantalla no funcione correctamente. Recomendamos actualizar su sistema operativo o usar un dispositivo diferente.",
      };
   }

   // Check Safari version if it's Safari on Mac
   if (isMac && isSafari) {
      // Add older Mac detection with potential timeout warning
      if (isOlderMac) {
         console.warn("Detected older Mac, may experience timeout issues with video sources");
      }

      const safariVersionMatch = userAgent.match(/Version\/(\d+)\.(\d+)/);
      if (safariVersionMatch) {
         const majorVersion = parseInt(safariVersionMatch[1], 10);

         // Safari below version this threshold may have issues
         if (majorVersion < 14) {
            return {
               compatible: false,
               message:
                  language === "en-US"
                     ? "You're using an older version of Safari that might have issues with screen sharing. We recommend updating your browser or using Chrome."
                     : "Está utilizando una versión anterior de Safari que podría tener problemas con el uso compartido de pantalla. Recomendamos actualizar su navegador o usar Chrome.",
            };
         }
      }
   }

   if (!isDisplayMediaSupported) {
      return {
         compatible: false,
         message:
            language === "en-US"
               ? "Your browser doesn't support screen sharing. Please use a modern browser like Chrome, Firefox, or Safari 14+."
               : "Su navegador no admite el uso compartido de pantalla. Utilice un navegador moderno como Chrome, Firefox o Safari 14+.",
      };
   }

   return {
      compatible: true,
   };
}

// Interface for device memory
interface NavigatorWithMemory extends Navigator {
   deviceMemory?: number;
}

/**
 * Initialize the performance metrics object
 */
export function initializePerformanceMetrics(): PerformanceMetrics {
   const sessionId = generateSessionId();

   return {
      initTime: new Date().toISOString(),
      cameraStartTime: null,
      screenStartTime: null,
      deviceInfo: navigator.userAgent,
      isSharingScreen: false,
      // Extract browser and OS information
      browserName: getBrowserInfo().name,
      browserVersion: getBrowserInfo().version,
      osName: getOSInfo().name,
      osVersion: getOSInfo().version,
      // Add device capabilities information
      deviceMemory: (navigator as NavigatorWithMemory).deviceMemory,
      connectionType: getConnectionType(),
      // Generate session ID
      sessionId: sessionId,
      recordingAttempts: 0,
      // Add media capabilities
      supportedMimeTypes: getSupportedMimeTypes(),
   };
}

// Types for log data
export type LogData = {
   error?: string;
   [key: string]: unknown;
};

/**
 * Log performance metrics event
 */
export function logPerformanceEvent(
   action: string,
   initTime: number,
   data?: LogData,
   updateMetricsCallback?: (updatedMetrics: Partial<PerformanceMetrics>) => void,
) {
   console.log(`[Performance] ${action}`, {
      timestamp: Date.now(),
      timeFromInit: Date.now() - initTime,
      ...data,
   });

   // Update performance metrics with any error information if callback provided
   if (data?.error && updateMetricsCallback) {
      updateMetricsCallback({
         lastErrorMessage: data.error,
         lastErrorTime: Date.now(),
         permissionDenials: data.error.includes("permission") ? 1 : 0,
      } as Partial<PerformanceMetrics>);
   }
}
