"use client";

import { Button, TextInput, Avatar } from "flowbite-react";
import { FormEvent, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import SideBarMenu from "@/components/chat/SidebarMenu";
import SideBarChat from "@/components/chat/SidebarChat";
import BubbleChat from "@/components/chat/BubbleChat";
import { MessageType } from "@/types/global";
import useHttp from "@/hooks/useHttp";
import { profileState } from "@/state/profile.state";
import { useRecoilState } from "recoil";

const SOCKET_SERVER_URL = "http://localhost:4000";

export default function page() {
  const http = useHttp();
  const [chat, setChat] = useState<any[]>([]);
  const [profile, setProfile] = useRecoilState(profileState);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [receive, setReceive] = useState<any>(null);

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

  const getMember = async () => {
    try {
      const response = await http.get<any>("/v1/member/conversation/RLEG1QLR692DMOOQ1L3X");
      const receiver = response.data.member.filter((user: any) => user.id !== profile?.id);
      if (receiver) {
        setReceive(receive[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = {
      sender: profile?.id,
      receive: receive?.id,
      message: formChat.message,
      attachment: "[]",
      idConversation: formChat.idConversation,
    };
    socket?.emit("message", payload);
    setFormChat((prev) => ({
      ...prev,
      message: "",
    }));
  };

  useEffect(() => {
    getMessage();
    getProfile();
  }, []);

  useEffect(() => {
    if (profile && profile.id) {
      getMember();
      setFormChat((prevData) => ({
        ...prevData,
        idUser: profile.id ?? "",
      }));

      const newSocket = io(SOCKET_SERVER_URL);

      newSocket.on("connect", () => {
        newSocket.emit("registerUser", profile.id);
      });

      newSocket.on("message", (newMessage) => {
        const newChat = {
          id: newMessage.Id,
          message: newMessage.Message,
          attachment: newMessage.Attachment,
          member: {
            email: newMessage.member.email,
            name: newMessage.member.name,
            role: newMessage.member.role,
          },
        };
        setChat((prev) => [...prev, newChat]);
      });

      setSocket(newSocket);
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
          <div className="flex min-h-px w-full grow flex-col gap-4 overflow-auto">{chat && profile && chat.map((item: any, index) => <BubbleChat userName={item.member.name} message={item.message} type={item.member.role === profile.role ? MessageType.SENDER : MessageType.RECEIVER} key={index} />)}</div>
          <form onSubmit={onSubmit} className="mt-auto flex flex-col gap-2">
            <p>{profile && profile.name} </p>
            <div className="flex gap-2">
              <TextInput value={formChat.message} name="message" className="w-full" onChange={(e) => setFormChat((prev) => ({ ...prev, message: e.target.value }))} />
              <Button color="blue" type="submit">
                Send
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
