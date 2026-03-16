'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning';

type ToastProps = {
  message: string;
  type: ToastType;
  onClose: () => void;
  visible: boolean;
};

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
};

const colors = {
  success: 'bg-highlight text-ink',
  error: 'bg-danger text-white',
  warning: 'bg-warning text-ink',
};

export function Toast({ message, type, onClose, visible }: ToastProps) {
  const Icon = icons[type];
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10 }}
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 nb-surface px-4 py-3 ${colors[type]}`}
        >
          <Icon className="h-5 w-5 shrink-0" />
          <p className="text-sm font-black uppercase tracking-wider">{message}</p>
          <button
            onClick={onClose}
            className="ml-2 nb-surface-soft bg-white/50 p-1 hover:bg-white/70"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
