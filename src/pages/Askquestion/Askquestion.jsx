import React, { useState } from 'react'
import './Askquestion.css'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux"
import { askquestion } from '../../action/question'
import AIAssistant from '../../Comnponent/AIAssistant/AIAssistant'
const Askquestion = () => {
    const navigate = useNavigate();
    const dispatch=useDispatch();
    const user = useSelector((state)=>state.currentuserreducer)
    const [questiontitle, setquestiontitle] = useState("");
    const [questionbody, setquestionbody] = useState("");
    const [questiontagsText, setquestiontagsText] = useState("");
    const [questiontags, setquestiontags] = useState([])
    const handlesubmit = (e) => {
        e.preventDefault();
        if (user) {
            if (questionbody && questiontitle && questiontags.length > 0) {
                dispatch(askquestion({questiontitle,questionbody,questiontags,userposted:user.result.name},navigate))
                alert("you have successfuly posted a question")
            } else {
                alert("Please enter all the fields")
            }
        } else {
            alert("Login to ask question")
        }
    }
    const handleenter = (e) => {
        if (e.code === 'Enter') {
            setquestionbody(questionbody + "\n");
        }
    }

    return (
        <div className="ask-question">
            <div className="ask-ques-container">
                <h1>Ask a public Question</h1>
                <form onSubmit={handlesubmit}>
                    <div className="ask-form-container">
                        <label htmlFor="ask-ques-title">
                            <h4>Title</h4>
                            <p>Be specific and imagine you're asking a question to another person</p>
                            <input type="text" id="ask-ques-title"
                                value={questiontitle}
                                onChange={(e) => {
                                    setquestiontitle(e.target.value);
                                }} placeholder='e.g. Is there an R function for finding the index of an element in a vector?' />
                        </label>
                        <label htmlFor="ask-ques-body">
                            <h4>Body</h4>
                            <p>Include all the information someone would need to answer your question</p>
                            <textarea name="" id="ask-ques-body" value={questionbody} onChange={(e) => {
                                setquestionbody(e.target.value);

                            }}
                                cols="30"
                                rows="10"
                                onKeyDown={handleenter}
                            ></textarea>
                        </label>

                        <AIAssistant
                            title={questiontitle}
                            body={questionbody}
                            tags={questiontags}
                            onApplyImprove={({ title, body }) => {
                                setquestiontitle(title);
                                setquestionbody(body);
                            }}
                            onApplyTags={(aiTags) => {
                                const next = Array.isArray(aiTags) ? aiTags.slice(0, 5) : [];
                                setquestiontags(next);
                                setquestiontagsText(next.join(' '));
                            }}
                            onApplyAnswerToBody={(answer) => {
                                if (!answer) return;
                                setquestionbody((prev) => {
                                    const prefix = prev?.trim() ? `${prev}\n\n` : '';
                                    return `${prefix}---\nSuggested answer (AI):\n${answer}`;
                                });
                            }}
                        />
                        <label htmlFor="ask-ques-tags">
                            <h4>Tags</h4>
                            <p>Add up to 5 tags to descibe what your question is about</p>
                            <input type="text" id='ask-ques-tags'
                                value={questiontagsText}
                                onChange={(e) => {
                                    const text = e.target.value;
                                    setquestiontagsText(text);
                                    setquestiontags(text.split(" ").filter(Boolean));
                                }}
                                placeholder='e.g. (xml typescript wordpress'
                            />
                        </label>
                    </div>
                    <input type="submit"
                        value="Review your question"
                        className='review-btn' />
                </form>
            </div>
        </div>
    )
}

export default Askquestion