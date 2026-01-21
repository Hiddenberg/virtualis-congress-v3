"use client";

import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Minimal WebHID typings to avoid using any
interface NavigatorWithHID extends Navigator {
   hid?: HID;
}

interface HID {
   getDevices?: () => Promise<HIDDevice[]>;
   requestDevice?: (options: HIDRequestDeviceOptions) => Promise<HIDDevice[]>;
}

interface HIDRequestDeviceOptions {
   filters: Array<Record<string, unknown>>;
}

interface HIDDevice {
   opened: boolean;
   vendorId: number;
   productId: number;
   productName?: string;
   open: () => Promise<void>;
   addEventListener: (type: "inputreport", listener: (event: HIDInputReportEvent) => void) => void;
}

interface HIDInputReportEvent extends Event {
   device: HIDDevice;
   reportId: number;
   data: DataView;
}

interface InputEventRecord {
   id: string;
   timestampMs: number;
   deviceKind: "keyboard" | "mouse" | "gamepad" | "hid";
   deviceName: string;
   label: string;
}

interface ConnectedHIDDevice {
   id: string;
   productName: string;
}

const MAX_EVENTS = 50;

export default function ButtonsDetector(): React.ReactElement {
   const [events, setEvents] = useState<InputEventRecord[]>([]);
   const [gamepadPolling, setGamepadPolling] = useState<boolean>(true);
   const [connectedHidDevices, setConnectedHidDevices] = useState<ConnectedHIDDevice[]>([]);

   const rafRef = useRef<number | null>(null);
   const prevGamepadButtonsRef = useRef<Record<string, boolean[]>>({});

   const addEvent = useCallback((partial: Omit<InputEventRecord, "id" | "timestampMs">): void => {
      setEvents((prev) => {
         const next: InputEventRecord = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            timestampMs: Date.now(),
            ...partial,
         };
         const result = [next, ...prev];
         if (result.length > MAX_EVENTS) {
            return result.slice(0, MAX_EVENTS);
         }
         return result;
      });
   }, []);

   const mouseButtonLabelByCode = useMemo(
      () =>
         ({
            0: "Izquierdo",
            1: "Central",
            2: "Derecho",
            3: "Atrás",
            4: "Adelante",
         }) as Record<number, string>,
      [],
   );

   useEffect(() => {
      const onKeyDown = (e: KeyboardEvent): void => {
         addEvent({
            deviceKind: "keyboard",
            deviceName: "Teclado",
            label: `${formatKey(e)} Presionado`,
         });
      };
      const onKeyUp = (e: KeyboardEvent): void => {
         addEvent({
            deviceKind: "keyboard",
            deviceName: "Teclado",
            label: `${formatKey(e)} Soltado`,
         });
      };

      const onMouseDown = (e: MouseEvent): void => {
         addEvent({
            deviceKind: "mouse",
            deviceName: "Mouse",
            label: `${mouseButtonLabelByCode[e.button] ?? `Botón ${e.button}`} Presionado`,
         });
      };
      const onMouseUp = (e: MouseEvent): void => {
         addEvent({
            deviceKind: "mouse",
            deviceName: "Mouse",
            label: `${mouseButtonLabelByCode[e.button] ?? `Botón ${e.button}`} Soltado`,
         });
      };
      const onAuxClick = (e: MouseEvent): void => {
         addEvent({
            deviceKind: "mouse",
            deviceName: "Mouse",
            label: `${mouseButtonLabelByCode[e.button] ?? `Botón ${e.button}`} (aux)`,
         });
      };

      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);
      window.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mouseup", onMouseUp);
      window.addEventListener("auxclick", onAuxClick);

      return () => {
         window.removeEventListener("keydown", onKeyDown);
         window.removeEventListener("keyup", onKeyUp);
         window.removeEventListener("mousedown", onMouseDown);
         window.removeEventListener("mouseup", onMouseUp);
         window.removeEventListener("auxclick", onAuxClick);
      };
   }, [addEvent, mouseButtonLabelByCode]);

   useEffect(() => {
      if (!gamepadPolling) {
         if (rafRef.current !== null) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
         }
         return;
      }

      const tick = (): void => {
         const gamepads = navigator.getGamepads?.() ?? [];
         for (const gp of gamepads) {
            if (!gp) continue;
            const key = `${gp.index}`;
            const prevButtons = prevGamepadButtonsRef.current[key] ?? [];
            const nextButtons: boolean[] = [];
            for (let i = 0; i < gp.buttons.length; i++) {
               const pressed = gp.buttons[i]?.pressed === true;
               nextButtons[i] = pressed;
               const wasPressed = prevButtons[i] === true;
               if (pressed && !wasPressed) {
                  addEvent({
                     deviceKind: "gamepad",
                     deviceName: gp.id || `Gamepad ${gp.index}`,
                     label: `Botón ${i} ↓`,
                  });
               } else if (!pressed && wasPressed) {
                  addEvent({
                     deviceKind: "gamepad",
                     deviceName: gp.id || `Gamepad ${gp.index}`,
                     label: `Botón ${i} ↑`,
                  });
               }
            }
            prevGamepadButtonsRef.current[key] = nextButtons;
         }
         rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
      return () => {
         if (rafRef.current !== null) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
         }
      };
   }, [addEvent, gamepadPolling]);

   useEffect(() => {
      const hid = (navigator as NavigatorWithHID).hid;
      if (!hid?.getDevices) return;
      let isMounted = true;
      void hid
         .getDevices()
         .then((devices) => {
            if (!isMounted) return;
            setConnectedHidDevices(
               devices.map((d) => ({
                  id: `${d.vendorId}:${d.productId}:${d.productName}`,
                  productName: d.productName ?? "HID",
               })),
            );
         })
         .catch(() => {});
      return () => {
         isMounted = false;
      };
   }, []);

   const requestHidDevice = async (): Promise<void> => {
      const hid = (navigator as NavigatorWithHID).hid;
      if (!hid?.requestDevice) {
         addEvent({
            deviceKind: "hid",
            deviceName: "HID",
            label: "WebHID no compatible en este navegador",
         });
         return;
      }
      try {
         const devices = await hid.requestDevice({
            filters: [],
         });
         for (const device of devices) {
            if (!device.opened) await device.open();
            const deviceName: string = device.productName ?? "HID";
            setConnectedHidDevices((prev) => {
               const id = `${device.vendorId}:${device.productId}:${device.productName}`;
               if (prev.some((d) => d.id === id)) return prev;
               return [
                  {
                     id,
                     productName: deviceName,
                  },
                  ...prev,
               ];
            });
            device.addEventListener("inputreport", (e: HIDInputReportEvent) => {
               try {
                  const data: DataView = e.data;
                  const bytes: number[] = [];
                  for (let i = 0; i < data.byteLength; i++) bytes.push(data.getUint8(i));
                  const hex = bytes.map((b) => b.toString(16).padStart(2, "0")).join(" ");
                  addEvent({
                     deviceKind: "hid",
                     deviceName: deviceName,
                     label: `Reporte ${e.reportId}: ${hex}`,
                  });
               } catch {
                  addEvent({
                     deviceKind: "hid",
                     deviceName: deviceName,
                     label: `Reporte recibido`,
                  });
               }
            });
         }
      } catch {
         addEvent({
            deviceKind: "hid",
            deviceName: "HID",
            label: "Permiso denegado o sin dispositivos",
         });
      }
   };

   return (
      <div className="flex flex-col gap-4">
         <div className="bg-white shadow-sm p-4 border border-blue-200 rounded-lg">
            <div className="flex justify-between items-center mb-3">
               <h2 className="font-semibold text-blue-900 text-lg">Detector de botones</h2>
               <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-blue-900 text-sm">
                     <input
                        type="checkbox"
                        className="w-4 h-4 accent-blue-600"
                        checked={gamepadPolling}
                        onChange={(e) => setGamepadPolling(e.target.checked)}
                     />
                     Gamepad
                  </label>
                  <button
                     type="button"
                     className="bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md font-medium text-white text-sm"
                     onClick={() => setEvents([])}
                  >
                     Limpiar
                  </button>
               </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-4">
               <button
                  type="button"
                  className="bg-blue-50 hover:bg-blue-100 px-3 py-1.5 border border-blue-300 rounded-md font-medium text-blue-800 text-sm"
                  onClick={() => {
                     void requestHidDevice();
                  }}
               >
                  Conectar dispositivo HID
               </button>
               {connectedHidDevices.length > 0 && (
                  <div className="text-blue-900 text-sm">
                     HID conectados: {connectedHidDevices.map((d) => d.productName).join(", ")}
                  </div>
               )}
            </div>

            <div className="border border-blue-100 rounded-md max-h-[420px] overflow-auto">
               <table className="min-w-full text-sm text-left">
                  <thead className="bg-blue-50 text-blue-900">
                     <tr>
                        <th className="px-3 py-2 font-medium">Hora</th>
                        <th className="px-3 py-2 font-medium">Dispositivo</th>
                        <th className="px-3 py-2 font-medium">Evento</th>
                     </tr>
                  </thead>
                  <tbody>
                     {events.map((ev) => (
                        <tr key={ev.id} className="even:bg-blue-50/40 odd:bg-white">
                           <td className="px-3 py-2 text-blue-900">{new Date(ev.timestampMs).toLocaleTimeString()}</td>
                           <td className="px-3 py-2 text-blue-900">{labelForDevice(ev)}</td>
                           <td className="px-3 py-2 font-medium text-blue-900">{ev.label}</td>
                        </tr>
                     ))}
                     {events.length === 0 && (
                        <tr>
                           <td colSpan={3} className="px-3 py-6 text-blue-700 text-center">
                              Presiona cualquier botón del teclado, mouse, gamepad o un dispositivo HID.
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
}

function labelForDevice(ev: InputEventRecord): string {
   if (ev.deviceKind === "keyboard") return "Teclado";
   if (ev.deviceKind === "mouse") return "Mouse";
   if (ev.deviceKind === "gamepad") return ev.deviceName || "Gamepad";
   if (ev.deviceKind === "hid") return ev.deviceName || "HID";
   return "Dispositivo";
}

function formatKey(e: KeyboardEvent): string {
   const parts: string[] = [];
   if (e.ctrlKey) parts.push("Ctrl");
   if (e.altKey) parts.push("Alt");
   if (e.shiftKey) parts.push("Shift");
   if (e.metaKey) parts.push("Meta");
   const key = normalizeKeyLabel(e.key);
   parts.push(key);
   return parts.join("+");
}

function normalizeKeyLabel(key: string): string {
   if (key === " ") return "Espacio";
   if (key === "Meta") return "Meta";
   if (key.length === 1) return key.toUpperCase();
   const map: Record<string, string> = {
      Enter: "Enter",
      Escape: "Escape",
      Backspace: "Backspace",
      Tab: "Tab",
      ArrowUp: "Flecha Arriba",
      ArrowDown: "Flecha Abajo",
      ArrowLeft: "Flecha Izquierda",
      ArrowRight: "Flecha Derecha",
      Delete: "Delete",
      Insert: "Insert",
      Home: "Home",
      End: "End",
      PageUp: "PageUp",
      PageDown: "PageDown",
   };
   return map[key] ?? key;
}
