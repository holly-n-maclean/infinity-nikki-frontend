import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import ReactMarkdown from 'react-markdown';
import ReactMde from 'react-mde';
import 'react-mde/lib/styles/css/react-mde-all.css';

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTab, setSelectedTab] = useState('write');
  const [imagePreviews, setImagePreviews] = useState([]);
  const [tagInput, setTagInput] = useState([]);

  useEffect(() => {
    Axios.get(`http://localhost:5000/api/posts/${id}`)
      .then(res => {
        setTitle(res.data.title);
        setContent(res.data.content);
        setTags(Array.isArray(res.data.tags) ? res.data.tags : []);
      })
      .catch(err => {
        console.error('Failed to load post for editing:', err);
        alert('Could not load post');
      });
  }, [id]);

  const handleImagesChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const token = localStorage.getItem('token');

    for (const file of files) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const res = await Axios.post('http://localhost:5000/api/posts/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        const imageUrl = `http://localhost:5000/uploads/${res.data.filename}`;
        const markdown = `\n\n![Uploaded Image](${imageUrl})\n`;

        setContent(prev => prev + markdown);
        setImagePreviews(prev => [...prev, { url: imageUrl, markdown }]);
      } catch (err) {
        console.error('Image upload failed:', err);
        alert(`Failed to upload: ${file.name}`);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await Axios.put(`http://localhost:5000/api/posts/${id}`, {
        title,
        content,
        tags
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      navigate(`/posts/${id}`);
    } catch (err) {
      console.error('Error updating post:', err);
      alert('Failed to update post');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      <h1>Edit Post</h1>

      <form onSubmit={handleUpdate}>
        {/* Title */}
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Post Title"
            style={{ width: '100%', padding: '0.5rem' }}
            required
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
              Promise.resolve(
                <ReactMarkdown
                  components={{
                    img: ({ node, ...props }) => (
                      <img
                        {...props}
                        style={{
                          maxWidth: '100%',
                          height: 'auto',
                          borderRadius: '8px',
                          margin: '1rem 0',
                          display: 'block'
                        }}
                        alt={props.alt || ''}
                      />
                    )
                  }}
                >
                  {markdown}
                </ReactMarkdown>
              )
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

        {/* Image upload */}
        <div style={{ marginBottom: '1rem' }}>
          <label>Upload additional images</label><br />
          <input type="file" multiple accept="image/*" onChange={handleImagesChange} />
        </div>

        {/* Thumbnails */}
        {imagePreviews.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {imagePreviews.map((img, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                <img
                  src={img.url}
                  alt={`Preview ${idx}`}
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    boxShadow: '0 1px 6px rgba(0,0,0,0.2)'
                  }}
                />
                <button
                  onClick={() => {
                    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
                    setContent(prev => prev.replace(img.markdown, ''));
                  }}
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: '#ff4d4d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          style={{
            marginTop: '1.5rem',
            padding: '0.7rem 1.5rem',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Update Post
        </button>
      </form>
    </div>
  );
}

export default EditPost;
