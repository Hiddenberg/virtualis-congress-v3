// "use client";

// import {
//    useCallback, useEffect, useState
// } from "react";
// import {
//    Cpu, Monitor, Layers, Clock, Chrome, Server
// } from "lucide-react";

// interface SystemInfo {
//   browser: {
//     name: string;
//     version: string;
//     userAgent: string;
//     language: string;
//     cookiesEnabled: boolean;
//     doNotTrack: string | null;
//   };
//   screen: {
//     width: number;
//     height: number;
//     colorDepth: number;
//     pixelRatio: number;
//     orientation: string;
//   };
//   system: {
//     platform: string;
//     cores: number;
//     memory: string | null;
//     connection: string | null;
//     batteryLevel: number | null;
//     batteryCharging: boolean | null;
//     osName: string;
//     osVersion: string;
//     isDesktop: boolean;
//     isMobile: boolean;
//     isTablet: boolean;
//     architecture: string;
//     kernelVersion: string | null;
//     isVirtualized: boolean | null;
//   };
//   time: {
//     timezone: string;
//     timezoneOffset: number;
//     currentTime: string;
//   };
//   features: {
//     touchscreen: boolean;
//     webGL: boolean;
//     canvas: boolean;
//     webRTC: boolean;
//     webP: boolean;
//   };
// }

// export default function SystemInfoPage () {
//    const [setSystemInfo] = useState<SystemInfo | null>(null);
//    const [loading, setLoading] = useState(true);

//    const getBrowserVersion = useCallback(() => {
//       const ua = navigator.userAgent;
//       const browser = getBrowserName();
//       let match;

//       switch(browser) {
//       case "Chrome":
//          match = ua.match(/Chrome\/(\d+\.\d+)/);
//          break;
//       case "Firefox":
//          match = ua.match(/Firefox\/(\d+\.\d+)/);
//          break;
//       case "Edge":
//          match = ua.match(/Edge\/(\d+\.\d+)/);
//          break;
//       case "Safari":
//          match = ua.match(/Version\/(\d+\.\d+)/);
//          break;
//       case "Opera":
//          match = ua.match(/OPR\/(\d+\.\d+)/);
//          break;
//       }

//       return match ? match[1] : "Unknown";
//    }, [])

//    useEffect(() => {
//       async function gatherSystemInfo () {
//       // Browser information
//          const browserInfo = {
//             name: getBrowserName(),
//             version: getBrowserVersion(),
//             userAgent: navigator.userAgent,
//             language: navigator.language,
//             cookiesEnabled: navigator.cookieEnabled,
//             doNotTrack: navigator.doNotTrack,
//          };

//          // Screen information
//          const screenInfo = {
//             width: window.screen.width,
//             height: window.screen.height,
//             colorDepth: window.screen.colorDepth,
//             pixelRatio: window.devicePixelRatio,
//             orientation: screen.orientation ? screen.orientation.type : "N/A",
//          };

//          // System information
//          let batteryLevel: number | null = null;
//          let batteryCharging: boolean | null = null;

//          // Check if Battery API is available
//          if ('getBattery' in navigator) {
//             try {
//                // @ts-expect-error - The Battery API may not be typed in all TypeScript versions
//                const battery = await navigator.getBattery();
//                batteryLevel = battery.level * 100;
//                batteryCharging = battery.charging;
//             } catch (error) {
//                console.error("Battery API error:", error);
//             }
//          }

//          // Get connection type if available
//          let connectionType = null;
//          if ('connection' in navigator && navigator.connection) {
//             // @ts-expect-error - Connection API may not be typed
//             connectionType = navigator.connection.effectiveType || navigator.connection.type;
//          }

//          // Memory info if available
//          let memoryInfo = null;
//          if ('deviceMemory' in navigator) {
//             // Using type assertion with a specific interface
//             interface NavigatorWithMemory extends Navigator {
//                deviceMemory: number;
//             }
//             memoryInfo = (navigator as NavigatorWithMemory).deviceMemory + "GB";
//          }

