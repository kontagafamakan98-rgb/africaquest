import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

// The workflow is the gate a change passes before it reaches main, and it is
// the only place the project's checks are wired together outside somebody's
// machine. It is also a file nobody opens: a step quietly removed, a trigger
// narrowed to one branch, or a failing command told to continue anyway would
// leave every badge green and nothing checked. These tests read it the way the
// runner does, and hold it to the one command the project verifies itself with.

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const WORKFLOW_FILE = path.join(ROOT, ".github", "workflows", "verify.yml");
const workflow = readFileSync(WORKFLOW_FILE, "utf8");
const pagesFile = path.join(ROOT, ".github", "workflows", "pages.yml");
const pages = readFileSync(pagesFile, "utf8");
const nvmrc = readFileSync(path.join(ROOT, ".nvmrc"), "utf8").trim();
const { engines, scripts } = JSON.parse(readFileSync(path.join(ROOT, "package.json"), "utf8"));

/**
 * What a shell says about one script, retried while the shell itself is what
 * would not start: a machine that cannot fork a process twice in a row says
 * nothing about the script, and a check that failed on that would be a check
 * people learn to ignore.
 */
function shellSays(script) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const checked = spawnSync("bash", ["-n"], { input: script, encoding: "utf8" });
    if (!checked.error && checked.status !== null) {
      return { ok: checked.status === 0, why: (checked.stderr || "").trim() };
    }
  }
  return { ok: false, why: "bash itself could not be started, so the shell was not read" };
}

/**
 * Every `run:` of a workflow, as the runner hands it to the shell: an inline
 * command as it is, and a block scalar unindented by the indentation it was
 * written with.
 */
function shellBlocks(source) {
  const lines = source.split("\n");
  const blocks = [];

  for (let index = 0; index < lines.length; index += 1) {
    const match = /^(\s*)run:\s*(.*)$/.exec(lines[index]);
    if (!match) continue;
    const [, indent, rest] = match;
    if (rest.trim() !== "" && rest.trim() !== "|" && rest.trim() !== ">") {
      blocks.push(rest);
      continue;
    }

    const body = [];
    for (let next = index + 1; next < lines.length; next += 1) {
      const line = lines[next];
      if (line.trim() !== "" && line.search(/\S/) <= indent.length) break;
      body.push(line.slice(Math.min(line.length, indent.length + 2)));
    }
    blocks.push(body.join("\n"));
  }

  return blocks;
}

/** The `on:` block alone, so a trigger is never found in a comment above it. */
function triggerBlock(source) {
  const start = source.search(/^on:/m);
  assert.ok(start > 0, "the workflow says when it runs");
  const end = source.indexOf("\njobs:", start);
  assert.ok(end > start, "the triggers come before the job they start");
  return source.slice(start, end);
}

test("the verification runs on every pull request and on every push to main", () => {
  assert.ok(existsSync(WORKFLOW_FILE), ".github/workflows/verify.yml");

  const triggers = triggerBlock(workflow);
  assert.match(triggers, /^ {2}pull_request:/m, "a pull request is verified");

  const push = triggers.slice(triggers.indexOf("push:"));
  assert.ok(push.length > 0, "a push is verified");
  assert.match(push, /branches:\s*\[?main\]?/, "the push trigger watches main");

  // The gate is only worth something if a failure stops it.
  assert.doesNotMatch(workflow, /continue-on-error:\s*true/, "a failing verification is not ignored");
  assert.match(workflow, /^permissions:\n {2}contents: read/m, "the job only reads the repository");
  assert.match(workflow, /concurrency:/, "a run that has been pushed over is cancelled");
  assert.match(workflow, /timeout-minutes:\s*\d+/, "a hung job cannot hold a runner for hours");

  // What runs is the real command, after the dependencies it needs.
  const installed = workflow.indexOf("run: npm ci");
  const verified = workflow.indexOf("run: npm run verify");
  assert.ok(installed > 0, "the dependencies are installed from the lockfile");
  assert.ok(verified > installed, "the verification runs after the dependencies are installed");
  assert.match(scripts.verify, /scripts\/verify\.mjs/, "and it is the script a developer runs");
});

