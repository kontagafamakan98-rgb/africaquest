import test from "node:test";
import assert from "node:assert/strict";
import { shareApp, shareText } from "./share.js";

// Passing the game on.
//
// The screen that offers this is read by somebody sending the game to a friend,
// so the failure that matters is not an exception but a button that appears to
// do nothing: a sheet that is offered, the copy that is the fallback everywhere
// there is no sheet, and the browser that can do neither and is told so.

const TEMPLATE = "Africa History Quest, installed on Android. Open {url}.";

test("the address is put where the template asks for it, however many times it asks", () => {
  assert.equal(
    shareText(TEMPLATE, "https://example.org/android"),
    "Africa History Quest, installed on Android. Open https://example.org/android."
  );
  assert.equal(
    shareText("{url} and again {url}", "https://example.org/"),
    "https://example.org/ and again https://example.org/"
  );
});

test("the system sheet is used when there is one, and the text carries the address", async () => {
  const calls = [];
  const nav = { share: async (data) => calls.push(data) };

  assert.equal(await shareApp({ template: TEMPLATE, url: "https://example.org/a", nav }), "shared");
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://example.org/a");
  assert.match(calls[0].text, /https:\/\/example\.org\/a/, "the message a friend reads has no address in it");
});

test("closing the sheet says nothing, and a sheet that refuses falls back to the clipboard", async () => {
  const closed = {
    share: async () => {
      const error = new Error("the reader closed it");
      error.name = "AbortError";
      throw error;
    },
    clipboard: { writeText: async () => assert.fail("the clipboard was used after a closed sheet") },
  };
  assert.equal(await shareApp({ template: TEMPLATE, url: "https://example.org/", nav: closed }), "cancelled");

  // A sheet that failed for any other reason is not the end of it: the address
  // is copied instead, which is what a desktop browser does anyway.
  const refused = { share: async () => { throw new Error("no sheet here"); } };
  const clipboard = [];
  refused.clipboard = { writeText: async (text) => clipboard.push(text) };
  assert.equal(await shareApp({ template: TEMPLATE, url: "https://example.org/b", nav: refused }), "copied");
  assert.equal(clipboard.length, 1);
  assert.match(clipboard[0], /https:\/\/example\.org\/b/);
});

test("the clipboard is the fallback, and a browser with neither is told so", async () => {
  const clipboard = [];
  const desktop = { clipboard: { writeText: async (text) => clipboard.push(text) } };
  assert.equal(await shareApp({ template: TEMPLATE, url: "https://example.org/c", nav: desktop }), "copied");
  assert.match(clipboard[0], /https:\/\/example\.org\/c/);

  // A browser that can do neither, and one whose clipboard refuses to write:
  // both are the same answer to the screen, which offers the address as text.
  assert.equal(await shareApp({ template: TEMPLATE, url: "https://example.org/", nav: {} }), "unavailable");
  assert.equal(
    await shareApp({
      template: TEMPLATE,
      url: "https://example.org/",
      nav: { clipboard: { writeText: async () => { throw new Error("denied"); } } },
    }),
    "unavailable"
  );
});
