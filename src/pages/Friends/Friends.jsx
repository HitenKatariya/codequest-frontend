import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Friends.css';

const API_URL = 'https://codequest-frontend-psi.vercel.app'; // Backend base URL (deployed)

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFriends();
    // eslint-disable-next-line
  }, []);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('Profile'))?.token;
      const res = await axios.get(`${API_URL}/friends/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFriends(res.data);
    } catch {
      setFriends([]);
    }
    setLoading(false);
  };

  return (
    <div className="friends-list-container">
      <h2 className="friends-list-title">Your Friends</h2>
      {loading ? <p>Loading...</p> : (
        friends.length === 0 ? <p>No friends yet.</p> : (
          <div className="friends-grid">
            {friends.map(friend => (
              <div className="friend-card" key={friend._id}>
                <img className="friend-avatar" src={friend.avatar || '/default-avatar.png'} alt="avatar" />
                <div className="friend-name">{friend.name}</div>
                <Link className="friend-profile-link" to={`/Users/${friend._id}`}>View Profile</Link>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Friends;
