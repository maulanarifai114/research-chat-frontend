import React from "react";
import { Avatar } from "flowbite-react";
import { IoMdPerson } from "react-icons/io";
import { FaUserGroup } from "react-icons/fa6";
import { FaTowerBroadcast } from "react-icons/fa6";

const SideBarChat = (props: { currentMenu: string; onMenuChange: (menu: string) => void }) => {
  return (
    <div className="h-full px-5 py-8">
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
      <div className="mt-5 flex flex-col gap-4">
        <div className="flex gap-2">
          <Avatar img="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png" rounded>
            <div className="space-y-1 font-medium dark:text-white">
              <div>Jese Leos</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Joined in August 2014</div>
            </div>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default SideBarChat;
