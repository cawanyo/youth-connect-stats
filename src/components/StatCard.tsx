import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: { value: number; label: string };
  className?: string;
  variant?: 'default' | 'primary' | 'accent';
}

export function StatCard({ title, value, icon, trend, className, variant = 'default' }: StatCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md animate-fade-in",
        variant === 'primary' && "gradient-primary border-transparent text-primary-foreground",
        variant === 'accent' && "gradient-accent border-transparent text-accent-foreground",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className={cn(
            "text-sm font-medium",
            variant === 'default' ? "text-muted-foreground" : "opacity-90"
          )}>
            {title}
          </p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {trend && (
            <p className={cn(
              "text-xs font-medium",
              variant === 'default' ? "text-muted-foreground" : "opacity-80"
            )}>
              <span className={trend.value >= 0 ? "text-success" : "text-destructive"}>
                {trend.value >= 0 ? '+' : ''}{trend.value}%
              </span>
              {' '}{trend.label}
            </p>
          )}
        </div>
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-lg",
          variant === 'default' ? "bg-secondary text-primary" : "bg-primary-foreground/20"
        )}>
          {icon}
        </div>
      </div>
      
      {/* Decorative element */}
      <div className={cn(
        "absolute -right-4 -bottom-4 h-24 w-24 rounded-full opacity-10",
        variant === 'default' ? "bg-primary" : "bg-primary-foreground"
      )} />
    </div>
  );
}
