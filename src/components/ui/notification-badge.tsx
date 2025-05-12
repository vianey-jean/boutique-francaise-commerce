
import React from 'react';
import { cn } from '@/lib/utils';

interface NotificationBadgeProps {
  count: number;
  className?: string;
  maxCount?: number;
}

const NotificationBadge = ({
  count,
  className,
  maxCount = 99
}: NotificationBadgeProps) => {
  if (count <= 0) return null;
  
  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();
  
  return (
    <span
      className={cn(
        "absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-800 px-1.5 text-xs font-semibold text-white",
        className
      )}
    >
      {displayCount}
    </span>
  );
};

export default NotificationBadge;
