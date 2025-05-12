import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import Axios from 'axios'; 
import TagList from '../components/TagList';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination'; // Import the Pagination component


function TagPage() {
    const { tag } = useParams(); // Get the tag from the URL
    const [posts, setPosts] = useState([]); // State to hold posts with the specified tag
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        Axios.get(`http://localhost:5000/api/posts/tag/${tag}?page=${currentPage}&limit=5`)
          .then(res => {
            setPosts(res.data.posts);
            setTotalPages(res.data.pages);
          })
          .catch(err => {
            console.error('Error fetching posts by tag:', err);
            setPosts([]);
          });
      }, [tag, currentPage]); 

    const getThumbnailFromContent = (markdown) => {
        const match = markdown.match(/!\[.*?\]\((.*?)\)/);
        return match ? match[1] : 'https://via.placeholder.com/300x200?text=No+Image';
      };
    
      const stripImagesAndMarkdown = (markdown) => {
        const noImages = markdown.replace(/!\[.*?\]\(.*?\)/g, '');
        return noImages.replace(/[#_*`>]/g, '').substring(0, 160);
      };
    
      const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      };

    return (
        <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '1rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
        Posts tagged with <span style={{ color: '#ec4899' }}>#{tag}</span>
      </h1>

      {posts.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999' }}>No posts found for this tag.</p>
      ) : (
        posts.map(post => {
          const thumbnail = getThumbnailFromContent(post.content);

          return (
            <div key={post._id} style={{
              display: 'flex',
              border: '1px solid #ddd',
              borderRadius: '10px',
              marginBottom: '1.5rem',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              background: '#fff',
              flexDirection: 'row',
            }}>
              <img
                src={thumbnail}
                alt="Post thumbnail"
                style={{ width: '200px', objectFit: 'cover' }}
              />

              <div style={{ padding: '1rem', flex: 1 }}>
                <Link to={`/posts/${post._id}`} style={{ textDecoration: 'none', color: '#222' }}>
                  <h2 style={{ margin: '0 0 0.5rem 0' }}>{post.title}</h2>
                </Link>

                <p style={{ color: '#888', fontSize: '0.8rem', marginTop: '-0.5rem', marginBottom: '0.75rem' }}>
                  {formatDate(post.createdAt)}
                </p>

                <p style={{ color: '#555', marginBottom: '1rem' }}>
                  {stripImagesAndMarkdown(post.content)}...
                </p>

                <TagList tags={post.tags} />

                <Link to={`/posts/${post._id}`} className="read-more-button">
                  Read More →
                </Link>
              </div>
            </div>

            
          );
        },
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            />
      ))}
    </div>
  );
}

export default TagPage;