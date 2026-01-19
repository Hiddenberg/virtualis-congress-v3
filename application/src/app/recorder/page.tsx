import RecorderInterface from "@/components/recorder/RecorderInterface";
import { ScreenRecorderContextProvider } from "@/contexts/ScreenRecorderContext";

function RecorderPage() {
   return (
      <ScreenRecorderContextProvider isPresentation={false}>
         <RecorderInterface />
      </ScreenRecorderContextProvider>
   );
}

export default RecorderPage;
