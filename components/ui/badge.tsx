import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary ring-primary/20',
        secondary: 'bg-secondary text-secondary-foreground ring-border',
        destructive: 'bg-destructive/10 text-destructive ring-destructive/20',
        outline: 'text-foreground ring-border bg-transparent',
        success: 'bg-emerald-400/10 text-emerald-400 ring-emerald-400/20',
        warning: 'bg-yellow-400/10 text-yellow-400 ring-yellow-400/20',
        accent: 'bg-accent/10 text-accent ring-accent/20',
        muted: 'bg-muted text-muted-foreground ring-border',
        purple: 'bg-violet-400/10 text-violet-400 ring-violet-400/20',
        blue: 'bg-blue-400/10 text-blue-400 ring-blue-400/20',
        pink: 'bg-pink-400/10 text-pink-400 ring-pink-400/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