//          // Detect OS information
//          const osInfo = detectOS();
//          const userAgent = navigator.userAgent;
//          const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
//          const isTabletDevice = /iPad|Android(?!.*Mobile)/i.test(userAgent);

//          // Try to detect architecture
//          let architecture = "unknown";
//          if (userAgent.includes("x86_64") || userAgent.includes("x86-64") || userAgent.includes("Win64") || userAgent.includes("x64;") || userAgent.includes("amd64")) {
//             architecture = "x86_64";
//          } else if (userAgent.includes("i386") || userAgent.includes("i686") || userAgent.includes("x86")) {
//             architecture = "x86";
//          } else if (userAgent.includes("arm") || userAgent.includes("ARM")) {
//             architecture = "ARM";
//          } else if (userAgent.includes("aarch64") || (userAgent.includes("Mac") && userAgent.includes("Apple"))) {
//             architecture = "ARM64";
//          }

//          // Check for virtualization (very basic detection, not reliable)
//          let isVirtualized = null;
//          if (navigator.hardwareConcurrency < 2 && memoryInfo && parseInt(memoryInfo) < 4) {
//             isVirtualized = true;
//          }

//          const systemInfo = {
//             platform: navigator.platform,
//             cores: navigator.hardwareConcurrency || 0,
//             memory: memoryInfo,
//             connection: connectionType,
//             batteryLevel,
//             batteryCharging,
//             osName: osInfo.name,
//             osVersion: osInfo.version,
//             isDesktop: !isMobileDevice,
//             isMobile: isMobileDevice && !isTabletDevice,
//             isTablet: isTabletDevice,
//             architecture: architecture,
//             kernelVersion: detectKernelVersion(userAgent),
//             isVirtualized: isVirtualized,
//          };

//          // Time information
//          // const now = new Date();
//          // const timeInfo = {
//          //    timezone: Intl.DateTimeFormat()
//          //       .resolvedOptions().timeZone,
//          //    timezoneOffset: now.getTimezoneOffset(),
//          //    currentTime: now.toLocaleString(),
//          // };

//          // Feature detection
//          // const featureInfo = {
//          //    touchscreen: 'ontouchstart' in window,
//          //    webGL: hasWebGL(),
//          //    canvas: hasCanvas(),
//          //    webRTC: hasWebRTC(),
//          //    webP: await hasWebP(),
//          // };

//          // setSystemInfo({
//          //    browser: browserInfo,
//          //    screen: screenInfo,
//          //    system: systemInfo,
//          //    time: timeInfo,
//          //    features: featureInfo,
//          // });

//          setLoading(false);
//       }

//       gatherSystemInfo();
//    }, [getBrowserVersion]);

//    // Helper functions
//    function getBrowserName () {
//       const ua = navigator.userAgent;
//       if (ua.includes("Firefox")) return "Firefox";
//       if (ua.includes("SamsungBrowser")) return "Samsung Browser";
//       if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
//       if (ua.includes("Trident")) return "Internet Explorer";
//       if (ua.includes("Edge")) return "Edge";
//       if (ua.includes("Chrome")) return "Chrome";
//       if (ua.includes("Safari")) return "Safari";
//       return "Unknown";
//    }

//    function hasWebGL () {
//       try {
//          const canvas = document.createElement('canvas');
//          return !!(window.WebGLRenderingContext &&
//             (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
//       } catch {
//          return false;
//       }
//    }

//    function hasCanvas () {
//       try {
//          const canvas = document.createElement('canvas');
//          return !!(canvas.getContext && canvas.getContext('2d'));
//       } catch {
//          return false;
//       }
//    }

//    function hasWebRTC () {
//       return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
//    }

//    async function hasWebP () {
//       try {
//          const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
//          const img = new Image();
//          return new Promise<boolean>((resolve) => {
//             img.onload = () => {
//                const result = (img.width > 0) && (img.height > 0);
//                resolve(result);
//             };
//             img.onerror = () => resolve(false);
//             img.src = webpData;
//          });
//       } catch {
//          return false;
//       }
//    }

