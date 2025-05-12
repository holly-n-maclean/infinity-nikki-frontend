import React from 'react';

function About() {
  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
      <h1 style={{ fontFamily: "'Cinzel', serif", marginBottom: '1rem' }}>About Luna's Nikki Blog</h1>
      <p style={{ lineHeight: '1.7', fontSize: '1.05rem', color: '#555' }}>
        Hi! I'm Luna — a longtime fan of the Nikki game series and fashion-focused games. This blog is my creative space where I post outfit ideas, game commentary, and inspiration from the Nikki universe. Whether you're here for styling tips, image collections, or just some cozy vibes, I'm glad you're visiting.
      </p>
      <p style={{ lineHeight: '1.7', fontSize: '1.05rem', color: '#555', marginTop: '1rem' }}>
        I built this blog myself using React and Node.js as a passion project, and I'm continuing to improve it over time. Thanks for stopping by 💖
      </p>
    </div>
  );
}

export default About;