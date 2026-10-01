# Africa History Quest

An educational quiz game that helps young learners explore the history of Africa.
Players progress through twenty-six levels that follow the whole timeline, from the first
humans to Africa today - Ancient Egypt, Kush, Great Zimbabwe, Mali, Axum, Songhai, the
Zulu Kingdom, African Independence and the periods between them - each with a study
pack to read before the quiz and three difficulty modes with stars, XP, badges and a
daily streak. Every level and every question is written in English and in French.

## Stack

- React 18 + Vite
- Tailwind CSS
- TanStack Query
- Framer Motion (light, non-decorative transitions only)
- Lucide icons

## Local by design

There is no account, no server and no tracking. Everything the game needs lives in the
browser:

- Progress (levels, XP, stars, badges, per-level scores, play time, streak) is stored in
  `localStorage` under the key `aq_progress_v1`.
- Hints are computed on the device, so they work offline.
- Language preference is stored in `localStorage` under the key `aq_lang`.

The application makes no network request after loading its own assets: the level photographs
are files of its own, downloaded once from their free licence source and shipped with the
rest of the game.

Nothing else is kept. The failure log ("When something breaks", below) is the one other name,
and it is the tab's own: session storage under `aq_failures_v1`, holding the last dozen
failures of the session and gone when the tab is closed. A reload keeps it, because a reload
is the one thing the crash screen offers. It is not a cookie, not a database, and not a
request.

## Running locally

```bash
npm install
npm run dev
```

Pushing is the one step that needs something the repository cannot hold. The remote is HTTPS,
so a push authenticates with a token the machine keeps - in the Windows Credential Manager
through Git Credential Manager here, in the Keychain on macOS, in libsecret on Linux - rather
than with a password typed into a page. A fresh clone that asks for a sign-in window instead
of pushing usually needs one line, because of how the credential is filed:

- Git Credential Manager stores the token under a username, and git asks the helper without
  one whenever the remote address carries no username. Recording the account once, in this
  repository's own config, is the whole difference:
  `git config credential.https://github.com.username <account>`.
- The token itself should be a fine-grained one, limited to this repository with
  **Contents: read and write**. A classic token arrives with scopes - administration,
  deletion, workflow - that a push here has no use for, which is a lot of reach for a command
  that only ever adds a commit.

No token belongs in this repository, in its config or in the address of its remote: the
credential store is the only place one lives, so a push cannot leave a secret behind in a
file that travels with the work.

## Scripts

- `npm run dev` starts the development server.
- `npm run build` produces a production build in `dist/`.
- `npm run preview` serves the production build.
- `npm run lint` runs ESLint.
- `npm run verify` runs every gate the project has: the translations, the photograph budgets
  and fingerprints, the application icons, the brief the first screen reads, the content written
  for each level, the tests and the house rules, the linters, the annotations the code is read
  through - twice, once for the program that ships and once for the build modules that run under
  Node - and then a production build, which the last step weighs, bundle by bundle, against the
  pass it is compared with.
- `npm run typecheck` is that reading on its own, and it is the one gate that never runs the
  code: it holds every JSDoc annotation to what its function really does, so a parameter
  typed narrower than the values it receives is an error here rather than a surprise later.
  It reads two programs, and between them no file under `src/` is left unchecked:
  `jsconfig.json` is the browser program, which leaves the test files out on purpose since
  they run under Node and are not part of what ships, and `jsconfig.node.json` reads the two
  modules under `src/lib/` that call Node's own libraries - the icon rasteriser and the
  photograph fingerprints - with Node's typings, since neither could run in a page at all.
- `npm run level:content` writes the module of every level - its questions, their references,
  its study pack and its gallery - from the three tables the rest of the game is written from;
  `npm run check:levels` is that write held to what is on disk, and it runs inside the
  verification.
- `npm run photos:stamp` records the fingerprint of every photograph, after the pictures have
  changed.
- `npm run weights` weighs the build bundle by bundle and compares it with the last recorded
  pass.
- `npm run check:references` follows the pages the verified references point at and reads the
  title each one answers with, on demand and outside the verification, since it needs the
  network.
- `npm run check:references:record` writes down what a person read on a page no script can read,
  with their name and the day, so that a refusal stops being the last word about it.
- `npm run weights:record` records this build as the pass the next one is compared with.
- `npm run stress` walks the newest and the heaviest progress record the application accepts
  and holds every path that has to read one to a budget, outside the verification.

## The content, and the database it is edited in

