// import ChatComponent from "./ChatComponent";
import RemindersComponent from "./RemindersComponent";

function ChatSection() {
   return (
      <div className="flex items-start space-x-4 py-4">
         {/* <ChatComponent /> */}
         <RemindersComponent />
      </div>
   );
}

export default ChatSection;
