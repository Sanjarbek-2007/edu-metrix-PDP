import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
}: ConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-dark-900 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="p-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDestructive ? 'bg-danger/20 text-danger' : 'bg-warning/20 text-warning'}`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{message}</p>
            </div>
            
            <div className="p-4 border-t border-gray-800 bg-dark-900/50 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg font-medium text-gray-400 hover:text-white transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onConfirm();
                }}
                className={`px-4 py-2 rounded-lg font-medium text-white transition-colors ${
                  isDestructive ? 'bg-danger hover:bg-red-600' : 'bg-primary hover:bg-indigo-600'
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
