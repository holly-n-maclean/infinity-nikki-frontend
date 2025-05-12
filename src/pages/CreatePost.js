import React, { useState } from 'react';
import Axios from 'axios';
import ReactMarkdown from 'react-markdown';
import ReactMde from 'react-mde';
import 'react-mde/lib/styles/css/react-mde-all.css'
import { useNavigate } from 'react-router-dom';

function CreatePost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTab, setSelectedTab] = useState('write');
  const [success, setSuccess] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [tagInput, setTagInput] = useState([]);

  const handleImagesChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const token = localStorage.getItem('token');
  
    for (const file of files) {
      const formData = new FormData();
      formData.append('image', file);
      
  
      try {
        const res = await Axios.post('http://localhost:5000/api/posts/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
        });
  
        const imageUrl = `http://localhost:5000/uploads/${res.data.filename}`;
        const markdownImage = `\n\n![Uploaded Image](${imageUrl})\n`;
  
        // ✅ Immediately insert the image markdown into the editor content
        setContent(prev => prev + markdownImage);
  
      } catch (err) {
        console.error('Error uploading image:', err);
        alert(`Failed to upload: ${file.name}`);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);

    let finalContent = content;

    try {
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const formData = new FormData();
          formData.append('image', file);

          const token = localStorage.getItem('token');

          const res = await Axios.post('http://localhost:5000/api/posts/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
          });

          const imageUrl = `http://localhost:5000/uploads/${res.data.filename}`;
          finalContent += `\n\n![Uploaded Image](${imageUrl})\n`;
        }
      }

      const token = localStorage.getItem('token');

      await Axios.post('http://localhost:5000/api/posts', {
        title,
        content: finalContent,
        tags
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSuccess(true);
      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      <h1>Create a New Post</h1>

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        {/* Markdown Editor */}
        <div style={{ marginBottom: '1rem' }}>
          <ReactMde
            value={content}
            onChange={setContent}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            generateMarkdownPreview={markdown =>
              Promise.resolve(<ReactMarkdown
                components={{
                  img: ({ node, ...props }) => (
                    <img
                      {...props}
                      style={{
                        maxWidth: '100%',
                        height: 'auto',
                        borderRadius: '8px',
                        margin: '1rem 0',
                        display: 'block',
                        boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
                      }}
                    />
                  )
                }}
              
              >{markdown}</ReactMarkdown>)
            }
          />
        </div>

        {/* Tags */}
        <div style={{ marginBottom: '1rem' }}>
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
            marginBottom: '0.5rem'
          }}
        />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {tags.map((tag, i) => (
            <span
              key={i}
              style={{
                backgroundColor: '#f3f4f6',
                color: '#374151',
                padding: '0.4rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 500,
                border: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {tag}
              <button
                type="button"
                onClick={() => setTags(tags.filter((_, index) => index !== i))}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  lineHeight: 1
                }}
                aria-label={`Remove ${tag}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

        {/* Multiple image file input */}
        <div style={{ marginBottom: '1rem' }}>
          <label>Upload one or more images</label><br />
          <input type="file" multiple accept="image/*" onChange={handleImagesChange} />
        </div>

        <button
          type="submit"
          style={{
            padding: '0.7rem 1.5rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Create Post
        </button>
      </form>
    </div>
  );
}

export default CreatePost;