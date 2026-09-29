/**
 * How the last save or load went, in one line.
 *
 * A refusal names what was wrong with the file rather than blaming the player,
 * and it never claims progress was restored. The reasons live here, next to the
 * wording they use, so the settings sheet and the welcome screen cannot drift
 * apart on what a given failure means.
 */
export default function BackupNotice({ note, t }) {
  const failures = {
    tooLarge: t.backupTooLarge,
    wrongType: t.backupWrongType,
    notBackup: t.backupNotOurs,
    newer: t.backupNewer,
    failed: t.backupFailed,
  };
  const successes = { exported: t.backupExported, imported: t.backupImported };
  const failure = failures[note] || (successes[note] ? null : t.backupBadFile);

  return (
    <p
      role={failure ? "alert" : "status"}
      className={`mt-2 text-xs rounded-xl px-3 py-2 ${
        failure
          ? "text-orange-800 bg-orange-50 border border-orange-200"
          : "text-emerald-800 bg-emerald-50 border border-emerald-200"
      }`}
    >
      {failure || successes[note]}
    </p>
  );
}
