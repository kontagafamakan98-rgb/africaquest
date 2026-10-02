import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Download,
  GraduationCap,
  Lock,
  LockOpen,
  Pencil,
  Plus,
  RotateCcw,
  ShieldCheck,
  Star,
  Target,
  Trash2,
  Upload,
  UserCheck,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useT, useLang } from "../components/i18n";
import { getLevels } from "../components/game/gameData";
import LiquidMark from "../components/game/LiquidMark";
import { classSummary } from "../lib/class-stats";
import {
  activeProfileId,
  createProfile,
  deleteProfile,
  importStudentProfile,
  listStudentsWithProgress,
  renameProfile,
  setActiveProfile,
} from "../api/profiles-store";
import {
  backupFileName,
  buildBackup,
  checkBackupFile,
  readBackup,
} from "../lib/progress-file";
import {
  TEACHER_PIN_LENGTH,
  clearTeacherPin,
  hasTeacherPin,
  isTeacherCode,
  isTeacherUnlocked,
  isValidCode,
  lockTeacher,
  normalizeCode,
  setTeacherPin,
  unlockTeacher,
} from "../lib/teacher-access";
import { cn } from "@/lib/utils";

/**
 * Teacher space: the class results for every student profile on this device, and
 * the tools to manage that roster. Reached from the settings sheet, and gated by
 * a local access code because students share the very same device.
 */
export default function TeacherPage() {
  const [unlocked, setUnlocked] = useState(() => isTeacherUnlocked());
  const lang = useLang();
  const levels = useMemo(() => getLevels(lang), [lang]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header
        className="relative overflow-hidden text-white"
        style={{
          background: "linear-gradient(160deg, #1C1109 0%, #4A2A12 45%, #7A3B1D 100%)",
          paddingTop: "calc(2rem + var(--sat))",
          paddingBottom: "1.5rem",
        }}
      >
        <div className="max-w-lg mx-auto px-5">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 min-h-11 text-xs font-bold text-white/70 hover:text-white mb-3"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <BackLabel />
          </Link>
          <h1 className="text-2xl font-extrabold leading-tight flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-amber-300" aria-hidden="true" />
            <TitleLabel />
          </h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 py-6">
        {unlocked ? (
          <ClassDashboard levels={levels} />
        ) : (
          <CodeGate onUnlock={() => setUnlocked(true)} />
        )}
      </main>
    </div>
  );
}

function BackLabel() {
  const t = useT();
  return t.backToGame;
}

function TitleLabel() {
  const t = useT();
  return t.teacherSpace;
}

/**
 * Access code gate. On a device that has no code yet, the first visit sets one:
 * without that step there would be no way to protect the page at all.
 */
function CodeGate({ onUnlock }) {
  const t = useT();
  // Decided once on mount: either a code exists and it is asked for, or this
  // first visit sets the one that will protect the page afterwards.
  const [existing] = useState(() => hasTeacherPin());
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = (event) => {
    event.preventDefault();
    if (!isValidCode(code)) {
      setError(t.teacherCodeLength);
      return;
    }
    if (!existing) {
      setTeacherPin(code);
      onUnlock();
      return;
    }
    if (isTeacherCode(code)) {
      unlockTeacher();
      onUnlock();
      return;
    }
    setError(t.teacherWrongCode);
    setCode("");
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-1">
        <Lock className="w-5 h-5 text-amber-600" aria-hidden="true" />
        <h2 className="font-extrabold text-slate-800">{t.teacherLocked}</h2>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed mb-5">
        {existing ? t.teacherEnterCode : t.teacherSetCodeDesc}
      </p>

      <label htmlFor="teacher-code" className="block text-sm font-semibold text-slate-700 mb-2">
        {existing ? t.teacherEnterCode : t.teacherSetCode}
      </label>
      <input
        id="teacher-code"
        ref={inputRef}
        type="password"
        inputMode="numeric"
        autoComplete="off"
        maxLength={TEACHER_PIN_LENGTH}
        value={code}
        onChange={(event) => {
          setCode(normalizeCode(event.target.value));
          setError("");
        }}
        aria-describedby="teacher-code-hint"
        className={cn(
          "w-full h-12 px-4 rounded-xl border-2 text-center text-2xl font-extrabold tracking-[0.5em] tabular-nums bg-white",
          error ? "border-red-400 text-red-600" : "border-slate-200 text-slate-800 focus:border-amber-500"
        )}
      />
      <p id="teacher-code-hint" className={cn("text-xs mt-2", error ? "text-red-600 font-semibold" : "text-slate-500")}>
        {error || t.teacherCodeHint}
      </p>

      <button
        type="submit"
        className="w-full h-12 mt-4 rounded-xl bg-gradient-to-r from-amber-700 to-orange-800 hover:from-amber-800 hover:to-orange-900 text-white font-bold text-base shadow-lg shadow-amber-900/20"
      >
        {existing ? t.teacherUnlock : t.teacherCreateCode}
      </button>
    </form>
  );
}

