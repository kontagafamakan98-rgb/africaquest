/**
 * The page the desktop application is drawn from.
 *
 * The game is one page served by a web server, and the desktop build keeps that
 * arrangement rather than opening dist/index.html off the disk. A page loaded
 * from a `file://` address has no origin to fetch its own files against, cannot
 * keep the service worker that makes the game playable with no network, and
 * cannot stand behind a deep link the router reads. So a small server is started
 * inside the application, on the loopback interface and nowhere else, and the
 * window is pointed at it: what the browser gets from GitHub Pages, the desktop
 * window gets from its own machine.
 *
 * Plain Node module, with no Electron in it: the shell starts it, and the tests
 * reach it without a window and without a display.
 *
 * Nothing it serves is dynamic, so it is deliberately small: read the file the
 * address names, say what it is, answer a route with the page. Everything the
 * game does after that happens in the window.
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

/**
 * The address the window is pointed at.
 *
 * The loopback interface rather than every interface: this responds to whoever
 * can reach the port, and a game that opened a port to the local network would
 * be handing its own files to anything on the same coffee shop wifi.
 */
export const DEFAULT_HOST = "127.0.0.1";

/** What a single page site answers a route with. */
export const INDEX_FILE = "index.html";

/**
 * What the browser is told each file is.
 *
 * Written out rather than taken from a package because the list is what the
 * build produces and nothing else: an address with no entry here is answered as
 * a stream of bytes, which a browser refuses to run as a script or show as a
 * picture. The types are read from the extension, case insensitively, and the
 * text ones carry their character set so a page full of accented French is not
 * decoded as the wrong one.
 */
export const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".wasm": "application/wasm",
  ".map": "application/json; charset=utf-8",
};

/** What a browser is told one file is, from its extension. */
export function contentType(file) {
  return MIME_TYPES[path.extname(String(file)).toLowerCase()] || "application/octet-stream";
}

/**
 * The file an address names, or null when it names something that is not in the
 * folder the build wrote.
 *
 * The containment check is the whole of the safety here, and it is done on the
 * resolved path rather than on the text of the address: `..`, an encoded
 * separator and a Windows drive letter all end up as characters in a string that
 * a test can be written against, and only one of the many spellings of "leave
 * this folder" has to be missed for the game to start serving the machine it is
 * installed on. Resolving first, then asking whether the result is still under
 * the root, is the one form no spelling gets past.
 *
 * A name that ends in a slash is a folder, and the server answers it with the
 * page, exactly as a host would.
 */
export function fileFor(requestPath, root, index = INDEX_FILE) {
  const name = String(requestPath ?? "/").split("?")[0].split("#")[0];

  let decoded = "";
  try {
    decoded = decodeURIComponent(name);
  } catch {
    // An address that is not even decodable names nothing: refused here rather
    // than thrown at the caller, which has no better answer for it.
    return null;
  }
  // A NUL byte ends a path as far as the operating system is concerned, so the
  // rest of the address would be read as a different file than the one checked.
  if (decoded.includes("\0")) return null;

  const base = path.resolve(root);
  const relative = decoded.replace(/^\/+/, "");
  const target = path.resolve(base, relative);
  if (target !== base && !target.startsWith(base + path.sep)) return null;

  if (relative === "" || relative.endsWith("/")) return path.join(target, index);
  return target;
}

/**
 * One request, answered.
 *
 * A file that is not there is answered with the page when the address has no
 * extension, and with a plain 404 when it has one. That is the difference
 * between a route - `/LessonScreen`, which the router reads after the page has
 * loaded - and a file the build was supposed to write: the first is the site
 * working, the second is the site broken, and answering both with the page would
 * turn a missing stylesheet into a page that renders as text.
 */
async function answer(request, response, root) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end();
    return;
  }

  let file = fileFor(request.url, root);
  if (file === null) {
    response.writeHead(403);
    response.end();
    return;
  }

  let found = await stat(file).catch(() => null);
  if (found && found.isDirectory()) {
    file = path.join(file, INDEX_FILE);
    found = await stat(file).catch(() => null);
  }

  if (!found && path.extname(file) === "") {
    file = path.join(path.resolve(root), INDEX_FILE);
    found = await stat(file).catch(() => null);
  }

  if (!found || !found.isFile()) {
    response.writeHead(404);
    response.end();
    return;
  }

  const body = await readFile(file);
  response.writeHead(200, {
    "Content-Type": contentType(file),
    "Content-Length": String(body.length),
    // The window is the only reader of this server, and a freshly installed
    // application has to show the files that came with it rather than a copy a
    // browser kept. The service worker the page registers does its own caching
    // of what it precached, and it is the one thing here allowed to.
    "Cache-Control": "no-cache",
  });
  response.end(request.method === "HEAD" ? undefined : body);
}

/**
 * The server, listening, with the address it can be reached at.
 *
 * A port of 0 asks the operating system for a free one and the real number is
 * read back from the socket, so two copies of the application - or an unrelated
 * program holding a fixed port - cannot stop the game from starting. The caller
 * is handed the address to load rather than a number to assemble, so the only
 * place that knows how the two are written together is this one.
 */
export async function createStaticServer({ root, host = DEFAULT_HOST, port = 0 } = {}) {
  if (!root) throw new Error("server: name the folder the build wrote");

  const base = path.resolve(root);
  const server = createServer((request, response) => {
    answer(request, response, base).catch(() => {
      if (!response.headersSent) response.writeHead(500);
      response.end();
    });
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => {
      server.removeListener("error", reject);
      resolve();
    });
  });

  const address = server.address();
  const listening = typeof address === "object" && address !== null ? address.port : port;

  return {
    url: `http://${host}:${listening}/`,
    port: listening,
    close: () =>
      new Promise((resolve) => {
        server.close(() => resolve());
      }),
  };
}
