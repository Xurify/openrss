"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  DownloadIcon,
  SettingsIcon,
  HeartIcon,
  LucideIcon,
} from "lucide-react";

interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
}

const mainNavItems: NavItem[] = [
  { href: "/", icon: HomeIcon, label: "Home" },
  { href: "/favorites", icon: HeartIcon, label: "Favorites" },
  { href: "/downloads", icon: DownloadIcon, label: "Downloads" },
];

const NavLink = ({ href, icon: Icon, label, isActive }: NavItem & { isActive: boolean }) => (
  <Link 
    href={href}
    className="flex flex-col items-center gap-1 p-3 hover:text-theme-main rounded-lg transition-colors"
  >
    <Icon 
      size={28} 
      className={isActive ? "text-orange-500" : ""}
    />
    <span className="text-xs font-medium">{label}</span>
  </Link>
);

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="border-r-2 border-black p-2 w-24 h-full flex flex-col">
      <div className="flex flex-col items-center space-y-8 flex-1 pt-8">
        {mainNavItems.map((item) => (
          <NavLink 
            key={item.href}
            {...item}
            isActive={pathname === item.href}
          />
        ))}
      </div>
      <div className="flex flex-col items-center pb-4">
        <NavLink 
          href="/settings"
          icon={SettingsIcon}
          label="Settings"
          isActive={pathname === "/settings"}
        />
      </div>
    </div>
  );
};