//    function detectOS () {
//       const userAgent = window.navigator.userAgent;
//       const platform = window.navigator.platform;

//       // Windows detection
//       if (/Windows/.test(userAgent)) {
//          if (/Windows NT 10.0/.test(userAgent)) return {
//             name: "Windows",
//             version: "10/11"
//          };
//          if (/Windows NT 6.3/.test(userAgent)) return {
//             name: "Windows",
//             version: "8.1"
//          };
//          if (/Windows NT 6.2/.test(userAgent)) return {
//             name: "Windows",
//             version: "8"
//          };
//          if (/Windows NT 6.1/.test(userAgent)) return {
//             name: "Windows",
//             version: "7"
//          };
//          if (/Windows NT 6.0/.test(userAgent)) return {
//             name: "Windows",
//             version: "Vista"
//          };
//          if (/Windows NT 5.1/.test(userAgent)) return {
//             name: "Windows",
//             version: "XP"
//          };
//          if (/Windows NT 5.0/.test(userAgent)) return {
//             name: "Windows",
//             version: "2000"
//          };

//          return {
//             name: "Windows",
//             version: "Unknown"
//          };
//       }

//       // macOS detection
//       if (/Macintosh/.test(userAgent)) {
//          if (/Mac OS X 10[._]15/.test(userAgent)) return {
//             name: "macOS",
//             version: "Catalina"
//          };
//          if (/Mac OS X 10[._]14/.test(userAgent)) return {
//             name: "macOS",
//             version: "Mojave"
//          };
//          if (/Mac OS X 10[._]13/.test(userAgent)) return {
//             name: "macOS",
//             version: "High Sierra"
//          };
//          if (/Mac OS X 10[._]12/.test(userAgent)) return {
//             name: "macOS",
//             version: "Sierra"
//          };
//          if (/Mac OS X 10[._]11/.test(userAgent)) return {
//             name: "macOS",
//             version: "El Capitan"
//          };
//          if (/Mac OS X 10[._]10/.test(userAgent)) return {
//             name: "macOS",
//             version: "Yosemite"
//          };
//          if (/Mac OS X 10[._]9/.test(userAgent)) return {
//             name: "macOS",
//             version: "Mavericks"
//          };
//          if (/Mac OS X 10[._]8/.test(userAgent)) return {
//             name: "macOS",
//             version: "Mountain Lion"
//          };

//          // Check for newer macOS that might not be in the list
//          const macVersionMatch = userAgent.match(/Mac OS X 10[._](\d+)/);
//          if (macVersionMatch && macVersionMatch[1]) {
//             const majorVersion = parseInt(macVersionMatch[1], 10);
//             if (majorVersion >= 16) {
//                return {
//                   name: "macOS",
//                   version: "Big Sur or newer"
//                };
//             }
//          }

//          return {
//             name: "macOS",
//             version: "Unknown"
//          };
//       }

//       // iOS detection
//       if (/iPhone|iPad|iPod/.test(userAgent)) {
//          const iosVersionMatch = userAgent.match(/OS (\d+)_(\d+)/);
//          if (iosVersionMatch) {
//             return {
//                name: "iOS",
//                version: `${iosVersionMatch[1]}.${iosVersionMatch[2]}`
//             };
//          }
//          return {
//             name: "iOS",
//             version: "Unknown"
//          };
//       }

//       // Android detection
//       if (/Android/.test(userAgent)) {
//          const androidVersionMatch = userAgent.match(/Android (\d+(?:\.\d+)*)/);
//          if (androidVersionMatch) {
//             return {
//                name: "Android",
//                version: androidVersionMatch[1]
//             };
//          }
//          return {
//             name: "Android",
//             version: "Unknown"
//          };
//       }

//       // Linux detection
//       if (/Linux/.test(platform)) {
//          if (/Ubuntu/.test(userAgent)) return {
//             name: "Ubuntu",
//             version: "Unknown"
//          };
//          if (/Fedora/.test(userAgent)) return {
//             name: "Fedora",
//             version: "Unknown"
//          };
//          if (/Debian/.test(userAgent)) return {
//             name: "Debian",
//             version: "Unknown"
//          };
//          if (/CentOS/.test(userAgent)) return {
//             name: "CentOS",
//             version: "Unknown"
//          };

