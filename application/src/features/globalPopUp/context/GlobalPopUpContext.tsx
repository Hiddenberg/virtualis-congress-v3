"use client";

import { createContext, type ReactNode, useCallback, useContext, useRef, useState } from "react";
import PopUp from "../components/PopUp";

export interface GlobalPopUpOptions {
   hasCloseButton?: boolean;
}

interface GlobalPopUpItem {
   id: string;
   content: ReactNode;
   options?: GlobalPopUpOptions;
}

function useGlobalPopUp() {
   const [popUps, setPopUps] = useState<GlobalPopUpItem[]>([]);
   const idCounterRef = useRef(0);

   const isOpen = popUps.length > 0;
   const popUpContent = popUps.length > 0 ? popUps[popUps.length - 1].content : null;

   const showInPopUp = useCallback((content: ReactNode, options?: GlobalPopUpOptions) => {
      idCounterRef.current += 1;
      const id = `${Date.now()}-${idCounterRef.current}`;
      setPopUps((current) => [
         ...current,
         {
            id,
            content,
            options,
         },
      ]);
      return id;
   }, []);

   const closePopUp = useCallback((id?: string) => {
      setPopUps((current) => {
         if (!current.length) return current;
         if (!id) {
            // Close the most recently opened popup
            return current.slice(0, -1);
         }
         return current.filter((p) => p.id !== id);
      });
   }, []);

   const closeAllPopUps = useCallback(() => {
      setPopUps([]);
   }, []);

   return {
      isOpen,
      popUpContent,
      showInPopUp,
      closePopUp,
      closeAllPopUps,
      popUps,
   };
}

export const GlobalPopUpContext = createContext<ReturnType<typeof useGlobalPopUp> | null>(null);

export const GlobalPopUpProvider = ({ children }: { children: ReactNode }) => {
   const { isOpen, popUpContent, showInPopUp, closePopUp, closeAllPopUps, popUps } = useGlobalPopUp();

   return (
      <GlobalPopUpContext.Provider
         value={{
            isOpen,
            popUpContent,
            showInPopUp,
            closePopUp,
            closeAllPopUps,
            popUps,
         }}
      >
         <div className={`${isOpen ? "h-screen overflow-hidden" : ""}`}>{children}</div>

         {isOpen &&
            popUps.map((p) => (
               <PopUp key={p.id} onClose={() => closePopUp(p.id)} options={p.options}>
                  {p.content}
               </PopUp>
            ))}
      </GlobalPopUpContext.Provider>
   );
};

export function useGlobalPopUpContext() {
   const globalPopUpContext = useContext(GlobalPopUpContext);

   if (!globalPopUpContext) {
      throw new Error("useGlobalPopUpContext must be used within a GlobalPopUpProvider");
   }

   return globalPopUpContext;
}
