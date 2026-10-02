/**
 * The desktop window Africa History Quest is played in.
 *
 * The game is the same page the site serves, and this is the shell that hands it
 * to a window: it starts the small server in `server.js` on the loopback
 * interface, points one window at it, and gets out of the way. Nothing of the
 * application is reimplemented here and nothing of Electron is given to the page
 * - no preload script, no Node integration, a sandboxed renderer - because the
 * page is the one published on the web and it should not be able to tell the
 * difference.
 *
 * The one thing the shell does decide is what a link out of the game opens in.
 * A window with no address bar and no way back is the wrong place for the page
 * that installs the Android build or a reference at Wikipedia, so anything that
 * leaves this application's own origin is handed to the reader's browser and the
 * window stays where it is.
 *
 * It is started by Electron from the `main` field of package.json, and it is
 * the only file here that knows Electron exists.
 */
import { app, BrowserWindow, dialog, shell } from "electron";
import { existsSync } from "node:fs";
import path from "node:path";
import { createStaticServer } from "./server.js";

/** What Windows groups the taskbar entry and the notifications under. */
const APP_ID = "com.africaquest.desktop";

/** The name on the window, the shortcut and the installer. */
const APP_NAME = "Africa History Quest";

/** The colour the page paints its background, so no white frame is ever shown. */
const BACKGROUND = "#14100A";

/**
 * The window, in the shape the game is laid out for.
 *
 * Its smallest size is the one the screens are written to rather than a fraction
 * of it: below that the quiz and the level list stop being a layout and start
 * being a scroll, which is what the phone build is for.
 */
const WINDOW_SIZE = { width: 1080, height: 720, minWidth: 360, minHeight: 480 };

/** @type {BrowserWindow | null} */
let mainWindow = null;

/** @type {{ url: string, close: () => Promise<void> } | null} */
let site = null;

/**
 * The folder the build writes, wherever the application was started from.
 *
 * `app.getAppPath()` is the project folder when the shell is run from a
 * checkout and the packed archive when it is installed, and Electron reads a
 * path inside either one the same way, so the two are told apart nowhere here.
 */
function buildFolder() {
  return path.join(app.getAppPath(), "dist");
}

/** Whether an address is one a browser can be asked to open. */
function openable(url) {
  try {
    const { protocol } = new URL(String(url));
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

/** Whether an address is the page this application serves itself. */
function ours(url, origin) {
  try {
    return new URL(String(url)).origin === origin;
  } catch {
    return false;
  }
}

/** The one window, pointed at the server. */
function openWindow(origin) {
  const icon = path.join(buildFolder(), "icon-512.png");

  mainWindow = new BrowserWindow({
    ...WINDOW_SIZE,
    show: false,
    backgroundColor: BACKGROUND,
    autoHideMenuBar: true,
    title: APP_NAME,
    // Set from the file the build writes rather than from a copy kept beside
    // this one, so the window and the installer cannot carry two different marks.
    ...(existsSync(icon) ? { icon } : {}),
    webPreferences: {
      // The page is the one published on the web and it is expected to be able
      // to do nothing more than it can there: no Node, no shared context, and a
      // sandbox, which is the state a browser would hand it.
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  // Shown when it has something to show: the frame is the colour of the page, so
  // a window that appeared any earlier would be a rectangle waiting for a game.
  mainWindow.once("ready-to-show", () => mainWindow?.show());
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // A link that would open a second window - the Android page's GitHub link, a
  // reference - is the reader's browser's business, not this window's.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (openable(url)) shell.openExternal(url);
    return { action: "deny" };
  });

  // And a link that would move this window off the game entirely is handed out
  // the same way, so the window can only ever be showing the game.
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (ours(url, origin)) return;
    event.preventDefault();
    if (openable(url)) shell.openExternal(url);
  });

  return mainWindow.loadURL(origin);
}

/** The server, then the window. */
async function start() {
  app.setAppUserModelId(APP_ID);

  const root = buildFolder();
  if (!existsSync(path.join(root, "index.html"))) {
    // Said in a box rather than on a console nobody sees: the shell is started by
    // double-clicking, and a window that never appears with no explanation is
    // the least useful failure this application has.
    dialog.showErrorBox(
      `${APP_NAME} has not been built yet`,
      "The desktop application serves the site the build writes, and there is no dist/index.html beside it.\n\n" +
        "From the project folder, run:\n    npm run build"
    );
    app.quit();
    return;
  }

  site = await createStaticServer({ root });
  await openWindow(site.url);
}

// One copy of the game at a time: a second launch brings the window that is
// already open to the front rather than starting a second server on a second
// port and leaving the player with two half-finished quizzes.
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (!mainWindow) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  });

  app
    .whenReady()
    .then(start)
    .catch((error) => {
      dialog.showErrorBox(`${APP_NAME} could not start`, String(error?.message ?? error));
      app.quit();
    });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0 && site) openWindow(site.url);
  });

  app.on("window-all-closed", () => {
    // Everywhere but macOS, closing the window is quitting the application.
    if (process.platform !== "darwin") app.quit();
  });

  app.on("will-quit", () => {
    // Not awaited: the quit is not held open for a socket on the loopback
    // interface, which the operating system would close with this process anyway.
    site?.close();
  });
}
