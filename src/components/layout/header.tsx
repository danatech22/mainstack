import { MenuIcon, MessageSquareTextIcon, BellIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router";

const navItems = [
  { icon: "/src/assets/home.svg", label: "Home", href: "/" },
  { icon: "/src/assets/analytics.svg", label: "Analytics", href: "/analytics" },
  {
    icon: "/src/assets/payments.svg",
    label: "Revenue",
    href: "/revenue",
    active: true,
  },
  { icon: "/src/assets/users.svg", label: "CRM", href: "/crm" },
  { icon: "/src/assets/apps.svg", label: "Apps", href: "/apps" },
];

export function Header() {
  return (
    <header className="sticky bg-white top-10 z-50 h-16 w-full border-2 border-white max-w-352 mx-auto my-10 rounded-[6.25rem] shadow-[0px_2px_4px_0px_rgba(45,59,67,0.05),inset_0px_2px_4px_0px_rgba(45,59,67,0.05)]">
      <nav className="w-full h-full flex items-center justify-between px-5">
        <NavLink to="/" className="shrink-0">
          <img
            src="/src/assets/mainstack-logo.svg"
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
            <BellIcon className="size-5 text-[#56616B] " />
          </Button>
          <Button variant="ghost" size="icon-lg">
            <MessageSquareTextIcon className="size-5 text-[#56616B] " />
          </Button>
          <div className="flex items-center justify-around rounded-2xl bg-[#EFF1F6] h-10 w-20">
            <Avatar>
              <AvatarFallback className="text-sm bg-gray-900 text-white">
                OJ
              </AvatarFallback>
            </Avatar>
            <MenuIcon className="text-[#56616B] size-4" />
          </div>
        </div>
      </nav>
    </header>
  );
}
