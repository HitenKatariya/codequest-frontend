import React from 'react'
import moment from 'moment'
import { Link,useParams } from 'react-router-dom'
import Avatar from '../../Comnponent/Avatar/Avatar'
import { useDispatch ,useSelector} from 'react-redux'
import { deleteanswer } from '../../action/question'
const Displayanswer = ({ question, handleshare }) => {
  const user =useSelector((state)=>state.currentuserreducer)
  const users = useSelector((state) => state.usersreducer);
  const {id}=useParams();
  const dispatch=useDispatch()
  const handledelete = (answerid, noofanswers) => {
    dispatch(deleteanswer(id,answerid,noofanswers -1))
  }
  return (
    <div>
      {question.answer.map((ans) => {
        const u = users.find(u => u._id === ans.userid);
        return (
        <div className="display-ans" key={ans._id}>
          <p>{ans.answerbody}</p>
          <div className="question-actions-user">
            <div>
              <button type='button' onClick={handleshare} >Share</button>
              {user?.result?._id === ans?.userid && (
                <button type='button' onClick={() => handledelete(ans._id, question.noofanswers)}>Delete</button>
              )}
            </div>
            <div>
            <p>answered {moment(ans.answeredon).fromNow()}</p>
            <Link to={`Users/${ans.userid}`} className='user-limk' style={{ color: "#0086d8" }}>
              <Avatar 
                avatar={u?.avatar} 
                backgroundColor="#ff9900" 
                color="white" 
                fontSize="1rem" 
                px="0" 
                py="0" 
                borderRadius="50%"
                style={{ width: 28, height: 28, border: '2px solid #ff9900' }}
              >
                {(!u?.avatar && ans.useranswered) ? ans.useranswered.charAt(0).toUpperCase() : null}
              </Avatar>
              <div>{ans.useranswered}</div>
            </Link>
            </div>
          </div>
        </div>
      )})}
    </div>
  )
}

export default Displayanswer