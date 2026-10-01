import { neon } from "@neondatabase/serverless";

/**
 * The one endpoint of the backend, and the two things it answers.
 *
 * The application this backend belongs to is a static site: it ships as files,
 * it works with no network at all, and nothing a player does leaves their
 * device. What Neon holds is where the content is written down, counted and
 * translated - the game reads it at build time, never at run time. So this
 * function has no player waiting on it, and it is not part of the path a lesson
 * is drawn on; what it has is the job every backend left alone for most of the
 * day has: saying whether it is still there.
 *
 * `/health` therefore reads the database as well as itself. That is the whole
 * point rather than an extra: the compute behind a Neon database scales to zero
 * after a few idle minutes, so a check that only asks the function whether it
 * is up cannot tell a base that is really gone from one that is asleep and will
 * answer in half a second. Both questions are asked in one call, from a place
 * that already holds the credential, so the daily check outside needs no secret
 * of its own.
 *
 * The answer says which of the three states it found, and says it in words a
 * reader of a failed run can act on. `tookMs` and `wokeFromSleep` are there for
 * the one case that is not a fault and must never be reported as one: a
 * suspended database waking up to answer is a slow 200, not a 500, and the
 * check that reads this reads them to know the difference.
 *
 * The bar is low because a warm query is a dozen milliseconds and a wake is a few
 * hundred: measured here, the same read that answered a sleeping compute took 576
 * ms where the warm one took 13, so anything past a quarter of a second is a wake
 * rather than a slow query.
 *
 * And the same answer carries what the database holds, because a health that says
 * only "up" leaves the one question this backend exists to answer unasked: the
 * counts of the content and the moment it was last written. `content_sync` is the
 * row `content:push` leaves behind, so `lastPush` is the date of the last time
 * somebody ran that command. A database that drifted from the repository is then
 * visible from outside, without a console and without a credential, which is what
 * makes this the smallest possible dashboard rather than only a liveness probe.
 */
const WAKE_MS = 300;

/** The counts and the date, in one statement: the driver sends one query a call. */
const COUNTERS = [
  "select",
  "  (select count(*) from levels)::int as levels,",
  "  (select count(*) from questions)::int as questions,",
  "  (select count(*) from photographs)::int as photographs,",
  "  (select pushed_at from content_sync where id = 1) as pushed_at,",
  "  (select source from content_sync where id = 1) as pushed_by",
].join("\n");

/** What went wrong, as a line rather than an object nobody can read. */
function describe(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * The content as the counters read it, or nothing when the query said nothing.
 *
 * Every field is optional in practice: `content_sync` is written by `content:push`
 * and by nothing else, so a database that has just had its schema applied and no
 * content written yet answers with the counts and no date at all. That is a state
 * worth reporting as it is rather than as an error, since the tables behind it are
 * perfectly healthy.
 */
function contentOf(rows: unknown): Record<string, unknown> | null {
  const row = Array.isArray(rows) ? (rows[0] as Record<string, unknown> | undefined) : undefined;
  if (!row) return null;

  const when = row.pushed_at ? new Date(row.pushed_at as string) : null;
  const pushedAt = when && !Number.isNaN(when.getTime()) ? when : null;

  return {
    levels: Number(row.levels) || 0,
    questions: Number(row.questions) || 0,
    photographs: Number(row.photographs) || 0,
    lastPush: pushedAt ? pushedAt.toISOString() : null,
    lastPushBy: row.pushed_by ?? null,
    lastPushAgoSeconds: pushedAt ? Math.round((Date.now() - pushedAt.getTime()) / 1000) : null,
  };
}

export default async function hello(request: Request = new Request("http://localhost/")): Promise<Response> {
  const path = new URL(request.url).pathname.replace(/\/+$/, "");

  if (!path.endsWith("/health")) {
    return new Response("Hello from Neon Functions");
  }

  const startedAt = Date.now();
  let database = "ok";
  let detail = "";
  let content: Record<string, unknown> | null = null;
  let contentDetail = "";

  const url = process.env.DATABASE_URL;
  if (!url) {
    database = "down";
    detail = "DATABASE_URL is not set in this runtime";
  } else {
    const sql = neon(url);
    try {
      await sql.query("select 1 as one");
    } catch (error) {
      database = "down";
      detail = describe(error);
    }
    // Read only once the base has answered at all: what the counters fail on is a
    // table that is not there yet, which is a deployment rather than a dead
    // database, and the two must not be reported as one thing.
    if (database === "ok") {
      try {
        content = contentOf(await sql.query(COUNTERS));
      } catch (error) {
        contentDetail = describe(error);
      }
    }
  }

  const tookMs = Date.now() - startedAt;

  return Response.json({
    status: database === "ok" ? "ok" : "down",
    function: "ok",
    database,
    detail: detail || undefined,
    content,
    contentDetail: contentDetail || undefined,
    tookMs,
    wokeFromSleep: tookMs >= WAKE_MS,
    at: new Date().toISOString(),
  });
}
