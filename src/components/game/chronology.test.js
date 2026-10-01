import test from "node:test";
import assert from "node:assert/strict";
// Explicit extensions: the file is also loaded directly by the test runner.
import { LEVEL_STUDY } from "./level-study.js";
import {
  CHRONOLOGY_STEPS,
  chronologyQuestion,
  isChronological,
  momentYear,
  movedMoment,
  shuffledOrder,
  spreadMoments,
} from "./chronology.js";

const LEVEL_IDS = Object.keys(LEVEL_STUDY)
  .map(Number)
  .sort((one, other) => one - other);
const LANGUAGES = ["en", "fr"];
/** Every lesson's study pack, in both languages, as the lesson screen reads it. */
const PACKS = LEVEL_IDS.flatMap((id) => LANGUAGES.map((lang) => ({ id, lang, study: LEVEL_STUDY[id][lang] })));

test("every lesson dates enough moments to ask a chronology question", () => {
  // The question is built from the lesson's own timeline, so a lesson whose
  // timeline is too short simply asks none - which is why it is a content rule
  // rather than a screen's problem, and why it is refused here rather than
  // discovered by a player looking at a question with an empty row in it.
  for (const { id, lang, study } of PACKS) {
    const where = `level ${id} (${lang})`;
    assert.ok(
      Array.isArray(study.timeline) && study.timeline.length >= CHRONOLOGY_STEPS,
      `${where}: the timeline holds ${study.timeline?.length ?? 0} moments, and a chronology question asks ${CHRONOLOGY_STEPS}`
    );
    study.timeline.forEach((moment, position) => {
      assert.ok(
        typeof moment.year === "string" && moment.year.trim().length > 0,
        `${where}: moment ${position + 1} has no date`
      );
      assert.ok(
        typeof moment.text === "string" && moment.text.trim().length > 0,
        `${where}: moment ${position + 1} says nothing`
      );
    });
    assert.ok(chronologyQuestion(study, id), `${where}: no chronology question can be built`);
  }

  // The whole game is illustrated and written, not a sample of it.
  assert.equal(PACKS.length, 52, "twenty-six lessons, each in two languages");
});

test("a lesson's timeline is written in the order it tells", () => {
  // The one claim the question cannot check for itself. A timeline written back
  // to front draws perfectly well on the lesson screen and would be the answer
  // to a question asking the reverse of the truth, so the dates are read back
  // and held to the order they are written in.
  for (const { id, lang, study } of PACKS) {
    const years = study.timeline.map((moment) => {
      const year = momentYear(moment.year);
      assert.notEqual(year, null, `level ${id} (${lang}): "${moment.year}" cannot be read as a date`);
      return year;
    });
    for (let position = 1; position < years.length; position += 1) {
      assert.ok(
        years[position] >= years[position - 1],
        `level ${id} (${lang}): "${study.timeline[position].year}" comes after "${study.timeline[position - 1].year}"`
      );
    }
  }
});

test("a date is read the way its own language writes it", () => {
  // The readings the two languages need, including the pairs that look alike
  // and mean the opposite: a depth of years counts backwards, and a date before
  // the common era counts backwards from it.
  const readings = [
    ["c. 3100 BC", -3100],
    ["v. 3100 av. J.-C.", -3100],
    ["196 BC", -196],
    ["c. 300 AD", 300],
    ["v. 300 apr. J.-C.", 300],
    ["c. 2560 BC to 1279 BC", -2560],
    ["v. 3100 av. J.-C. à 30 apr. J.-C.", -3100],
    ["c. 315,000 years ago", -315000],
    ["v. 315 000 ans", -315000],
    ["c. 3.3 million years ago", -3300000],
    ["v. 3,3 millions d'années", -3300000],
    ["1520s", 1520],
    ["années 1520", 1520],
    ["1353", 1353],
  ];
  for (const [label, year] of readings) {
    assert.equal(momentYear(label), year, `"${label}"`);
  }
  // Nothing readable is null rather than a made up zero, so the test above can
  // tell an unreadable date from one that really stands at the year zero.
  for (const label of ["", "   ", "later", "sometime after that", null, undefined]) {
    assert.equal(momentYear(label), null, JSON.stringify(label));
  }
});

test("the moments asked for are the shape of the whole period", () => {
  // The first and the last moment of the lesson always appear, and the ones
  // between them are taken from what is left: four neighbouring events would be
  // a question about one decade rather than about the period.
  for (const { id, lang, study } of PACKS) {
    const question = chronologyQuestion(study, id);
    const timeline = study.timeline;
    assert.equal(question.steps.length, CHRONOLOGY_STEPS, `level ${id} (${lang})`);
    assert.equal(new Set(question.steps).size, CHRONOLOGY_STEPS, `level ${id} (${lang}): a moment appears twice`);
    assert.equal(question.years.length, CHRONOLOGY_STEPS, `level ${id} (${lang})`);
    assert.equal(
      question.steps[0],
      timeline[0].text,
      `level ${id} (${lang}): the question does not open on the first moment of the lesson`
    );
    assert.equal(
      question.steps[CHRONOLOGY_STEPS - 1],
      timeline[timeline.length - 1].text,
      `level ${id} (${lang}): and does not close on the last`
    );

    // The answer is the order the moments are written in, and the order they are
    // shown in is never that one.
    assert.deepEqual(
      question.steps.map((text) => text),
      spreadMoments(timeline.length).map((position) => timeline[position].text),
      `level ${id} (${lang})`
    );
    assert.ok(
      !isChronological(question.order),
      `level ${id} (${lang}): the moments are handed over already in order`
    );
    assert.deepEqual(
      [...question.order].sort((one, other) => one - other),
      [0, 1, 2, 3],
      `level ${id} (${lang}): the shown order is not an arrangement of the moments`
    );
  }
});

