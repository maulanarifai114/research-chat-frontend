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
  const [currentMenu, setCurrentMenu] = useState<string>("private");
  const [idConversation, setIdConversation] = useState<string>("");
  const [member, setMember] = useState<any[]>([]);
  const [receive, setReceive] = useState<any>(null);

  const [formChat, setFormChat] = useState({
    message: "",
    attachment: "",
    idConversation: "",
    idUser: "",
  });

  const getMessage = async () => {
    try {
      const response = await http.get<any>(`/v1/message/conversation/${idConversation}`);
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
      const response = await http.get<any>(`/v1/member/user/${profile?.id}`);
      if (response.data) {
        setMember(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = {
      sender: profile?.id,
      message: formChat.message,
      attachment: "[]",
      idConversation: idConversation,
    };
    socket?.emit("message", payload);
    setFormChat((prev) => ({
      ...prev,
      message: "",
    }));
  };

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (idConversation) {
      getMessage();
    }
  }, [idConversation]);

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
    <div className="flex h-screen max-h-screen items-center justify-center pl-4">
      {/* <div className="hidden h-screen w-2/12 border border-solid border-black md:flex">
        <SideBarMenu />
      </div> */}
      <div className="grid w-full grid-cols-1 items-center gap-3 md:grid-cols-4">
        <div className="hidden h-full md:flex">
          <SideBarChat currentUser={receive && receive.id} receive={(data) => setReceive(data)} idConversation={(id) => setIdConversation(id)} onMenuChange={(menu) => setCurrentMenu(menu)} currentMenu={currentMenu} member={member && member} />
        </div>
        <div className="container col-span-3 flex flex-col">
          {receive ? (
            <div className="flex p-2">
              <Avatar img="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png" rounded>
                <div className="space-y-1 font-medium dark:text-white">
                  <div>{receive.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Joined in August 2014</div>
                </div>
              </Avatar>
            </div>
          ) : null}
          <div className="scrollbar flex max-h-[75vh] min-h-[75vh] w-full grow flex-col gap-4 overflow-auto">{chat && chat.length > 0 ? chat.map((item: any, index) => <BubbleChat userName={item.member.name} message={item.message} type={item.member.role === profile?.role ? MessageType.SENDER : MessageType.RECEIVER} key={index} />) : <div className="flex h-[70vh] items-center justify-center text-gray-500 dark:text-gray-400">Add a chat now</div>}</div>
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
