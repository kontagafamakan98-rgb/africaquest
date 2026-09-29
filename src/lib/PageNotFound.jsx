import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { basePath } from '@/lib/base-path.js';

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1);

  // Send unknown routes back to the game.
  //
  // The application is not always at the root of a domain: a project site on
  // GitHub Pages is served under /<repository>/, and a bare '/' there would
  // take the visitor out of the game and onto whatever else the domain hosts.
  useEffect(() => {
    window.location.replace(basePath());
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-6xl font-light text-slate-300">404</h1>
        <h2 className="text-xl font-semibold text-slate-800">Page not found</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          The page <span className="font-medium text-slate-700">"{pageName}"</span> does not exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-amber-700 rounded-lg hover:bg-amber-800 transition-colors"
        >
          Back to the game
        </Link>
      </div>
    </div>
  );
}
