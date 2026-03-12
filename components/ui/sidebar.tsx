import { PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';

export function Sidebar({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <aside className={cn('bg-background p-4', className)}>{children}</aside>;
}
