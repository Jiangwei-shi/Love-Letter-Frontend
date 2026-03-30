import AdminGuard from '@/components/AdminGuard';
import AdminChrome from '@/components/AdminChrome';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <AdminChrome>{children}</AdminChrome>
    </AdminGuard>
  );
}
