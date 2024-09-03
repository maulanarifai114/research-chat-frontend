import { Profile } from "@/types/global";
import { atom } from "recoil";

export const profileState = atom<Profile | null>({
  key: "profileState",
  default: null,
});
