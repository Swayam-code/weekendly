import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorBoundaryProps {
  error?: Error;
  onRetry?: () => void;
  title?: string;
  description?: string;
}

export function ErrorBoundary({ 
  error, 
  onRetry, 
  title = "Something went wrong",
  description = "We encountered an unexpected error. Please try again."
}: ErrorBoundaryProps) {
  return (
    <Card className="max-w-md mx-auto bg-red-50 border-red-200">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <CardTitle className="text-red-800">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-sm text-red-600">{description}</p>
        
        {error && (
          <details className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            <summary className="cursor-pointer font-medium">Error Details</summary>
            <code className="block mt-2 text-left">{error.message}</code>
          </details>
        )}
        
        {onRetry && (
          <Button onClick={onRetry} className="bg-red-600 hover:bg-red-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function EmptyState({ 
  icon: Icon = AlertTriangle,
  title = "No data found",
  description = "There's nothing to display right now.",
  action
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-600 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-4 max-w-sm">{description}</p>
      {action && action}
    </div>
  );
}
