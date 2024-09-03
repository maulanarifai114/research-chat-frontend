import React from "react";

interface BubbleChatProps {
  message: string;
  userName: string;
}
const BubbleChat = (props: BubbleChatProps) => {
  return (
    <div className={`flex w-fit flex-row-reverse gap-4`}>
      <img className="h-8 w-8 rounded-full" src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png" alt="Jese image" />
      <div className="leading-1.5 flex w-full max-w-[320px] flex-col rounded-lg border-gray-200 bg-gray-100 p-4 dark:bg-gray-700">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">Bonnie Green</span>
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">11:46</span>
        </div>
        <p className="py-2.5 text-sm font-normal text-gray-900 dark:text-white">{props.message}</p>
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Delivered</span>
      </div>
    </div>
  );
};

export default BubbleChat;
