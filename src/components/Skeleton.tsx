import React from "react";

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: boolean;
}

export function Skeleton({ className = "", width, height, rounded = false }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-on-surface/10 ${rounded ? "rounded-full" : ""} ${className}`}
      style={{ width, height }}
    />
  );
}

export function ArtifactCardSkeleton() {
  return (
    <div className="notched-card p-4 bg-surface border border-on-surface/15 flex flex-col justify-between">
      <div className="space-y-4">
        <div className="relative aspect-square bg-surface-container-high overflow-hidden notched-card border-none">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-2.5 w-16" />
          <Skeleton className="h-5 w-3/4" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
      <div className="mt-6 pt-3 border-t border-on-surface/5 flex justify-between items-center">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

export function LeaderboardRowSkeleton() {
  return (
    <div className="notched-card p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-on-surface/15 bg-surface">
      <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left flex-grow">
        <Skeleton className="w-10 h-10 rounded-full" rounded />
        <Skeleton className="w-16 h-16 rounded-full" rounded />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8 text-center md:text-right min-w-[170px]">
        <div className="space-y-1">
          <Skeleton className="h-6 w-16 mx-auto md:ml-auto md:mr-0" />
          <Skeleton className="h-2 w-20 mx-auto md:ml-auto md:mr-0" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-6 w-16 mx-auto md:ml-auto md:mr-0" />
          <Skeleton className="h-2 w-20 mx-auto md:ml-auto md:mr-0" />
        </div>
      </div>
      <Skeleton className="h-8 w-20" />
    </div>
  );
}
