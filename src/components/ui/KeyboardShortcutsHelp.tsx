import React, { useState } from 'react';
import { HelpCircle, Keyboard, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

export function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { keys: 'Ctrl + S', description: 'Save current plan' },
    { keys: 'Ctrl + E', description: 'Export plan' },
    { keys: 'Ctrl + N', description: 'Create new plan' },
    { keys: 'Ctrl + Shift + C', description: 'Clear all filters' },
    { keys: '?', description: 'Show this help dialog' },
  ];

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 text-gray-600 hover:text-gray-800 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg z-40"
      >
        <HelpCircle className="h-4 w-4" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Keyboard className="h-5 w-5 text-purple-600" />
                    Keyboard Shortcuts
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {shortcuts.map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-600">{shortcut.description}</span>
                      <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 border border-gray-300 rounded">
                        {shortcut.keys}
                      </kbd>
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <p className="text-xs text-gray-500 text-center">
                      Press <kbd className="px-1 py-0.5 text-xs font-mono bg-gray-100 border rounded">?</kbd> to toggle this dialog
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
