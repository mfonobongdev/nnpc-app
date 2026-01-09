"use client";

import HomeIcon from "@/app/assets/home-icon";
import SidebarLink from "./sidebar-link";

export default function Sidebar() {
  return (
    <div className="w-56 h-screen bg-[#fbfcfd] border-r border-gray-100 pt-10 px-2">
      Sidebar
      <SidebarLink label="Home" icon={<HomeIcon />} href="/" badgeCount={10} />
      <SidebarLink
        label="Orders"
        icon={<HomeIcon />}
        href="/home"
        badgeCount={5}
      />
      <SidebarLink
        label="TopUp"
        icon={<HomeIcon />}
        href="/topup"
        badgeCount={5}
      />
    </div>
  );
}
