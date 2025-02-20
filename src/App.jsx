import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import NewsProvider from './contexts/NewsContext'

// Pages
import News from './pages/News'
import Settings from './pages/Settings'
import MainLayout from './layouts/MainLayout'

const App = () => (
  <RecoilRoot>
    <NewsProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<News />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </NewsProvider>
  </RecoilRoot>
)

export default App