test("the workflow runs on the Node version the app is developed on", () => {
  assert.match(nvmrc, /^\d+(\.\d+){0,2}$/, ".nvmrc names one version");
  assert.match(workflow, /node-version-file:\s*\.nvmrc/, "the workflow reads that same file");
  assert.match(workflow, /cache:\s*npm/, "the npm cache is reused between runs");

  const declared = engines?.node;
  assert.match(declared || "", /^>=\d+/, "package.json says which Node versions the app runs on");

  const floor = Number(declared.replace(/[^\d.]/g, "").split(".")[0]);
  const pinned = Number(nvmrc.split(".")[0]);
  assert.ok(floor >= 22, `Node 22 is the oldest line still maintained, and ${declared} is older`);
  assert.ok(pinned >= floor, `.nvmrc names Node ${nvmrc}, below the declared minimum ${declared}`);
});

test("the built application is published to Pages on every push to main", () => {
  assert.ok(existsSync(pagesFile), ".github/workflows/pages.yml");

  const triggers = triggerBlock(pages);
  const push = triggers.slice(triggers.indexOf("push:"));
  assert.match(push, /branches:\s*\[?main\]?/, "the site follows main");
  assert.match(triggers, /workflow_dispatch:/, "and can be published by hand");

  // A deployment already in flight is allowed to finish: cutting it off would
  // leave the site between two versions.
  assert.match(
    pages,
    /^concurrency:\n {2}group: pages\n {2}cancel-in-progress: false$/m,
    "one deployment at a time, and none interrupted"
  );

  // Reading is all the build needs; writing is the publication's business. The
  // Pages setting is one of the things it reads, since that is what decides
  // whether there is anywhere to publish to.
  assert.match(
    pages,
    /^permissions:\n {2}contents: read\n {2}pages: read$/m,
    "the build only reads the repository, and the Pages setting"
  );
  assert.doesNotMatch(pages, /contents: write/, "the build may write to the repository");
  assert.match(
    pages,
    /^ {4}permissions:\n {6}pages: write\n {6}id-token: write$/m,
    "the publication is the only step allowed to write"
  );
  assert.match(pages, /^ {4}environment:\n {6}name: github-pages$/m, "the run is tied to the Pages environment");
  assert.match(pages, /^ {4}needs: build$/m, "the publication waits for the build");
  assert.match(pages, /actions\/upload-pages-artifact@v\d+\n\s+with:\n\s+path: dist/, "the built site is published");
  assert.match(pages, /actions\/deploy-pages@v\d+/, "through the Pages deployment");

  // The service worker travels inside dist, and a deep link has to reach the
  // application: a single page site has no other file to serve for one. Both
  // are the build's own doing, so the workflow publishes the build untouched
  // rather than patching it on its way out, and what is deployed is what
  // `npm run build` produces on any machine.
  const viteConfig = readFileSync(path.join(ROOT, "vite.config.js"), "utf8");
  assert.match(viteConfig, /pagesFallback\(\)/, "the build writes the page an unknown path is answered with");
  assert.match(
    viteConfig,
    /pagesFallback\(\)[\s\S]{0,400}offlineApp\(/,
    "before the worker lists what the build produced"
  );
  assert.ok(!/cp\s+dist\//.test(pages), "the built site is published as it is");
});

test("a repository that does not publish with Pages yet is told so, and nothing is published in silence", () => {
  // Turning Pages on is one click, and it is not a click this file can make: the
  // token a workflow is given may read the setting and may publish through it,
  // but creating the site is outside what it is allowed to do, and GitHub answers
  // "Resource not accessible by integration" when an action tries (which is what
  // an `enablement: true` with that token produces). A run on such a repository
  // therefore has two honest choices - say what to click and publish nothing, or
  // fail on a step whose name says nothing about the reason - and the first is
  // what happens here, with the publication gated on the answer.
  assert.match(pages, /curl[\s\S]{0,400}\/pages/, "the Pages setting is never asked about");
  assert.match(
    pages,
    /Authorization: Bearer \$\{\{ github\.token \}\}/,
    "the setting is asked about without the token the run already has"
  );
  assert.match(pages, /404\)[\s\S]{0,120}serving=no/, "an absent Pages site is not read as a no");
  assert.match(
    pages,
    /\*\)[\s\S]{0,260}exit 1/,
    "an answer that could not be read is taken for an answer, and the site quietly stops being published"
  );

  // Every step that builds or publishes waits for that answer, and the one that
  // publishes again waits for the job: a deployment with no artifact in front of
  // it fails, which would leave the run red for the reason it was explaining.
  assert.equal(
    pages.match(/if: steps\.asked\.outputs\.serving == 'yes'/g)?.length,
    5,
    "a step that builds or publishes does not wait for the answer"
  );
  assert.match(pages, /^ {4}outputs:\n {6}serving: \$\{\{ steps\.asked\.outputs\.serving \}\}$/m, "the answer is not handed to the publication");
  assert.match(pages, /^ {4}if: needs\.build\.outputs\.serving == 'yes'$/m, "the publication does not wait for it");

  // And what the person who has to click gets: the exact setting, the address of
  // the page to open it on, and one warning in the annotations rather than a red
  // cross with a step name on it.
  assert.match(pages, /settings\/pages/, "the run does not say where the setting is");
  assert.match(pages, /::warning title=Pages is not enabled::/, "nothing tells the publisher why no site appeared");
  assert.match(pages, /GITHUB_STEP_SUMMARY/, "the explanation is not written where the run explains itself");
  assert.match(pages, /Under "Build and deployment", set "Source" to "GitHub Actions"/, "the one click is not spelled out");

  // The way out without a click, and the trap it avoids: a token that may
  // administer the repository can turn the setting on, the workflow's own token
  // cannot, so enablement is never asked for with one that cannot do it.
  assert.match(pages, /secrets\.PAGES_TOKEN/, "there is no way to turn Pages on from here");
  assert.match(pages, /enablement: \$\{\{ env\.PAGES_TOKEN != '' \}\}/, "enablement is not tied to the token that can do it");
  assert.doesNotMatch(pages, /enablement: true/, "enablement is asked for with a token that cannot enable anything");
});