The content of the game is written in a Neon database, and the repository holds the snapshot of
it that ships. The four modules the game is read from - the levels, the French wording, the study
material and the photographs - are generated from it by `npm run content:pull`, reviewed as the
diff of those files and committed like any other change. So the database is the source rather than
a copy, which is what keeps an edit made in its console from becoming a fork of the content nobody
can see. Each of the four modules keeps its imports, its helpers and the prose that explains it:
only the declaration of data, framed by two marker comments, is written from the database, so a
command run against it cannot quietly delete a comment somebody wrote.

The database is not part of what a reader downloads: nothing in the built application talks to
it, which is what keeps the game working offline in the first place. Its compute scales to zero
when idle and wakes on the next query, so the first one of a session waits a moment for it -
nothing a player does depends on it, and nothing they do reaches it.

`npm run content:push` writes the other way: it applies `db/schema.sql`, empties the six tables and
writes the modules' content into them, a mirror rather than a merge. `npm run content:check` reads
all six back and compares them row by row with the repository, and also rebuilds the four modules
and compares their generated lines - so a file edited by hand where it is generated is named,
rather than silently rewritten by the next pull. The connection string comes from `.env.local`,
which `neon link` writes and no commit carries.

`content:push` also leaves a dated row behind - the counts and the moment, in a table of its
own rather than in the mirror - and the backend's `/health` answers with it. So what the
database holds, and since when, can be read from outside, without a console and without a
credential of its own: the counts, the date of the last push, who made it and whether a push or
a run started by hand carried it out, beside the liveness the same answer already carries.

That comparison needs a credential, so it is deliberately not a step of `npm run verify`: that
gate runs on every pull request, on a machine that holds no database credential, and it has to
mean the same thing there as anywhere else. It has a workflow of its own instead
(`.github/workflows/content.yml`), on every push to `main` and on demand, with the production
connection string in the `NEON_DATABASE_URL` secret. A run without that secret says so in an
annotation and passes, because a missing credential is not a database that drifted; a run with it
fails when the database no longer says what the repository holds, or the repository no longer
says what the database would write. That failure is written into the run's own summary as well as
its log - the table or module in fault, the rows that differ, and the command that would put the
two ends back together - so a run that has drifted can be understood from its summary without
opening the job.

The other direction is a command nobody can start by accident. `.github/workflows/content-sync.yml`
runs `npm run content:push` from a runner, triggered by hand alone - no push, no pull request, no
schedule - and only after a confirmation is typed into the run, since it overwrites the database
with the repository rather than comparing the two. That is how a database that has drifted is put
back without the production connection string on a laptop. It is a workflow of its own on purpose:
the Content one compares the two ends and fails, this one writes one end from the other.

## Photographs

Each of the seventy-eight level photographs ships as a JPEG, a WebP beside it, and — where it pays
off — an AVIF in front of that one. A browser is offered them lightest first and draws the
first it can read; the JPEG is only there for a browser that reads neither.

The service worker installs none of the full pictures. It carries the code and the seventy-eight
thumbnails, about a fifth of a megabyte of photographs, and every full picture is fetched the
first time its level is opened and kept from then on. Installing the whole gallery up front
was nearly three megabytes most players never look at, on the very first load; now the
install carries two and a half megabytes, nearly all of it code, and the two hundred and
fourteen full pictures it leaves out weigh nine and a third. The offline copy stays
complete for every level that has really been played rather than for the ones nobody opened.
`src/lib/offline.test.js` holds it: each photograph's full files are left out of the install,
and the one thumbnail that stands for the picture is in.

The third format is not written for every picture. At the size these are drawn, five hundred
to six hundred and forty pixels across, AV1 pays for its headers more than it saves, and on
part of the gallery the WebP is already the smaller file. `scripts/optimize-photos.mjs`
encodes the AVIF at the lowest quality at which it is at least as faithful as the WebP it
would replace, and writes it only when it also weighs meaningfully less; `npm run verify`
reports how many pictures carry one rather than assuming they all do.

That rule lives in `build/photo-fidelity.js` rather than inside the script, so that what the
tests run is the very code that decides. `src/lib/photo-fidelity.test.js` measures it on one
witness picture of its own, a hundred pixels of noise and edges, and checks the shape of the
decision: that the walk stops on fidelity, that an AVIF lighter than the WebP but less
faithful is refused, and that both halves have to hold. It costs half a second, where
re-measuring the gallery would cost a minute and a half, which is why `--check` weighs the
files that ship and leaves fidelity to that witness.

