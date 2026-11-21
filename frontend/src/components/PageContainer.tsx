import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <main className={`max-w-[1280px] mx-auto px-6 pt-6 pb-12 w-full ${className}`}>
      {children}
    </main>
  );
}

export default PageContainer;