test("the shell each workflow runs is read by a shell before it runs", () => {
  // The steps of a workflow are small programs, and a mistake in one of them is
  // found by the runner, on main, after the push: nothing in a build reads them.
  // They are checked here the way they are run, one block at a time, and a
  // workflow that no longer parses is worth one more line - a tab is the one
  // character that breaks a YAML file while looking right in an editor, and
  // GitHub's answer to one is to run nothing at all.
  //
  // The directory rather than a list of names: a workflow added tomorrow is a
  // shell nobody reads unless this finds it, which is the same gap this test
  // exists to close, one level up.
  const directory = path.join(ROOT, ".github", "workflows");
  const workflows = readdirSync(directory).filter((name) => name.endsWith(".yml"));
  assert.ok(workflows.length >= 3, `only ${workflows.length} workflows were found`);

  for (const file of workflows) {
    const source = readFileSync(path.join(directory, file), "utf8");
    assert.doesNotMatch(source, /\t/, `${file} carries a tab`);

    const blocks = shellBlocks(source);
    assert.ok(blocks.length > 0, `${file} runs no shell at all`);
    for (const script of blocks) {
      const said = shellSays(script);
      assert.ok(said.ok, `${file}: ${said.why}`);
    }
  }
});

test("the site is built for the address Pages serves it from", () => {
  // A project site lives under /<repository>, and every file the build refers to
  // is otherwise looked for at the root of the domain: a blank page, with a
  // working service worker wondering where its files went.
  // The step is gated, so the condition sits between its name and its id; what
  // matters is that the address the build is given comes from this action under
  // the id the build reads.
  assert.match(
    pages,
    /id: pages[\s\S]{0,120}uses: actions\/configure-pages@v\d+/,
    "Pages says where the site will live"
  );
  assert.match(
    pages,
    /run: npm run build -- --base="\$\{\{ steps\.pages\.outputs\.base_path \}\}\/"/,
    "and the build is given that address"
  );
  assert.match(pages, /actions\/setup-node@v\d+\n\s+with:\n\s+node-version-file: \.nvmrc/, "on the same Node version");
  assert.match(pages, /run: npm ci/, "from the lockfile");
});

