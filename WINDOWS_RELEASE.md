# The Windows installer

The game is published to a browser, to Android, and to Windows. The third is the one this file is
about: what the installer holds, how one is made, and what Windows says to the person who runs it.

## What the file is

`npm run desktop:build` produces `release/Africa-History-Quest-Setup-<version>.exe`: a single file
that installs the game on a Windows machine and needs nothing else on it. No Node, no browser
extension, no repository, no network. Running it puts a shortcut on the desktop, an entry in the
Start menu, and a row in **Apps and features** that uninstalls the application the way any other
Windows program does.

What it installs is the Electron runtime and the build of the site this repository makes. The
application's own files are one archive, `resources/app.asar`, and it holds three things:

- `electron/` - the shell: the window, and the small server the page is served from;
- `dist/` - the built site, which is the same directory `npm run build` writes and GitHub Pages
  publishes;
- `package.json`, which names the shell's entry point.

Nothing else, and that is checked rather than hoped for. The project's production dependencies are
bundled into `dist/` by Vite already, so electron-builder is told to leave `node_modules` out: left
in, it is forty megabytes of React, Tailwind and jsPDF inside a file the player would never load.

## Making one

On Windows, with Node installed:

```bash
npm install
npm run desktop:build
```

The version in the file's name is the version in `package.json`. `npm run desktop:start` opens the
same shell on the same build without assembling an installer, which is the loop to work in: it is a
window rather than a wizard, and it needs `npm run build` to have run first.

The installer is assembled by `.github/workflows/desktop.yml`, on a Windows runner, when a version
tag is pushed and when it is started by hand. A tag does two things a hand-held run cannot: it
decides the version, and the installer is attached to the release that tag names, so a download
link handed to somebody keeps working - an artifact is the copy that expires, and a release is the
one people mean to keep. The version comes from the tag by the same arithmetic as the APK's, in
reverse: the tag without its `v` is written into `package.json` by the workflow before the build,
so the file somebody downloads, the number in **Apps and features** and the tag are the same three
numbers.

## What a person sees the first time

Windows does not know who made the installer, because it is not code signed:

> **Windows protected your PC**
> Microsoft Defender SmartScreen prevented an unrecognised app from starting. Running this app
> might put your PC at risk.

That is SmartScreen's ordinary answer to any program from outside the Store that is not signed with
a certificate Windows can chain to a certificate authority. It is the same shape of warning a phone
gives an APK from outside the Play Store, and it has the same way through it:

1. Choose **More info**.
2. Choose **Run anyway**.

The page that hands out the file says so, and so does the release note, because a person who meets
that dialog with no explanation reasonably stops. The installation itself needs no administrator
rights: it is a per-user install, in the user's own `AppData`, and it asks for nothing a browser
would not.

## Why it is not signed

A code signing certificate for a Windows program is issued to a named company or person, verified
against a business registry, and costs a few hundred pounds a year. An EV certificate, the kind
that clears SmartScreen immediately rather than after a reputation has built up, costs more and
arrives on a physical token. Neither is something this project has, and pretending otherwise by
buying the cheapest one would put a name on the file that is not the name of whoever writes it.

The trade is written down here rather than left implicit: what it costs is one dialog, once per
machine, per version. What it would buy is that dialog not appearing, which is worth the money to
somebody shipping to strangers and is not worth it to a game handed to friends.

## Reading it back

Nothing reads a published installer back the way `npm run check:apk` reads a published APK, and
that is a gap rather than a decision. What could be checked without a certificate is thin: the file
exists, it is the size the build reported, and it carries the version the tag named. The Windows
properties a person could read - the publisher, the signature - are empty by design here, so the
check that would matter is the one thing a red run could not fix.

What stands in its place is that the installer is built from the same `dist` as the two other
targets, by a workflow that runs the same build, and that the file is attached to the release in
the same job that produced it rather than copied there by hand.
