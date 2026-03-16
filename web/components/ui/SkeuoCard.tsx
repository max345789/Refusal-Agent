'use client';

import { motion } from 'framer-motion';

type Props = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
};

export function SkeuoCard({
  children,
  className = '',
  hover = true,
  delay = 0,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={
        hover
          ? {
              y: -2,
              boxShadow: '14px 14px 0 0 rgba(18,18,18,1)',
            }
          : undefined
      }
      className={`nb-surface p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}
