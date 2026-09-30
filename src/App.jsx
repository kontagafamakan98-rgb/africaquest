import { Suspense } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { basePath } from '@/lib/base-path.js';
import AppStatus from '@/components/AppStatus';
import AppCrash from '@/components/AppCrash.jsx';
import ScreenSkeleton from '@/components/game/ScreenSkeleton.jsx';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      {/* The app can be served under a path, the way a project site on GitHub
          Pages is: the routes then live there too, or a link to the privacy
          notice would leave the application for the root of the domain. */}
      {/* The boundary wraps the router rather than one screen: a failure in any
          page, in a chunk that could not be fetched, or in the router itself
          lands here as a message with a reload and a trace, instead of a white
          page with nothing on it. */}
      <AppCrash>
        <Router basename={basePath()}>
          <Routes>
            <Route path="/" element={
              <LayoutWrapper currentPageName={mainPageKey}>
                <MainPage />
              </LayoutWrapper>
            } />
            {Object.entries(Pages).map(([path, Page]) => (
              <Route
                key={path}
                path={`/${path}`}
                element={
                  <LayoutWrapper currentPageName={path}>
                    {/* A page may be loaded on demand, like the teacher space or
                        the credits: the same placeholder the game shows while it
                        reads the stored progress, rather than a blank page. */}
                    <Suspense fallback={<ScreenSkeleton />}>
                      <Page />
                    </Suspense>
                  </LayoutWrapper>
                }
              />
            ))}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </AppCrash>
      {/* Says whether the device still has a network, and offers a reload when
          a new version of the app has taken over. */}
      <AppStatus />
    </QueryClientProvider>
  )
}

export default App
