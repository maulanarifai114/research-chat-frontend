"use client";

import { Sidebar } from "flowbite-react";
import { HiChartPie, HiInbox, HiUser, HiBookOpen } from "react-icons/hi";

const SidebarMenu = () => {
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
          <Sidebar.Item href="#" icon={HiUser}>
            Users
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default SidebarMenu;
