/**
 * Downloads the level photographs into public/photos, once.
 *
 *   node scripts/fetch-photos.mjs           # fetches what is missing
 *   node scripts/fetch-photos.mjs --force   # fetches everything again
 *   node scripts/fetch-photos.mjs --verify  # checks the licences, downloads nothing
 *
 * After this has run, the game serves its own copies: nothing is requested from
 * Wikimedia or Unsplash while a child plays, on a plane or offline.
 *
 * For a Wikimedia Commons photograph the script asks the API for the file
 * rather than trusting a stored URL, and it refuses to save anything whose
 * licence does not match the one recorded in src/lib/level-images.js. An image
 * whose licence changed, or a file name that no longer exists, is a hard error
 * instead of a silent substitution: this is what keeps the credits truthful.
 */
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LEVEL_PHOTOS } from "../src/lib/level-images.js";
import { CONTACT_EMAIL } from "../src/lib/contact.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const PHOTO_DIR = path.join(ROOT, "public", "photos");
const USER_AGENT = `AfricaHistoryQuest/1.0 (level photographs; ${CONTACT_EMAIL})`;
const COMMONS_API = "https://commons.wikimedia.org/w/api.php";
const ATTEMPTS = 4;

const force = process.argv.includes("--force");
const verifyOnly = process.argv.includes("--verify");

/** A JPEG starts with FF D8 FF; anything else means an error page was saved. */
function looksLikeJpeg(buffer) {
  return buffer.length > 1024 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
}

const stripTags = (html) => String(html || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

/** Asks Commons about one file: where it is, who made it, under which licence. */
async function commonsInfo(title, width) {
  const url = new URL(COMMONS_API);
  url.search = new URLSearchParams({
    action: "query",
    format: "json",
    titles: `File:${title}`,
    prop: "imageinfo",
    iiprop: "url|extmetadata|size",
    iiurlwidth: String(width),
  });

  const response = await fetch(url, { headers: { "user-agent": USER_AGENT } });
  if (!response.ok) throw new Error(`the Commons API answered ${response.status}`);
  const data = await response.json();
  const page = Object.values(data?.query?.pages || {})[0];
  const info = page?.imageinfo?.[0];
  if (!info) throw new Error("Commons does not know this file any more");

  const licence = info.extmetadata?.LicenseShortName?.value || "";
  const author = stripTags(info.extmetadata?.Artist?.value);
  return {
    // Commons never enlarges a picture: asking for more than the original just
    // returns the original, so the width is capped here rather than guessed.
    url: width < info.width ? info.thumburl : info.url,
    licence,
    author,
    sourceWidth: info.width,
    sourceHeight: info.height,
  };
}

/** One download attempt, with a browser-shaped polite request. */
async function fetchImage(url) {
  const response = await fetch(url, {
    headers: { "user-agent": USER_AGENT, accept: "image/jpeg,image/*" },
    redirect: "follow",
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  if (!looksLikeJpeg(buffer)) throw new Error("the answer is not a JPEG");
  return buffer;
}

async function fetchWithRetries(url) {
  let lastError;
  for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
    try {
      return await fetchImage(url);
    } catch (error) {
      lastError = error;
      // Wikimedia answers 429 when asked too quickly; back off a little.
      if (attempt < ATTEMPTS) await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
    }
  }
  throw lastError;
}

mkdirSync(PHOTO_DIR, { recursive: true });

let saved = 0;
let kept = 0;
let checked = 0;
const problems = [];

for (const photo of LEVEL_PHOTOS) {
  const target = path.join(ROOT, "public", photo.file.replace(/^\//, ""));
  const label = `level ${photo.level} (${photo.caption.en})`;

  try {
    let url = photo.origin;

    if (photo.commonsTitle) {
      const info = await commonsInfo(photo.commonsTitle, photo.width);
      url = info.url;

      // The credit is only honest if the licence written in the table is still
      // the one Commons publishes.
      if (info.licence !== photo.licence) {
        throw new Error(`licence changed: table says ${photo.licence}, Commons says ${info.licence}`);
      }
      if (photo.author && info.author && !info.author.includes(photo.author)) {
        throw new Error(`author changed: table says ${photo.author}, Commons says ${info.author}`);
      }
      checked += 1;
      if (verifyOnly) {
        console.log(`ok      ${label}: ${info.author || photo.collection}, ${info.licence}, ${info.sourceWidth}x${info.sourceHeight}`);
        continue;
      }
    }

    if (!verifyOnly && !force && existsSync(target) && looksLikeJpeg(readFileSync(target))) {
      kept += 1;
      console.log(`kept    ${label}: ${path.basename(target)}, ${(statSync(target).size / 1024).toFixed(0)} kB`);
      continue;
    }

    if (verifyOnly) {
      console.log(`ok      ${label}: ${photo.author || photo.collection}, ${photo.licence}`);
      continue;
    }

    const buffer = await fetchWithRetries(url);
    writeFileSync(target, buffer);
    saved += 1;
    console.log(`saved   ${label}: ${path.basename(target)}, ${(buffer.length / 1024).toFixed(0)} kB, ${photo.licence}`);
  } catch (error) {
    problems.push(`${label}: ${error.message}`);
    console.error(`FAILED  ${label}: ${error.message}`);
  }
}

if (verifyOnly) {
  console.log(`\n${checked} licences verified against Commons, ${problems.length} problem(s)`);
} else {
  console.log(`\n${saved} saved, ${kept} already there, ${problems.length} failed`);
}
if (problems.length > 0) process.exitCode = 1;
