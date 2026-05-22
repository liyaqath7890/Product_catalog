import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const CustomModal = ({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-2xl', icon: Icon }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-[var(--color-dark)]/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className={`relative w-full ${maxWidth} bg-white rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300`}>
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[var(--color-gray-100)]">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-9 h-9 rounded-xl bg-[var(--color-primary-light)] flex items-center justify-center">
                <Icon size={18} className="text-[var(--color-primary)]" />
              </div>
            )}
            <div>
              <h3 className="text-base font-black text-[var(--color-gray-900)] tracking-tight">{title}</h3>
              {subtitle && <p className="text-[10px] font-bold text-[var(--color-gray-400)] uppercase tracking-widest mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[var(--color-gray-400)] hover:text-[var(--color-gray-700)] hover:bg-[var(--color-gray-100)] rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
