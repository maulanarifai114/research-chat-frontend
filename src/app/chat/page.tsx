"use client";

import { Auth, getAuth } from "@/utils/get-auth";
import { setAuth } from "@/utils/set-auth";
import { Button, TextInput, Avatar } from "flowbite-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import SideBarMenu from "@/components/chat/SidebarMenu";
import SideBarChat from "@/components/chat/SidebarChat";
import BubbleChat from "@/components/chat/BubbleChat";
import { MessageType, Roles } from "@/types/global";
import useHttp from "@/hooks/useHttp";
import { profileState } from "@/state/profile.state";
import { useRecoilState } from "recoil";

export default function page() {
  const http = useHttp();
  const router = useRouter();
  const [chat, setChat] = useState([]);
  const [profile, setProfile] = useRecoilState(profileState);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);
  const [user, setUser] = useState<Auth | null>(null);
  const [dummyChat, setDummyChat] = useState([
    {
      message: "hello",
      userName: "john",
    },
    {
      message: "hello",
      userName: "john",
      type: MessageType.SENDER,
    },
    {
      message: "hello",
      userName: "tom",
    },
  ]);
  const [formChat, setFormChat] = useState({
    message: "",
    attachment: "",
    idConversation: "RLEG1QLR692DMOOQ1L3X",
    idUser: "",
  });

  const getMessage = async () => {
    try {
      const response = await http.get<any>("/v1/message/conversation/RLEG1QLR692DMOOQ1L3X");
      setChat(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const getProfile = async () => {
    try {
      const profileData = await http.get<any>("/v1/user/profile");
      setProfile(profileData.data.profile);
    } catch (error: any) {
      console.log(error);
    }
  };

  // const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const formData = new FormData(event.currentTarget);
  //   const message = formData.get("message");
  //   if (message) {
  //     event.currentTarget.reset();
  //     socket?.emit("message", { sender: user?.name, message: message as string });
  //   }
  // };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await http.post<{ name: string; email: string; role: string }>("/v1/message/save", formChat);
      console.log(response);
    } catch (error) {}
  };

  const onLogout = () => {
    setAuth(null);
    router.push("/auth");
  };

  useEffect(() => {
    getMessage();
    getProfile();
    if (!localStorage.getItem("user")) router.push("/auth");
    setUser(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null);

    const newSocket = io("http://localhost:4000");

    newSocket.on("message", (props: { sender: string; message: string }) => {
      setMessages((prev) => [...prev, props]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (profile && profile.id) {
      setFormChat((prevData) => ({
        ...prevData,
        idUser: profile.id ?? "",
      }));
    }
  }, [profile]);

  return (
    <div className="flex h-full gap-4 p-8">
      <div className="h-screen w-2/12 border border-solid border-black">
        <SideBarMenu />
      </div>
      <div className="flex h-screen w-10/12 items-center border border-solid border-black bg-gray-200">
        <div className="h-full w-1/3 border border-solid border-black">
          <SideBarChat />
        </div>
        <div className="container flex h-full flex-col gap-4 py-8">
          <div className="flex border border-solid border-black p-2">
            <Avatar img="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png" rounded>
              <div className="space-y-1 font-medium dark:text-white">
                <div>Jese Leos</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Joined in August 2014</div>
              </div>
            </Avatar>
          </div>
          <div className="flex min-h-px w-full grow flex-col gap-4 overflow-auto">
            {/* {dummyChat.map((item, index) => (
              <BubbleChat {...item} key={index} />
            ))} */}
            {chat && profile && chat.map((item: any, index) => <BubbleChat userName={item.member.name} message={item.message} type={item.member.role === profile.role ? MessageType.SENDER : MessageType.RECEIVER} key={index} />)}
          </div>
          <form onSubmit={onSubmit} className="mt-auto flex flex-col gap-2">
            <p>{user?.name} </p>
            <div className="flex gap-2">
              <TextInput name="message" className="w-full" onChange={(e) => setFormChat((prev) => ({ ...prev, message: e.target.value }))} />
              <Button color="blue" type="submit">
                Send
              </Button>
              {/* <Button onClick={onLogout} color="failure" type="button">
              Logout
            </Button> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// "use client";
// import { Button, TextInput } from "flowbite-react";
// import { useEffect, useState } from "react";
// import io from "socket.io-client";

// const socket = io("/api/socssssket"); // Replace with your server URL

// const Chat = () => {
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState<string[]>([]);

//   useEffect(() => {
//     socket.on("message", (msg) => {
//       setMessages((prevMessages) => [...prevMessages, msg]);
//     });

//     return () => {
//       socket.off("message");
//     };
//   }, []);

//   const handleSendMessage = () => {
//     socket.emit("message", message);
//     setMessage("");
//   };

//   return (
//     <div className="container py-12">
//       <div>
//         {messages.map((msg, index) => (
//           <div key={index}>{msg}</div>
//         ))}
//       </div>
//       <TextInput type="text" value={message} onChange={(e) => setMessage(e.target.value)}></TextInput>
//       <Button onClick={handleSendMessage}>Send</Button>
//     </div>
//   );
// };

// export default Chat;
