import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { AppSidebar } from "./dashboard/app-sidebar";
import { auth } from "@/server/auth";

type SidebarLayoutProps = {
  children: React.ReactNode;
};

const SidebarLayout = async({ children }: SidebarLayoutProps) => {
  
  const session = await auth();

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="m-2 w-full">
        <div className="flex items-center gap-2 rounded-md border border-sidebar bg-sidebar shadow">
        <SidebarTrigger/>
          {/* <SearchBar/> */}
          <div className="ml-auto"></div>
          {/* <UserButton/> */}
          <div className="h-10 w-10 mb-1 rounded-full bg-gray-400">
           <img className="rounded-full" src={`${session?.user.image}`} alt="user profile"/> 
            </div>
        </div>
        <div className="h-4"></div>
        {/* main content */}
        <div className="h-[calc(100vh-5rem)] overflow-y-scroll rounded-md border border-sidebar-border bg-sidebar p-4 shadow">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
};

export default SidebarLayout;
