import React, { useState, useEffect } from 'react'
import Leftsidebar from '../../Comnponent/Leftsidebar/Leftsidebar'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import Avatar from '../../Comnponent/Avatar/Avatar'
import Editprofileform from './Edirprofileform'
import Profilebio from './Profilebio'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBirthdayCake, faPen } from '@fortawesome/free-solid-svg-icons'
import { fetchallusers } from '../../action/users'

const Userprofile = ({ slidein }) => {
  const { id } = useParams()
  const [Switch, setswitch] = useState(false);

  const dispatch = useDispatch();
  const users = useSelector((state)=>state.usersreducer)
  const currentprofile = users.filter((user) => user._id === id)[0]
  const currentuser = useSelector((state)=>state.currentuserreducer)

  useEffect(() => {
    if (!users || users.length === 0) {
      dispatch(fetchallusers());
    }
  }, [dispatch, users]);

  if (!currentprofile) {
    return <div style={{padding: 40, textAlign: 'center'}}>Loading profile...</div>;
  }

  return (
    <div className="home-container-1">
      <Leftsidebar slidein={slidein} />
      <div className="home-container-2">
        <section>
          <div className="user-details-container">
            <div className="user-details">
              <Avatar 
                avatar={currentprofile.avatar} // pass avatar prop
                backgroundColor="purple" color="white" fontSize="50px" px="40px" py="30px"
              >
                {(!currentprofile.avatar && currentprofile.name) ? currentprofile.name.charAt(0).toUpperCase() : null}
              </Avatar>
              <div className="user-name">
                <h1>{currentprofile?.name}</h1>
                <p>
                  <FontAwesomeIcon icon={faBirthdayCake} /> Joined{" "} {moment(currentprofile?.joinedon).fromNow()}
                </p>
              </div>
            </div>
            {currentuser?.result?._id === id && ( 
              <button className="edit-profile-btn" type='button' onClick={() => setswitch(true)}><FontAwesomeIcon icon={faPen} /> Edit Profile</button>
            )}
          </div>
          <>
            {Switch ? (
              <Editprofileform currentuser={currentuser} setswitch={setswitch} />
            ) : (
              <Profilebio currentprofile={currentprofile} />
            )}
          </>
        </section>
      </div></div>
  )
}

export default Userprofile