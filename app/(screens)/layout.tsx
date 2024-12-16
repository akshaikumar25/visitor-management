import AppSidebar from "@/components/common/SideBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <AppSidebar>{children}</AppSidebar>
    </main>
  );
}
