import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NotFound, Login, MainPage } from './pages';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
