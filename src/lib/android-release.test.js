import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  ANDROID_REPO,
  LATEST_RELEASE_API,
  RELEASES_PAGE,
  latestAndroidRelease,
  releaseFrom,
} from "./android-release.js";

// Where the newest Android release is read from, and what a reader is offered
// when it cannot be read at all.
//
// The version on the Android screen is the one value this application does not
// own: it comes from GitHub, on demand, and everything about the request can go
// wrong - a phone in a tunnel, a rate limit, a page whose shape changed. What is
// checked here is therefore the two ends and not the happy one alone: that a
// real answer is read into a version and a download, and that every other answer
// ends in the release page rather than in a broken screen.

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const read = (file) => readFileSync(path.join(ROOT, file), "utf8");

const ANSWER = {
  tag_name: "v1.2.3",
  assets: [
    { name: "notes.txt", browser_download_url: "https://github.com/example/notes.txt" },
    {
      name: "africa-history-quest-1.2.3.apk",
      browser_download_url: "https://github.com/example/releases/download/v1.2.3/app.apk",
    },
  ],
};

test("a release answer is read into the version it names and the APK it carries", () => {
  const release = releaseFrom(ANSWER);
  assert.equal(release.version, "1.2.3", "the leading v of the tag is not part of the version");
  assert.equal(release.page, RELEASES_PAGE);
  assert.equal(
    release.download,
    "https://github.com/example/releases/download/v1.2.3/app.apk",
    "the download is the APK, not the notes beside it"
  );

  // The addresses are derived from the one repository, so a page and a request
  // cannot be pointed at two different projects.
  assert.match(RELEASES_PAGE, /^https:\/\/github\.com\/kontagafamakan98-rgb\/africaquest\/releases\/latest$/);
  assert.equal(LATEST_RELEASE_API, `https://api.github.com/repos/${ANDROID_REPO}/releases/latest`);

  // A release with no asset at all is still a release: the version is shown and
  // the button falls back to the release page, where the files are listed.
  const bare = releaseFrom({ tag_name: "v2.0.0", assets: [] });
  assert.equal(bare.version, "2.0.0");
  assert.equal(bare.download, RELEASES_PAGE, "a release with no file still downloads something");
});

test("an answer that is not a version this project tags is refused rather than printed", () => {
  // The tags here are three numbers, optionally behind a v. Anything else would
  // put a name on the screen that no installed application reports.
  for (const tag of ["v1", "1.2", "version-1.0.0", "1.0.0-rc.1", "v1.0.0-beta", "", "   "]) {
    assert.equal(releaseFrom({ tag_name: tag }), null, `${JSON.stringify(tag)} was read as a version`);
  }
  for (const answer of [null, undefined, "v1.0.0", 42, {}]) {
    assert.equal(releaseFrom(answer), null, `${JSON.stringify(answer)} was read as a release`);
  }

  // And a file that is not an https address, or not an APK, is not a download:
  // the release page is offered instead of a link to nowhere.
  const plain = releaseFrom({
    tag_name: "v1.0.0",
    assets: [{ name: "app.apk", browser_download_url: "http://example.org/app.apk" }],
  });
  assert.equal(plain.download, RELEASES_PAGE, "a plain http file is not handed to a reader");
});

/** A fetch that answers with one prepared response, and records what it was asked. */
function fakeFetch(response) {
  const calls = [];
  const impl = async (url, init) => {
    calls.push({ url, init });
    if (typeof response === "function") return response();
    return response;
  };
  impl.calls = calls;
  return impl;
}

test("the newest release is asked for once, and every failure is the release page", async () => {
  const ok = fakeFetch({ ok: true, json: async () => ANSWER });
  const release = await latestAndroidRelease({ fetchImpl: ok });
  assert.equal(release.version, "1.2.3");
  assert.equal(ok.calls.length, 1, "one request, not a retry loop");
  assert.equal(ok.calls[0].url, LATEST_RELEASE_API);

  // A refusal, a rate limit and a body that is not JSON are all the same to the
  // caller: no version, and the release page behind the button.
  assert.equal(await latestAndroidRelease({ fetchImpl: fakeFetch({ ok: false }) }), null);
  assert.equal(
    await latestAndroidRelease({ fetchImpl: fakeFetch({ ok: true, json: async () => ({ message: "rate limited" }) }) }),
    null
  );
  assert.equal(
    await latestAndroidRelease({
      fetchImpl: fakeFetch(() => {
        throw new Error("offline");
      }),
    }),
    null
  );
  assert.equal(
    await latestAndroidRelease({
      fetchImpl: fakeFetch({ ok: true, json: async () => {
        throw new Error("not json");
      } }),
    }),
    null
  );

  // With no fetch at all - a very old browser - there is nothing to ask with.
  assert.equal(await latestAndroidRelease({ fetchImpl: null }), null);
});

test("this is the only address the application talks to, and it is asked on demand", () => {
  // The promise the rest of the application is written on is that it makes no
  // request of its own after it has loaded its files. This screen is the one
  // deliberate exception, so it is named here: the module injects its `fetch`
  // and only the Android screen calls it, which is what keeps the request off
  // the way in and bounded to a screen somebody opened.
  const sources = [];
  const walk = (directory) => {
    for (const entry of readdirSync(path.join(ROOT, directory), { withFileTypes: true })) {
      if (entry.name === "node_modules") continue;
      const relative = `${directory}/${entry.name}`;
      if (entry.isDirectory()) walk(relative);
      else if (/\.(js|jsx)$/.test(entry.name) && !entry.name.endsWith(".test.js")) sources.push(relative);
    }
  };
  walk("src");

  const calling = sources.filter((file) => /\bfetch\s*\(\s*["'`]?https?:/.test(read(file)));
  assert.deepEqual(calling, [], "a screen fetches an address of its own instead of going through this module");

  const module = read("src/lib/android-release.js");
  assert.match(module, /fetchImpl\(LATEST_RELEASE_API/, "the request no longer goes through the injected fetch");

  const page = read("src/pages/Android.jsx");
  assert.match(page, /latestAndroidRelease\(/, "the screen no longer asks for the release");
  assert.match(page, /RELEASES_PAGE/, "the screen has no fallback for a request that never answers");
  assert.match(read("src/pages.config.js"), /"Android": Android/, "the Android screen is not routed");
});
