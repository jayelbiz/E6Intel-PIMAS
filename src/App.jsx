import React, { Suspense } from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import News from './pages/News';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Import custom styles
import './styles/index.scss';

function App() {
  return (
    <RecoilRoot>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<News />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </RecoilRoot>
  );
}

export default App;
