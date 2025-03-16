import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { AppSidebar } from "./dashboard/app-sidebar";

type SidebarLayoutProps = {
  children: React.ReactNode;
};

const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="m-2 w-full">
        <div className="flex items-center gap-2 rounded-md border border-sidebar bg-sidebar shadow">
          {/* <SearchBar/> */}
          <div className="ml-auto"></div>
          {/* <UserButton/> */}
          <div className="h-10 w-10 mb-1 rounded-full bg-gray-400"></div>
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
