import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { RecoilRoot } from 'recoil'

// Pages
import News from './pages/News'
import Settings from './pages/Settings'
import MainLayout from './layouts/MainLayout'

const App = () => (
  <RecoilRoot>
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<News />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  </RecoilRoot>
)

export default App
