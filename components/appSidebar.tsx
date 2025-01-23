import { Command } from "lucide-react";
import { NavMain } from "@/components/navMain";
import { NavProjects } from "@/components/navProjects";
import { NavSecondary } from "@/components/navSecondary";
import { NavUser } from "@/components/navUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";

export async function AppSidebar({...props }) {
  
  const session = await auth();
  
  
  // Extract only plain data
  const user = session?.user ? {
    name: session.user.name || "",
    email: session.user.email || "",
    image: session.user.image || "",
  } : null;

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavProjects />
        <NavSecondary className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {/* Pass only plain data */}
        {user && <NavUser user={user} />}
      </SidebarFooter>
    </Sidebar>
  );
}