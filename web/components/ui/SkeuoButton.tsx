'use client';

import { motion } from 'framer-motion';
import { forwardRef } from 'react';

type Props = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
};

const variants = {
  primary:
    'nb-surface nb-pressable bg-primary text-white',
  secondary:
    'nb-surface nb-pressable bg-warning text-ink',
  ghost:
    'nb-surface nb-pressable bg-white text-ink',
  danger:
    'nb-surface nb-pressable bg-danger text-white',
};

const sizes = {
  sm: 'px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-[var(--nb-radius)]',
  md: 'px-5 py-3 text-sm font-black uppercase tracking-wider rounded-[var(--nb-radius)]',
  lg: 'px-6 py-3.5 text-base font-black uppercase tracking-wider rounded-[var(--nb-radius)]',
};

export const SkeuoButton = forwardRef<HTMLButtonElement, Props>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      className = '',
      disabled = false,
      loading = false,
      type = 'button',
      onClick,
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        type={type}
        onClick={onClick}
        className={`inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
      >
        {loading ? (
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="h-4 w-4 rounded-full border-2 border-current border-t-transparent"
          />
        ) : (
          children
        )}
      </motion.button>
    );
  }
);
SkeuoButton.displayName = 'SkeuoButton';
