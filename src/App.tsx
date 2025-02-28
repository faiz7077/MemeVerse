import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './components/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy loaded components for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const MemeExplorer = lazy(() => import('./pages/MemeExplorer'));
// const MemeUpload = lazy(() => import('./pages/MemeUpload'));
const MemeDetails = lazy(() => import('./pages/MemeDetails'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
// const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<MemeExplorer />} />
              {/* <Route path="/upload" element={<MemeUpload />} /> */}
              <Route path="/meme/:id" element={<MemeDetails />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              {/* <Route path="*" element={<NotFound />} /> */}
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;