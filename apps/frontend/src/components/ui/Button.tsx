import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'ghost' | 'outline' | 'danger' | 'success';
  size?:    'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'gold', size = 'md', className, children, ...props }, ref) => {
    const base = 'font-cinzel tracking-widest uppercase rounded-full border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed';
    const sizes = {
      sm:  'text-xs px-4 py-2',
      md:  'text-xs px-6 py-3',
      lg:  'text-sm px-10 py-4',
    };
    const variants = {
      gold:    'bg-gradient-to-br from-[#2a1f08] to-[#3a2c0e] border-gold-dim text-gold-light hover:border-gold hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] hover:-translate-y-px',
      ghost:   'bg-transparent border-transparent text-[#9a8a6a] hover:text-gold-light',
      outline: 'bg-transparent border-[rgba(201,168,76,0.2)] text-[#9a8a6a] hover:border-gold-dim hover:text-gold',
      danger:  'bg-[rgba(201,80,80,0.1)] border-[rgba(201,80,80,0.4)] text-[#c95050] hover:bg-[rgba(201,80,80,0.2)]',
      success: 'bg-[rgba(76,175,120,0.1)] border-[rgba(76,175,120,0.4)] text-[#4caf78] hover:bg-[rgba(76,175,120,0.2)]',
    };
    return (
      <button ref={ref} className={cn(base, sizes[size], variants[variant], className)} {...props}>
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';