Where an AVIF is written it is pinned by its own fingerprint in `src/lib/level-images.js`,
and that line is also what tells the application which pictures to offer it for: a browser
asked for an AVIF that is not there shows no picture rather than the one behind it.

Each picture also ships a thumbnail, written by the same script in the same run: a WebP of
a hundred and sixty pixels on the long edge, which is what the photo credits screen draws
beside each name. That screen listed seventy-eight lesson-sized pictures before, about two megabytes
to fill seventy-eight eighty-pixel squares; it now downloads about two hundred and twenty kilobytes
in total. No AVIF is written at that size, and that is a measurement rather than a shortcut:
at a hundred and sixty pixels it came out heavier than the WebP every time the two were
weighed, which is the same rule that leaves part of the gallery without a third format.

A fourth file exists for the pictures the map draws, and it is the one that changed the first
screen. The home screen shows twenty-six cards, one photograph each, three hundred and fifty-eight
pixels wide on a phone, and those twenty-six pictures were being drawn from the light version:
six hundred and forty across, which is what a screen of doubled pixel density asks for and a
third more than an ordinary one needs. `scripts/optimize-photos.mjs` now writes a fourth
hundred-and-eighty-pixel copy for those twenty-six pictures, and `LevelPicture.jsx` offers it as
one candidate beside the light version rather than in place of it, so a sharper screen still
receives the sharper file and a school laptop receives two hundred and seventy kilobytes fewer. The
twenty-six copies weigh about three hundred and eighty kilobytes together against six hundred and
sixty for the light versions, and `src/lib/photo-weight.test.js` holds the budget of one copy and of
the twenty-six. It is a WebP and nothing else, for the reason a thumbnail is: at that size an AVIF's
header costs more than its pixels save. No lesson ships one - a lesson draws its pictures at
six hundred and forty pixels, where the light version is already the right file.

A thumbnail tells two pictures apart and shows neither of them, so each one is a button: it
opens the photograph at the size it was made, in `src/components/game/PhotoViewer.jsx`, with
its caption and its credit line still beside it and the page it came from one tap away. The
largest file is asked for at the moment of the tap and not with the list, so a reader who only
came to check who made a picture still downloads the small copies alone. The viewer is a
dialog like every other sheet of the game: the focus moves into it, Escape and the area
around the picture close it, and the focus goes back to the thumbnail that opened it.

The one part of this that no build can hold is the page each credit points at: it is on
somebody else's wiki, and it can be deleted between two releases. `npm run check:photos`
follows all seventy-eight of them on demand and says when one is gone, which is the failure a reader
would find instead of a licence. It asks with HEAD, so no page is downloaded to learn whether
it exists, and it keeps a page that could not be read apart from a page that is not there, so a
bad connection is never reported as a badly credited photograph. Like the check on the search
links, it needs the network and is therefore not part of `npm run verify`.

All four files are pinned by a fingerprint of their own, so the credit line belongs to the
bytes a reader is actually shown — in a lesson and on the credits screen alike.

## Coming back for a review

Spaced repetition only works if the player comes back, and a schedule is invisible from outside the
game. So the count of what is due goes on the icon of the installed application, and, when the
player asks for it in the settings, a notification is raised when the game is not open.

None of it leaves the device and none of it needs a server. The page hands the moments of the
schedule to the service worker, which keeps them in IndexedDB and looks at them when the browser
wakes it: that is periodic background sync, which the manifest asks for with
`"permissions": ["periodic-background-sync"]` and which the worker registers under one tag. The
wording of the notification is composed by the page, in the language on screen, and travels with
the schedule, so the worker never holds a second copy of the dictionary; the counted form carries a
single `%d`, since more is due on the day of the notification than on the day it was handed over.

Where a browser does not implement that wake-up, the switch says so instead of pretending: it
tries to register the wake-up when the reminder is turned on, and a registration the browser
refuses, which is what a desktop browser does today, is written under the switch as the reason
no notification will come. The count on the icon still arrives every time the game is opened,
which is the half that needs no permission at all. `src/lib/review-reminder.js` is the page's
half of it, `build/offline-plugin.js` writes the worker's, and
`src/lib/review-reminder.test.js` holds the two together: the tag the two halves agree on, the
count on the icon against the count on the review tab inside the game, and the three reasons
the worker says nothing at all. That last test does not read the worker, it runs it: the slice
of the generated source the browser would run, given a browser of its own, since no test can
wait for a notification that arrives while the page is closed.

## Deployment

Pushing to `main` publishes the built application to GitHub Pages (see
`.github/workflows/pages.yml`). The build is told the address Pages reports, so the game
works both at the root of a domain and under a project path such as
`https://<owner>.github.io/<repository>/`, and the service worker is written for that same
address, which is what keeps the offline copy working once installed.

