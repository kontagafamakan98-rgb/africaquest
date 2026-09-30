import { Component } from "react";
import { AlertTriangle, Check, Copy, RefreshCw } from "lucide-react";
import { useT } from "@/components/i18n";
import { recordFailure } from "@/lib/error-log.js";
import { describeFailure, failureReport } from "@/lib/failure-report.js";

/**
 * What the reader sees when a screen fails to be drawn.
 *
 * Without this, a failure anywhere inside the application is a white page: the
 * code that would have explained it is the code that just stopped. The boundary
 * therefore sits as high as it can, above the router, and it catches the three
 * ways a screen breaks here - a value the data does not have, a chunk that could
 * not be fetched (a phone that opened a level while the network had gone), and a
 * mistake in the drawing itself.
 *
 * It says three things and no more: that it broke, that nothing played has been
 * lost (progress lives in this browser, and a broken screen does not touch it),
 * and what to do about it. The trace hides behind a disclosure rather than being
 * laid on the page, because a stack trace in front of a child is noise, and it
 * is there for the person who has to send it on.
 *
 * Nothing is sent anywhere: the lines exist while this screen is open, the copy
 * button is the only way they leave the device, and the one thing the boundary
 * writes down is a line in the failure log, which is the bounded memory of the
 * session (src/lib/error-log.js) that the progress report a teacher exports
 * carries. A crash that nobody kept would otherwise be lost the moment the page
 * is reloaded, which is the moment right after it happened.
 */
class CrashCatcher extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, componentStack: "", at: null, copied: false };
    this.handleReload = this.handleReload.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { error, at: new Date().toISOString(), copied: false };
  }

  componentDidCatch(error, info) {
    // Which screen was being drawn, which the first render cannot know yet: the
    // boundary is painted before React hands this over. One more render, once.
    this.setState({ componentStack: info?.componentStack || "" });
    // And one line into the log of the session, so the report a teacher exports
    // afterwards can say what broke, rather than the reader having to describe it.
    recordFailure(error, { where: info?.componentStack || "" });
  }

  handleReload() {
    window.location.reload();
  }

  async handleCopy() {
    try {
      await navigator.clipboard.writeText(failureReport(this.report()));
      this.setState({ copied: true });
    } catch {
      // A browser that refuses the clipboard - an older one, or a page not
      // served over https - is not a reason to hide the trace: the lines are on
      // the screen already, and the reader selects them by hand.
      this.setState({ copied: false });
    }
  }

  /** The failure as a report: built here, so the screen and the copy agree. */
  report() {
    return describeFailure(this.state.error, {
      componentStack: this.state.componentStack,
      address: typeof window === "undefined" ? "" : window.location.href,
      at: this.state.at,
    });
  }

  render() {
    const { error, copied } = this.state;
    const { t, children } = this.props;

    if (!error) return children;

    const report = failureReport(this.report());

    return (
      <div className="min-h-screen bg-[#14100A] text-white flex items-center justify-center px-5 py-10">
        <div role="alert" className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#1C150C] p-5">
          <h1 className="flex items-center gap-2 text-lg font-extrabold">
            <AlertTriangle className="w-5 h-5 text-amber-400" aria-hidden="true" />
            {t.appCrashed}
          </h1>
          <p className="mt-2 text-sm text-white/75 leading-relaxed">{t.appCrashedDesc}</p>

          <button
            type="button"
            onClick={this.handleReload}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold text-[#1C150C] transition-colors hover:bg-amber-400 active:scale-[0.99]"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            {t.appCrashedReload}
          </button>

          <details className="mt-4">
            <summary className="cursor-pointer text-xs font-bold text-amber-200">{t.appCrashedCopy}</summary>
            <pre className="mt-2 max-h-56 overflow-auto rounded-xl bg-black/40 p-3 text-[11px] leading-relaxed text-white/80">
              {report}
            </pre>
            <button
              type="button"
              onClick={this.handleCopy}
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-bold text-white/90 transition-colors hover:border-white/35"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              {copied ? t.appCrashedCopied : t.appCrashedCopy}
            </button>
          </details>
        </div>
      </div>
    );
  }
}

/**
 * The boundary, with the reader's language handed to it.
 *
 * The language lives in a hook and a boundary has to be a class, since React
 * offers no other way to catch a render, so the two meet here: this component
 * reads the language and passes the dictionary down, which is also what makes
 * the crash screen come out in the language the reader had chosen.
 */
export default function AppCrash({ children }) {
  const t = useT();
  return <CrashCatcher t={t}>{children}</CrashCatcher>;
}
