"use client";

import { Auth, getAuth } from "@/utils/get-auth";
import { setAuth } from "@/utils/set-auth";
import { Button, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function page() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);
  const [user, setUser] = useState<Auth | null>(null);
  const router = useRouter();
  useEffect(() => {
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

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const message = formData.get("message");
    if (message) {
      event.currentTarget.reset();
      socket?.emit("message", { sender: user?.fullName, message: message as string });
    }
  };

  const onLogout = () => {
    setAuth(null);
    router.push("/auth");
  };

  return (
    <div className="container flex h-full flex-col gap-4 py-12">
      <div className="flex min-h-px grow flex-col gap-2 overflow-auto">
        {messages.map((item, index) => (
          <p key={index}>
            {item.sender} : {item.message}{" "}
          </p>
        ))}
      </div>
      <form onSubmit={onSubmit} className="mt-auto flex flex-col gap-2">
        <p>{user?.fullName} </p>
        <div className="flex gap-2">
          <TextInput name="message" className="w-full" />
          <Button color="blue" type="submit">
            Send
          </Button>
          <Button onClick={onLogout} color="failure" type="button">
            Logout
          </Button>
        </div>
      </form>
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
