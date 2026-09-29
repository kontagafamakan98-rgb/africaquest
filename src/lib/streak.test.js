import test from "node:test";
import assert from "node:assert/strict";
import { localDay, previousLocalDay, streakAfterPlay } from "./streak.js";

// Dates below are built from local components on purpose: the streak must follow
// the player's clock, so the expectations have to hold in any timezone.
const at = (y, m, d, h = 12, min = 0) => new Date(y, m - 1, d, h, min);

test("the first day of play counts as a streak of one", () => {
  // Brand new profile: nothing played yet, so no date is stored.
  assert.deepEqual(streakAfterPlay(0, null, at(2026, 9, 27)), {
    streakDays: 1,
    lastPlayed: "2026-09-27",
  });
});

test("a profile seeded with today's date still starts at one", () => {
  // Older profiles were created with last_played already set to the current day.
  assert.deepEqual(streakAfterPlay(0, "2026-09-27", at(2026, 9, 27, 21, 30)), {
    streakDays: 1,
    lastPlayed: "2026-09-27",
  });
});

test("playing twice on the same day never lowers or doubles the streak", () => {
  assert.equal(streakAfterPlay(1, "2026-09-27", at(2026, 9, 27, 23, 59)).streakDays, 1);
  assert.equal(streakAfterPlay(6, "2026-09-27", at(2026, 9, 27, 8, 0)).streakDays, 6);
});

test("playing the next day adds one day", () => {
  assert.equal(streakAfterPlay(1, "2026-09-26", at(2026, 9, 27)).streakDays, 2);
  assert.equal(streakAfterPlay(4, "2026-09-26", at(2026, 9, 27)).streakDays, 5);
});

test("a longer gap starts the streak over", () => {
  assert.deepEqual(streakAfterPlay(9, "2026-09-24", at(2026, 9, 27)), {
    streakDays: 1,
    lastPlayed: "2026-09-27",
  });
});

test("month, year and leap year boundaries are handled", () => {
  assert.equal(previousLocalDay(at(2026, 3, 1)), "2026-02-28");
  assert.equal(previousLocalDay(at(2028, 3, 1)), "2028-02-29");
  assert.equal(previousLocalDay(at(2027, 1, 1)), "2026-12-31");
  assert.equal(streakAfterPlay(3, "2026-01-31", at(2026, 2, 1)).streakDays, 4);
  assert.equal(streakAfterPlay(3, "2026-12-31", at(2027, 1, 1)).streakDays, 4);
  assert.equal(streakAfterPlay(3, "2028-02-28", at(2028, 2, 29)).streakDays, 4);
  assert.equal(streakAfterPlay(3, "2028-02-29", at(2028, 3, 1)).streakDays, 4);
});

test("the streak follows the local clock, not UTC", () => {
  // Five past midnight local: the calendar day already changed for the player.
  const justAfterMidnight = at(2026, 9, 28, 0, 5);
  assert.equal(localDay(justAfterMidnight), "2026-09-28");
  assert.equal(streakAfterPlay(3, "2026-09-27", justAfterMidnight).streakDays, 4);
  // Conversely, late in the evening it is still the same day.
  assert.equal(localDay(at(2026, 9, 27, 23, 45)), "2026-09-27");
});

test("stored dates keep a stable format", () => {
  assert.equal(localDay(at(2026, 1, 5)), "2026-01-05");
  assert.equal(localDay("2026-09-27T10:00:00"), "2026-09-27");
  assert.match(streakAfterPlay(0, null, at(2026, 9, 27)).lastPlayed, /^\d{4}-\d{2}-\d{2}$/);
});

test("a corrupted streak value does not break the count", () => {
  assert.equal(streakAfterPlay(undefined, "2026-09-26", at(2026, 9, 27)).streakDays, 1);
  assert.equal(streakAfterPlay(-4, "2026-09-26", at(2026, 9, 27)).streakDays, 1);
  assert.equal(streakAfterPlay(2.7, "2026-09-26", at(2026, 9, 27)).streakDays, 3);
});
