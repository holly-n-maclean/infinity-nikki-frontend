import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import TagList from '../components/TagList';
import Pagination from '../components/Pagination';

function Home() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    Axios.get(`http://localhost:5000/api/posts?page=${currentPage}&limit=5`)
      .then(res => {
        setPosts(res.data.posts);
        setTotalPages(res.data.pages);
      })
      .catch(err => console.error('Error fetching posts:', err));
  }, [currentPage]);

  const getThumbnailFromContent = (markdown) => {
    const match = markdown.match(/!\[.*?\]\((.*?)\)/);
    return match ? match[1] : null;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="home-container">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <img
          src="/images/homeimage.png"
          alt="Posts and Updates Banner"
          style={{
            maxWidth: '60%',
            height: 'auto',
            backgroundColor: '#fce4ec'
          }}
        />
      </div>


      {posts.map(post => {
        const thumbnail = getThumbnailFromContent(post.content) || 'https://via.placeholder.com/300x200?text=No+Image';

        return (
          <div key={post._id} className="post-card">
            <img src={thumbnail} alt="Post thumbnail" />
            <div className="post-content">
              <Link to={`/posts/${post._id}`} className="post-title-link">
                <h2>{post.title}</h2>
              </Link>

              <p className="post-date">Posted by <strong>{post.author}</strong> on {formatDate(post.createdAt)}</p>

              <p className="post-excerpt">
                {post.content.replace(/!\[.*?\]\(.*?\)/g, '').substring(0, 140)}...
              </p>

              <TagList tags={post.tags} />

              <Link to={`/posts/${post._id}`} className="read-more-button">
                Read More →
              </Link>
            </div>
          </div>
        );
      })}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Home;