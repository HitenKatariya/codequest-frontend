import React from 'react'
import { Link } from 'react-router-dom'
import moment from "moment"

const Question = ({ question }) => {
    // Defensive: ensure arrays/strings are always defined
    const upvote = Array.isArray(question.upvote) ? question.upvote : [];
    const downvote = Array.isArray(question.downvote) ? question.downvote : [];
    const questiontitle = typeof question.questiontitle === 'string' ? question.questiontitle : '';
    const questiontags = Array.isArray(question.questiontags) ? question.questiontags : [];
    return (
        <div className="display-question-container">
            <div className="display-votes-ans">
                <p>{upvote.length - downvote.length}</p>
                <p>votes</p>
            </div>
            <div className="display-votes-ans">
                <p>{question.noofanswers}</p>
                <p>answers</p>
            </div>
            <div className="display-question-details">
                <Link to={`/Question/${question._id}`} className='question-title-link'>
                    {questiontitle.length > (window.innerWidth <= 400 ? 70 : 90)
                        ? questiontitle.substring(
                            0,
                            window.innerWidth <= 400 ? 70 : 90
                        ) + "..."
                        : questiontitle
                    }
                </Link>
                <div className="display-tags-time">
                    <div className="display-tags">
                        {questiontags.map((tag)=>(
                            <p key={tag}> {tag}</p>
                        ))}
                    </div>
                    <p className="display-time">
                        asked {moment(question.askedon).fromNow()} {question.userposted}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Question