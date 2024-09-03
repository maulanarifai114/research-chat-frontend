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
