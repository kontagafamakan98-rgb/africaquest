export default function Layout({ children, currentPageName }) {
  return (
    <div className="no-select">
      {children}
    </div>
  );
}