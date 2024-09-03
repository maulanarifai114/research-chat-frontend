"use client";

import { RecoilRoot } from "recoil";

export const RecoilContextProvider = ({ children }: { children: React.ReactNode }) => {
  return <RecoilRoot>{children}</RecoilRoot>;
};
