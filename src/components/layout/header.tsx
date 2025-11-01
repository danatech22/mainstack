import {
  MenuIcon,
  MessageSquareTextIcon,
  BellIcon,
  Settings,
  Receipt,
  Gift,
  Grid2x2,
  Bug,
  UserRoundSearch,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router";
import { useUser } from "@/api/hooks";

import homeIcon from "/src/assets/home.svg";
import analyticsIcon from "/src/assets/analytics.svg";
import paymentsIcon from "/src/assets/payments.svg";
import usersIcon from "/src/assets/users.svg";
import appsIcon from "/src/assets/apps.svg";
import logoIcon from "/src/assets/mainstack-logo.svg";

const navItems = [
  { icon: homeIcon, label: "Home", href: "/" },
  { icon: analyticsIcon, label: "Analytics", href: "/analytics" },
  {
    icon: paymentsIcon,
    label: "Revenue",
    href: "/revenue",
    active: true,
  },
  { icon: usersIcon, label: "CRM", href: "/crm" },
  { icon: appsIcon, label: "Apps", href: "/apps" },
];

// Helper function to get initials
const getInitials = (firstName?: string, lastName?: string) => {
  const first = firstName?.charAt(0).toUpperCase() || "";
  const last = lastName?.charAt(0).toUpperCase() || "";
  return first + last || "U";
};

export function Header() {
  const { data } = useUser();
  const initials = getInitials(data?.first_name, data?.last_name);

  return (
    <header className="sticky bg-white top-10 z-50 h-16 w-full border-2 border-white max-w-352 mx-auto my-10 rounded-[6.25rem] shadow-[0px_2px_4px_0px_rgba(45,59,67,0.05),inset_0px_2px_4px_0px_rgba(45,59,67,0.05)]">
      <nav className="w-full h-full flex items-center justify-between px-5">
        <NavLink to="/" className="shrink-0">
          <img
            src={logoIcon}
            className="size-9 object-contain"
            alt="mainstack logo"
          />
        </NavLink>
        <ul className="flex items-center gap-5 text-[#56616B] font-semibold tracking-tighter">
          {navItems.map((item) => (
            <li key={item.href}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 py-2 px-4 rounded-full transition-colors",
                    isActive
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "hover:bg-gray-100 text-[#56616B]"
                  )
                }
              >
                <img
                  src={item.icon}
                  className="size-5 object-contain shrink-0"
                  alt={`${item.label} icon`}
                />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon-lg">
            <BellIcon className="size-5 text-[#56616B]" />
          </Button>
          <Button variant="ghost" size="icon-lg">
            <MessageSquareTextIcon className="size-5 text-[#56616B]" />
          </Button>
          <div className="flex items-center justify-around rounded-2xl bg-[#EFF1F6] h-10 w-20">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-sm bg-gray-900 text-white font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MenuIcon className="text-[#56616B] size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-90 p-4 mt-2 rounded-3xl"
              >
                {/* User Info Section */}
                <div className="flex items-center gap-3 px-2 py-3">
                  <Avatar className="size-9">
                    <AvatarFallback className="text-base bg-[#131316] text-white font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold tracking-tight text-[#131316]">
                      {data?.first_name} {data?.last_name}
                    </span>
                    <span className="text-xs text-[#56616B]">
                      {data?.email}
                    </span>
                  </div>
                </div>

                {/* Menu Items */}
                <DropdownMenuItem className="px-2 py-3 cursor-pointer rounded-xl">
                  <Settings className="mr-3 h-5 w-5 text-[#56616B]" />
                  <span className="text-sm font-semibold tracking-tight">
                    Settings
                  </span>
                </DropdownMenuItem>

                <DropdownMenuItem className="px-2 py-3 cursor-pointer rounded-xl">
                  <Receipt className="mr-3 h-5 w-5 text-[#56616B]" />
                  <span className="text-sm font-semibold tracking-tight">
                    Purchase History
                  </span>
                </DropdownMenuItem>

                <DropdownMenuItem className="px-2 py-3 cursor-pointer rounded-xl">
                  <Gift className="mr-3 h-5 w-5 text-[#56616B]" />
                  <span className="text-sm font-semibold tracking-tight">
                    Refer and Earn
                  </span>
                </DropdownMenuItem>

                <DropdownMenuItem className="px-2 py-3 cursor-pointer rounded-xl">
                  <Grid2x2 className="mr-3 h-5 w-5 text-[#56616B]" />
                  <span className="text-sm font-semibold tracking-tight">
                    Integrations
                  </span>
                </DropdownMenuItem>

                <DropdownMenuItem className="px-2 py-3 cursor-pointer rounded-xl">
                  <Bug className="mr-3 h-5 w-5 text-[#56616B]" />
                  <span className="text-sm font-semibold tracking-tight">
                    Report Bug
                  </span>
                </DropdownMenuItem>

                <DropdownMenuItem className="px-2 py-3 cursor-pointer rounded-xl">
                  <UserRoundSearch className="mr-3 h-5 w-5 text-[#56616B]" />
                  <span className="text-sm font-semibold tracking-tight">
                    Switch Account
                  </span>
                </DropdownMenuItem>

                <DropdownMenuItem className="px-2 py-3 cursor-pointer rounded-xl">
                  <LogOut className="mr-3 h-5 w-5 text-[#56616B]" />
                  <span className="text-sm font-semibold tracking-tight">
                    Sign Out
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </header>
  );
}
