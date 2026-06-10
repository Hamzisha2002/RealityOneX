import { cn } from '@/lib/utils';

interface R1XLogoProps {
  compact?: boolean;
  className?: string;
}

export const R1XLogo = ({ compact = false, className }: R1XLogoProps) => (
  <div className={cn('flex items-center gap-3', className)}>
    <div className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-2xl border border-primary/40 bg-background/80 shadow-[0_0_35px_rgba(45,212,191,0.22)]">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/35 via-secondary/20 to-accent/30" />
      <div className="absolute -left-5 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full bg-primary/30 blur-xl" />
      <span className="relative font-display text-[1.05rem] font-black tracking-[-0.12em] text-foreground drop-shadow-[0_0_10px_rgba(45,212,191,0.95)]">
        R1X
      </span>
    </div>
    {!compact && (
      <div className="flex flex-col leading-none">
        <span className="font-display text-lg font-black tracking-tight gradient-text-primary">
          RealityOneX
        </span>
        <span className="mt-1 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          Next Gen Ownership
        </span>
      </div>
    )}
  </div>
);
