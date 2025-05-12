import React from 'react';

function Layout({ children }) {
  return (
    <div
      className="layout-wrapper"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#fce4ec',
      }}
    >
      {/* Main content area */}
      <main
        className="container"
        style={{
          flex: 1,
          padding: '2rem',
        }}
      >
        {children}
      </main>

      {/* Footer pinned to bottom */}
      <footer
        style={{
          backgroundColor: '#fff',
          textAlign: 'center',
          padding: '1.5rem',
          color: '#555',
          fontSize: '0.9rem',
        }}
      >
        <p>&copy; {new Date().getFullYear()} Luna's Nikki Blog. All rights reserved.</p>
        <p style={{ marginTop: '0.5rem' }}>Crafted with 💕 by Holly MacLean</p>
      </footer>
    </div>
  );
}

export default Layout;