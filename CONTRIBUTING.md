# Contributing

Africa History Quest is a small, self-contained project: one React application,
no server, everything it needs in the repository. This page is what to know
before you change it.

## Running it

```bash
npm install
npm run dev
```

## Before you send a change

```bash
npm run verify
```

That runs every gate the project has: translations, photograph budgets, the
icon set, the brief the first screen reads, the tests and the house rules, the
linters, the type annotations read two ways, and then a production build that
the last step weighs. It takes about forty seconds and it is the same command
the CI runs, so a green run here is a green run there.

`npm run stress` and the network checks (`check:links`, `check:photos`,
`check:references`, `check:site`) are run by hand and are deliberately outside
`verify`, because a timing on a shared machine and a page on somebody else's
server are both things that fail at random.

## What the tests do

Two kinds of test live here. Most read the source as text, which is what catches
a rule broken on purpose. A few draw the application for real: the runner
bundles the quiz, the review and the statistics screens together with the
teacher page, renders them in a jsdom window, and hands the markup to axe, so a
screen that throws while it draws, or a control that reaches a reader with no
name, fails here instead of in front of a player. That is the reason `jsdom`,
`axe-core` and `esbuild` sit in the development dependencies.

The half of accessibility no test can reach - sitting down with NVDA or
VoiceOver and going through a lesson and then a quiz - is written out step by
step, with what counts as a failure, in [ACCESSIBILITY.md](ACCESSIBILITY.md).
[ACCESSIBILITY_SESSION.md](ACCESSIBILITY_SESSION.md) is the same sitting as a form
to fill in as you go, one line per checkpoint, because the wording heard is the
evidence and it is the first thing to go.

## House rules

The rules in `src/lib/design-rules.test.js` are the taste of this project, and
the build fails on each of them by name: no emoji, no em dash or en dash, one
icon set at one weight, no serif or italic, no purple or violet, no gradient
text, no second web font, no measured script, no payment library. Read the file
before fighting it: each rule says why it exists.

Keep the README lines at a hundred characters or fewer. Every wording must exist
in both languages: `npm run check:translations` fails on a line that is missing
its French.

## Adding or changing a question

- The English question lives in `LEVELS` in
  `src/components/game/gameData.js`; its French wording lives in
  `src/components/game/content-fr.js`, question for question and option for
  option, in the same order.
- Every question needs a source. Use a label, and an `https` link when there is
  a page for it. A link that is not https fails the verification.
- The correct answer index belongs to the English entry alone, so a translation
  can never mark a different answer.
- After editing, run `npm run level:facts` to regenerate the brief the first
  screen reads, then `npm run verify`.
- A level holds between ten and fifteen questions; keep a new one inside that
  range.

## How to check a source

Some pages the game cites answer a script with a refusal. The World Heritage
Centre returns a 403 on every one of its addresses, and Britannica does too, so
no automated run can ever read them. A person can, and the record of that
reading is what closes the gap.

1. Run `npm run check:references`. It follows the pages the verified references
   point at, reads the title each one answers with, and prints the ones it could
   not confirm rather than passing them quietly.
2. Open one of those pages in a browser and read its title.
3. Record what you read, with your name and the day:

```bash
npm run check:references:record -- <url> --title "<the title the tab shows>" --by "<your name>"
```

A reading is dated, and it comes due after a year. You can record a page you
found moved or gone just as easily as one you confirmed: a by-hand check is
evidence in both directions, and it is reported as a failure exactly like the
machine's own. A page that answered under another title is printed beside your
reading as a disagreement rather than one quietly winning. The readings live in
`build/reference-checks.json`, written only by that command.

## The words

Corrections to a date, a name or an attribution are the most useful thing you
can send, and so are better sources. If a fact cannot be sourced, it does not
belong in the quiz.
