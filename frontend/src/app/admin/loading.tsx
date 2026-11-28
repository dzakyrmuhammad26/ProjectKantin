import { AdminDashboardSkeleton } from '@/components/loading/LoadingSkeletons';

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="h-[64px] bg-white border-b border-[#E5E7EB]" />
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-6">
        <AdminDashboardSkeleton />
      </div>
    </div>
  );
}
