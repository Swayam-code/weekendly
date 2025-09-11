'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/stores/app-store';
import { Header } from './header';
import { Sidebar } from './sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const initializeApp = useAppStore((state) => state.initializeApp);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <Header />
      
      {/* Mobile menu button */}
      {isMobile && (
        <div className="fixed top-20 left-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            className="bg-white/90 backdrop-blur-sm shadow-lg border-purple-200"
          >
            {showMobileSidebar ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}
      
      <div className="flex">
        {/* Desktop sidebar */}
        {!isMobile && <Sidebar />}
        
        {/* Mobile sidebar overlay */}
        {isMobile && showMobileSidebar && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setShowMobileSidebar(false)}
            />
            <div className="fixed top-0 left-0 h-full w-80 bg-white z-50 shadow-2xl">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-800">Planning Tools</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMobileSidebar(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="overflow-y-auto h-full pb-20">
                <Sidebar />
              </div>
            </div>
          </>
        )}
        
        <main className={`flex-1 transition-all duration-300 ${
          isMobile ? 'p-4 pt-20' : 'p-4 lg:p-6'
        } overflow-x-hidden`}>
          {children}
        </main>
      </div>
    </div>
  );
}
