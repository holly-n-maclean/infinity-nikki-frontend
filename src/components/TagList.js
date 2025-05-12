import React from 'react';
import { useNavigate } from 'react-router-dom';

const TAG_COLOURS = {
  sweet: '#fdcbe5',
  sexy: '#dccbfd',
  fresh: '#bceab6',
  cool: '#b9dcf7',
  elegant: '#fae483',
};

function getTagColour(tag) {
  return TAG_COLOURS[tag.toLowerCase()] || '#6b7280'; // Default to grey
}

function TagList({ tags = [], onClick }) {
  const navigate = useNavigate();

  const handleClick = (tag) => {
    if (onClick) {
      onClick(tag);
    } else {
      navigate(`/tags/${tag}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
      {tags.map((tag, i) => (
        <button
          key={i}
          onClick={() => handleClick(tag)}
          style={{
            backgroundColor: getTagColour(tag),
            color: 'white',
            padding: '0.4rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
            transition: 'opacity 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
}

export default TagList;


