import useHttp from "@/hooks/useHttp";
import React, { useEffect, useState } from "react";

import { TabsMenu } from "@/types/global";
import SelectComponent from "../../base/Select";
import { Avatar, Button, Modal } from "flowbite-react";

import { IoMdPerson } from "react-icons/io";
import { FaUserGroup } from "react-icons/fa6";
import { FaTowerBroadcast } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import ModalBodyPrivate from "./ModalBodyPrivate";
import ModalBodyGroup from "./ModalBodyGroup";
import ModalBodyBroadcast from "./ModalBodyBroadcast";

interface SidebarChatProps {
  idUser?: string | null;
  currentUser: string | null | undefined;
  currentMenu: string;
  member: any;
  isDarkMode: boolean;
  onMenuChange: (menu: TabsMenu) => void;
  idConversation: (id: string) => void;
  receive: (data: any) => void;
  isUpdated: (data: boolean) => void;
}

const SideBarChat = (props: SidebarChatProps) => {
  const http = useHttp();
  const [openModal, setOpenModal] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [member, setMember] = useState<any[]>([]);
  const [memberByRole, setMemberByRole] = useState<any[]>([]);

  const [optionMember, setOptionMember] = useState<any[]>([]);
  const [idsUser, setIdsUser] = useState<any[]>([]);
  const [nameConversation, setNameConversation] = useState<string>("");

  const getMember = async () => {
    try {
      const response = await http.get<any>(`/v1/member/member/${props.idUser}`);
      setMember(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserByRole = async (type: string) => {
    try {
      const response = await http.get<any>(`/v1/member/list/user?roles=${type}`);
      if (response.data) {
        setMemberByRole(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateGroup = async (e: any) => {
    e.preventDefault();
    try {
      let idsMember = [];
      setOpenModal(false);
      const responseCreate = await addConversation({
        name: nameConversation,
        type: props.currentMenu,
      });

      if (props.currentMenu === "BROADCAST") {
        const response = await http.get<any>(`/v1/member/list/user?roles=MEMBER`);
        if (response.data) {
          idsMember = response.data.map((user: any) => user.Id);
        }
      }

      if (responseCreate?.data) {
        const dataBulk = {
          idConversation: responseCreate.data.id,
          idUsers: props.currentMenu === "GROUP" ? [...idsUser, props.idUser] : idsMember,
          idAdmin: props.currentMenu === "BROADCAST" ? [...idsUser, props.idUser] : [],
        };
        await http.post<any>(`/v1/member/bulk`, dataBulk);
      }
    } catch (error) {
      console.log(error);
    } finally {
      props.isUpdated(true);
    }
  };

  const addMember = async (idUser: string, idConversation: string) => {
    try {
      const data = {
        id: "",
        idUser: idUser,
        idConversation: idConversation,
      };
      await http.post<any>(`/v1/member/save`, data);
    } catch (error) {
      console.log(error);
    }
  };

  const addConversation = async (props: { name?: string; type: string }) => {
    try {
      const data = {
        name: props.name ? props.name : props.type.toLowerCase(),
        type: props.type,
      };
      return await http.post<any>(`/v1/conversation/save`, data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeSelect = (selected: any) => {
    const ids = selected.map((user: any) => user.value);
    setIdsUser(ids);
  };

  useEffect(() => {
    if (memberByRole) {
      const options = memberByRole.map((member) => ({
        value: member.Id,
        label: member.Name,
      }));
      setOptionMember(options);
    }
  }, [memberByRole]);

  useEffect(() => {
    if (props.idUser && openModal) {
      getMember();
      if (props.currentMenu === "GROUP") {
        getUserByRole("MEMBER");
      } else if (props.currentMenu === "BROADCAST") {
        getUserByRole("ADMIN");
      }
    }
  }, [openModal, props.idUser]);

  useEffect(() => {
    if (props.member) {
      if (props.currentMenu === "PRIVATE") {
        setUsers(props.member.privateMember);
      }
      if (props.currentMenu === "GROUP") {
        setUsers(props.member.groupMember);
      }
      if (props.currentMenu === "BROADCAST") {
        setUsers(props.member.broadcastMember);
      }
    }
  }, [props.currentMenu, props.member]);

  return (
    <div className="flex h-full w-full flex-col justify-between rounded-lg bg-gray-200 px-5 py-8 dark:bg-gray-800">
      <div>
        {/* tabs */}
        <div className="flex justify-between">
          <div onClick={() => props.onMenuChange("PRIVATE")} className={`cursor-pointer rounded-t-md p-3 text-2xl hover:bg-gray-200 dark:hover:bg-gray-800 ${props.currentMenu === "PRIVATE" ? "border-b-2 border-blue-700 text-blue-700" : "text-gray-400 dark:text-gray-700"}`}>
            <IoMdPerson />
          </div>
          <div onClick={() => props.onMenuChange("GROUP")} className={`cursor-pointer rounded-t-md p-3 text-2xl hover:bg-gray-200 dark:hover:bg-gray-800 ${props.currentMenu === "GROUP" ? "border-b-2 border-blue-700 text-blue-700" : "text-gray-400 dark:text-gray-700"}`}>
            <FaUserGroup />
          </div>
          <div onClick={() => props.onMenuChange("BROADCAST")} className={`cursor-pointer rounded-t-md p-3 text-2xl hover:bg-gray-200 dark:hover:bg-gray-800 ${props.currentMenu === "BROADCAST" ? "border-b-2 border-blue-700 text-blue-700" : "text-gray-400 dark:text-gray-700"}`}>
            <FaTowerBroadcast />
          </div>
        </div>

        {/* sidebar user list by tabs */}
        <div className="mt-5 w-full flex-col gap-4">
          <div className="flex w-full gap-2">
            <div className="grid w-full cursor-pointer grid-cols-1 items-start gap-3">
              {users && users.length > 0 ? (
                users.map((user, index) => (
                  <Avatar
                    onClick={() => {
                      props.idConversation(user.idConversation ? user.idConversation : user.id);
                      props.receive({
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                      });
                    }}
                    className={`cursor-pointer justify-start rounded-md p-2 hover:bg-gray-300 dark:hover:bg-gray-900 ${props.currentUser === user.id ? "bg-gray-300 dark:bg-gray-900" : ""}`}
                    key={index}
                    img="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png"
                    rounded
                  >
                    <div className="space-y-1 font-medium dark:text-white">
                      <div>{user.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Joined in August 2014</div>
                    </div>
                  </Avatar>
                ))
              ) : (
                <div className="w-full py-8 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-600">Tidak ada data</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* modal tabs */}
      <div className="flex flex-col items-end justify-end">
        <button onClick={() => setOpenModal(true)} type="button" className="me-2 inline-flex w-fit items-center rounded-full bg-blue-700 p-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          <FaPlus />
        </button>
        <Modal dismissible show={openModal} onClose={() => setOpenModal(false)} style={{ zIndex: 10 }} className="z-10">
          <form onSubmit={handleCreateGroup}>
            <Modal.Header>{props.currentMenu === "PRIVATE" ? "Kontak" : "Group"}</Modal.Header>
            {props.currentMenu === "PRIVATE" ? <ModalBodyPrivate member={member} idUser={props.idUser} currentUser={props.currentUser} currentMenu={props.currentMenu} addConversation={addConversation} addMember={addMember} idConversation={props.idConversation} receive={props.receive} setOpenModal={(openModal) => setOpenModal(openModal)} /> : props.currentMenu === "GROUP" ? <ModalBodyGroup isDarkMode={props.isDarkMode} optionMember={optionMember} setNameConversation={(e) => setNameConversation(e)} handleChangeSelect={handleChangeSelect} /> : <ModalBodyBroadcast isDarkMode={props.isDarkMode} optionAdmin={optionMember} setNameConversation={(e) => setNameConversation(e)} handleChangeSelect={handleChangeSelect} />}
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default SideBarChat;
