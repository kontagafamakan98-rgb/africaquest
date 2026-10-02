# Checking a lesson and a quiz with a screen reader

Part of the accessibility of Africa History Quest is a check and part of it is a promise. The
check runs on every `npm run verify`: `src/components/game/screens.test.js` draws every screen for
real and hands the markup to axe, and a fault axe rates serious or critical fails the run. A second
job reads the built site in a real browser at the size of a phone, because that drawing lays
nothing out: seen through jsdom, the rectangle of every element is zero, so the rules axe needs a
layout engine for - the contrast of a word against what is behind it, the size of a target in real
pixels - cannot run there and were switched off. `.github/workflows/layout.yml` runs it on every
change, and it is run by hand as `npm run audit:layout`.

That same job does a second thing a markup cannot be read for: at each width it puts the pointer
away and walks the game with nothing but Tab, Shift and Tab and Enter, from the bottom bar to the
study list, a lesson, the difficulty picker and a quiz, moving a moment of the chronology and
checking the order. So by the time this session starts, a lesson and a quiz have already been
opened without a mouse, the order the focus takes has been read, the ring that shows it has been
measured against the stylesheet, and the controls that answer a press have been found to. What no
audit can read is the part of a screen a reader hears rather than sees, and that is what this
session is for. It is written down here so that the next person does not start from a blank page.

## What this session is for

axe can tell that a control has a name. It cannot hear the order the parts of a lesson arrive in,
whether an announcement lands often enough and not too often, or whether a heading a sighted
reader walks past is one a screen reader trips over. Those three questions are the whole of it,
and they are the reason a person has to sit down rather than a machine.

The keyboard is no longer one of them. `npm run audit:layout` walks a lesson and a quiz with Tab,
Shift and Tab and Enter before anybody sits down, so the order the focus takes and whether it can
be seen are already checked; the three questions above are read with the ears, and a control that
moves the focus in the right order can still announce the wrong thing.

## Before you start

Write down these five things before the first word is spoken, because a session nobody can
reproduce is a session nobody can trust:

- **The date.**
- **The reader:** your name, or the person whose ears it was.
- **The screen reader and its version:** NVDA on Windows, VoiceOver on macOS or on an iPhone.
  The two behave differently enough that a session on each is worth more than two on one.
- **The browser:** Chrome or Edge with NVDA, Safari with VoiceOver. Say which.
- **The language:** the game is written twice, in English and in French. Set it once and keep it.
  A half-session in each language is a session in neither.

Then choose where you are reading:

- **The published site**, at the address the README gives, which is what a reader really meets.
- **A local build**, with `npm run build` and then `npm run preview`, if you are checking a change
  that has not been published. Say which one you used.

## The route

One sitting covers a lesson and then a quiz, in this order. Do not skip to the quiz: the lesson is
where the headings and the announcements are densest, and a fault there is a fault a player meets
before any question.

1. The home screen: the map of the twenty-six levels.
2. Open one level and read its lesson to the end.
3. Start the quiz from the lesson, and choose one of the four settings the picker offers.
4. Answer one question of each of the four shapes the quiz draws: four answers to choose between,
   a chronology to put in order, three names to match to their descriptions, and the exam.
5. Finish the run, and read the screen it ends on.

## Checkpoints

For each checkpoint, do the thing, listen for what a pass sounds like, and treat the last line as
what counts as a failure. A failure is anything that makes a task impossible or ambiguous for a
reader who cannot see the screen. Something that is right but could be said better is a note, not
a failure, and it is worth writing down just the same.

### 1. The map, which is the home screen

Do: move through the level cards with the screen reader's own navigation, not the mouse.

Pass: every card is announced as one control with its level's name and enough of what it opens to
choose between them; the order it is read in is the order it is drawn in.

A failure is a card announced as "button" with no name, two cards announced as the same thing, a
level's icon or photograph read out as an unlabelled image, or a card that a reader cannot reach
or open at all.

### 2. The lesson

Do: read the whole lesson from the top, then move through it a second time by headings.

