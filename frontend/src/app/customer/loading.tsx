import { PageContainer } from '@/components/PageContainer';
import { CustomerMenuSkeleton } from '@/components/loading/LoadingSkeletons';

export default function CustomerLoading() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="h-[64px] bg-white border-b border-[#E5E7EB]" />
      <PageContainer>
        <CustomerMenuSkeleton />
      </PageContainer>
    </div>
  );
}
