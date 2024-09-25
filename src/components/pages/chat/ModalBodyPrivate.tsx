import { TabsMenu } from "@/types/global";
import { Avatar, Modal } from "flowbite-react";
import React from "react";

interface ModalBodyPrivateProps {
  member: any[];
  idUser: string | null | undefined;
  currentUser: string | null | undefined;
  currentMenu: TabsMenu;
  addConversation: (params: { type: string; name?: string }) => void;
  addMember: (idUser: string, idConversation: string) => void;
  idConversation: (id: string) => void;
  receive: (params: { id: string; name: string; role: string; email: string }) => void;
  setOpenModal: (openModal: boolean) => void;
}

const ModalBodyPrivate = (props: ModalBodyPrivateProps) => {
  return (
    <Modal.Body>
      <div className="flex flex-col gap-2">
        {props.member &&
          props.member.map((user, index) => (
            <Avatar
              onClick={async () => {
                const conv: any = await props.addConversation({
                  type: props.currentMenu,
                });
                console.log(conv.data);
                if (conv.data && props.idUser) {
                  await props.addMember(user.id, conv.data.id);
                  await props.addMember(props.idUser, conv.data.id);
                  props.idConversation(conv.data.id);
                }
                props.receive({
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  role: user.role,
                });
                props.setOpenModal(false);
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
      </div>
    </Modal.Body>
  );
};

export default ModalBodyPrivate;
