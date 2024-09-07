import React, { useEffect, useState } from "react";
import { Avatar } from "flowbite-react";
import { IoMdPerson } from "react-icons/io";
import { FaUserGroup } from "react-icons/fa6";
import { FaTowerBroadcast } from "react-icons/fa6";

const SideBarChat = (props: { currentUser: string; currentMenu: string; onMenuChange: (menu: string) => void; member: any; idConversation: (id: string) => void; receive: (data: any) => void }) => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (props.member) {
      if (props.currentMenu === "private") {
        setUsers(props.member.privateMember);
      }
      if (props.currentMenu === "group") {
        setUsers(props.member.groupMember);
      }
      if (props.currentMenu === "broadcast") {
        setUsers(props.member.broadcastMember);
      }
    }
  }, [props.currentMenu, props.member]);

  return (
    <div className="h-full w-full rounded-lg bg-gray-200 px-5 py-8 dark:bg-gray-800">
      <div className="flex justify-between">
        <div onClick={() => props.onMenuChange("private")} className={`cursor-pointer rounded-t-md p-3 text-2xl hover:bg-gray-200 dark:hover:bg-gray-800 ${props.currentMenu === "private" ? "border-b-2 border-blue-700 text-blue-700" : "text-gray-400 dark:text-gray-700"}`}>
          <IoMdPerson />
        </div>
        <div onClick={() => props.onMenuChange("group")} className={`cursor-pointer rounded-t-md p-3 text-2xl hover:bg-gray-200 dark:hover:bg-gray-800 ${props.currentMenu === "group" ? "border-b-2 border-blue-700 text-blue-700" : "text-gray-400 dark:text-gray-700"}`}>
          <FaUserGroup />
        </div>
        <div onClick={() => props.onMenuChange("broadcast")} className={`cursor-pointer rounded-t-md p-3 text-2xl hover:bg-gray-200 dark:hover:bg-gray-800 ${props.currentMenu === "broadcast" ? "border-b-2 border-blue-700 text-blue-700" : "text-gray-400 dark:text-gray-700"}`}>
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
                    props.idConversation(user.idConversation);
                    props.receive({ id: user.id, name: user.name, email: user.email, role: user.role });
                  }}
                  className={`justify-start rounded-md p-2 hover:bg-gray-300 dark:hover:bg-gray-900 ${props.currentUser === user.id ? "bg-gray-300 dark:bg-gray-900" : ""}`}
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
  );
};

export default SideBarChat;
