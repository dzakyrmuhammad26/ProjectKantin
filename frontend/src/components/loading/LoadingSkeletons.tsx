'use client';

import React from 'react';
import { motion } from 'framer-motion';

function SkeletonBlock({
  className = '',
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      animate={{ opacity: [0.45, 0.9, 0.45] }}
      transition={{
        duration: 1.35,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      className={`rounded-lg bg-slate-200/80 ${className}`}
    />
  );
}

export function CustomerMenuSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
    >
      <div className="col-span-1 lg:col-span-8 space-y-5 sm:space-y-6">
        <SkeletonBlock className="h-11 w-full rounded-xl" />
        <div className="flex gap-2 overflow-hidden">
          {[0, 1, 2, 3, 4].map((i) => (
            <SkeletonBlock key={i} delay={i * 0.08} className="h-9 w-28 shrink-0 rounded-lg" />
          ))}
        </div>

        {[0, 1].map((sec) => (
          <div key={sec} className="space-y-3">
            <SkeletonBlock className="h-5 w-44" />
            <div className="grid grid-cols-3 sm:grid-cols-2 gap-2 sm:gap-4">
              {[0, 1, 2, 3].map((card) => (
                <div
                  key={card}
                  className="bg-white rounded-[12px] p-2 sm:p-3 border border-line flex flex-col sm:flex-row gap-2 sm:gap-3"
                >
                  <SkeletonBlock
                    delay={(sec * 4 + card) * 0.05}
                    className="w-full sm:w-[104px] aspect-square sm:h-[104px] shrink-0"
                  />
                  <div className="flex-1 space-y-2 py-1">
                    <SkeletonBlock className="h-4 w-3/4" />
                    <SkeletonBlock className="h-3 w-1/3" />
                    <div className="pt-4 flex justify-between items-center">
                      <SkeletonBlock className="h-4 w-16" />
                      <SkeletonBlock className="h-8 w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="hidden lg:block lg:col-span-4">
        <div className="rounded-[12px] border border-line bg-white p-5 space-y-4">
          <SkeletonBlock className="h-6 w-40" />
          <SkeletonBlock className="h-3 w-52" />
          <div className="space-y-3 py-4 border-y border-line">
            <SkeletonBlock className="h-12 w-full" />
            <SkeletonBlock delay={0.1} className="h-12 w-full" />
          </div>
          <SkeletonBlock className="h-16 w-full" />
          <SkeletonBlock className="h-12 w-full" />
        </div>
      </div>
    </motion.div>
  );
}

export function CustomerSummarySkeleton() {
  return (
    <div className="max-w-[588px] mx-auto bg-white rounded-xl border border-line p-6 space-y-5">
      <div className="flex justify-between items-start border-b border-line pb-4">
        <div className="space-y-2">
          <SkeletonBlock className="h-6 w-44" />
          <SkeletonBlock className="h-4 w-32" />
        </div>
        <SkeletonBlock className="h-8 w-24" />
      </div>
      <div className="space-y-3">
        <SkeletonBlock className="h-24 w-full" />
        <SkeletonBlock delay={0.1} className="h-24 w-full" />
      </div>
      <SkeletonBlock className="h-20 w-full" />
      <SkeletonBlock className="h-12 w-full" />
    </div>
  );
}

export function CashierWorkspaceSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-6 items-start">
      <div className="col-span-12 lg:col-span-5 rounded-[12px] border border-line bg-white p-4 space-y-3">
        <SkeletonBlock className="h-10 w-full" />
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <SkeletonBlock key={i} delay={i * 0.08} className="h-8 w-24" />
          ))}
        </div>
        <div className="space-y-2 pt-2">
          {[0, 1, 2, 3].map((i) => (
            <SkeletonBlock key={i} delay={i * 0.1} className="h-24 w-full" />
          ))}
        </div>
      </div>

      <div className="col-span-12 lg:col-span-7 rounded-[12px] border border-line bg-white p-6 space-y-5">
        <div className="flex justify-between border-b border-line pb-4">
          <SkeletonBlock className="h-8 w-44" />
          <SkeletonBlock className="h-8 w-32" />
        </div>
        <SkeletonBlock className="h-40 w-full" />
        <SkeletonBlock delay={0.1} className="h-48 w-full" />
      </div>
    </div>
  );
}

export function StallQueueSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[0, 1, 2].map((col) => (
        <div
          key={col}
          className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden min-h-[460px] flex flex-col"
        >
          <div className="p-3.5 border-b border-[#E5E7EB] bg-[#F9FAFB] flex justify-between">
            <SkeletonBlock className="h-5 w-32" />
            <SkeletonBlock className="h-5 w-8 rounded-full" />
          </div>
          <div className="p-3 space-y-3">
            {[0, 1, 2].map((card) => (
              <SkeletonBlock
                key={card}
                delay={(col * 3 + card) * 0.08}
                className="h-32 w-full"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CardGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="space-y-5">
      <div className="bg-white p-3.5 rounded-xl border border-[#E5E7EB] flex justify-between gap-3">
        <SkeletonBlock className="h-9 w-64" />
        <SkeletonBlock className="h-9 w-48" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden p-3.5 space-y-3"
          >
            <SkeletonBlock delay={idx * 0.05} className="aspect-video w-full" />
            <SkeletonBlock className="h-4 w-3/4" />
            <SkeletonBlock className="h-4 w-1/2" />
            <SkeletonBlock className="h-8 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="p-4 bg-white rounded-xl border border-[#E5E7EB] space-y-2">
            <SkeletonBlock delay={i * 0.08} className="h-3.5 w-28" />
            <SkeletonBlock delay={i * 0.08} className="h-7 w-36" />
            <SkeletonBlock delay={i * 0.08} className="h-3 w-24" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 space-y-3">
        <SkeletonBlock className="h-5 w-48" />
        {[0, 1, 2, 3].map((r) => (
          <SkeletonBlock key={r} delay={r * 0.08} className="h-11 w-full" />
        ))}
      </div>
    </div>
  );
}

export function AdminTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-5">
      <div className="bg-white p-3.5 rounded-xl border border-[#E5E7EB] flex justify-between gap-3">
        <SkeletonBlock className="h-9 w-64" />
        <SkeletonBlock className="h-9 w-40" />
      </div>
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 space-y-3">
        <SkeletonBlock className="h-9 w-full bg-slate-100" />
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonBlock key={i} delay={i * 0.06} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}

export function AdminFormSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-1.5">
          <SkeletonBlock delay={i * 0.06} className="h-4 w-36" />
          <SkeletonBlock delay={i * 0.06} className="h-10 w-full" />
        </div>
      ))}
      <div className="flex justify-end pt-3">
        <SkeletonBlock className="h-10 w-40" />
      </div>
    </div>
  );
}
