import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import ReactMarkdown from 'react-markdown';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

function CreatePost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [imageFiles, setImageFiles] = useState([]);

  const handleEditorChange = ({ text }) => {
    setContent(text);
  };

  const handleImagesChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const token = localStorage.getItem('token');

    for (const file of files) {
      const formData = new FormData();
      formData.append('image', file);
      try {
        const res = await Axios.post(`${process.env.REACT_APP_API_BASE_URL}/posts/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
        });

        const imageUrl = `${process.env.REACT_APP_API_BASE_URL.replace('/api', '')}/uploads/${res.data.filename}`;
        setContent(prev => prev + `\n\n![Uploaded Image](${imageUrl})\n`);
      } catch (err) {
        console.error('Error uploading image:', err);
        alert(`Failed to upload: ${file.name}`);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await Axios.post(`${process.env.REACT_APP_API_BASE_URL}/posts`, {
        title,
        content,
        tags
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      navigate('/');
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      <h1>Create a New Post</h1>
      <form onSubmit={handleSubmit}>
        {/* Title Input */}
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />

        {/* Markdown Editor */}
        <MdEditor
          value={content}
          style={{ height: '400px', marginBottom: '1rem' }}
          renderHTML={text => <ReactMarkdown>{text}</ReactMarkdown>}
          onChange={handleEditorChange}
        />

        {/* Tag Input */}
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const trimmed = tagInput.trim();
              if (trimmed && !tags.includes(trimmed)) {
                setTags([...tags, trimmed]);
                setTagInput('');
              }
            }
          }}
          placeholder="Enter tag and press Enter"
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '5px',
            border: '1px solid #ccc',
            marginBottom: '1rem'
          }}
        />

        {/* Tag List */}
        <div style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {tags.map((tag, i) => (
            <span key={i} style={{
              backgroundColor: '#f3f4f6',
              padding: '0.4rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center'
            }}>
              {tag}
              <button
                type="button"
                onClick={() => setTags(tags.filter((_, index) => index !== i))}
                style={{
                  background: 'none',
                  border: 'none',
                  marginLeft: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {/* Image Upload */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImagesChange}
          style={{ marginBottom: '1rem' }}
        />

        <button type="submit" style={{
          padding: '0.7rem 1.5rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Create Post
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