//          return {
//             name: "Linux",
//             version: "Unknown"
//          };
//       }

//       // Chrome OS detection
//       if (/CrOS/.test(userAgent)) {
//          return {
//             name: "Chrome OS",
//             version: "Unknown"
//          };
//       }

//       return {
//          name: "Unknown",
//          version: "Unknown"
//       };
//    }

//    function detectKernelVersion (userAgent: string) {
//       if (userAgent.includes("Linux")) {
//          const kernelMatch = userAgent.match(/Linux ([a-z0-9.-]+)/i);
//          if (kernelMatch) {
//             return kernelMatch[1];
//          }
//       }

//       // For Windows, macOS, or other platforms, kernel info isn't usually available in UA
//       return null;
//    }

//    if (loading) {
//       return (
//          <div className="flex justify-center items-center min-h-screen">
//             <div className="text-center">
//                <div className="mx-auto border-primary border-b-2 rounded-full w-12 h-12 animate-spin" />
//                <p className="mt-4 text-lg">Loading system information...</p>
//             </div>
//          </div>
//       );
//    }

//    return (
//       <div className="mx-auto px-4 py-10 container">
//          <h1 className="mb-6 font-bold text-3xl">System Information</h1>
//          <p className="mb-8 text-gray-500">
//             Detailed information about your browser and device
//          </p>

//          <div className="space-y-8">
//             {/* OS Information */}
//             {/* <Card>
//                <CardHeader>
//                   <CardTitle className="flex items-center space-x-2">
//                      <Server className="w-5 h-5" />
//                      <span>OS Information</span>
//                   </CardTitle>
//                   <CardDescription>Details about your operating system</CardDescription>
//                </CardHeader>
//                <CardContent>
//                   <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
//                      <div className="space-y-2">
//                         <div className="flex justify-between">
//                            <span className="font-medium">OS Name</span>
//                            <span>{systemInfo?.system.osName}</span>
//                         </div>
//                         <div className="flex justify-between">
//                            <span className="font-medium">OS Version</span>
//                            <span>{systemInfo?.system.osVersion}</span>
//                         </div>
//                         <div className="flex justify-between">
//                            <span className="font-medium">Architecture</span>
//                            <span>{systemInfo?.system.architecture}</span>
//                         </div>
//                         {systemInfo?.system.kernelVersion && (
//                            <div className="flex justify-between">
//                               <span className="font-medium">Kernel Version</span>
//                               <span>{systemInfo?.system.kernelVersion}</span>
//                            </div>
//                         )}
//                      </div>
//                      <div className="space-y-2">
//                         <div className="flex justify-between">
//                            <span className="font-medium">Device Type</span>
//                            <span>
//                               {systemInfo?.system.isDesktop ? "Desktop" :
//                                  systemInfo?.system.isTablet ? "Tablet" :
//                                     systemInfo?.system.isMobile ? "Mobile" : "Unknown"}
//                            </span>
//                         </div>
//                         <div className="flex justify-between">
//                            <span className="font-medium">Platform</span>
//                            <span>{systemInfo?.system.platform}</span>
//                         </div>
//                         {systemInfo?.system.isVirtualized !== null && (
//                            <div className="flex justify-between">
//                               <span className="font-medium">Virtualized</span>
//                               <span>{systemInfo?.system.isVirtualized ? "Possibly" : "Likely Not"}</span>
//                            </div>
//                         )}
//                      </div>
//                   </div>
//                   <div className="bg-gray-100 mt-4 p-3 rounded-md text-sm">
//                      <p className="text-gray-500">Note: OS detection in browsers is limited and may not be 100% accurate.</p>
//                   </div>
//                </CardContent>
//             </Card> */}

