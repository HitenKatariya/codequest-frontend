import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../../Comnponent/Avatar/Avatar';

const API_URL = 'https://codequest-backend-wmll.onrender.com/'; // Backend base URL

const User = ({ user }) => {
  const displayName = typeof user?.name === 'string' ? user.name : '';
  const [isFriend, setIsFriend] = useState(false);
  const [loading, setLoading] = useState(false);
  const myId = JSON.parse(localStorage.getItem('Profile'))?.result?._id;
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    fetchFriends();
    // eslint-disable-next-line
  }, []);

  const fetchFriends = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('Profile'))?.token;
      const res = await axios.get(`${API_URL}/friends/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFriends(res.data.map(f => f._id));
      setIsFriend(res.data.some(f => f._id === user._id));
    } catch {}
  };

  const handleAddFriend = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('Profile'))?.token;
      await axios.post(`${API_URL}/friends/add`, { friendId: user._id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsFriend(true);
      setFriends(prev => [...prev, user._id]);
      alert('Friend added successfully!');
    } catch (err) {
      console.error('Error adding friend:', err);
      alert('Failed to add friend. Please try again.');
    }
    setLoading(false);
  };

  const handleRemoveFriend = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('Profile'))?.token;
      await axios.post(`${API_URL}/friends/remove`, { friendId: user._id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsFriend(false);
      alert('Friend removed successfully!');
    } catch (err) {
      console.error('Error removing friend:', err);
      alert('Failed to remove friend. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className='user-profile-link'>
      <Link to={`/Users/${user?._id}`} style={{ display: 'inline-block', cursor: 'pointer' }} tabIndex={0} aria-label={`View profile of ${displayName}`}>
        <Avatar 
          avatar={user.avatar} 
          backgroundColor="#ff9900" 
          color="white" 
          fontSize="2rem" 
          px="0" 
          py="0" 
          borderRadius="50%"
          style={{ width: 48, height: 48, border: '3px solid #ff9900' }}
        >
          {(!user.avatar && displayName) ? displayName.charAt(0).toUpperCase() : null}
        </Avatar>
      </Link>
      <h5>{displayName}</h5>
      <Link to={`/Users/${user?._id}`} style={{ color: '#ff9900', marginBottom: 8 }}>View Profile</Link>
      {user._id !== myId && (
        <form onSubmit={isFriend ? handleRemoveFriend : handleAddFriend} style={{ marginTop: 8 }}>
          <button
            className={`friend-btn${isFriend ? ' remove' : ''}`}
            type="submit"
            disabled={loading}
          >
            {isFriend ? 'Remove Friend' : 'Add Friend'}
          </button>
        </form>
      )}
    </div>
  );
};

export default User;