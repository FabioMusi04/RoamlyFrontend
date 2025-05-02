import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import NavbarMenu from './components/navbarMenu';
import Profile from './pages/profilePage';
import FriendList from './pages/friendList';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<><NavbarMenu isLoggedIn={true} /><Home /></>} />
        <Route path="/login" element={<><NavbarMenu isLoggedIn={true} /><Login /></>} />
        <Route path="/register" element={<><NavbarMenu isLoggedIn={true} /><Register /></>} />
        <Route path="/profile" element={<><NavbarMenu isLoggedIn={true} /><Profile /></>} />
        <Route path="/friendList" element={<><NavbarMenu isLoggedIn={true} /><FriendList /></>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
