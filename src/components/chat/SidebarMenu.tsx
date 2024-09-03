"use client";

import { clearAuth } from "@/utils/clear-auth";
import { Sidebar } from "flowbite-react";
import { useRouter } from "next/router";
import { HiChartPie, HiInbox, HiBookOpen } from "react-icons/hi";
import { RiLogoutCircleRLine } from "react-icons/ri";

const SidebarMenu = () => {
  const handleLogout = () => {
    clearAuth();
    window.location.href = "/auth";
  };
  return (
    <Sidebar aria-label="Default sidebar example" className="w-full">
      <Sidebar.Items>
        <Sidebar.Logo href="#" img="https://img.freepik.com/free-vector/gradient-logo_23-2148149233.jpg?w=740&t=st=1725079665~exp=1725080265~hmac=025e7ce8596b2aae31404cad60a4b134063466cca9c9f36f7ac15043d32a939b" imgAlt="Flowbite logo">
          Flowbite
        </Sidebar.Logo>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="#" icon={HiChartPie}>
            Dashboard
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiBookOpen}>
            Course
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiInbox}>
            Chat
          </Sidebar.Item>
          <Sidebar.Item as="button" icon={RiLogoutCircleRLine} onClick={handleLogout}>
            Logout
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default SidebarMenu;
