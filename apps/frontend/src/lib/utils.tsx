// ── cn ────────────────────────────────────────────────────────────────────────
type ClassValue = string | undefined | null | false;
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}

// ── Card ─────────────────────────────────────────────────────────────────────
import { HTMLAttributes } from 'react';

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'bg-gradient-to-br from-[#201808] to-[#140f05] border border-[#3a2d10] rounded-[20px]',
        'shadow-[0_4px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(201,168,76,0.15)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ size = 24 }: { size?: number }) {
  return (
    <svg
      className="animate-spin text-gold-dim"
      width={size} height={size}
      viewBox="0 0 24 24" fill="none"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

// ── Input ─────────────────────────────────────────────────────────────────────
import { InputHTMLAttributes, forwardRef } from 'react';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.2)] rounded-xl',
        'px-4 py-3 text-[#f0e6cc] placeholder-[#9a8a6a] outline-none font-raleway text-sm',
        'focus:border-gold-dim focus:shadow-[0_0_0_2px_rgba(201,168,76,0.15)]',
        'transition-all duration-200',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
