import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from './Button';

interface ModalProps {
  children: ReactNode;
  description?: string;
  onClose: () => void;
  title: string;
}

export function Modal({ children, description, onClose, title }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6">
      <div
        aria-modal="true"
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-lg bg-white shadow-2xl"
        role="dialog"
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
            {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
          </div>
          <Button
            aria-label="Fechar modal"
            className="min-h-9 px-2"
            icon={<X className="h-4 w-4" aria-hidden="true" />}
            onClick={onClose}
            variant="ghost"
          >
            <span className="sr-only">Fechar</span>
          </Button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
