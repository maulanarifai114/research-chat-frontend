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

      <button data-modal-target="default-modal" data-modal-toggle="default-modal" className="block rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
        Toggle modal
      </button>

      <div id="default-modal" tabIndex={-1} aria-hidden="true" className="fixed left-0 right-0 top-0 z-50 hidden h-[calc(100%-1rem)] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0">
        <div className="relative max-h-full w-full max-w-2xl p-4">
          <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
            <div className="flex items-center justify-between rounded-t border-b p-4 dark:border-gray-600 md:p-5">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Terms of Service</h3>
              <button type="button" className="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                <svg className="h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="space-y-4 p-4 md:p-5">
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">With less than a month to go before the European Union enacts new consumer privacy laws for its citizens, companies around the world are updating their terms of service agreements to comply.</p>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as possible of high-risk data breaches that could personally affect them.</p>
            </div>
            <div className="flex items-center rounded-b border-t border-gray-200 p-4 dark:border-gray-600 md:p-5">
              <button data-modal-hide="default-modal" type="button" className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                I accept
              </button>
              <button data-modal-hide="default-modal" type="button" className="ms-3 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBarChat;
