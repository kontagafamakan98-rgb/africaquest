// Text selection is disabled during play to avoid accidental highlighting,
// but legal pages must remain selectable and copyable.
const SELECTABLE_PAGES = ["PrivacyPolicy", "TermsOfService", "TeacherPage"];

export default function Layout({ children, currentPageName }) {
  const isSelectable = SELECTABLE_PAGES.includes(currentPageName);
  return (
    <div className={isSelectable ? undefined : "no-select"}>
      {children}
    </div>
  );
}