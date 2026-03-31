import AdminGuard from '@/admin/AdminGuard';
import AdminChrome from '@/admin/AdminChrome';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <AdminChrome>{children}</AdminChrome>
    </AdminGuard>
  );
}
