/**
 * Complete verification runner for Africa History Quest.
 *
 * Runs all content checks, tests, linting, and build in order,
 * failing fast at the first error with a clear, readable summary.
 *
 * Usage:
 *   node scripts/verify.mjs
 *   npm run verify
 */

import { spawnSync } from "node:child_process";
import { performance } from "node:perf_hooks";

const STEPS = [
  {
    id: "translations",
    name: "Contrôle des traductions",
    command: process.execPath,
    args: ["scripts/check-translations.mjs"],
  },
  {
    id: "photos",
    name: "Budget et intégrité des photographies",
    command: process.execPath,
    args: ["scripts/optimize-photos.mjs", "--check"],
  },
  {
    id: "icons",
    name: "Icônes de l'application",
    command: process.execPath,
    args: ["scripts/generate-icons.mjs", "--check"],
  },
  // The icon the Windows installer wears, drawn from the same favicon as the
  // browser icons above: a check rather than a generation, so a favicon that
  // changed without the desktop icon following it stops the verification here
  // rather than being noticed on somebody's desktop.
  {
    id: "desktop-icon",
    name: "Icône de l'application Windows (Setup)",
    command: process.execPath,
    args: ["scripts/generate-desktop-icon.mjs", "--check"],
  },
  {
    id: "facts",
    name: "Bref du jeu (premier écran)",
    command: process.execPath,
    args: ["scripts/generate-level-facts.mjs", "--check"],
  },
  {
    id: "levels",
    name: "Contenu par niveau (la leçon télécharge un niveau)",
    command: process.execPath,
    args: ["scripts/generate-level-content.mjs", "--check"],
  },
  {
    id: "tests",
    name: "Tests unitaires et règles de design",
    command: process.execPath,
    args: ["--test"],
  },
  {
    id: "lint",
    name: "Linters ESLint (qualité du code)",
    command: process.execPath,
    args: ["./node_modules/eslint/bin/eslint.js", ".", "--quiet"],
  },
  // The one gate that reads the code without running it: it holds the JSDoc
  // annotations to what the functions actually do, so a parameter typed as
  // narrower than it is - which is how a whole afternoon of stored progress once
  // read as an impossible shape - is an error here rather than a surprise later.
  // It reads the program jsconfig.json declares, which leaves the test files out
  // on purpose: they run under Node and are not part of what ships.
  {
    id: "types",
    name: "Annotations et types (tsc)",
    command: process.execPath,
    args: ["./node_modules/typescript/bin/tsc", "-p", "./jsconfig.json"],
  },
  // The other half of the same gate, and the reason the first half can afford to
  // stay browser only: the two modules under src/lib that call Node's own
  // libraries - the one that draws the icons, the one that hashes a photograph -
  // are read here, with Node's typings, against their own declared program.
  // Between the two, every file under src is checked, and neither program has to
  // pretend to be the other.
  {
    id: "tooling-types",
    name: "Annotations des modules de build (tsc, Node)",
    command: process.execPath,
    args: ["./node_modules/typescript/bin/tsc", "-p", "./jsconfig.node.json"],
  },
  {
    id: "build",
    name: "Production bundle (Vite + Service Worker)",
    command: process.execPath,
    args: ["./node_modules/vite/bin/vite.js", "build"],
  },
  // It reads dist/sw.js, which the bundle above writes, so it is here rather than
  // among the unit tests: a test that read an artifact of another step would fail
  // on a fresh checkout, where the tests run before there is anything in dist.
  {
    id: "worker",
    name: "Service worker (l'installation et les scripts qu'il nomme)",
    command: process.execPath,
    args: ["scripts/check-worker.mjs"],
  },
  // Last, because it weighs the output of another one too: it reads dist, and what
  // it says is what this build cost, bundle by bundle, against the pass it is
  // compared with and the budget each one is allowed.
  {
    id: "weights",
    name: "Poids des ballots (seuil, budget et table complète)",
    command: process.execPath,
    args: ["scripts/report-weights.mjs"],
  },
];

console.log("\n🔍 Démarrage de la vérification complète...\n");

const results = [];
const overallStart = performance.now();
let failedStep = null;