function ClassDashboard({ levels }) {
  const t = useT();
  const [profiles, setProfiles] = useState(() => listStudentsWithProgress());
  const [activeId, setActiveId] = useState(() => activeProfileId());
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [draftName, setDraftName] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [codeMode, setCodeMode] = useState(null);
  const [codeDraft, setCodeDraft] = useState("");
  const [codeError, setCodeError] = useState("");
  const [hasCode, setHasCode] = useState(() => hasTeacherPin());
  const [importStatus, setImportStatus] = useState(null);

  const refresh = useCallback(() => {
    setProfiles(listStudentsWithProgress());
    setActiveId(activeProfileId());
    setHasCode(hasTeacherPin());
  }, []);

  const stats = useMemo(() => classSummary(profiles, levels), [profiles, levels]);
  const { summary } = stats;

  const handleExport = (profile) => {
    try {
      const name = profile.name || "";
      const backup = buildBackup({ progress: profile.progress, profileName: name });
      const fileName = backupFileName(name);
      const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      setImportStatus({ type: "error", message: t.backupFailed });
    }
  };

  const handleImportFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setImportStatus(null);

    // The size and the type are checked before the file is read, and the reason
    // is the one the settings sheet gives, so a teacher meets the same wording
    // for the same refusal wherever a file is picked.
    const looked = checkBackupFile(file);
    if (!looked.ok) {
      const wording = { tooLarge: t.backupTooLarge, wrongType: t.backupWrongType };
      setImportStatus({ type: "error", message: wording[looked.reason] || t.importStudentError });
      return;
    }

    let text = "";
    try {
      text = await file.text();
    } catch {
      setImportStatus({ type: "error", message: t.importStudentError });
      return;
    }

    const read = readBackup(text);
    if (!read.ok) {
      setImportStatus({ type: "error", message: t.importStudentError });
      return;
    }

    try {
      const studentName = read.profileName || file.name.replace(/\.[^/.]+$/, "").replace(/^africa-quest-/, "").replace(/-\d{4}-\d{2}-\d{2}$/, "");
      const res = importStudentProfile(studentName, read.progress);
      refresh();
      setImportStatus({
        type: "success",
        message: res.updated ? t.importStudentUpdated : t.importStudentSuccess,
      });
    } catch {
      setImportStatus({ type: "error", message: t.importStudentError });
    }
  };

  const handleAdd = (event) => {
    event.preventDefault();
    if (!newName.trim()) return;
    createProfile(newName);
    setNewName("");
    refresh();
  };

  const handleRename = (id) => {
    renameProfile(id, draftName);
    setEditingId(null);
    setDraftName("");
    refresh();
  };

  const handleDelete = (id) => {
    deleteProfile(id);
    setConfirmId(null);
    refresh();
  };

  const handleActivate = (id) => {
    setActiveProfile(id);
    refresh();
  };

  const handleCodeSubmit = (event) => {
    event.preventDefault();
    if (!isValidCode(codeDraft)) {
      setCodeError(t.teacherCodeLength);
      return;
    }
    setTeacherPin(codeDraft);
    setCodeDraft("");
    setCodeError("");
    setCodeMode(null);
    refresh();
  };

  return (
    <div className="space-y-6">
      <p className="text-xs text-slate-500 leading-relaxed">{t.teacherIntro}</p>

      {/* Class totals */}
      <section className="grid grid-cols-2 gap-2">
        <Metric
          icon={Users}
          value={`${summary.withData}/${summary.students}`}
          label={`${t.students} ${t.studentsWithData}`}
        />
        <Metric icon={Target} value={`${summary.averageMastery}%`} label={t.classMastery} />
        <Metric
          icon={GraduationCap}
          value={summary.averageAccuracy === null ? t.noAnswersYet : `${summary.averageAccuracy}%`}
          label={t.classAccuracy}
        />
        <Metric icon={Star} value={String(summary.totalStars)} label={t.stars} />
        <Metric icon={Zap} value={String(summary.totalXp)} label={t.totalXp} />
        <Metric icon={RotateCcw} value={String(summary.dueNow)} label={t.questionsToReview} />
      </section>

      {/* Roster and per student results */}
      <section>
        <h2 className="flex items-center gap-1.5 text-slate-700 text-xs font-bold uppercase tracking-widest mb-2 px-1">
          <Users className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
          {t.perStudent}
        </h2>

        {/* Import student progress file */}
        <div className="flex items-center justify-between gap-3 mb-3 bg-white border border-slate-200 rounded-2xl p-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
              {t.importStudent}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{t.importStudentDesc}</p>
          </div>
          <label className="shrink-0 flex items-center gap-1.5 h-9 px-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 text-xs font-bold hover:bg-amber-100 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t.importStudent}</span>
            <input
              type="file"
              accept=".json,application/json"
              className="sr-only"
              onChange={handleImportFile}
            />
          </label>
        </div>

        {importStatus && (
          <div
            role="status"
            className={cn(
              "mb-3 px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-2",
              importStatus.type === "success"
                ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                : "bg-orange-50 border border-orange-200 text-orange-800"
            )}
          >
            <span>{importStatus.message}</span>
            <button
              onClick={() => setImportStatus(null)}
              className="min-h-11 min-w-11 flex items-center justify-center rounded-md hover:bg-black/5 transition-colors"
              aria-label={t.close}
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        )}

        <form onSubmit={handleAdd} className="flex gap-2 mb-3">
          <label htmlFor="new-student" className="sr-only">
            {t.studentName}
          </label>
          <input
            id="new-student"
            type="text"
            name="student-name"
            autoComplete="name"
            maxLength={40}
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            placeholder={t.studentNamePlaceholder}
            className="flex-1 h-11 px-3 rounded-xl border-2 border-slate-200 bg-white text-sm text-slate-800 focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={!newName.trim()}
            className="h-11 px-4 rounded-xl bg-gradient-to-r from-amber-700 to-orange-800 text-white font-bold text-sm disabled:opacity-50 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            {t.add}
          </button>
        </form>

        {profiles.length === 0 && <p className="text-xs text-slate-500 px-1">{t.noStudents}</p>}

        <div className="space-y-2">
          {profiles.map((profile, index) => {
            const row = stats.students[index];
            const isActive = profile.id === activeId;
            const displayName = profile.name || t.defaultProfileName;
            return (
              <div
                key={profile.id}
                // The outline never changes by itself: the mark says which
                // student is being played, and it travels down the register when
                // the teacher picks another one.
                className="relative isolate bg-white border border-slate-200 rounded-2xl p-3.5"
              >
                {isActive && (
                  <LiquidMark
                    layoutId="teacher-student"
                    className="-inset-px rounded-2xl border border-amber-400 shadow-sm"
                  />
                )}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600 to-orange-800 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>

                  <div className="min-w-0 flex-1">
                    {editingId === profile.id ? (
                      <div className="flex items-center gap-1.5">
                        <label htmlFor={`rename-${profile.id}`} className="sr-only">
                          {t.studentName}
                        </label>
                        <input
                          id={`rename-${profile.id}`}
                          type="text"
                          name="student-name"
                          autoComplete="name"
                          value={draftName}
                          onChange={(event) => setDraftName(event.target.value)}
                          maxLength={40}
                          className="flex-1 h-9 px-2 rounded-lg border-2 border-amber-400 bg-white text-sm font-bold text-slate-800"
                        />
                        <button
                          onClick={() => handleRename(profile.id)}
                          aria-label={`${t.save} ${displayName}`}
                          className="p-2 rounded-lg hover:bg-amber-50 text-amber-700"
                        >
                          <Check className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          aria-label={t.cancel}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
                        >
                          <X className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    ) : (
                      <p className="font-bold text-sm text-slate-800 truncate flex items-center gap-2">
                        {displayName}
                        {isActive && (
                          <span className="text-[10px] font-bold uppercase tracking-wide text-amber-800 bg-amber-100 border border-amber-300 rounded px-1.5 py-0.5">
                            {t.activeProfile}
                          </span>
                        )}
                      </p>
                    )}

                    {row.hasData ? (
                      <>
                        <p className="text-[11px] text-slate-600 mt-1 tabular-nums">
                          {row.levelsCompleted}/{row.totalLevels} {t.levelsCompleted} · {t.mastery}{" "}
                          {row.mastery}% · {t.accuracy}{" "}
                          {row.accuracy === null ? t.noAnswersYet : `${row.accuracy}%`}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 tabular-nums">
                          <Star className="w-3 h-3 inline-block align-[-2px] text-amber-500" aria-hidden="true" />{" "}
                          {row.stars} · {t.totalXp} {row.xp} · {t.questionsToReview} {row.dueNow}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {t.lastPlayed}: {row.lastPlayed || t.neverPlayed}
                        </p>
                      </>
                    ) : (
                      <p className="text-[11px] text-slate-500 mt-1">{t.notPlayedYet}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    onClick={() => handleActivate(profile.id)}
                    disabled={isActive}
                    aria-label={`${t.activateProfile} ${displayName}`}
                    className={cn(
                      "flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-bold border-2 transition-colors",
                      isActive
                        ? "border-slate-100 bg-slate-50 text-slate-400"
                        : "border-amber-500 text-amber-800 hover:bg-amber-50"
                    )}
                  >
                    <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
                    {isActive ? t.activeProfile : t.activateProfile}
                  </button>
                  <button
                    onClick={() => handleExport(profile)}
                    aria-label={`${t.exportStudent} ${displayName}`}
                    title={t.exportStudentDesc}
                    className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-bold border-2 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" aria-hidden="true" />
                    {t.exportStudent}
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(profile.id);
                      setDraftName(profile.name || "");
                    }}
                    aria-label={`${t.rename} ${displayName}`}
                    className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-bold border-2 border-slate-200 text-slate-600 hover:border-slate-300"
                  >
                    <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                    {t.rename}
                  </button>
                  <button
                    onClick={() => setConfirmId(profile.id)}
                    aria-label={`${t.delete} ${displayName}`}
                    className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-bold border-2 border-slate-200 text-orange-700 hover:border-orange-300 hover:bg-orange-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    {t.delete}
                  </button>
                </div>

                {confirmId === profile.id && (
                  <div className="mt-3 bg-orange-50 border border-orange-200 rounded-xl p-3">
                    <p className="text-xs font-semibold text-orange-800 mb-2">{t.deleteStudentConfirm}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirmId(null)}
                        className="flex-1 h-9 rounded-lg border-2 border-orange-200 text-xs font-bold text-orange-800 bg-white"
                      >
                        {t.cancel}
                      </button>
                      <button
                        onClick={() => handleDelete(profile.id)}
                        className="flex-1 h-9 rounded-lg bg-orange-700 text-xs font-bold text-white"
                      >
                        {t.delete}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Per level completion across the class */}
      <section>
        <h2 className="flex items-center gap-1.5 text-slate-700 text-xs font-bold uppercase tracking-widest mb-2 px-1">
          <GraduationCap className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
          {t.perLevelCompletion}
        </h2>
        <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100">
          {stats.levels.map((level) => {
            const percent = level.students > 0 ? Math.round((level.completed / level.students) * 100) : 0;
            return (
              <div key={level.id} className="p-3.5">
                <div className="flex items-baseline justify-between gap-3 mb-2">
                  <p className="text-xs font-bold text-slate-800 truncate">{level.title}</p>
                  <p className="text-[11px] text-slate-500 tabular-nums shrink-0">
                    {level.completed}/{level.students} {t.studentsCompleted}
                  </p>
                </div>
                <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-600"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{level.region}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Access code */}
      <section>
        <h2 className="flex items-center gap-1.5 text-slate-700 text-xs font-bold uppercase tracking-widest mb-2 px-1">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
          {t.teacherAccess}
        </h2>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
          {codeMode === "change" ? (
            <form onSubmit={handleCodeSubmit} className="space-y-2">
              <label htmlFor="new-code" className="block text-sm font-semibold text-slate-700">
                {t.teacherChangeCode}
              </label>
              <input
                id="new-code"
                type="password"
                inputMode="numeric"
                autoComplete="off"
                maxLength={TEACHER_PIN_LENGTH}
                value={codeDraft}
                onChange={(event) => {
                  setCodeDraft(normalizeCode(event.target.value));
                  setCodeError("");
                }}
                aria-describedby="new-code-hint"
                className={cn(
                  "w-full h-11 px-3 rounded-xl border-2 text-center text-xl font-extrabold tracking-[0.4em] tabular-nums bg-white",
                  codeError ? "border-red-400 text-red-600" : "border-slate-200 focus:border-amber-500"
                )}
              />
              <p id="new-code-hint" className={cn("text-xs", codeError ? "text-red-600 font-semibold" : "text-slate-500")}>
                {codeError || t.teacherCodeHint}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCodeMode(null);
                    setCodeDraft("");
                    setCodeError("");
                  }}
                  className="flex-1 h-10 rounded-xl border-2 border-slate-200 text-xs font-bold text-slate-600"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-xl bg-gradient-to-r from-amber-700 to-orange-800 text-xs font-bold text-white"
                >
                  {t.save}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <LockOpen className="w-4 h-4 text-amber-600" aria-hidden="true" />
                <p className="text-xs text-slate-600 flex-1">
                  {hasCode ? t.teacherAccess : t.teacherRemoveCodeNote}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCodeMode("change")}
                  className="flex-1 h-10 rounded-xl border-2 border-slate-200 text-xs font-bold text-slate-600 hover:border-amber-400"
                >
                  {hasCode ? t.teacherChangeCode : t.teacherCreateCode}
                </button>
                {hasCode && (
                  <button
                    onClick={() => {
                      clearTeacherPin();
                      refresh();
                    }}
                    className="flex-1 h-10 rounded-xl border-2 border-slate-200 text-xs font-bold text-orange-700 hover:border-orange-300"
                  >
                    {t.teacherRemoveCode}
                  </button>
                )}
              </div>
            </>
          )}

          <button
            onClick={() => {
              lockTeacher();
              window.location.reload();
            }}
            className="w-full h-10 rounded-xl bg-slate-800 text-xs font-bold text-white"
          >
            {t.teacherLock}
          </button>
        </div>
      </section>
    </div>
  );
}

function Metric({ icon: Icon, value, label }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-3">
      <Icon className="w-4 h-4 text-amber-600 mb-1.5" aria-hidden="true" />
      <p className="text-lg font-extrabold text-slate-800 tabular-nums leading-tight">{value}</p>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 leading-tight mt-0.5">
        {label}
      </p>
    </div>
  );
}
