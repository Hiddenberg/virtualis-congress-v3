// "use client";
// import dynamic from "next/dynamic";

// const DeepChat = dynamic(
//    () => import('deep-chat-react').then((mod) => mod.DeepChat),
//    {
//       ssr: false,
//    }
// );

// export default function DeepChatComponent () {
//    return (
//       <div>
//          <h1>DeepChat test</h1>
//          <DeepChat
//             connect={{
//                url: "/api/ai/cs-chat",
//                method: "POST",
//             }}
//          />
//       </div>
//    );
// }
