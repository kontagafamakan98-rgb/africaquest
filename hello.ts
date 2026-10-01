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
 */
const WAKE_MS = 300;

export default async function hello(request: Request = new Request("http://localhost/")): Promise<Response> {
  const path = new URL(request.url).pathname.replace(/\/+$/, "");

  if (!path.endsWith("/health")) {
    return new Response("Hello from Neon Functions");
  }

  const startedAt = Date.now();
  let database = "ok";
  let detail = "";

  try {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set in this runtime");
    const sql = neon(url);
    await sql.query("select 1 as one");
  } catch (error) {
    database = "down";
    detail = error instanceof Error ? error.message : String(error);
  }

  const tookMs = Date.now() - startedAt;

  return Response.json({
    status: database === "ok" ? "ok" : "down",
    function: "ok",
    database,
    detail: detail || undefined,
    tookMs,
    wokeFromSleep: tookMs >= WAKE_MS,
    at: new Date().toISOString(),
  });
}
