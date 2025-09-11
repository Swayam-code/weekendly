'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppLayout } from '@/components/layout/app-layout';
import { ActivityGrid } from '@/components/activities/activity-grid';
import { WeekendSchedule } from '@/components/schedule/weekend-schedule';
import { useKeyboardShortcuts, createShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useAppStore } from '@/stores/app-store';
import { toast } from 'sonner';
import { KeyboardShortcutsHelp } from '@/components/ui/KeyboardShortcutsHelp';

export default function Home() {
  const [activeTab, setActiveTab] = useState('activities');
  const [showHelp, setShowHelp] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    createNewPlan, 
    savePlan, 
    exportPlanAsJSON, 
    clearFilters 
  } = useAppStore();

  // Setup keyboard shortcuts
  const shortcuts = createShortcuts({
    save: () => {
      savePlan();
      toast.success('Plan saved!');
    },
    export: () => {
      const result = exportPlanAsJSON();
      if (result) {
        toast.success('Plan exported!');
      } else {
        toast.error('No plan to export');
      }
    },
    newPlan: () => {
      createNewPlan();
      toast.success('New plan created!');
    },
    focusSearch: () => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
      setActiveTab('activities');
    },
    clearFilters: () => {
      clearFilters();
      toast.success('Filters cleared!');
    },
  });

  // Add help toggle shortcut
  shortcuts['?'] = () => setShowHelp(!showHelp);

  useKeyboardShortcuts(shortcuts);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header Section */}
          <div className="mb-6 lg:mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Plan Your Perfect Weekend
            </h1>
            <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Discover amazing activities, create your ideal schedule, and make every weekend memorable.
            </p>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/60 backdrop-blur-sm">
              <TabsTrigger 
                value="activities" 
                className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
              >
                Browse Activities
              </TabsTrigger>
              <TabsTrigger 
                value="schedule" 
                className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
              >
                Weekend Schedule
              </TabsTrigger>
            </TabsList>

            <TabsContent value="activities" className="mt-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4 lg:mb-6">
                  <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-2">
                    Discover Activities
                  </h2>
                  <p className="text-sm lg:text-base text-gray-600">
                    Browse through our curated collection of weekend activities and add them to your schedule.
                  </p>
                </div>
                <ActivityGrid />
              </motion.div>
            </TabsContent>

            <TabsContent value="schedule" className="mt-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4 lg:mb-6">
                  <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-2">
                    Your Weekend Schedule
                  </h2>
                  <p className="text-sm lg:text-base text-gray-600">
                    Organize your selected activities into a perfect weekend timeline.
                  </p>
                </div>
                <WeekendSchedule />
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
      <KeyboardShortcutsHelp />
    </AppLayout>
  );
}
