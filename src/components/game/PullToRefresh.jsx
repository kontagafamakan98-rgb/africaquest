import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";

const THRESHOLD = 72;

export default function PullToRefresh({ onRefresh, children }) {
  const [pullY, setPullY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(null);
  const scrollRef = useRef(null);

  const handleTouchStart = useCallback((e) => {
    const el = scrollRef.current;
    if (el && el.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (startY.current === null || refreshing) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy > 0) {
      // dampened pull
      setPullY(Math.min(dy * 0.45, THRESHOLD * 1.4));
    }
  }, [refreshing]);

  const handleTouchEnd = useCallback(async () => {
    if (pullY >= THRESHOLD && !refreshing) {
      setRefreshing(true);
      setPullY(THRESHOLD);
      await onRefresh();
      setRefreshing(false);
    }
    setPullY(0);
    startY.current = null;
  }, [pullY, refreshing, onRefresh]);

  const progress = Math.min(pullY / THRESHOLD, 1);

  return (
    <div className="relative overflow-hidden flex-1">
      {/* Indicator */}
      <AnimatePresence>
        {(pullY > 0 || refreshing) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 left-0 right-0 flex justify-center z-10 pointer-events-none"
            style={{ top: Math.min(pullY - 44, 16) }}
          >
            <div className="bg-amber-600 rounded-xl w-9 h-9 flex items-center justify-center shadow-lg shadow-amber-900/30">
              <motion.div animate={{ rotate: refreshing ? 360 : progress * 360 }} transition={refreshing ? { repeat: Infinity, duration: 0.8, ease: "linear" } : { duration: 0 }}>
                <RefreshCw className="w-4 h-4 text-white" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        className="h-full overflow-y-auto overflow-x-hidden"
        style={{ transform: pullY > 0 ? `translateY(${Math.min(pullY, THRESHOLD)}px)` : undefined, transition: pullY === 0 ? "transform 0.3s ease" : undefined }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}