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
  RocketIcon,
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
<SidebarHeader className="font-bold text-4xl flex flex-row items-center gap-2">
  <RocketIcon className="w-8 h-8 text-black" /> 
  <span className="bg-gradient-to-r from-gray-300 to-black text-transparent bg-clip-text">
    {open ? "Raptor.ai" : "R"}
  </span>
</SidebarHeader>

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
                      className={`${pathname === item.url ? "bg-primary text-primary-foreground" : ""}`}
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
                          "flex size-6 items-center justify-center rounded-sm border bg-primary-foreground text-sm text-primary",
                          {
                            "bg-primary text-primary-foreground border border-red-400": project.id === projectId,
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
