import { Routes, Route } from 'react-router-dom'
import Layout from './app/layout/Layout'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import GamesPage from './pages/GamesPage'
import GenrePage from './pages/GenrePage'
import GameDetailPage from './pages/GameDetailPage'
import ContactPage from './pages/ContactPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="products/:platform" element={<ProductsPage />} />
        <Route path="games" element={<GamesPage />} />
        <Route path="games/genres/:genre" element={<GenrePage />} />
        <Route path="games/:slug" element={<GameDetailPage />} />
        <Route path="iletisim" element={<ContactPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="profil" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