test("the same lesson asks the same question, in either language", () => {
  // The question is rebuilt on every render, so what it holds has to be stable:
  // a real shuffle would move the moments under the player's hands between two
  // keystrokes. And the arrangement is the level's, not the language's, so a
  // reader who switches language mid-quiz is not handed a different question.
  for (const id of LEVEL_IDS) {
    const english = chronologyQuestion(LEVEL_STUDY[id].en, id);
    const french = chronologyQuestion(LEVEL_STUDY[id].fr, id);
    assert.deepEqual(english, chronologyQuestion(LEVEL_STUDY[id].en, id), `level ${id} asks two things`);
    assert.deepEqual(english.order, french.order, `level ${id}: the two languages show different orders`);
    assert.notDeepEqual(english.steps, french.steps, `level ${id}: the two languages ask the same words`);
  }

  // A shuffle that came out sorted is rotated rather than handed over: a
  // question already in order asks nothing at all.
  for (let seed = -20; seed <= 200; seed += 1) {
    for (const count of [2, 3, 4, 5, 6]) {
      const order = shuffledOrder(count, seed);
      assert.equal(new Set(order).size, count, `seed ${seed}, ${count} moments: not an arrangement`);
      assert.ok(!isChronological(order), `seed ${seed}, ${count} moments: handed over in order`);
      assert.deepEqual(order, shuffledOrder(count, seed), `seed ${seed}: the shuffle is not repeatable`);
    }
  }
});

test("a lesson that cannot carry a chronology question asks none", () => {
  // Null rather than a question with a hole in it, and rather than a crash: the
  // quiz asks what it has.
  const full = LEVEL_STUDY[LEVEL_IDS[0]].en;
  assert.equal(chronologyQuestion(undefined, 1), null);
  assert.equal(chronologyQuestion(null, 1), null);
  assert.equal(chronologyQuestion({}, 1), null);
  assert.equal(chronologyQuestion({ timeline: [] }, 1), null);
  assert.equal(chronologyQuestion({ timeline: full.timeline.slice(0, 3) }, 1), null);

  // A moment with no date would be a row whose answer nobody could give.
  const undated = {
    timeline: full.timeline.map((moment, position) => (position === 2 ? { ...moment, year: "  " } : moment)),
  };
  assert.equal(chronologyQuestion(undated, 1), null);
});

test("an arrangement is right only when every moment is in its place", () => {
  assert.equal(isChronological([0, 1, 2, 3]), true);
  // A nearly right answer is a wrong one: one question, one point, and the
  // screen says which rows are right rather than paying for the others.
  assert.equal(isChronological([0, 1, 3, 2]), false);
  assert.equal(isChronological([1, 0, 2, 3]), false);
  assert.equal(isChronological([]), false);
  assert.equal(isChronological(null), false);
  assert.equal(isChronological(undefined), false);
});

test("a moment moved off either end stays where it is", () => {
  const order = [2, 0, 3, 1];
  assert.deepEqual(movedMoment(order, 0, -1), order, "the first moment cannot move up");
  assert.deepEqual(movedMoment(order, 3, 1), order, "the last cannot move down");
  assert.deepEqual(movedMoment(order, 0, 1), [0, 2, 3, 1]);
  assert.deepEqual(movedMoment(order, 3, -1), [2, 0, 1, 3]);
  assert.deepEqual(order, [2, 0, 3, 1], "the arrangement it was given is left alone");
  assert.deepEqual(movedMoment(null, 0, 1), null);
});

test("the moments asked for are spread over the timeline", () => {
  // Read from the length alone, so the same timeline always yields the same
  // moments, and the ends are always in.
  assert.deepEqual(spreadMoments(5), [0, 1, 3, 4]);
  assert.deepEqual(spreadMoments(6), [0, 2, 3, 5]);
  assert.deepEqual(spreadMoments(8), [0, 2, 5, 7]);
  assert.deepEqual(spreadMoments(4), [0, 1, 2, 3]);
  // A timeline shorter than the question asks for is handed over whole rather
  // than padded.
  assert.deepEqual(spreadMoments(3), [0, 1, 2]);
  assert.deepEqual(spreadMoments(1), [0]);
  assert.deepEqual(spreadMoments(0), []);
  for (let total = 1; total <= 20; total += 1) {
    const spread = spreadMoments(total);
    assert.ok(spread.length <= CHRONOLOGY_STEPS, `${total} moments: asks for more than there are`);
    assert.equal(new Set(spread).size, spread.length, `${total} moments: the same moment twice`);
    assert.ok(spread.every((position) => position >= 0 && position < total), `${total} moments: off the end`);
  }
});