test("the Content workflow compares the two ends, and never writes either", () => {
  // The Content run is the half of the pair kept by hand that cannot depend on a
  // person remembering: it compares the six tables and the four generated modules
  // with the repository, on the push that changed the repository and on the days
  // nobody pushed anything, which is the only way a change made in the Neon
  // console alone is ever noticed. What it must never do is write - `content:push`
  // is a workflow of its own, started by hand and confirmed in a field - so this
  // holds both halves: the triggers that make it notice, and the one command it is
  // allowed to run.
  const file = path.join(ROOT, ".github", "workflows", "content.yml");
  assert.ok(existsSync(file), "the comparison is not a workflow");

  const source = readFileSync(file, "utf8");
  assert.match(source, /^name: Content$/m, "the workflow is named Content");

  const triggers = triggerBlock(source);
  assert.match(triggers, /^ {2}push:/m, "a push that changed the repository is compared");
  assert.match(triggers, /branches:\s*\[?main\]?/, "the push trigger watches main");
  assert.match(triggers, /^ {2}schedule:/m, "a change made only in the console is noticed");
  assert.match(triggers, /cron: "\d+ \d+ \* \* \*"/, "the schedule is a daily one");
  assert.match(triggers, /^ {2}workflow_dispatch:/m, "the comparison can be asked for by hand");

  assert.match(source, /^permissions:\n {2}contents: read$/m, "the job only reads the repository");
  assert.match(source, /timeout-minutes:\s*\d+/, "a hung job cannot hold a runner for hours");
  assert.match(source, /run: npm ci/, "the dependencies are installed from the lockfile");
  assert.doesNotMatch(source, /continue-on-error/, "a failing comparison is not ignored");
  assert.doesNotMatch(source, /npm run content:push/, "the comparison does not write the database");

  // The credential arrives under the name the script reads, from the one secret,
  // and its absence is a skipped check rather than a failed one - which is why the
  // branch that finds none exits zero. A run without that branch would read a
  // missing secret as a database that drifted, and be switched off within a week.
  assert.match(source, /DATABASE_URL: \$\{\{ secrets\.NEON_DATABASE_URL \}\}/, "the connection string comes from the secret");
  assert.match(source, /if \[ -z "\$DATABASE_URL" \]/, "a run with no secret is told apart from a drifting database");
  assert.match(source, /Neon credential missing/, "a missing secret is named in an annotation");
  assert.match(source, /exit 0/, "a run holding no credential passes rather than failing");
  assert.match(source, /npm run content:check/, "the workflow runs the comparison");
});

