import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PublicSpace.css';

const API_URL = 'http://localhost:5000'; // Backend base URL

const PublicSpace = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [canPost, setCanPost] = useState(true);
  const [friendsCount, setFriendsCount] = useState(0);

  // Fetch posts
  useEffect(() => {
    fetchPosts();
    fetchFriendsCount();
    
    // Refresh friends count when page becomes visible (user comes back from Users page)
    const handleFocus = () => {
      fetchFriendsCount();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchFriendsCount = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('Profile'))?.token;
      const res = await axios.get(`${API_URL}/friends/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFriendsCount(res.data.length);
    } catch (err) {
      console.error('Failed to fetch friends count:', err);
      // Fallback to localStorage
      const storedFriends = JSON.parse(localStorage.getItem('Profile'))?.result?.friends?.length || 0;
      setFriendsCount(storedFriends);
    }
  };

  const fetchPosts = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('Profile'))?.token;
      const res = await axios.get(`${API_URL}/publicspace`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(res.data);
      // Check if user can post (max 2 per day)
      const myId = JSON.parse(localStorage.getItem('Profile'))?.result?._id;
      const today = new Date().toDateString();
      const myPostsToday = res.data.filter(p => p.user._id === myId && new Date(p.createdAt).toDateString() === today);
      console.log('My posts today:', myPostsToday.length, 'Can post:', myPostsToday.length < 2);
      setCanPost(myPostsToday.length < 2);
    } catch (err) {
      setError('Failed to fetch posts');
      console.error('Error fetching posts:', err);
    }
  };

  const handleMediaChange = e => {
    const file = e.target.files[0];
    setMedia(file);
    setMediaPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    console.log('Submit clicked! Content:', content, 'Media:', media, 'Can post:', canPost);
    setError(''); setSuccess('');
    if (!canPost) return setError('You have reached your daily post limit.');
    if (!content.trim() && !media) return setError('Please add some content or media to post.');
    
    const formData = new FormData();
    formData.append('content', content);
    if (media) formData.append('media', media);
    
    console.log('Sending form data:', { content, hasMedia: !!media });
    
    try {
      const token = JSON.parse(localStorage.getItem('Profile'))?.token;
      console.log('Token exists:', !!token);
      const response = await axios.post(`${API_URL}/publicspace/create`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      console.log('Post created successfully:', response.data);
      setContent(''); setMedia(null); setMediaPreview(null);
      setSuccess('Post created!');
      fetchPosts();
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.response?.data?.message || 'Failed to post');
    }
  };

  const handleLike = async (postId) => {
    try {
      const token = JSON.parse(localStorage.getItem('Profile'))?.token;
      await axios.post(`${API_URL}/publicspace/like/${postId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPosts();
    } catch (err) {
      setError('Failed to like post');
    }
  };

  return (
    <div className="public-space-container">
      <h2>Public Space</h2>
      <form className="public-space-form" onSubmit={handleSubmit}>
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="What's on your mind?" rows={3} />
        <input type="file" accept="image/*,video/*" onChange={handleMediaChange} />
        {mediaPreview && (
          <div className="public-space-preview">
            {media && media.type.startsWith('video') ? (
              <video src={mediaPreview} controls width={200} />
            ) : (
              <img src={mediaPreview} alt="preview" width={100} />
            )}
          </div>
        )}
        <button type="submit" disabled={!canPost} title={!canPost ? 'You have reached your daily post limit (2 posts max)' : 'Click to post'}>
          {!canPost ? 'Daily limit reached' : 'Post'}
        </button>
        {!canPost && <div style={{color:'orange', fontSize:'12px', marginTop:'4px'}}>You can only post 2 times per day</div>}
        {error && <div style={{color:'red'}}>{error}</div>}
        {success && <div style={{color:'green'}}>{success}</div>}
      </form>
      {/* Show friend count and add friend button */}
      <div className="public-space-friends-info">
        <b>Friends:</b> {friendsCount}
        <button style={{marginLeft:8}} onClick={() => window.location='/Users'}>Add Friend</button>
      </div>
      <div className="posts-list">
        {posts.map(post => (
          <div key={post._id} className="post-item">
            <div className="post-header">
              {post.user.avatar ? (
                <img 
                  src={post.user.avatar.startsWith('/uploads/') ? `http://localhost:5000${post.user.avatar}` : post.user.avatar} 
                  alt="avatar" 
                  style={{width:44,height:44,borderRadius:'50%',objectFit:'cover',border:'2px solid #ff9900'}}
                />
              ) : (
                <div style={{width:44,height:44,background:'#eee',borderRadius:'50%'}}></div>
              )}
              <span className="post-user">{post.user.name}</span>
              <span className="post-date">{new Date(post.createdAt).toLocaleString()}</span>
            </div>
            <div className="post-content">{post.content}</div>
            {post.media && post.type === 'image' && (
              <img 
                src={post.media} 
                alt="media" 
                className="post-media" 
                style={{maxWidth:200, borderRadius:8, marginTop:8}}
              />
            )}
            {post.media && post.type === 'video' && (
              <video 
                src={post.media} 
                controls 
                className="post-media" 
                style={{maxWidth:200, borderRadius:8, marginTop:8}}
              />
            )}
            <div className="post-actions">
              <button onClick={() => handleLike(post._id)}>
                ❤️ Like ({post.likes.length})
              </button>
            </div>
            <div className="post-comments">
              <b>Comments:</b>
              <ul>
                {post.comments.map((c, i) => (
                  <li key={i}>{c.text}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicSpace;
