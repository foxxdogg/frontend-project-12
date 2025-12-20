import {
  BrowserRouter, Routes, Route,
} from 'react-router-dom'
import NotFound from './pages/NotFound.jsx'
import Login from './pages/Login.jsx'
import MainPage from './pages/MainPage.jsx'
import Signup from './pages/Signup.jsx'

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
)

export default App
