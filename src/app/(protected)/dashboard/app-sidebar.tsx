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
import useProject from "@/hooks/use-project";
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
  const {projects, projectId, setProjectId} = useProject()
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
             {projects?.map(project => {
              return(
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                  <div onClick={()=>setProjectId(project.id)}>
                      <div
                        className={cn(
                          "flex size-6 items-center justify-center rounded-sm border bg-white text-sm text-primary",
                          {
                            "bg-primary text-white": project.id === projectId,
                          },
                        )}
                        // First charcter of the name
                      >
                        {project.name[0]}
                      </div>
                      <span> {project.name}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
             })}
             
             
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