Pass: the lesson's name is heard first, and its sections arrive as headings in the order they are
drawn - the story, then the timeline, then the people, then the places, then the words, then the
key points. The timeline is an ordered list whose years are read with the moments they date. Each
person, place and word is read as a term and its description, not as one run of words. The
narration can be started, paused and stopped from the keyboard alone. A photograph that carries
meaning is described, and one that is decoration is silent.

A failure is a section a heading jump skips or lands on twice, a year read apart from the moment
it dates, a term and its description that cannot be told apart, a control that only the mouse can
reach, or a decorative picture that announces a file name.

### 3. The difficulty picker

Do: read the four rows, the three difficulties and the exam.

Pass: each row is one control that names the difficulty or the exam, the time it allows, how many
questions it asks, and where there is a best score, the stars. The exam is read as a setting of
its own rather than as a fourth difficulty.

A failure is a row whose name leaves out the number of questions or the time, a best score that
cannot be heard at all, or the exam announced as though it were one of the three.

### 4. The quiz

Do: answer one question of each shape. The four are worth doing one at a time, and it is worth
finishing a question before moving to the next.

- **The progress and the question.** Pass: the progress is read as a position out of a total, the
  question is read in full before its answers, and the focus moves to the question when it
  changes. A failure is a question whose text is never read, or a progress that says nothing about
  where in the run the reader is.
- **Four answers to choose between.** Pass: the answers are a group a reader moves through with
  the arrow keys, the chosen one is stated as chosen, and once the answer is checked the verdict
  is spoken as a word, correct or not. A failure is an answer that can only be chosen by sight or
  by the mouse, or a verdict carried by a colour and not by a word.
- **The chronology.** Pass: the list is read in its current order, and each moment is moved by two
  buttons named for the moment they move, so that neither is ever "the first button". A failure is
  a moment moved without the reader being told which one moved and where it landed.
- **The matching question.** Pass: each term is a group of choices named for the term, each
  description is numbered and chosen by its number, and the pairing is spoken once the question is
  checked. A failure is a description that cannot be told apart from another.
- **The exam.** Pass: the same controls as the other shapes, and no verdict until the run is
  over, with the answers remembered rather than confirmed as it goes.
- **The hint sheet, and every dialog.** Pass: the keyboard is held while the sheet is open and
  given back when it closes, and the sheet has an announced name. A failure is a dialog that loses
  the focus, does not give it back, or has no name.

One thing that is right and will feel wrong at first: the countdown is deliberately not announced
on every tick. A timer read aloud every second would talk over the question. It is not a failure
that the seconds are quiet.

### 5. The end of the run

Do: finish a run, and read the screen it ends on.

Pass: the score, the stars and what to work on are read in an order that makes sense, and the way
back is a named control.

A failure is a result that is drawn but not written, or a number with no word saying what it
counts.

## What counts as a failure, and what does not

- **A failure:** something a reader cannot do without sight, or would have to guess at, that a
  sighted reader does without thinking. Each one is worth an issue, written in the reader's own
  words rather than a paraphrase, because the wording heard is the evidence.
- **A note:** something that is right but could be said better, or said less. Write it beside the
  session; it is not a failure.
- **Not a failure here:** anything the automated audit already covers, such as a missing name, a
  contrast fault or a picture with no description. If axe can see it, `npm run verify` has already
  refused it, and spending the session on it spends the session on the half that is already
  checked.

## Recording the session

[ACCESSIBILITY_SESSION.md](ACCESSIBILITY_SESSION.md) is that recording, already laid out: the five
things to write down before the first word, one line per checkpoint to mark pass, note or failure,
and a place for the words heard under each. Copy it and fill it in as you go, rather than writing
the session up afterwards - the wording is the evidence, and it is the first thing to go.

Write down, in this order: the five things from "Before you start"; then each checkpoint, marked
pass, note or failure; then, for every failure, the exact words heard and the step that produced
them. A recording that says "the chronology was confusing" cannot be fixed; one that says which
button said what, and what happened instead, can.

A failure becomes an issue, and the issue is closed by a change that `npm run verify` accepts like
any other. When a session has gone through a lesson and then a quiz without a failure, say so where
the project keeps the promise: the paragraph in `README.md` under "What a screen reader gets, and
what is left to check" says that the session is still owed, and it should stop saying that on the
day it is no longer true.
