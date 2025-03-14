"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Bot,
  CreditCard,
  Home,
  LucideIcon,
  Plus,
  Presentation,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items: Array<{
  icon: LucideIcon;
  label: string;
  url: string;
}> = [
  {
    label: "Dashboard",
    icon: Home,
    url: "/dashboard",
  },
  {
    label: "Q&A",
    icon: Bot,
    url: "/qna",
  },
  {
    label: "Meetings",
    icon: Presentation,
    url: "meetings",
  },
  {
    label: "Billing",
    icon: CreditCard,
    url: "/billing",
  },
];
export function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>Logo</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url ?? "#"}
                      className={`${pathname === item.url ? "bg-primary text-white" : ""}`}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Your Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <div>
                      <div
                        className={cn(
                          "flex size-6 items-center justify-center rounded-sm border bg-white text-sm text-primary",
                          {
                            "bg-primary text-white": true,
                          },
                        )}
                        // First charcter of the name
                      >
                        P
                      </div>
                      <span> Project-1</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenuItem>
              <SidebarMenuButton asChild>
                <div>
                  <div
                    className={cn(
                      "flex size-6 items-center justify-center rounded-sm border bg-white text-sm text-primary",
                      {
                        "bg-primary text-white": false,
                      },
                    )}
                    // First charcter of the name
                  >
                    P
                  </div>
                  <span> Project-3</span>
                </div>
              </SidebarMenuButton>
              <SidebarMenuButton asChild>
                <div>
                  <div
                    className={cn(
                      "flex size-6 items-center justify-center rounded-sm border bg-white text-sm text-primary",
                      {
                        "bg-primary text-white": false,
                      },
                    )}
                    // First charcter of the name
                  >
                    P
                  </div>
                  <span> Project-2</span>
                </div>
              </SidebarMenuButton>
              <div className="h-2"></div>
            {open &&  <SidebarMenuItem>
                <Link href={"/create"}>
                  <Button variant={"outline"} className="w-full">
                    <Plus />
                    Create Project
                  </Button>
                </Link>
              </SidebarMenuItem>}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
