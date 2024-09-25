export interface Profile {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface ProfileDto {
  email: string;
  password: string;
}

export interface MessageDto {
  message: string;
  attachment: string;
  idConversation: string;
  idUser: string;
}

export interface Message {
  id: string;
  message: string;
  attachment: string;
  dateCreated?: Date;
  dateUpdate?: Date;
  member?: Member;
}

export type TabsMenu = "PRIVATE" | "GROUP" | "BROADCAST";

export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  idConversation?: string;
  isAllowed?: boolean;
}

export enum Roles {
  SUPERADMIN = "SUPERADMIN",
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
  MENTOR = "MENTOR",
}

export enum MessageType {
  SENDER = "SENDER",
  RECEIVER = "RECEIVER",
}
