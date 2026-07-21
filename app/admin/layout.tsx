import { Navbar } from "@/components/navbar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata = { title: "Admin" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="max-w-[1240px] mx-auto px-6 md:px-8 py-10 grid md:grid-cols-[220px_1fr] gap-10">
        <AdminSidebar />
        <div>{children}</div>
      </div>
    </>
  );
}
