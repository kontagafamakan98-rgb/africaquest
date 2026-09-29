import { useEffect, useState } from "react";
import { RefreshCw, WifiOff } from "lucide-react";
import { useT } from "@/components/i18n";
import { isOnline, watchConnection } from "@/lib/connection.js";
import { watchForUpdates } from "@/lib/offline.js";

/**
 * The two quiet things the application owes the reader: whether it has a
 * network, and whether a newer version is waiting for them.
 *
 * Both are true of the whole application rather than of one screen, so they are
 * drawn over the page instead of inside it, and they share one element so the
 * two can never cover each other. Everything here lets taps through except the
 * single button, which is the only thing on this layer meant to be pressed.
 *
 * Neither is shown when there is nothing to say: on a device with a network
 * running the current version, this renders nothing at all.
 */
export default function AppStatus() {
  const t = useT();
  const [online, setOnline] = useState(() => isOnline());
  const [updateReady, setUpdateReady] = useState(false);

  useEffect(() => watchConnection(setOnline), []);

  // The worker takes over by itself; this is only how the reader learns that
  // the page in front of them has become one version old.
  useEffect(() => watchForUpdates(() => setUpdateReady(true)), []);

  if (online && !updateReady) return null;

  const reload = () => window.location.reload();

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 flex flex-col items-center gap-2 pointer-events-none"
      style={{ top: "calc(0.5rem + var(--sat))" }}
    >
      {!online && (
        <p
          role="status"
          className="pointer-events-auto inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#1C150C] px-2.5 py-1 text-[11px] font-semibold text-amber-200 shadow-lg"
        >
          <WifiOff className="w-3.5 h-3.5" aria-hidden="true" />
          {t.offline}
          {/* A reader who cannot see the badge is told the same reassuring
              thing the badge is meant to convey: nothing has been lost. */}
          <span className="sr-only">. {t.offlineNote}</span>
        </p>
      )}

      {updateReady && (
        <div
          role="status"
          className="pointer-events-auto w-full flex items-center gap-3 rounded-xl border border-white/10 bg-[#1C150C] px-3 py-2 shadow-lg"
        >
          <p className="flex-1 text-xs font-semibold text-amber-100">{t.updateReady}</p>
          <button
            onClick={reload}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-[#1C150C] transition-colors hover:bg-amber-400"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            {t.reloadNow}
          </button>
        </div>
      )}
    </div>
  );
}
