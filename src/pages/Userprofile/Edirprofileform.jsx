import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateprofile } from '../../action/users'
import './Userprofile.css'
import axios from 'axios';

const Edirprofileform = ({ currentuser, setswitch }) => {
  const [name, setname] = useState(currentuser?.result?.name)
  const [about, setabout] = useState(currentuser?.result?.about)
  const [tags, settags] = useState([])
  const [avatar, setAvatar] = useState(null);
  const dispatch=useDispatch()

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const res = await axios.post('https://codequest-backend-wmll.onrender.com/user/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAvatar(res.data.imageUrl);
    } catch (err) {
      alert('Failed to upload avatar');
    }
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    // Build update object with only changed fields
    const updateData = {};
    if (name && name !== currentuser?.result?.name) updateData.name = name;
    if (about && about !== currentuser?.result?.about) updateData.about = about;
    if (tags.length > 0 && tags[0] !== '') updateData.tags = tags;
    if (avatar) updateData.avatar = avatar;
    if (Object.keys(updateData).length === 0) {
      alert('No changes to update.');
    } else {
      dispatch(updateprofile(currentuser?.result?._id, updateData));
    }
    setswitch(false);
  }
  return (
    <div>
      <h1 className="edit-profile-title">Edit Your Profile</h1>
      <h2 className='edit-profile-title-2'>Public Information</h2>
      <form className="edit-profile-form" onSubmit={handlesubmit}>
        <label htmlFor="name">
          <h3>Display name</h3>
          <input type="text" value={name} onChange={(e) => setname(e.target.value)} />
        </label>
        <label htmlFor="about">
          <h3>About me</h3>
          <textarea name="" id="about" cols="30" rows="10" value={about} onChange={(e) => setabout(e.target.value)}></textarea>
        </label>
        <label htmlFor="tags">
          <h3>Watched tags</h3>
          <p>Add tags separated by 1 space</p>
          <input
            type="text"
            id="tags"
            onChange={(e) => settags(e.target.value.split(" "))}
          />
        </label>
        <label htmlFor="avatar">
          <h3>Profile Picture</h3>
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
          {avatar && <img src={avatar} alt="avatar" style={{ width: 60, height: 60, borderRadius: '50%', marginTop: 10 }} />}
        </label>
        <br />
        <input type="submit" value="save profile" className='user-submit-btn' />
        <button type='button' className='user-cancel-btn' onClick={() => setswitch(false)}>Cancel</button>
      </form>
    </div>
  )
}

export default Edirprofileform