/**
 * Handing the application to somebody else.
 *
 * The Android screen is the one page of this project that is read in order to be
 * passed on: a reader downloads the game here, and the person they are talking
 * to needs the same address. The sharing itself is the browser's, not a service:
 * the system sheet where the device has one, which is what puts the message in
 * whatever the reader already uses to talk to people, and the clipboard where it
 * does not, which is every desktop browser.
 *
 * Nothing here knows what is being shared. The wording arrives as a template with
 * the address marked in it, so the two languages live with the page rather than
 * here, and the address is whatever the caller was showing.
 */

/**
 * The message a friend receives, with the address where the template asks for it.
 *
 * `replaceAll` rather than a single replacement: a template that names the
 * address twice already works, and the reason a message carries it twice - once
 * as the sentence and once to be tapped - is a decision the wording is allowed
 * to make.
 *
 * @param {string} template - the wording, carrying `{url}` where the link goes.
 * @param {string} url - the address of the screen that is being passed on.
 * @returns {string}
 */
export function shareText(template, url) {
  return template.replaceAll("{url}", url);
}

/**
 * Offer the address to the system sheet, or to the clipboard.
 *
 * The four answers are told apart because the screen says something different for
 * each: a sheet that opened and was closed is not a failure and says nothing, a
 * copied link is confirmed so the reader knows the paste will work, and a browser
 * that can do neither is told so rather than leaving a button that looks broken.
 *
 * @param {object} options
 * @param {string} options.template - the wording, carrying `{url}` where the link goes.
 * @param {string} options.url - the address to share.
 * @param {Navigator} [options.nav] - the navigator to use, for a test.
 * @returns {Promise<"shared" | "copied" | "cancelled" | "unavailable">}
 */
export async function shareApp({ template, url, nav }) {
  const target = nav ?? (typeof navigator === "undefined" ? undefined : navigator);
  const text = shareText(template, url);

  if (target && typeof target.share === "function") {
    try {
      await target.share({ text, url });
      return "shared";
    } catch (error) {
      // Closing the sheet is one of the ways it ends, and a reader who changed
      // their mind is not an error to report. Anything else falls through to the
      // clipboard, because a sheet that refused to open is a reason to try the
      // other way rather than to stop.
      if (error instanceof Error && error.name === "AbortError") return "cancelled";
    }
  }

  if (target?.clipboard && typeof target.clipboard.writeText === "function") {
    try {
      await target.clipboard.writeText(text);
      return "copied";
    } catch {
      return "unavailable";
    }
  }

  return "unavailable";
}