for (let i = 0; i < STEPS.length; i++) {
  const step = STEPS[i];
  const stepNumber = `[${i + 1}/${STEPS.length}]`;
  process.stdout.write(`${stepNumber} ${step.name}... `);

  const stepStart = performance.now();
  const res = spawnSync(step.command, step.args, {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  const elapsedMs = Math.round(performance.now() - stepStart);
  const elapsedSec = (elapsedMs / 1000).toFixed(2);

  const passed = res.status === 0;

  if (passed) {
    console.log(`✓ OK (${elapsedSec}s)`);
    // Print meaningful high-level output if available (e.g. translation count or photo stats)
    if (step.id === "translations" && res.stdout) {
      const summaryLine = res.stdout.trim().split("\n")[0];
      console.log(`    ↳ ${summaryLine}`);
    } else if ((step.id === "photos" || step.id === "icons" || step.id === "desktop-icon") && res.stdout) {
      const lines = res.stdout.trim().split("\n");
      console.log(`    ↳ ${lines[0]}`);
      // A photograph is prepared in two formats and sometimes a third, and what
      // a device installs is the lightest of them: those are the lines worth
      // reading here, and the count of AVIF is the part of it that only shows on
      // some pictures.
      const light = lines.find((line) => line.includes("light versions"));
      if (light) console.log(`    ↳ ${light.trim()}`);
      const third = lines.find((line) => line.includes("AVIF"));
      if (third) console.log(`    ↳ ${third.trim()}`);
      // The thumbnails are the weight of one screen rather than of a lesson, so
      // they are reported apart: what that line says is what the list of
      // credits costs to open.
      const thumbnails = lines.find((line) => line.includes("thumbnails"));
      if (thumbnails) console.log(`    ↳ ${thumbnails.trim()}`);
    } else if (step.id === "facts" && res.stdout) {
      const lines = res.stdout.trim().split("\n");
      console.log(`    ↳ ${lines[0]}`);
      if (lines[1]) console.log(`    ↳ ${lines[1].trim()}`);
    } else if (step.id === "tests" && res.stdout) {
      const passLine = res.stdout
        .split("\n")
        .find((l) => l.trim().startsWith("ℹ pass"));
      const totalLine = res.stdout
        .split("\n")
        .find((l) => l.trim().startsWith("ℹ tests"));
      if (passLine && totalLine) {
        console.log(`    ↳ ${totalLine.trim()} (${passLine.trim()})`);
      }
    } else if (step.id === "build" && res.stdout) {
      const offlineLine = res.stdout
        .split("\n")
        .find((l) => l.includes("offline: cached"));
      if (offlineLine) {
        const clean = offlineLine.replace(/^.*\[plugin africa-quest-offline\]\s*/, "");
        console.log(`    ↳ ${clean}`);
      }
    } else if (step.id === "worker" && res.stdout) {
      // The check says what the build named, in two lines, and a step that prints
      // nothing on success reads as a step that did nothing.
      for (const line of res.stdout.trim().split("\n")) {
        if (line.trim().length > 0) console.log(`    ↳ ${line.trim()}`);
      }
    } else if (step.id === "types" || step.id === "tooling-types") {
      // tsc says nothing at all when it is happy, which is exactly why it needs a
      // line here: a step that prints nothing reads as a step that did nothing.
      // The name of the config is the name of the program it read, since there
      // are two of them now.
      const config = step.args[step.args.length - 1];
      console.log(`    ↳ no type error in the program ${config} declares`);
    } else if (step.id === "weights" && res.stdout) {
      // The report is the step: one line per bundle of the application, and what
      // each of them weighs against the pass it is compared with. It is read in
      // full here, capped only so that a build with hundreds of bundles cannot
      // bury the summary that follows it.
      for (const line of res.stdout.trim().split("\n").slice(0, 40)) {
        console.log(`    ↳ ${line.trim()}`);
      }
    }

    results.push({ ...step, status: "passed", duration: elapsedSec });
  } else {
    console.log(`✗ ÉCHEC (${elapsedSec}s)`);
    results.push({ ...step, status: "failed", duration: elapsedSec });
    failedStep = {
      ...step,
      stdout: res.stdout,
      stderr: res.stderr,
      code: res.status,
    };
    // Fail fast immediately!
    break;
  }
}

const totalSec = ((performance.now() - overallStart) / 1000).toFixed(2);

console.log("\n" + "=".repeat(60));
console.log("RÉSUMÉ DE LA VÉRIFICATION");
console.log("=".repeat(60));

for (const step of STEPS) {
  const recorded = results.find((r) => r.id === step.id);
  if (!recorded) {
    console.log(`  - ${step.name.padEnd(46)} [ IGNORÉ ]`);
  } else if (recorded.status === "passed") {
    console.log(`  ✓ ${step.name.padEnd(46)} [ PASSÉ en ${recorded.duration}s ]`);
  } else {
    console.log(`  ✗ ${step.name.padEnd(46)} [ ÉCHOUÉ en ${recorded.duration}s ]`);
  }
}

console.log("=".repeat(60));

if (failedStep) {
  console.error(`\n❌ Échec à l'étape : ${failedStep.name}`);
  if (failedStep.stdout?.trim()) {
    console.error("\n--- Sortie standard (stdout) ---");
    console.error(failedStep.stdout.trim());
  }
  if (failedStep.stderr?.trim()) {
    console.error("\n--- Erreurs (stderr) ---");
    console.error(failedStep.stderr.trim());
  }
  console.error(`\nTemps écoulé avant l'échec : ${totalSec}s\n`);
  process.exit(failedStep.code || 1);
} else {
  console.log(`\n🎉 Tout est conforme ! Tous les contrôles ont réussi en ${totalSec}s.\n`);
  process.exit(0);
}