//             {/* Browser Information */}
//             {/* <Card>
//                <CardHeader>
//                   <CardTitle className="flex items-center space-x-2">
//                      <Chrome className="w-5 h-5" />
//                      <span>Browser Information</span>
//                   </CardTitle>
//                   <CardDescription>Details about your web browser</CardDescription>
//                </CardHeader>
//                <CardContent>
//                   <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
//                      <div className="space-y-2">
//                         <div className="flex justify-between">
//                            <span className="font-medium">Browser</span>
//                            <span>{systemInfo?.browser.name}</span>
//                         </div>
//                         <div className="flex justify-between">
//                            <span className="font-medium">Version</span>
//                            <span>{systemInfo?.browser.version}</span>
//                         </div>
//                         <div className="flex justify-between">
//                            <span className="font-medium">Language</span>
//                            <span>{systemInfo?.browser.language}</span>
//                         </div>
//                      </div>
//                      <div className="space-y-2">
//                         <div className="flex justify-between">
//                            <span className="font-medium">Cookies Enabled</span>
//                            <span>{systemInfo?.browser.cookiesEnabled ? "Yes" : "No"}</span>
//                         </div>
//                         <div className="flex justify-between">
//                            <span className="font-medium">Do Not Track</span>
//                            <span>{systemInfo?.browser.doNotTrack === "1" ? "Enabled" : "Disabled"}</span>
//                         </div>
//                      </div>
//                   </div>
//                   <div className="mt-4">
//                      <div className="mb-1 font-medium">User Agent</div>
//                      <div className="bg-gray-100 p-3 rounded-md overflow-x-auto text-sm">
//                         {systemInfo?.browser.userAgent}
//                      </div>
//                   </div>
//                </CardContent>
//             </Card> */}

//             {/* System Information */}
//             {/* <Card>
//                <CardHeader>
//                   <CardTitle className="flex items-center space-x-2">
//                      <Cpu className="w-5 h-5" />
//                      <span>System Information</span>
//                   </CardTitle>
//                   <CardDescription>Hardware and system details</CardDescription>
//                </CardHeader>
//                <CardContent>
//                   <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
//                      <div className="space-y-2">
//                         <div className="flex justify-between">
//                            <span className="font-medium">CPU Cores</span>
//                            <span>{systemInfo?.system.cores}</span>
//                         </div>
//                         <div className="flex justify-between">
//                            <span className="font-medium">Memory</span>
//                            <span>{systemInfo?.system.memory || "Unknown"}</span>
//                         </div>
//                      </div>
//                      <div className="space-y-2">
//                         <div className="flex justify-between">
//                            <span className="font-medium">Network Connection</span>
//                            <span>{systemInfo?.system.connection || "Unknown"}</span>
//                         </div>
//                         {systemInfo?.system.batteryLevel !== null && (
//                            <div className="space-y-2">
//                               <div className="flex justify-between">
//                                  <span className="font-medium">Battery Level</span>
//                                  <span>{systemInfo?.system.batteryLevel?.toFixed(0)}%</span>
//                               </div>
//                               <div className="flex justify-between">
//                                  <span className="font-medium">Battery Status</span>
//                                  <span>
//                                     {systemInfo?.system.batteryCharging ? "Charging" : "Not Charging"}
//                                  </span>
//                               </div>
//                            </div>
//                         )}
//                      </div>
//                   </div>
//                </CardContent>
//             </Card> */}

//             {/* Screen Information */}
//             {/* <Card>
//                <CardHeader>
//                   <CardTitle className="flex items-center space-x-2">
//                      <Monitor className="w-5 h-5" />
//                      <span>Screen Information</span>
//                   </CardTitle>
//                   <CardDescription>Details about your display</CardDescription>
//                </CardHeader>
//                <CardContent>
//                   <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
//                      <div className="space-y-2">
//                         <div className="flex justify-between">
//                            <span className="font-medium">Resolution</span>
//                            <span>{systemInfo?.screen.width} × {systemInfo?.screen.height}</span>
//                         </div>
//                         <div className="flex justify-between">
//                            <span className="font-medium">Color Depth</span>
//                            <span>{systemInfo?.screen.colorDepth} bits</span>
//                         </div>
//                      </div>
//                      <div className="space-y-2">
//                         <div className="flex justify-between">
//                            <span className="font-medium">Pixel Ratio</span>
//                            <span>{systemInfo?.screen.pixelRatio}</span>
//                         </div>
//                         <div className="flex justify-between">
//                            <span className="font-medium">Orientation</span>
//                            <span>{systemInfo?.screen.orientation}</span>
//                         </div>
//                      </div>
//                   </div>
//                </CardContent>
//             </Card> */}

