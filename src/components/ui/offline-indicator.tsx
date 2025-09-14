import { useOnlineStatus } from '@/hooks/use-service-worker'
import { Wifi, WifiOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function OfflineIndicator() {
  const isOnline = useOnlineStatus()

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 z-50 bg-orange-500 text-white px-4 py-2 text-center text-sm font-medium shadow-lg"
        >
          <div className="flex items-center justify-center space-x-2">
            <WifiOff className="h-4 w-4" />
            <span>You're offline. Changes will sync when connection is restored.</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function ConnectionStatus() {
  const isOnline = useOnlineStatus()

  return (
    <div className="flex items-center space-x-2 text-xs text-gray-500">
      {isOnline ? (
        <>
          <Wifi className="h-3 w-3 text-green-500" />
          <span>Online</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3 text-orange-500" />
          <span>Offline</span>
        </>
      )}
    </div>
  )
}