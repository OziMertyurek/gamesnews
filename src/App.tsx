import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './app/layout/Layout'

const HomePage = lazy(() => import('./pages/HomePage'))
const GamesPage = lazy(() => import('./pages/GamesPage'))
const GamesAZPage = lazy(() => import('./pages/GamesAZPage'))
const GenrePage = lazy(() => import('./pages/GenrePage'))
const GameDetailPage = lazy(() => import('./pages/GameDetailPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const SignupPage = lazy(() => import('./pages/SignupPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const AwardsPage = lazy(() => import('./pages/AwardsPage'))

function App() {
  return (
    <Suspense fallback={<div className="container py-10 text-sm text-gray-400">Sayfa yukleniyor...</div>}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="games" element={<GamesPage />} />
          <Route path="games/alfabetik" element={<GamesAZPage />} />
          <Route path="oduller" element={<AwardsPage />} />
          <Route path="games/genres/:genre" element={<GenrePage />} />
          <Route path="games/:slug" element={<GameDetailPage />} />
          <Route path="iletisim" element={<ContactPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="profil" element={<ProfilePage />} />
          <Route path="kullanici/:email" element={<UserProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
