import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import PostPage from './pages/PostPage';
import EditPost from './pages/EditPost';
import TagPage from './pages/TagPage';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import { useAuth } from './context/AuthContext';
import About from './pages/About';

function App() {
  const { username, logout } = useAuth();

  return (
    <Router>
      <nav className="top-nav">
      <div className="nav-container flex flex-col sm:flex-row sm:justify-between sm:items-center text-center sm:text-left gap-4 sm:gap-0">
      <div className="logo-area">
        <div className="logo-circle">L</div>
        <h1 className="site-title">Luna's Nikki Blog</h1>
      </div>
      <div className="nav-links flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center sm:justify-end items-center sm:items-center w-full">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      {username && (
        <Link to="/create">Create</Link>
      )}

      <div className="dropdown">
        <span className="dropdown-label">Tags ▾</span>
        <div className="dropdown-menu">
          <Link to="/tags/sweet" className="dropdown-item">#sweet</Link>
          <Link to="/tags/elegant" className="dropdown-item">#elegant</Link>
          <Link to="/tags/fresh" className="dropdown-item">#fresh</Link>
          <Link to="/tags/sexy" className="dropdown-item">#sexy</Link>
          <Link to="/tags/cool" className="dropdown-item">#cool</Link>
        </div>
      </div>

      {username ? (
        <>
          <span style={{ marginLeft: '1rem', color: '#555' }}>
            Logged in as: <strong>{username}</strong>
          </span>
          <button
            onClick={logout}
            style={{
              marginLeft: '1rem',
              padding: '0.4rem 0.8rem',
              border: 'none',
              borderRadius: '4px',
              background: '#ec4899',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <Link to="/login" className="login-button">Login</Link>
      )}
    </div>
    </div>
  </nav>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/create" element={<Layout><CreatePost /></Layout>} />
        <Route path="/posts/:id" element={<Layout><PostPage /></Layout>} />
        <Route path="/posts/edit/:id" element={<Layout><EditPost /></Layout>} />
        <Route path="/tags/:tag" element={<Layout><TagPage /></Layout>} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
