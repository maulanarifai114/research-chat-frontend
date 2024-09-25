import SelectComponent from "@/components/base/Select";
import { Button, Modal } from "flowbite-react";
import React from "react";

interface ModalBodyBroadcastsProps {
  isDarkMode: boolean;
  optionAdmin: any[];
  setNameConversation: (e: string) => void;
  handleChangeSelect: (selected: any) => void;
}

const ModalBodyBroadcast = (props: ModalBodyBroadcastsProps) => {
  return (
    <>
      <Modal.Body>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Name Broadcast
            </label>
            <input onChange={(e) => props.setNameConversation(e.target.value)} type="text" id="name" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500" placeholder="lorem ipsum" required />
          </div>
          <div>
            <label htmlFor="member" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Admin
            </label>
            <SelectComponent id="member" isDarkMode={props.isDarkMode} optionMember={props.optionAdmin} onChange={props.handleChangeSelect} />
          </div>
          <div></div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex w-full items-center justify-end">
          <Button type="submit">Submit</Button>
        </div>
      </Modal.Footer>
    </>
  );
};

export default ModalBodyBroadcast;