The same address is handed to the build a second time, as `SITE_ORIGIN`, because the files a
crawler and a link preview read need it in full rather than as a path (see "What a crawler and a
shared link read").

One setting has to be turned on once, by hand: in the repository settings, under **Pages**,
set **Source** to **GitHub Actions**. Nothing in the workflow can do it: the token a run is
given may read that setting and may publish through it, but creating the site is outside what
it is allowed to do, and GitHub answers "Resource not accessible by integration" when
something tries. So the workflow asks first, and publishes only when there is somewhere to
publish to. A repository that does not publish with Pages yet gets one run that builds
nothing, writes what to click into the run summary, and warns once - instead of failing on a
step whose name says nothing about the reason. The Uptime workflow goes on failing until the
site is really there, which is the check that is meant to be alarmed. An owner who would
rather not click can add a repository secret named `PAGES_TOKEN` holding a token that may
administer the repository, and the next run turns Pages on with it.

## Project layout

```
src/
  api/            local progress store
  components/game game UI: level cards, quiz screen, hints, badges, stats, settings
  components/ui   reusable primitives
  pages/          Home, Quiz, About, Privacy Policy, Terms of Use, Photo credits, Bibliography
  Layout.jsx      shared page wrapper
```

## What the first screen waits for

The map is drawn from a brief of the game (`src/components/game/level-facts.js`), written by
`scripts/generate-level-facts.mjs` out of the level table, the French wording and the photograph
table, and checked by `npm run verify`. The brief carries the twenty-six levels' titles in both
languages, their place in the timeline, the icon and the picture on each card, and how many
questions each level holds - everything a card draws, and nothing else.

The questions, their facts and sources, the study packs, the lesson stories and the rest of the
gallery live in `gameData.js` and `level-images.js`, and the map asks for none of them: nothing
of the game's content is fetched from the first screen, so the entry file is about 180 kB rather
than the 460 kB of the whole game.

What a tap opens asks for what that screen shows, and only that. A lesson is one level, so it asks
for the one level it is opening: `scripts/generate-level-content.mjs` writes a module per level
out of the same tables the rest of the game is written from, `src/components/game/level-content.js`
turns the twenty-six modules into twenty-six requests, and the lesson downloads about 24 kB - its own
questions, their references, its study pack and its gallery - instead of the six hundred
kilobytes of all twenty-six. The lesson's own chunk fell from 139 kB to 12 kB as a result. The screens
that really need every level - the review inbox, the bibliography, the statistics - read
`gameData.js` when they are opened, which is why it still exists.

That boundary is held by tests rather than by memory: `src/lib/bundle-split.test.js` walks the
static imports of the entry file and fails on one that reaches the content, refuses a level module
that the map could reach, and refuses the lesson screen that reads any module but the level it
downloaded; `src/components/game/level-summary.test.js` compares the brief with the three tables it
is written from, down to the icon, the card picture and the AVIF list; and
`src/components/game/content.test.js` compares each level a lesson downloads with the level the
whole game holds, field for field, in both languages.

## The look of a screen

The interface has a house style, and it is held the same way as everything else here: the refusals
are written in `src/lib/design-rules.test.js` and checked on every `npm run verify`, so a screen
cannot quietly go back to wearing them.

Nothing on a screen is decorative. There is no gradient text, no texture or grid laid over a
gradient, and no serif or italic accent: a heading whose colour comes out of a gradient is
unreadable the moment the gradient runs light. The typography is one voice, the one the reader's
device already has, and the icons are one set at one weight, from the only icon package the project
depends on. A blur belongs to a scrim over a photograph, which cannot be read anyway, and never to
a card: a translucent panel is a surface nobody chose. Spacing comes from the scale rather than
from a bracket, and motion lasts 150 to 300 milliseconds and says only that something is happening.

A screen with a number to give gives one. The game opens on how far along the timeline the player
is, and the stars, the streak and the experience are a quiet line under it, because a row of three
boxes of equal weight is a row with nothing to read first. Text on the dark surfaces stays above a
measured floor: white at half strength over `#14100A` is 5.3 to 1 and over a raised surface 5.1 to
1, which is why the rule is half and not lower, and the band the game opens on is kept dark from
top to bottom so that the words on it are legible at the bottom as well as the top.

The waiting, the empty and the failed states are all drawn, because a screen that has nothing to
show has to say which nothing it is: `src/components/game/ScreenSkeleton.jsx` stands in for the map,
a quiz and a list of rows while their code arrives, the review inbox says when there is nothing to
review, a player who has never played is not shown a screen of zeroes, a report that could not be
written says so, and a device with no network and an address the app does not know both have their
own line.

One more thing was removed rather than written: `src/components/ui` now holds the one component the
screens load, and a test fails on any file in it that the application never loads. It had fifty.
The starter kit's toast was rendered on every screen and raised by nobody, and dropping it took
43 kB off the stylesheet and six off the entry file, which is the same house rule seen from the
other side: a thing nobody chose does not get to be in the app.

## What a screen reader gets, and what is left to check

Some of the accessibility of this application is a check and some of it is still a promise. The
check runs on every `npm run verify`, and it is read back from the screens rather than from their
source: `src/components/game/screens.test.js` draws every screen for real, in a browser it builds
inside the test, and hands the markup it produced to axe. A fault axe rates serious or critical
fails the run, and the test ends by drawing two deliberate faults to prove the audit still refuses
them, because a check nobody has seen fail is a check nobody knows is running.

What an audit can never read is the part of a screen a reader hears rather than sees, so the
gestures that matter are drawn and then asserted one by one. An answer is announced in words
rather than as a flag, because a boolean drawn as a child says nothing at all. A question
assembled from the lesson says what it asks for, a moved moment says which moment moved and where
it landed, a match says which term was paired with which description, and an exam says which answer
was chosen, since in an exam a change of colour is the only confirmation the screen gives. The
chronology is reordered with two named buttons rather than by dragging, and each of them names the
moment it moves, so neither is ever "the second one". The matching question is a group of choices
that answers the arrow keys and carries the focus with it. Every dialog holds the keyboard while it
is open and gives it back afterwards, every picture is described or marked as decoration, and every
field says what the browser may remember.

One thing is deliberately not done here, and it is not a detail of the code: nobody has yet sat
down with a real screen reader, NVDA on Windows or VoiceOver on a Mac or an iPhone, and gone
through a lesson and then a quiz. That session is the only way to hear the order the parts arrive
in, whether the announcements land often enough and not too often, and whether a heading a sighted
reader walks past is one a screen reader trips over. Until it happens, the automated audit is what
is covered here, and it is worth saying which of the two it is. The session itself, step by step,
with the route to follow and what counts as a failure, is written in
[ACCESSIBILITY.md](ACCESSIBILITY.md), so the next person does not start from a blank page.

## The weight of a build

A build is the one thing in this project whose size nobody decides: every change that adds a few
kilobytes adds them for a reason, and the total only shows up in somebody's download. So
`npm run verify` ends by weighing the build it just made, bundle by bundle, against two
references that refuse two different things, and against a table that has to hold every bundle
it writes.

The first is the pass recorded last time, in `build/bundle-weights.json`. Each bundle is printed
with what it weighs on disk, what it is allowed, what it weighs compressed, and how it changed
since that pass; a file more than a tenth heavier fails the verification, with both sizes and the
ratio. That is the growth somebody made this morning: a screen that started importing something
it only needs in one place, a dependency that was upgraded.

The second is an absolute budget per bundle, written by hand in `build/bundle-weight.js`: what
that bundle may weigh, whatever it weighed yesterday. It is the only thing that notices a bundle
which grew a tenth at a time, every time inside the allowance of the pass before, and which is
twice what it was after a year. A bundle past its budget fails the verification too, and the
failure names the line to change, because a budget is a decision and not a measurement. The
number is deliberately not the weight of the day: a budget set at the weight of the day fails on
the next honest feature, and a table everybody edits without reading is not a budget. The numbers
here carry room to grow into, and it is a change of direction they stop rather than a change of
size. And the table has to be complete for any of it to mean anything: a bundle the build
writes and nobody has written a line for fails the verification by name, with the kilobytes it
already weighs. It is the one refusal here whose fix is not a number: what to allow it is a
judgement, and the failure says which file to open rather than what to write in it.

The names are compared with the content hash taken out, so `assets/gameData-Ws8p2oa0.js` is
recorded as `assets/gameData.js`: the hash changes with the content, and without that every build
would look like fifty-four new files and fifty-four vanished ones.

`npm run weights:record` writes the current build down as the pass to compare against. It is a
separate command on purpose: a threshold that moves itself is not a threshold. It records weights
and never budgets, which only ever move by hand.

The recorded pass is compared with a build of the same sources, which the Node version in
`.nvmrc` turns into the same bytes wherever it runs, so the gate means the same thing on a
laptop and on the CI runner.

## What a crawler and a shared link read

The application is one page, and everything a reader meets inside it is drawn by code: a search
engine is shown the shell, and a chat shows what that shell says about itself. Three small files
carry the whole story, and the build writes all three (`build/site-files.js`).

`robots.txt` allows everything and names the sitemap, because nothing here is hidden from a
crawler: there is no private area, no account and no page behind a login. `sitemap.xml` lists the
addresses of `src/pages`, read from that folder at build time with the landing page first, so a
page added tomorrow turns up there without anybody remembering this file exists. The link preview
in `index.html` carries a title, a description and a picture drawn - like the icons - from
`public/favicon.svg`, so a shared link and the application itself cannot show two different marks.

The one thing none of them knows is the address the site is finally served from. It is handed in
at build time as `SITE_ORIGIN`, which the Pages workflow fills from the address GitHub answers for
the repository; a build without it falls back to the published address, and an address that is not
https is refused rather than written into a sitemap no crawler would fetch.
`src/lib/site-files.test.js` holds both ends of that: the addresses are the pages that exist, and
the picture the tags promise is the file on disk, 1200 by 630.

## When something breaks

A screen that fails to be drawn is the one failure with nothing left to draw it,
so the application has a boundary above its router (`src/components/AppCrash.jsx`).
It catches the three ways a screen breaks here - a value the data does not have, a
chunk that could not be fetched (a phone that opened a level while the network had
gone), and a mistake in the drawing itself - and it says three things: that it
broke, that nothing played has been lost, and what to do about it. The trace sits
behind a disclosure rather than on the page, written by a module of its own
(`src/lib/failure-report.js`) which bounds it, keeps the stack apart from the
component stack, and is tested against values that are not errors at all. Nothing
is stored and nothing is sent: the lines exist while the crash screen is open, and
the copy button is the only way they leave the device.

The failure a player cannot see for themselves is a browser that refuses to save.
A full quota, private browsing, a school browser that blocks storage: the game
keeps scoring and the afternoon disappears at the next reload. So a refused write
is remembered (`src/api/progress-store.js`) and said out loud on every screen by
the status layer, and the write still fails for its caller, so a screen that
thought it had saved knows it has not. When the browser saves again, the line goes
away on its own.

Both are written down as they happen, in a log of the session kept in the tab's
own storage (`src/lib/error-log.js`, session storage under `aq_failures_v1`): the
last dozen failures, newest first, each one a name, a message and the screen or the
place it came from, capped so that nothing here can grow. It is the one thing kept
here that survives a reload, and that is the point rather than an oversight:
reloading the page is the only thing the crash screen offers, so a log held in
memory alone would be gone at the exact moment somebody decided to look for it. A
failure that happens again is counted rather than stored again, which is what makes
a loop that throws a thousand times one line instead of a log it emptied - and a
crash loop that reloads the page goes on counting on the same line rather than
filling the dozen with itself. The list is read by the progress report a teacher
exports, so what went wrong on a tablet travels with the file rather than being
described from memory afterwards. What comes back out of that storage is read as
the device's text and not this module's own: parsed behind a guard, rebuilt into
those five fields, and capped again on the way in, because a stored list is exactly
where a sixth field would otherwise be able to get in. Nothing about any of it is
sent anywhere or about the reader: an error's own words, and where the application
was when it threw.

What is published is checked too, because a site that is not there is quiet: a
half finished deployment, a repository whose Pages setting was changed, and a
build that published an empty directory all answer at the same address.
`npm run check:site` reads the four files that say what the site is - the page,
`robots.txt`, the sitemap and the link preview - and decides what each answer
means rather than whether it arrived: a single page site answers an unknown path
with its own HTML, so a file that is missing comes back with a success status and
the wrong content. The Uptime workflow runs it once a day, and a failing run is
what tells the publisher, since GitHub notifies the owner of a scheduled workflow
that failed. That is why no third party watches this site and no secret is kept
for one.

Two screens hold long lists: the credits (seventy-eight rows of photographs) and the
bibliography (every reference of the game with its questions). Both are reference
screens, opened to settle one question, so each draws a few groups and offers the
rest, while the counts in the header stay the whole thing: what is not drawn yet
never reads as absent. And what nothing here needs is a rate limit, an API budget
or a cap on spending: the application makes no request at all after it has loaded
its own files - which the house rules check - and the only things that talk to
another machine are the on-demand checks and this one, four at a time, a quarter of
a second apart, with a timeout on every request.

## What a hundred thousand readers cost

A hundred thousand readers is not a load this application can feel, and the reason is
worth writing down rather than assuming: nothing of ours runs between them and the
files. Every request is answered by the host from a directory of static files, so readers
nobody is holding a device for cost bandwidth rather than CPU, and the only work this
project does per reader is the download `npm run weights` already reports. What is left
to worry about is the device in somebody's hand, and that is what `npm run stress`
measures.

What a hundred thousand readers can exhaust is the transfer, and it is arithmetic
rather than a guess. A first visit is the code the page loads with - the entry bundle,
the five chunks it declares beside itself and the stylesheet, one hundred and seventy-eight
kilobytes compressed, which `npm run weights` prints line by line - plus the photographs of
the map: three hundred and eighty kilobytes of card copies on an ordinary screen, six hundred and
sixty of light versions on a screen of doubled pixel density. A hundred thousand first
visits is therefore between fifty-six and eighty-four gigabytes, against the soft hundred
gigabytes a month GitHub Pages allows, and the range is the honest way to write it: which
end a month lands on is decided by the screens of the readers, not by us. Repeat visits are
answered from the browser's cache instead, since every file is content-hashed and installed
by the service worker. That threshold is worth knowing for the month a link travels, and it
is the only one there is: nothing behind these files counts the readers for us.

Two shapes are built and walked: a player who finished the game (twenty-six levels, five
hundred and forty-six questions answered once, some 55 KB of record) and the heaviest record the
importer accepts (four thousand answers, five thousand finished levels, some 800 KB).
What each path may cost is a decision kept in `src/lib/load-stress.js`, written in the
unit a reader feels it in — a tap that blocks the screen, a file that loads while
somebody waits — so the script cannot raise one on its way past.

The first run of it found the cliff this section exists to avoid: rebuilding the ceiling
record took eight hundred milliseconds, because the reader asked the growing record for
its key list once per answer and so paid the square of the number of answers. It now
costs a few milliseconds, and the budget is what keeps it there. The other number worth
knowing is the one a shared tablet meets: a browser gives one origin about 5 MB, which
holds some ninety finished players or six of the ceiling — and the ceiling only ever
arrives as an imported file, since nothing the game writes comes near it.

The stress run is deliberately not part of `npm run verify`: a timing on a shared runner
is a coin toss, and a check that fails at random is a check people learn to ignore.
Everything it decided is a table the tests read instead.

## What arrives from outside

Exactly one kind of thing does: a file a reader picks from their own device. Everything else in
this application is written here - the questions, the lessons, the references, the photographs - and
there is no server, no upload and no address of ours that accepts anything. A progress backup can
be loaded in three places (`SettingsModal.jsx`, the welcome card, and the teacher space), and all
three go through the same guard in `src/lib/progress-file.js`.

The file is weighed and typed before a single byte of it is read: two megabytes at most, which is
twice what the heaviest record the reader allows can weigh, and it has to look like a JSON document
either by name or by the type the browser declares - the picker's `accept` attribute is a hint, not
a check. What comes back is then rebuilt field by field against the known shape of a record
(`cleanProgress`), every value repaired to the type the rest of the app expects and every unknown
field dropped, so a truncated or hand-edited file cannot reach the dashboard. Nothing is ever
stored as a file, nothing is turned into a URL, and nothing is ever executed: what leaves a file is
text, and what leaves the text is a record.

Nothing a reader types is placed in the page as markup either. A name reaches the screen as a text
node and is trimmed and capped to forty characters before it is kept, a field taken from a file is
capped at the width of its column, and the application contains no `innerHTML`, no
`dangerouslySetInnerHTML` and no `eval`. A link that leaves the app opens in its own window and
carries nothing back with it. All of that is checked rather than remembered:
`src/lib/upload-guard.test.js` holds the guard, the wording of its refusals in both languages, and
the promise that no file is stored or executed, and the house rules fail on a raw HTML sink of any
kind.

One thing this application does not have is payments, and it should not look as though it does.
There is no checkout, no payment data and no webhook: the two Stripe packages the starter kit
brought along have been removed, because a manifest is a claim about what an application is. A
payment provider's webhook cannot be verified from here at all, and pretending otherwise would be
worse than saying so: a signature check needs a secret, a secret in a static site is public, and a
check that anyone can forge is not a check. It would need a small server-side handler - one that
holds the secret, verifies the signature over the raw body before it parses anything, and only then
records what it was told - which is a piece of infrastructure of its own rather than a line in this
repository.

## Legal

The application ships with a GDPR privacy notice (`/PrivacyPolicy`) and terms of use
(`/TermsOfService`), both available from the Settings screen. Because no data leaves the
device, the privacy notice describes a local-only processing model. It names the publisher, the
host and the person who answers for personal data, and `npm run check:legal` lists whatever of
those is still missing, so a store review finds the gap here rather than in a rejection email.

Nothing in the application asks a reader to agree to anything, because nothing in it collects
anything: no cookie is set, no measuring script is loaded, no font or script comes from another
origin, and no form sends a name anywhere. That is why there is no consent banner, and a banner
over an application that stores nothing would be worse than its absence: it would ask for a
permission that is not needed and teach a reader that a box is part of using an app. The rules
behind that are in `src/lib/design-rules.test.js` - an address that is not https, a script or a
picture loaded from another origin, a key or a token in a file every reader can download, a
credential, a countdown, and a box already ticked all fail the verification.

Every photograph is listed with its author, its licence and the page it was taken from,
on the photo credits screen (`/PhotoCredits`) that the Settings screen opens. The list is
built from the same table the game reads, so a picture replaced there cannot leave an old
credit behind. The credit section of the terms is written out by hand and a test keeps it
in step with that table.

Who edits the game, why it exists and how it is funded is said on its own page
(`/About`), opened from the Settings screen beside the legal pages. It reads the same
publisher facts the notices do, so it cannot name an editor they do not, and it carries the
contact address for corrections and support. How to contribute, and how to record a source
reading by hand, is written in [CONTRIBUTING.md](CONTRIBUTING.md).

Every explanation in the quiz carries a reference, and the bibliography (`/Bibliography`,
beside the credits in the Settings screen) lists all of them: the works grouped by the
institution that publishes them, each with the questions it documents and the page it was
read on where the game has one. The institutions live in
`src/components/game/publishers.js`, which the tests read as well, and the works and their
questions are derived from the levels themselves, so a reference added to the quiz turns up
on that page without anybody remembering to add it. A work whose page nobody verified is
written out in full instead of linked, the same rule the reference under a question follows.
It is not left as dead text either: each one carries a search of its publisher's own site,
and the two are shown differently, because one is an address somebody opened and the other
only opens a search. Encyclopaedia Britannica is the publisher that needs this, since its
site answers a script with a refusal, and the shape of that search is the one Wikidata
records for it rather than a guess. `npm run check:links` needs the network, so it is run by hand
rather than by the verification: it asks the registry for that shape again, and follows every
search the app offers, since a refusal is precisely what stops a link from being its own
evidence.

A verified link is a promise in two halves, and only one of them is visible from here: that the
page answers, and that it is still the work. A site that answers a retired article with a
landing page and a 200 keeps the first while breaking the second, and no build can tell, because
the page is somebody else's. `npm run check:references` follows the thirty-seven pages the verified
references point at, reads the title each one answers with, and holds it against the two names
the citation carries: the work's own, and the institution that publishes it. A page that answers
under a title naming neither is the failure it is looking for, and a page that names its
institution alone is reported as the weaker answer it is. The pages are downloaded rather than
asked about with HEAD, since a title is not part of a status code, and it is the reason this
check reads thirty-seven pages where the credits check asks about seventy-eight. Reading a title is a
heuristic and the report says so: it is not a proof that the page is the work, since only a
person can read a page, but it is the difference between a link that opens the work and a link
that opens another page. What it cannot read it does not count as confirmed: the World Heritage
Centre answers a script with a 403 on every one of its addresses, as Britannica does, so those
fourteen references are printed as unconfirmed rather than passed as checked. That is honest, and
it is also where it used to stop, since no run of a script can ever read a page it was never
handed. A person can, and `npm run check:references:record -- <url> --title "<what the tab says>"
--by "<your name>"` writes down what they read. From then on the page is reported as confirmed by
hand, under the name and the day, instead of unconfirmed.

Three things keep that from being a way to make a report green. A reading is dated and it comes
due: after a year it asks to be read again. A person may record a finding as easily as a
confirmation, and a page they read as moved or gone is reported as a failure exactly like the
machine's own, because a by-hand check is evidence and evidence goes both ways. And a person's
word only fills a silence: a page that answered under another title is today's answer about
today's page, so the two are printed together as a disagreement rather than one being quietly
preferred. The readings live in `build/reference-checks.json`, written only by that command and
read by the check, through a module of its own, `src/lib/reference-checks.js`, that the tests read
as well. Like the other two, it stays out of `npm run verify`: a gate that fails on a train is a
gate somebody turns off.
