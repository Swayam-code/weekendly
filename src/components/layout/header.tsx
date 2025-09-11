'use client';

import { useState } from 'react';
import { Calendar, Save, Download, Settings, Share2, FileDown, FileText, Loader2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useAppStore } from '@/stores/app-store';

export function Header() {
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { 
    currentPlan, 
    savePlan, 
    exportPlanAsJSON, 
    exportPlanAsText, 
    generateShareableLink 
  } = useAppStore();

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Brief loading state
    savePlan();
    toast.success('💾 Plan saved successfully!');
    setIsSaving(false);
  };

  const handleExportJSON = async () => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    const result = exportPlanAsJSON();
    if (result) {
      toast.success('📄 Plan exported as JSON!');
    } else {
      toast.error('No plan to export');
    }
    setIsExporting(false);
  };

  const handleExportText = async () => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    const result = exportPlanAsText();
    if (result) {
      toast.success('📝 Plan exported as text!');
    } else {
      toast.error('No plan to export');
    }
    setIsExporting(false);
  };

  const handleShare = async () => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    const link = generateShareableLink();
    if (link) {
      toast.success('🔗 Share link copied!', {
        description: 'Link copied to clipboard'
      });
    } else {
      toast.error('No plan to share');
    }
    setIsExporting(false);
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 flex-shrink-0" />
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Weekendly
              </h1>
            </div>
            {currentPlan && (
              <div className="text-xs sm:text-sm text-gray-600 ml-2 sm:ml-4 hidden sm:block">
                <span className="font-medium truncate">{currentPlan.name}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={!currentPlan || isSaving}
                className="text-gray-600 hover:text-gray-800 hover:bg-purple-50 hover:border-purple-200 disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!currentPlan || isExporting}
                    className="text-gray-600 hover:text-gray-800 hover:bg-purple-50 hover:border-purple-200 disabled:opacity-50"
                  >
                    {isExporting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleExportJSON}>
                    <FileDown className="h-4 w-4 mr-2" />
                    Export as JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportText}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export as Text
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-800"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex sm:hidden">
              <Button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                variant="outline"
                size="sm"
                className="p-2"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="mt-3 pt-3 border-t border-gray-200 sm:hidden">
            <div className="flex flex-col space-y-2">
              {currentPlan && (
                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">{currentPlan.name}</span>
                </div>
              )}
              
              <Button
                onClick={() => {
                  handleSave();
                  setMobileMenuOpen(false);
                }}
                variant="outline"
                size="sm"
                disabled={!currentPlan || isSaving}
                className="flex items-center justify-start space-x-2 hover:bg-purple-50 hover:border-purple-200 transition-colors"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>Save Plan</span>
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => {
                    handleExportJSON();
                    setMobileMenuOpen(false);
                  }}
                  disabled={!currentPlan || isExporting}
                  variant="outline"
                  size="sm"
                  className="flex flex-col items-center space-y-1 hover:bg-blue-50 hover:border-blue-200 transition-colors p-3 h-auto"
                >
                  <FileDown className="h-4 w-4" />
                  <span className="text-xs">JSON</span>
                </Button>
                
                <Button
                  onClick={() => {
                    handleExportText();
                    setMobileMenuOpen(false);
                  }}
                  disabled={!currentPlan || isExporting}
                  variant="outline"
                  size="sm"
                  className="flex flex-col items-center space-y-1 hover:bg-green-50 hover:border-green-200 transition-colors p-3 h-auto"
                >
                  <FileText className="h-4 w-4" />
                  <span className="text-xs">Text</span>
                </Button>
                
                <Button
                  onClick={() => {
                    handleShare();
                    setMobileMenuOpen(false);
                  }}
                  disabled={!currentPlan || isExporting}
                  variant="outline"
                  size="sm"
                  className="flex flex-col items-center space-y-1 hover:bg-purple-50 hover:border-purple-200 transition-colors p-3 h-auto"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="text-xs">Share</span>
                </Button>
                
                <Button
                  onClick={() => setMobileMenuOpen(false)}
                  variant="outline"
                  size="sm"
                  className="flex flex-col items-center space-y-1 hover:bg-gray-50 hover:border-gray-200 transition-colors p-3 h-auto"
                >
                  <Settings className="h-4 w-4" />
                  <span className="text-xs">Settings</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
