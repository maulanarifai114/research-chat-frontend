"use client";

import useHttp from "@/hooks/useHttp";
import { useRecoilState } from "recoil";
import { io, Socket } from "socket.io-client";
import { Button, TextInput, Avatar, useThemeMode } from "flowbite-react";
import { FormEvent, useEffect, useRef, useState } from "react";

import { Member, Message, MessageDto, MessageType, TabsMenu } from "@/types/global";
import { profileState } from "@/state/profile.state";

import SideBarChat from "@/components/pages/chat/SidebarChat";
import BubbleChat from "@/components/pages/chat/BubbleChat";

import AttachmentIcon from "@mui/icons-material/Attachment";

const SOCKET_SERVER_URL = "http://localhost:4000";

export default function page() {
  const http = useHttp();
  const [profile, setProfile] = useRecoilState(profileState);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chat, setChat] = useState<Message[]>([]);
  const [member, setMember] = useState<Member[]>([]);
  const [receive, setReceive] = useState<Member | undefined>();
  const [memberBroadcast, setmemberBroadcast] = useState<Member[] | undefined>();
  const [isAllowMemberBroadcast, setAllowMemberBroadcast] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [idConversation, setIdConversation] = useState<string>("");

  const [currentMenu, setCurrentMenu] = useState<TabsMenu>("PRIVATE");

  const theme = useThemeMode();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [formChat, setFormChat] = useState<MessageDto>({
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
      const response = await http.get<any>(`/v1/member/new/${profile?.id}`);
      if (response.data) {
        setMember(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMemberBroadcast = async () => {
    try {
      const response = await http.get<any>(`/v1/member/conversation/${idConversation}`);
      if (response.data) {
        setmemberBroadcast(response.data.member);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormChat((prev) => ({
        ...prev,
        attachment: file.name,
      }));
    }
  };

  const handleSendMessagaeSocket = (idProfile: string) => {
    const newSocket = io(SOCKET_SERVER_URL);

    newSocket.on("connect", () => {
      newSocket.emit("registerUser", idProfile);
    });

    newSocket.on("message", async (newMessage) => {
      const newChat = {
        id: newMessage.Id,
        message: newMessage.Message,
        attachment: newMessage.Attachment,
        member: {
          id: newMessage.member.id,
          email: newMessage.member.email,
          name: newMessage.member.name,
          role: newMessage.member.role,
        },
      };
      if (receive) {
        setChat((prev: Message[]) => [...prev, newChat]);
      }

      await getMember();
    });

    setSocket(newSocket);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = {
      sender: profile?.id,
      message: formChat.message,
      attachment: formChat.attachment,
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
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, [theme]);

  useEffect(() => {
    if (idConversation) {
      getMessage();
    } else {
      setChat([]);
    }
  }, [idConversation, receive]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  useEffect(() => {
    if (isUpdate) {
      getMember().finally(() => setIsUpdate(false));
    }
  }, [isUpdate]);

  useEffect(() => {
    if (profile && profile.id) {
      getMember();

      setFormChat((prevData) => ({
        ...prevData,
        idUser: profile.id ?? "",
      }));

      handleSendMessagaeSocket(profile.id);
    }
  }, [profile, receive]);

  useEffect(() => {
    if (idConversation && currentMenu === "BROADCAST") {
      getMemberBroadcast();
    }
  }, [currentMenu, idConversation]);

  useEffect(() => {
    if (memberBroadcast) {
      const isAllowedUser = memberBroadcast.find((user: Member) => user.id === profile?.id);
      if (isAllowedUser && isAllowedUser.isAllowed !== undefined) {
        setAllowMemberBroadcast(isAllowedUser.isAllowed);
      }
    }
  }, [memberBroadcast]);

  return (
    <div className="flex h-screen max-h-screen items-center justify-center pl-4">
      <div className="grid w-full grid-cols-1 items-center gap-3 md:grid-cols-4">
        <div className="hidden h-full md:flex">
          <SideBarChat isDarkMode={isDarkMode} isUpdated={(e) => setIsUpdate(e)} idUser={profile && profile.id} currentUser={receive && receive.id} receive={(data) => setReceive(data)} idConversation={(id) => setIdConversation(id)} onMenuChange={(menu: TabsMenu) => setCurrentMenu(menu)} currentMenu={currentMenu} member={member && member} />
        </div>
        <div className="container col-span-3 flex flex-col">
          {/* head chat */}
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

          {/* chat body */}
          <div ref={chatContainerRef} className="scrollbar flex max-h-[75vh] min-h-[75vh] w-full grow flex-col gap-4 overflow-auto">
            {chat && chat.length > 0 ? chat.map((item: any, index) => <BubbleChat userName={item.member.name} attachment={item.attachment} message={item.message} type={item.member.id === profile?.id ? MessageType.SENDER : MessageType.RECEIVER} key={index} />) : <div className="flex h-[70vh] items-center justify-center text-gray-500 dark:text-gray-400">Add a chat now</div>}
          </div>

          {/* submit chat */}
          <form onSubmit={onSubmit} className="mt-auto flex flex-col gap-2">
            <p>{profile && profile.name} </p>
            <div className="flex gap-2">
              <TextInput value={formChat.message} name="message" className="w-full" onChange={(e) => setFormChat((prev) => ({ ...prev, message: e.target.value }))} />
              <div className="relative">
                <button type="button" onClick={() => fileInputRef.current?.click()}>
                  <AttachmentIcon className="text-xl" />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*" />
              </div>
              <Button disabled={receive ? currentMenu === "BROADCAST" && !isAllowMemberBroadcast : true} color="blue" type="submit">
                Send
              </Button>
            </div>
          </form>
          {formChat.attachment && <p>Attachment: {formChat.attachment}</p>}
        </div>
      </div>
    </div>
  );
}