test("the database is only ever written back by a person who meant it", () => {
  // `content:push` empties the six mirrored tables and writes every row of the
  // repository again: run by accident, it deletes content. So the one thing worth
  // holding here is that nothing but a person can start it - a `push:` or a
  // `schedule:` added to this file tomorrow would turn a deliberate command into
  // one that fires on its own, which is exactly the failure this test exists to
  // catch. The confirmation field is held too, because a click alone is not the
  // same as reading that the database is what gets overwritten.
  const file = path.join(ROOT, ".github", "workflows", "content-sync.yml");
  assert.ok(existsSync(file), "the manual sync is not a workflow");

  const source = readFileSync(file, "utf8");
  const triggers = triggerBlock(source);
  assert.match(triggers, /workflow_dispatch:/, "a person can start the sync");
  assert.doesNotMatch(triggers, /push:/, "a push can empty the database");
  assert.doesNotMatch(triggers, /schedule:/, "a schedule can empty the database");

  assert.match(source, /npm run content:push/, "the sync does not run the command it exists for");
  assert.match(source, /secrets\.NEON_DATABASE_URL/, "the sync does not read the connection string it needs");
  assert.doesNotMatch(source, /continue-on-error:\s*true/, "a write that failed is reported as one that worked");
  assert.match(source, /if \[ \"\$CONFIRM\" != \"push\" \]/, "the database is overwritten without a typed confirmation");
});

test("the APK is attached to a release, so a version tag outlives the artifact that expires", () => {
  // An artifact belongs to a run and is deleted on a schedule, so the link
  // somebody was handed stops working and the version they were told about
  // cannot be downloaded again. A tag is the one push that names a version, and
  // the release it makes is the only write this workflow is allowed - which is
  // why it sits in a job of its own, apart from the build that compiles whatever
  // a pull request contains.
  const file = path.join(ROOT, ".github", "workflows", "android.yml");
  assert.ok(existsSync(file), "the wrapper is not built by a workflow");

  const source = readFileSync(file, "utf8");
  assert.match(source, /^name: Android$/m, "the workflow is named Android");

  // A hand-held run and a version tag both build and both keep the artifact; the
  // tag adds the release, and it is never a branch push that does.
  const triggers = triggerBlock(source);
  assert.match(triggers, /^ {2}workflow_dispatch:$/m, "the build cannot be asked for by hand");
  assert.match(triggers, /^ {2}push:\n {4}tags: \["v\*"\]$/m, "a version tag does not start the build");
  assert.match(source, /^permissions:\n {2}contents: read$/m, "the build only reads the repository");
  assert.doesNotMatch(source, /continue-on-error/, "a build that failed is reported as one that worked");

  // The release ships the APK the build produced rather than one of its own, so
  // the two downloads are the same file rather than two builds that can differ.
  const kept = source.indexOf("actions/upload-artifact@");
  const taken = source.indexOf("actions/download-artifact@");
  assert.ok(kept > 0, "the APK is not kept as an artifact at all");
  assert.ok(taken > kept, "the release compiles the APK a second time instead of reading the artifact");

  // `contents: write` on the job rather than on the file: the build above has no
  // business writing anything, and the release has no other use for the token.
  assert.match(source, /^ {4}permissions:\n {6}contents: write$/m, "no job may write a release");
  assert.match(source, /^ {4}needs: apk$/m, "the release does not wait for the build");
  assert.match(source, /if: startsWith\(github\.ref, 'refs\/tags\/v'\)/, "a release is made on a branch push");
  assert.match(source, /timeout-minutes:\s*\d+/, "a hung release cannot hold a runner for hours");

  // One release per tag rather than an error on the second run, and the APK is
  // attached under the name somebody is told to look for.
  assert.match(source, /gh release view[^\n]*>/, "an existing release is not asked about first");
  assert.match(source, /gh release create "\$TAG"/, "the release is not named after the tag that made it");
  // Named for the version rather than for what Gradle called it: the name of an
  // asset is the name of the file, so a label alone would leave every release
  // arriving on a disk as app-release.apk.
  assert.match(source, /VERSION="\$\{TAG#v\}"/, "the file is not named for the version the tag names");
  assert.match(
    source,
    /mv apk\/app-release\.apk "apk\/africa-history-quest-\$VERSION\.apk"/,
    "the file is uploaded under the name Gradle gave it"
  );
  assert.match(
    source,
    /gh release upload "\$TAG" "apk\/africa-history-quest-\$VERSION\.apk"/,
    "the APK the build produced is not the file attached"
  );
  assert.match(source, /--clobber/, "a second run on the same tag fails on the file already there");
  assert.match(source, /GH_TOKEN: \$\{\{ github\.token \}\}/, "the release is made without the token the run is given");
  assert.match(source, /name: africa-history-quest-apk-release/, "the release does not take the signed APK the build kept");
  assert.match(source, /Signed, so a device installs it/, "the release does not say what was built");
});

test("a version tag decides the version, and the key it is signed with is one the repository never holds", () => {
  // A device refuses an APK that is not signed, and the debug key a laptop build
  // uses is a key every debug build anywhere shares: anybody who has it can sign
  // an update for this application. So the release is signed with a key that
  // lives in repository secrets, arrives as base64 because a secret is text, and
  // is written into the runner's temporary directory rather than the checkout.
  const file = path.join(ROOT, ".github", "workflows", "android.yml");
  const source = readFileSync(file, "utf8");

  // The version is worked out from the tag rather than typed beside it, and only
  // a version tag writes one: a hand-held run carries the committed version.
  assert.match(
    source,
    /if: startsWith\(github\.ref, 'refs\/tags\/v'\)\n {8}run: node scripts\/android-version\.mjs "\$GITHUB_REF_NAME"/,
    "the version an installed app reports does not come from the tag"
  );

  assert.match(source, /KEYSTORE_BASE64: \$\{\{ secrets\.ANDROID_KEYSTORE_BASE64 \}\}/, "the run never reads the key");
  assert.match(
    source,
    /base64 --decode > "\$RUNNER_TEMP\/release\.keystore"/,
    "the key is not decoded into the runner's temporary directory"
  );
  assert.match(
    source,
    /ANDROID_KEYSTORE: \$\{\{ runner\.temp \}\}\/release\.keystore/,
    "the build is not given the key that was decoded"
  );

  // Every line that names the key file names the runner's temporary directory in
  // the same breath, so a copy of a signing key cannot end up in the checkout
  // where the artifact of the run would carry it off. There are two places the
  // key is decoded - the build that signs with it, and the check that reads the
  // published file back - and both are held to the same rule.
  const keyLines = source.split("\n").filter((line) => line.includes("release.keystore"));
  assert.equal(
    keyLines.filter((line) => line.includes("base64 --decode")).length,
    2,
    "the key is decoded somewhere other than the build and the check that reads the published file"
  );
  for (const line of keyLines) {
    assert.match(line, /RUNNER_TEMP|runner\.temp/, `the key is written outside the runner's temporary directory: ${line.trim()}`);
  }

  // The three values that go with it, each read from the secret of its own name,
  // which is what android/app/build.gradle expects to find in the environment.
  assert.match(source, /ANDROID_KEYSTORE_PASSWORD: \$\{\{ secrets\.ANDROID_KEYSTORE_PASSWORD \}\}/, "the run never reads the store password");
  assert.match(source, /ANDROID_KEY_ALIAS: \$\{\{ secrets\.ANDROID_KEY_ALIAS \}\}/, "the run never reads the key alias");
  assert.match(source, /ANDROID_KEY_PASSWORD: \$\{\{ secrets\.ANDROID_KEY_PASSWORD \}\}/, "the run never reads the key password");

  // Nothing prints what it read: a password echoed once is a password in the log
  // of every run anyone can see, and the log outlives the key.
  assert.doesNotMatch(source, /echo[^\n]*\$\{\{ secrets\./, "a signing secret is printed into the run's log");
  assert.doesNotMatch(source, /echo[^\n]*\$\{?KEYSTORE_BASE64/, "the key itself is printed into the run's log");

  // A tag with no key fails before the build rather than after it, since the
  // release it would publish is one nobody can install, and the same condition
  // is what tells a run with a key apart from one without.
  const refused = source.indexOf("Refuse a version tag there is no signing key for");
  const signed = source.indexOf("Build the signed release APK");
  assert.ok(refused > 0, "a tag with no key is not refused at all");
  assert.ok(signed > refused, "a tag with no key is refused only after the build it would waste");
  assert.match(
    source,
    /if: startsWith\(github\.ref, 'refs\/tags\/v'\) && env\.KEYSTORE_BASE64 == ''/,
    "a tag with no key is not told apart from one with one"
  );

  // And the key is never a file of this repository: the Android template ships
  // those two rules commented out, which is a rule somebody has to remember.
  const ignore = readFileSync(path.join(ROOT, "android", ".gitignore"), "utf8");
  assert.match(ignore, /^\*\.keystore$/m, "a keystore put in android/ would be committed");
  assert.match(ignore, /^\*\.jks$/m, "a .jks keystore put in android/ would be committed");
});

test("the file the release publishes is read back, and is what the tag promised", () => {
  // Every step above this one works on what the build produced: the artifact the
  // signed build kept, the name it was uploaded under, the version the tag named.
  // The asset a reader downloads is a copy of that, and the copy is the only
  // place where the three promises of a release - the version the tag names, the
  // key it is signed with, and the name it is carried under - can be read the way
  // a reader meets them. So a job takes the published file, and nothing else.
  const source = readFileSync(path.join(ROOT, ".github", "workflows", "android.yml"), "utf8");

  const check = source.indexOf("Read the published APK");
  assert.ok(check > 0, "nothing reads the published APK back");
  assert.ok(check > source.indexOf("Attach the APK to the release"), "the check runs before the release it reads");

  const job = source.slice(check);
  assert.match(job, /^ {4}needs: release$/m, "the check does not wait for the release it reads");
  assert.match(job, /if: always\(\) && \(startsWith\(github\.ref, 'refs\/tags\/v'\)/, "the check runs where there is no release");
  assert.match(job, /timeout-minutes:\s*\d+/, "a hung check cannot hold a runner for hours");

  // The published asset rather than the artifact of the run: the artifact is
  // what the build produced, and reading it would check nothing the steps above
  // have not already read.
  assert.match(job, /gh release download "\$TAG"[^\n]*--pattern '[^']*\.apk'/, "the artifact is read instead of the published file");
  assert.match(job, /npm run check:apk -- --apk/, "the published file is never handed to the check");
  assert.match(job, /--tag "\$TAG"/, "the file is not read against the tag it was released as");

  // The tag a hand-held run names, so the check can be tried on a release that
  // is already published without a tag that would publish another one.
  assert.match(source, /verify-tag:/, "an old release cannot be read back by hand");
  assert.match(job, /TAG: \$\{\{ inputs\.verify-tag \|\| github\.ref_name \}\}/, "a hand-held check does not know which release to read");

  // The signature is compared against the project's own key rather than read
  // alone, and the key is decoded into the runner's temporary directory as the
  // build decodes it: that is the difference between "signed" and "signed by us".
  assert.match(
    job,
    /ANDROID_KEYSTORE: \$\{\{ runner\.temp \}\}\/release\.keystore/,
    "the key the file should carry is never given to the check"
  );

  assert.ok(existsSync(path.join(ROOT, "scripts", "check-apk.mjs")), "the check has no program");
  assert.ok(existsSync(path.join(ROOT, "src", "lib", "apk-release.js")), "what the file would be read for is written down nowhere");

  const manifest = JSON.parse(readFileSync(path.join(ROOT, "package.json"), "utf8"));
  assert.match(manifest.scripts["check:apk"] ?? "", /check-apk\.mjs/, "npm has no way to ask for the check");
});

test("the installer the release publishes is read back, and it is what the tag promised", () => {
  // The desktop build has the same gap the Android one does, and the same answer:
  // every step before this one works on the artifact the build kept, the name it
  // was uploaded under and the version the manifest was given, and the asset a
  // reader downloads is a copy of that. A job takes the published file, and
  // nothing else, so the version a person would install is read the way a person
  // would meet it.
  const source = readFileSync(path.join(ROOT, ".github", "workflows", "desktop.yml"), "utf8");

  const check = source.indexOf("Read the published installer");
  assert.ok(check > 0, "nothing reads the published installer back");
  assert.ok(check > source.indexOf("Attach the installer to the release"), "the check runs before the release it reads");

  const job = source.slice(check);
  assert.match(job, /^ {4}needs: release$/m, "the check does not wait for the release it reads");
  assert.match(job, /if: always\(\) && \(startsWith\(github\.ref, 'refs\/tags\/v'\)/, "the check runs where there is no release");
  assert.match(job, /timeout-minutes:\s*\d+/, "a hung check cannot hold a runner for hours");
  assert.match(job, /^ {4}permissions:\n {6}contents: read$/m, "the check may write to the repository");

  // The published asset rather than the artifact of the run, which reading would
  // check nothing the steps above have not already read.
  assert.match(job, /gh release download "\$TAG"[^\n]*--pattern '[^']*\.exe'/, "the artifact is read instead of the published file");
  assert.match(job, /npm run check:desktop -- --exe/, "the published file is never handed to the check");
  assert.match(job, /--tag "\$TAG"/, "the file is not read against the tag it was released as");

  // The tag a hand-held run names, so the check can be tried on a release that
  // is already published without a tag that would publish another one.
  assert.match(source, /verify-tag:/, "an old release cannot be read back by hand");
  assert.match(job, /TAG: \$\{\{ inputs\.verify-tag \|\| github\.ref_name \}\}/, "a hand-held check does not know which release to read");

  assert.ok(existsSync(path.join(ROOT, "scripts", "check-desktop.mjs")), "the check has no program");
  assert.ok(
    existsSync(path.join(ROOT, "src", "lib", "desktop-release.js")),
    "what the file would be read for is written down nowhere"
  );

  const manifest = JSON.parse(readFileSync(path.join(ROOT, "package.json"), "utf8"));
  assert.match(manifest.scripts["check:desktop"] ?? "", /check-desktop\.mjs/, "npm has no way to ask for the check");

  // The build produces the installer and stops there. electron-builder publishes
  // a release by itself the moment it sees a version tag, and the build runner
  // has no token for it: left on, the installer is assembled and the step then
  // fails trying to publish it from a job that may only read. The release job is
  // the one write this workflow is allowed, so the build is told never to.
  assert.match(
    manifest.scripts["desktop:build"] ?? "",
    /--publish never/,
    "the installer build tries to publish the release itself"
  );
});

test("the workflow installs the image library the photograph check reads with", () => {
  // Half of `npm run verify` opens every JPEG and reads its pixels through
  // Pillow. A runner that has Python but not Pillow fails on the gallery, which
  // reads as a broken photograph rather than as a dependency nobody installed.
  assert.match(workflow, /actions\/checkout@v\d+/, "the repository is checked out");
  assert.match(workflow, /actions\/setup-node@v\d+/, "Node is set up");
  assert.match(workflow, /actions\/setup-python@v\d+/, "Python is set up");
  assert.match(workflow, /pip install[\s\S]{0,80}Pillow/, "Pillow is installed before the verification");
  assert.ok(
    workflow.indexOf("pip install") < workflow.indexOf("run: npm run verify"),
    "and it is installed first"
  );
});
