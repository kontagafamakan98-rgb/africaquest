/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import { lazy } from 'react';
import Home from './pages/Home';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import __Layout from './Layout.jsx';

// The quiz, the teacher space, the credits and the bibliography are only ever
// opened on purpose, so they ship as their own chunks instead of weighing down
// the map every player loads. Home opens the quiz the same way, so the two share
// the one file, the credits read the same photograph table a lesson does, and
// the bibliography reads the questions every other screen asks.
const QuizPage = lazy(() => import('./pages/QuizPage'));
const TeacherPage = lazy(() => import('./pages/TeacherPage'));
const PhotoCredits = lazy(() => import('./pages/PhotoCredits'));
const Bibliography = lazy(() => import('./pages/Bibliography'));
// The Android screen is read once, by a reader who came to install the game: it
// asks GitHub for the newest release when it is opened, so it is opened on
// purpose rather than carried by the map everyone loads.
const Android = lazy(() => import('./pages/Android'));


export const PAGES = {
    "QuizPage": QuizPage,
    "Home": Home,
    "About": About,
    "PrivacyPolicy": PrivacyPolicy,
    "TermsOfService": TermsOfService,
    "PhotoCredits": PhotoCredits,
    "Bibliography": Bibliography,
    "Android": Android,
    "TeacherPage": TeacherPage,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};