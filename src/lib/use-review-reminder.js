import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  applyBadge,
  disableReminder,
  enableReminder,
  postReminder,
  reminderEnabled,
  reminderMessage,
  reminderPermission,
  reminderSupport,
  reminderWording,
  reviewSchedule,
} from "./review-reminder.js";

/**
 * Keeps the reminder in step with the review schedule.
 *
 * It does three things, and they are deliberately not the same thing:
 *
 * - the count of what is due goes on the icon of the installed application as
 *   soon as it changes, with no permission and no switch, because it is the
 *   local half of the reminder and the one a player sees without opening
 *   anything;
 * - the schedule is handed to the service worker, which is the only thing that
 *   can raise it once the page is gone;
 * - the switch asks for the permission, registers the wake-up and turns all of
 *   it off again.
 *
 * The schedule is sent again on every change rather than on every render: it
 * moves with every answer, and a count on an icon that lags behind the game is
 * worse than no count at all.
 */
export function useReviewReminder({ questionStats = {}, levels, now = Date.now(), t }) {
  const [enabled, setEnabled] = useState(() => reminderEnabled());
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState(null);
  const support = useMemo(() => reminderSupport(), []);
  const posted = useRef(null);

  const schedule = useMemo(
    () => reviewSchedule(questionStats, levels, now),
    [questionStats, levels, now]
  );
  const wording = useMemo(
    () => reminderWording(t),
    [t?.reminderNotifyTitle, t?.reminderNotifyOne, t?.reminderNotifyMany]
  );
  const message = useMemo(() => reminderMessage(schedule, wording), [schedule, wording]);

  useEffect(() => {
    applyBadge(schedule.due);
  }, [schedule.due]);

  useEffect(() => {
    if (!enabled) return;
    // What the worker needs is the list of moments, so that is what decides
    // whether it has to be told again.
    const stamp = `${message.title}|${message.one}|${message.many}|${message.times.join(",")}`;
    if (stamp === posted.current) return;
    posted.current = stamp;
    postReminder(message);
  }, [enabled, message]);

  // A permission granted once can be taken away in the browser settings, and a
  // switch claiming to be on while nothing can be raised would be a lie. The
  // same goes for a browser that never had a way of waking the worker on its
  // own: the count on the icon still works there, and saying so is the honest
  // thing to put under the switch.
  useEffect(() => {
    if (!enabled) return;
    if (reminderPermission() !== "granted") setNote("blocked");
    else if (!support.periodic) setNote("noBackground");
  }, [enabled, support.periodic]);

  const toggle = useCallback(async () => {
    setBusy(true);
    try {
      if (enabled) {
        await disableReminder();
        posted.current = null;
        setEnabled(false);
        setNote(null);
        return;
      }

      const result = await enableReminder(message);
      setEnabled(result.granted);
      if (result.granted) {
        posted.current = `${message.title}|${message.one}|${message.many}|${message.times.join(",")}`;
        setNote(result.periodic ? null : "noBackground");
      } else {
        setNote(result.reason === "denied" ? "blocked" : result.reason);
      }
    } finally {
      setBusy(false);
    }
  }, [enabled, message]);

  return { enabled, busy, note, support, toggle, due: schedule.due };
}
