import { AuthProvider } from "@/context/AuthContext";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/shared/Header";
import { Footer } from "@/shared/Footer";
import { AppSidebar } from "@/components/app-sidebar";
import { AuthGuard } from "@/modules/auth/AuthGuard";

const DashboardContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <div className="min-h-screen flex flex-col">
            <div className="flex-1 space-y-4 p-4 pt-6 md:p-8 h-full">
              {children}
            </div>
          </div>
          <Footer />
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <DashboardContent>{children}</DashboardContent>
    </AuthProvider>
  );
};

export default Layout;
