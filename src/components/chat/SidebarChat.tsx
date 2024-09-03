import React from "react";
import { TextInput, Avatar } from "flowbite-react";

const SideBarChat = () => {
  return (
    <div className="h-full border-8 border-solid border-black px-5 py-8">
      <TextInput className="mb-5 w-full" placeholder="name..." />
      <div className="flex flex-col gap-4">
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
