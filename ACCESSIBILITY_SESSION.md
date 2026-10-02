# A screen reader session, filled in

The other half of the accessibility of this application is a promise, and this is the page it is
kept on. What to do, step by step, and what counts as a failure, is written in
[ACCESSIBILITY.md](ACCESSIBILITY.md). This file is the form to fill **while you do it**.

Copy it, keep it beside you, and write in it as you go. A session written up afterwards is a
session where the wording has already been forgotten, and the wording is the evidence: "the
chronology was confusing" cannot be fixed, "the second button said 'Move up' after I had already
moved it" can.

Nothing here needs a machine to run. A pass is a sentence you heard, a note is something right
that could be said better, and a failure is something a reader cannot do without sight.

## Before you start

Answer all of this before the first word is spoken. A session nobody can reproduce is a session
nobody can trust.

- **Date:**
- **Reader:** (your name, or the person whose ears it was)
- **Screen reader and its version:** (NVDA on Windows, VoiceOver on macOS or on an iPhone)
- **Browser:** (Chrome or Edge with NVDA, Safari with VoiceOver)
- **Where you are reading:** the published site, or a local build (`npm run build`, then
  `npm run preview`)
- **The address, or the build you read:** (a released version, or the branch you built)
- **Language:** English or French, and the same one for the whole sitting. A half-session in each
  language is a session in neither.
- **Anything else true of the day:** (a phone rather than a laptop, headphones, a slow machine)

## The route

Tick each one as it is finished. Do not skip to the quiz: the lesson is where the headings and the
announcements are densest, and a fault there is a fault a player meets before any question.

- [ ] 1. The home screen: the map of the twenty-six levels.
- [ ] 2. Open one level and read its lesson to the end.
- [ ] 3. Start the quiz from the lesson, and choose one of the four settings the picker offers.
- [ ] 4. Answer one question of each of the four shapes the quiz draws: four answers to choose
      between, a chronology to put in order, three names to match to their descriptions, and the
      exam.
- [ ] 5. Finish the run, and read the screen it ends on.

## Checkpoints

For each one: do the thing, listen, then mark it while you still have it in your ears.

Mark it **pass**, **note** or **failure**. "Pass" is the paragraph of that name in
ACCESSIBILITY.md; "failure" is the last line of that section, and nothing else is one. A failure
always wants the reader's own words, never a paraphrase.

### 1. The map, which is the home screen

Result: pass / note / failure

What was heard:

### 2. The lesson

Result: pass / note / failure

What was heard:

### 3. The difficulty picker

Result: pass / note / failure

What was heard:

### 4. The quiz

One mark per shape, because a fault in one shape is not a fault in the others. Answer a whole
question before moving to the next one.

**The progress and the question**

Result: pass / note / failure

What was heard:

**Four answers to choose between**

Result: pass / note / failure

What was heard:

**The chronology**

Result: pass / note / failure

What was heard:

**The matching question**

Result: pass / note / failure

What was heard:

**The exam**

Result: pass / note / failure

What was heard:

**The hint sheet, and every dialog**

Result: pass / note / failure

What was heard:

### 5. The end of the run

Result: pass / note / failure

What was heard:

## One thing that is not a failure

The countdown is deliberately not announced on every tick, and the seconds being quiet will feel
wrong at first. A timer read aloud every second would talk over the question. Write it down as a
note at most.

## What is not worth the session either

Anything the automated audit already covers: a control with no name, a contrast fault, a picture
with no description, a word that cannot be read against what is behind it, a target too small to
aim at, a row that has to be scrolled with a finger. Add to that the whole of the keyboard, since
`npm run audit:layout` now walks a lesson and a quiz with Tab, Shift and Tab and Enter: a control
a Tab never reaches, a focus ring that cannot be seen, a button that does nothing when it is
pressed, an order the focus takes that is not the one the screen is drawn in. `npm run verify` has
already refused the first three, the layout audit reads the rest in a real browser at the size of
a phone, and spending the session on any of them spends it on the half that is already checked.
What is left for the ears is the wording the keyboard pass can never hear: what each control
announces when the focus arrives on it, and what it says once it is pressed.

## The session in one page

- Checkpoints marked pass:
- Checkpoints marked note:
- Checkpoints marked failure:

For each failure, the next three lines, because a failure becomes an issue:

1. **What was being done:** (the checkpoint and the shape)
2. **What was heard, word for word:**
3. **What happened instead, or what could not be done:**

## Where this goes when the sitting is over

- **A failure:** one issue per failure, titled with what could not be done and quoting the words
  heard. The issue is closed by a change that `npm run verify` accepts like any other.
- **A note:** kept here, beside the session. A note is not an issue.
- **No failure at all:** say so where the project keeps this promise. The paragraph in
  [README.md](README.md) under "What a screen reader gets, and what is left to check" says the
  session is still owed, and it should stop saying that on the day it is no longer true.
- **Either way:** keep this filled page with the project, named for the day it was made, so the
  next session can start from what this one heard rather than from a blank page.
