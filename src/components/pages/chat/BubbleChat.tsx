import React from "react";
import { MessageType } from "@/types/global";
import Image from "next/image";

interface BubbleChatProps {
  message: string;
  userName: string;
  type?: "SENDER" | "RECEIVER";
  attachment?: string;
}
const BubbleChat = (props: BubbleChatProps) => {
  const isSender = props.type ? props.type === MessageType.SENDER : false;
  const bubbleClass = isSender ? "bg-blue-100 dark:bg-blue-700" : "bg-gray-200 dark:bg-gray-700";
  const alignmentClass = isSender ? "justify-end" : "justify-start";
  const textAlignment = isSender ? "text-right" : "text-left";

  return (
    <div className={`flex w-full gap-4 pr-4 ${alignmentClass}`}>
      {!isSender && <img className="h-8 w-8 rounded-full" src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png" alt={`${props.userName} avatar`} />}
      <div className={`leading-1.5 flex min-w-44 max-w-[320px] flex-col rounded-lg border-gray-200 p-4 ${bubbleClass} ${textAlignment}`}>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">{props.userName}</span>
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">11:46</span>
        </div>
        {/* <p className="py-2.5 text-sm font-normal text-gray-900 dark:text-white">{props.message}</p> */}
        {props.attachment && props.attachment !== "[]" && props.attachment !== "" ? <Image width={100} height={100} className="mt-2 max-w-full rounded-lg" src={`https://picsum.photos/200`} alt="Attachment" /> : <p className="py-2.5 text-sm font-normal text-gray-900 dark:text-white">{props.message}</p>}
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Delivered</span>
      </div>
      {isSender && <img className="h-8 w-8 rounded-full" src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png" alt={`${props.userName} avatar`} />}
    </div>
  );
};

export default BubbleChat;
