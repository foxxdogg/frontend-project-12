import {
  BrowserRouter, Routes, Route, Navigate,
} from 'react-router-dom';
import NotFound from './pages/NotFound.jsx';
import Login from './pages/Login.jsx';
import MainPage from './pages/MainPage.jsx';
import Registration from './pages/Registration.jsx';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
