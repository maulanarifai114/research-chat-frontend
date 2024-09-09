import React, { use, useEffect, useState } from "react";
import { Avatar, Button, Modal, useThemeMode } from "flowbite-react";
import { IoMdPerson } from "react-icons/io";
import { FaUserGroup } from "react-icons/fa6";
import { FaTowerBroadcast } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import useHttp from "@/hooks/useHttp";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { colourOptions } from "@/data/data";

const animatedComponents = makeAnimated();

const customStyles = (isDarkMode: boolean) => ({
  control: (base: any) => ({
    ...base,
    backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
    borderColor: isDarkMode ? "#4b5563" : "#d1d5db",
    color: isDarkMode ? "#ffffff" : "#000000",
    boxShadow: "none",
    "&:hover": {
      borderColor: isDarkMode ? "#9ca3af" : "#6b7280",
    },
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
    color: isDarkMode ? "#ffffff" : "#000000",
    zIndex: 9999,
  }),
  multiValueRemove: (base: any) => ({
    ...base,
    color: isDarkMode ? "#f87171" : "#ef4444",
    "&:hover": {
      backgroundColor: isDarkMode ? "#f87171" : "#ef4444",
      color: "#ffffff",
    },
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected ? (isDarkMode ? "#374151" : "#e5e7eb") : state.isFocused ? (isDarkMode ? "#4b5563" : "#f3f4f6") : isDarkMode ? "#1f2937" : "#ffffff",
    color: isDarkMode ? "#ffffff" : "#000000",
  }),
  singleValue: (base: any) => ({
    ...base,
    color: isDarkMode ? "#ffffff" : "#000000",
  }),
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
});

const SideBarChat = (props: { idUser?: string | null; currentUser: string; currentMenu: string; onMenuChange: (menu: string) => void; member: any; idConversation: (id: string) => void; receive: (data: any) => void }) => {
  const theme = useThemeMode();
  const http = useHttp();
  const [users, setUsers] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [member, setMember] = useState<any[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, [theme]);

  const getMember = async () => {
    try {
      const response = await http.get<any>(`/v1/member/member/${props.idUser}`);
      setMember(response.data);
    } catch (error) {
      console.log(error);
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

  useEffect(() => {
    if (props.idUser && openModal) {
      getMember();
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
        <div className="mt-5 w-full flex-col gap-4">
          <div className="flex w-full gap-2">
            <div className="grid w-full cursor-pointer grid-cols-1 items-start gap-3">
              {users && users.length > 0 ? (
                users.map((user, index) => (
                  <Avatar
                    onClick={() => {
                      props.idConversation(user.idConversation ? user.idConversation : user.id);
                      props.receive({ id: user.id, name: user.name, email: user.email, role: user.role });
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

      <div className="flex flex-col items-end justify-end">
        <button onClick={() => setOpenModal(true)} type="button" className="me-2 inline-flex w-fit items-center rounded-full bg-blue-700 p-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          <FaPlus />
        </button>
        <Modal dismissible show={openModal} onClose={() => setOpenModal(false)} style={{ zIndex: 10 }} className="z-10">
          <Modal.Header>Group</Modal.Header>
          <Modal.Body>
            <form>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Name Group
                  </label>
                  <input type="text" id="name" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500" placeholder="lorem ipsum" required />
                </div>
                <div>
                  <label htmlFor="member" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Member
                  </label>
                  <Select id="member" menuPortalTarget={document.body} styles={customStyles(isDarkMode)} closeMenuOnSelect={false} components={animatedComponents} defaultValue={[colourOptions[4], colourOptions[5]]} isMulti options={colourOptions} />
                </div>
                <div></div>
              </div>
            </form>
            {/* <div className="flex flex-col gap-2">
              {member &&
                member.map((user, index) => (
                  <Avatar
                    onClick={async () => {
                      const conv: any = await addConversation({ type: props.currentMenu });
                      console.log(conv.data);
                      if (conv.data && props.idUser) {
                        await addMember(user.id, conv.data.id);
                        await addMember(props.idUser, conv.data.id);
                        props.idConversation(conv.data.id);
                      }
                      props.receive({ id: user.id, name: user.name, email: user.email, role: user.role });
                      setOpenModal(false);
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
                ))}
            </div> */}
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default SideBarChat;