//             {/* Feature Support */}
//             {/* <Card>
//                <CardHeader>
//                   <CardTitle className="flex items-center space-x-2">
//                      <Layers className="w-5 h-5" />
//                      <span>Feature Support</span>
//                   </CardTitle>
//                   <CardDescription>Browser features and capabilities</CardDescription>
//                </CardHeader>
//                <CardContent>
//                   <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
//                      <div className="space-y-2">
//                         <div className="flex justify-between">
//                            <span className="font-medium">Touchscreen</span>
//                            <span className={systemInfo?.features.touchscreen ? "text-green-600" : "text-red-600"}>
//                               {systemInfo?.features.touchscreen ? "Supported" : "Not Supported"}
//                            </span>
//                         </div>
//                         <div className="flex justify-between">
//                            <span className="font-medium">WebGL</span>
//                            <span className={systemInfo?.features.webGL ? "text-green-600" : "text-red-600"}>
//                               {systemInfo?.features.webGL ? "Supported" : "Not Supported"}
//                            </span>
//                         </div>
//                         <div className="flex justify-between">
//                            <span className="font-medium">Canvas</span>
//                            <span className={systemInfo?.features.canvas ? "text-green-600" : "text-red-600"}>
//                               {systemInfo?.features.canvas ? "Supported" : "Not Supported"}
//                            </span>
//                         </div>
//                      </div>
//                      <div className="space-y-2">
//                         <div className="flex justify-between">
//                            <span className="font-medium">WebRTC</span>
//                            <span className={systemInfo?.features.webRTC ? "text-green-600" : "text-red-600"}>
//                               {systemInfo?.features.webRTC ? "Supported" : "Not Supported"}
//                            </span>
//                         </div>
//                         <div className="flex justify-between">
//                            <span className="font-medium">WebP</span>
//                            <span className={systemInfo?.features.webP ? "text-green-600" : "text-red-600"}>
//                               {systemInfo?.features.webP ? "Supported" : "Not Supported"}
//                            </span>
//                         </div>
//                      </div>
//                   </div>
//                </CardContent>
//             </Card> */}

//             {/* Time Information */}
//             {/* <Card>
//                <CardHeader>
//                   <CardTitle className="flex items-center space-x-2">
//                      <Clock className="w-5 h-5" />
//                      <span>Time Information</span>
//                   </CardTitle>
//                   <CardDescription>Time and timezone details</CardDescription>
//                </CardHeader>
//                <CardContent>
//                   <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
//                      <div className="space-y-2">
//                         <div className="flex justify-between">
//                            <span className="font-medium">Current Time</span>
//                            <span>{systemInfo?.time.currentTime}</span>
//                         </div>
//                      </div>
//                      <div className="space-y-2">
//                         <div className="flex justify-between">
//                            <span className="font-medium">Timezone</span>
//                            <span>{systemInfo?.time.timezone}</span>
//                         </div>
//                         <div className="flex justify-between">
//                            <span className="font-medium">UTC Offset</span>
//                            <span>{-(systemInfo?.time.timezoneOffset || 0) / 60} hours</span>
//                         </div>
//                      </div>
//                   </div>
//                </CardContent>
//             </Card> */}
//          </div>

//          <div className="mt-10 text-gray-500 text-sm text-center">
//             <p>This information is collected and displayed locally in your browser and is not sent to any server.</p>
//          </div>
//       </div>
//    );
// }
