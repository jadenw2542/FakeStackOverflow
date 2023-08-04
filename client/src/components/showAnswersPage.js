//import Model from '../models/model.js';
//import { useState } from "react";
import React from 'react';
import getMetaData from './utils.js';
import { useState, useEffect } from "react";
import axios from 'axios';
import { getAnswersListNewest, getCommentNewest } from './utils.js';
//import { set } from 'mongoose';


export default function AnswersPage(props) {
    let user = props.user;
    let userId = user.userId;
    console.log("AnswersPage");
    const [allAnswers, setAllAnswers] = useState();
    const question = props.question;
    const [questionVotes, setQuestionVotes] = useState(question.votes);

    console.log(question);
    //console.log('http://localhost:8000/increaseView/' + question._id);


    console.log(allAnswers);
    const [highlightPrev, setHighlightPrev] = useState(true); 
    const [answer_page_arr, setAnswer_page_arr] = useState([]);

    useEffect(() => {
        if (allAnswers) {
        let tmp = [];
        for (let i = 0; i < allAnswers.length; i += 5) {
            let chunk = allAnswers.slice(i, i + 5);
            console.log(chunk);
            tmp = [...tmp, chunk];
        }
        
        console.log(tmp);
        setAnswer_page_arr(tmp);
        }
    }, [allAnswers]);

    const [curr_answer_page_index, setCurr_answer_page_index] = useState(0);
    console.log(userId);
    useEffect(() => {
        axios.get('http://localhost:8000/getAllAnswers')
        .then(function (response) {
          //console.log(response?.data);
          console.log(getAnswersListNewest(question, response?.data));

          if (props.isEditingAnswer === true){

            let userAnsFirst = []
            let ans = getAnswersListNewest(question, response?.data);
            
            for (let i = 0; i < ans.length; i++ )
            {
                if(ans[i].author_id === user.userId){
                    userAnsFirst.unshift(ans[i]);
                }
                else{
                    userAnsFirst.push(ans[i]);
                }
            }
            setAllAnswers(userAnsFirst);
          }

        else 
        {
            setAllAnswers(getAnswersListNewest(question, response?.data));
        }
        })
        .catch(function (error) {
          console.log(error);
        });
        }, []);



    //http://localhost:8000/increaseView/64449619b6d0c7650851711c
    useEffect(() => {
        axios.post('http://localhost:8000/increaseView/' + question._id)
        .then(function (response) {
            console.log(response?.data);
            props.setQuestion(response?.data[0]);
        })
        .catch(function (error) {
            console.log(error);
          });
        }, []);




    let startTime = Date.now();
    let isAnswer = false;

    console.log(answer_page_arr);

    return (
        <div className="answersPage">
            <div className="answersPage_Header">
                <div className="answersPage_NumOfAnswers">{(question.answers.length) === 1? "1 Answer" : question.answers.length + " Answers"} </div>
                <div className="answersPage_QuestionTitle">{question.title}</div>
                {user.userId !== 0 && <button className="askQuestionButton" onClick={() => {
                                    props.setClicked("AskQuestionPage");
                                }}>Ask Question</button>}
            </div>
            <div className="answerPage_QuestionHeader">
                <div className="answersPage_Views">{(question.views) === 1? "1 View" : question.views + " Views"}</div>
                <div className='answersPage_QuestionTextAndComments'>
                    <AnswerText key="answersPage_QuestionText" text={question.text} className="answersPage_QuestionText"/>
                    {<QuestionCommentsContainer className="QuestionCommentsContainer" 
                    user={user} question={question} comments={question.comments}/>}
                </div>                   


                <div className="answersPage_AuthorMetadataContainer">
                    <div className="answersPage_Author"> {question.asked_by} </div>
                    {allAnswers && <div className="answersPage_AuthorMetadata">{getMetaData(startTime, question.ask_date_time, isAnswer)}</div> }

                    <div className = "answerPage_votes"> {questionVotes} </div>
                    
                    <div> 
                        <button className="answerPage_upvote" onClick={() => questionVote(1)}> {"\u2191"}</button>
                        <button className="answerPage_downvote" onClick={() => questionVote(-1)}> {"\u2193"}</button>
                    </div>
                    
                </div>
            </div>



            {answer_page_arr?.length > 0 && <ShowAnswers user={props.user} question={props.question} setQuestion={props.setQuestion} allAnswers={answer_page_arr[curr_answer_page_index]}
            setAnswer_page_arr={setAnswer_page_arr} answer_page_arr={answer_page_arr} curr_answer_page_index={curr_answer_page_index} setClicked={props.setClicked}
            answerToBeEdited={props.answerToBeEdited} setAnswerToBeEdited={props.setAnswerToBeEdited} isEditingAnswer={props.isEditingAnswer} setIsEditingAnswer={props.setIsEditingAnswer} />}
            <div className = "answersPage_QuestionButtonAndPrevNextButton">
                {user.userId !== 0 && <button className="answersPage_AnswerQuestionButton"onClick={() => {
                                        props.setClicked("AddAnswerPage");
                                        props.setQuestion(question);
                                    }}>Answer Question</button>}

                    <button className="answerPrevButton" style={{backgroundColor: highlightPrev && "grey"}} onClick={ () => {
                                                if (curr_answer_page_index === 0){
                                                    setHighlightPrev(true);
                                                }
                                                else 
                                                {
                                                    if (curr_answer_page_index - 1 === 0){
                                                        setHighlightPrev(true)
                                                    }
                                                    else {
                                                        setHighlightPrev(false);
                                                    }
                                                    setCurr_answer_page_index(curr_answer_page_index - 1);

                                                }
                                            }}> Prev</button>
                    <button className="answersNextButton"  onClick={ () => {
                                                if(answer_page_arr.length === 0){
                                                // do nothin
                                                }
                                                else if (curr_answer_page_index === answer_page_arr.length - 1){
                                                    setCurr_answer_page_index(0);
                                                    setHighlightPrev(true);
                                                }
                                                else 
                                                {
                                                    setCurr_answer_page_index(curr_answer_page_index + 1);
                                                    setHighlightPrev(false);
                                                }
                                            }}> Next</button>

            </div>
        </div>
    )

    async function questionVote(num){

        if(user.userId === 0)
        {
            alert("Must be logged in to vote!")
        }
        else
        {
            let votes = await axios.post("http://localhost:8000/voteQuestion/" + num + "/" + question._id );
            setQuestionVotes(votes.data[0].votes);
        }
    }
}

function QuestionCommentsContainer(props){
    let user = props.user;
    let[question, setQuestion] = useState(props.question);
    // const[comments, setComments] = useState(props.comments);
    const [highlightPrev, setHighlightPrev] = useState(true); 
    const [comment_page_arr, setComment_page_arr] = useState([]);
    const [curr_comment_page_index, setCurr_comment_page_index] = useState(0);

    let [error, setError] = useState("* indicated mandatory fields");
    let [commentData, setCommentData] = useState("");
    

    useEffect(() => {
        if (question) {
        //console.log(question);

        async function getComments(){
            //console.log(question.comments);
            return await axios.post("http://localhost:8000/getCommentArray", question.comments);
        }

        getComments().then(comments=> {
        //console.log(comments);
        let newest = comments.data.map(x => x[0]);
        //console.log(newest);

        newest = getCommentNewest(newest);
        //console.log(newest);
        let tmp = [];
        for (let i = 0; i < newest.length; i += 3) {
            let chunk = newest.slice(i, i + 3);
            //console.log(chunk);
            tmp = [...tmp, chunk];
        }
        //console.log(tmp);
        setComment_page_arr(tmp);
        })
        .catch(error => {
            console.log(error);
        })
    }
    }, [question]);


      
    function handleSubmit(e){
        
        e.preventDefault();
       
        let errMessage = "";
        
        if (user.userId === 0)
        {
            errMessage = "Must be logged in to comment";
            setError(errMessage);
        }
        else if (commentData.length > 140){
            errMessage = "Max characters is 140";
            setError(errMessage);
        }
        else if (commentData.trim().length === 0){
            errMessage = "Your comment should not be empty";
            setError(errMessage);
        }
        
        else{
            handleNewComment();
        }

    }

    async function handleNewComment(){
        let userId = props.user.userId;
        //console.log(userId);
        let reputation = await axios.get("http://localhost:8000/getReputation/" + user.userId );
        reputation = reputation.data[0].reputation;
        // console.log(reputation);
        if(reputation < 50)
        {
            let errMessage = "Your reputation is below 50";
            setError(errMessage);
        }
        else {
            const newComment = {
                comment_by: user.username, //implemnt username later
                text : commentData,
                author_id : userId
            };

            let comment_id = await axios.post("http://localhost:8000/comment_add_id", newComment);
            comment_id = comment_id.data;

            console.log(comment_id);
            
            const updateQuestion = {
                qid: question._id,
                comment_id: comment_id
            };


            let updatedQuestion = await axios.post("http://localhost:8000/comment_update_qid", updateQuestion);
            setQuestion(updatedQuestion.data[0]); //set to updated question
        }
    }

    function checkSubmit(e) {
        if(e && e.keyCode === 13) {
           handleSubmit(e); 
        }
     }

    return (
        <div>
            <form className="answersPage_commentOnQuestion" onKeyUp={(e) => checkSubmit(e)}  onSubmit={(e) => handleSubmit(e)}>
                <textarea className="answersPage_commentInput" id="answersPage_commentInputID" value={commentData} 
                onChange={(e) => setCommentData(e.target.value)} cols="20" rows="1" placeholder="Enter a comment"></textarea>

                <button type="submit" className="answersPage_submitComment">Comment</button>
                <div className="answersPage_MandatoryFields">{error}</div>
            </form> 
            <button className="commentsPrevButton" style={{backgroundColor: highlightPrev && "grey"}} onClick={ () => {
                                if (curr_comment_page_index === 0){
                                    setHighlightPrev(true);
                                }
                                else 
                                {   
                                    if (curr_comment_page_index - 1 === 0){
                                        setHighlightPrev(true)
                                    }
                                    else {
                                        setHighlightPrev(false);
                                    }
                                    setCurr_comment_page_index(curr_comment_page_index - 1);
                                }
                            }}> Prev</button>
            <button className="commentsNextButton"  onClick={ () => {
                                if(comment_page_arr.length === 0){
                                    // do nothin
                                    }
                                else if (curr_comment_page_index === comment_page_arr.length - 1){
                                    setCurr_comment_page_index(0);
                                    setHighlightPrev(true);
                                }
                                else 
                                {
                                    setCurr_comment_page_index(curr_comment_page_index + 1);
                                    setHighlightPrev(false);
                                }
                            }}> Next</button>
            {comment_page_arr?.length > 0 && <QuestionCommentPage user={user} comments={comment_page_arr[curr_comment_page_index]}
            setComment_page_arr={setComment_page_arr} />}

        </div>
    );

}


function QuestionCommentPage(props)
{ 
    let comments = props.comments;
    
    console.log(comments);

    let arr = [];
    for(let i = 0; i < comments.length; i ++)
        {
            arr.push(<QuestionSingleComment user={props.user} comment={comments[i]} i = {i} key={comments[i]._id} />)
        }
    return React.createElement("div", {}, arr);
}

function QuestionSingleComment(props){
    //console.log(props);
    let user = props.user;
    const [comment, setComment] = useState(props.comment);
    const [commentVotes, setCommentVotes] = useState(0);

    useEffect(() => {
        if(comment){
        setCommentVotes(comment.votes);
    }
    }, [comment]);
    
    useEffect(() => {
        axios.get("http://localhost:8000/getCommentById/" + comment._id)
        .then(function (response) {
          console.log(response?.data);
          setComment(response?.data[0]);
        })
        .catch(function (error) {
          console.log(error);
        });
        }, []);

    async function commentVote(num){

        if(user.userId === 0)
        {
            alert("Must be logged in to vote!")
        }
        else
        {
            console.log(num);
            console.log(comment._id );
            let votes = await axios.post("http://localhost:8000/voteComment/" + num + "/" + comment._id );
            setCommentVotes(votes.data[0].votes);
        }

        //update reputation
    }
    return(
        <div className='questionPage_CommentContainer'>
            <div className='questionPage_CommentText'> {comment && comment.text} </div>

            <div className='questionPage_questionCommentAuthor'> {comment && comment.comment_by} </div>

            <div className='questionPage_votesContainer'>
                <div className = "questionPage_votes"> {comment && commentVotes} </div>
                <div> 
                            <button className="answerPage_upvote" onClick={() => commentVote(1)}> {"\u2191"}</button>
                </div>
            </div>
        
        </div>
    )
}




function ShowAnswers(props) {
    console.log(props);
    let answersArr = props.allAnswers;
    console.log(answersArr);

    let arr = [];
    for(let i = 0; i < answersArr.length; i ++)
        {
            arr.push(<ShowSingleAnswer user={props.user} currentAns={answersArr[i]} i = {i} key={answersArr[i]._id}  setClicked={props.setClicked} question={props.question} setQuestion={props.setQuestion}
            setAnswer_page_arr={props.setAnswer_page_arr} answer_page_arr={props.answer_page_arr} curr_answer_page_index={props.curr_answer_page_index}
            answerToBeEdited={props.answerToBeEdited} setAnswerToBeEdited={props.setAnswerToBeEdited} isEditingAnswer={props.isEditingAnswer} setIsEditingAnswer={props.setIsEditingAnswer}/>)
        }
    return React.createElement("div", {}, arr);

}

function ShowSingleAnswer(props){   
    //console.log(props);
    
    console.log(props.question);
    let user = props.user;
    let currentAns = props.currentAns;
    let startTime = Date.now();
    let isAnswer = true;
    const [answerVotes, setAnswerVotes] = useState(currentAns.votes);
    //console.log(currentAns.author_id);
    //console.log(user.userId );
    //console.log(props.isEditingAnswer);

    async function answerVote(num){
        if(user.userId === 0)
        {
            alert("Must be logged in to vote!")
        }
        else
        {
            let votes = await axios.post("http://localhost:8000/voteAnswer/" + num + "/" + currentAns._id );
            setAnswerVotes(votes.data[0].votes);
            let arr =  props.answer_page_arr;
            arr[props.curr_answer_page_index][props.i].votes += num;
            props.setAnswer_page_arr(arr);
        }
    }

    return(
        <div className="answersPage_AnswerContainer" key={currentAns._id}>
            <div className='answersPage_AnswerAndComments'>
            <AnswerText key="answersPage_AnswerText" text={currentAns.text} className="answersPage_AnswerText"/>
            {<AnswerCommentsContainer className="AnswerCommentsContainer" 
            user={user} currentAns={currentAns} />}
            </div>
            <div className="answersPage_AnswerMetadata">
                <div className="answersPage_AnswerMetadata">

                {currentAns.author_id === user.userId && props.isEditingAnswer === true && <button className="editAnswerButton" onClick={() => {
                    props.setClicked("EditAnswerPage");
                    props.setAnswerToBeEdited(currentAns);
                    console.log(props.question);
                    props.setQuestion(props.question);
                }}> Edit Answer</button>}

                    <div className="answersPage_AnswerAuthor">{currentAns.ans_by}</div>
                    <div className="answerPage_AnswerText">
                        {getMetaData(startTime, currentAns.ans_date_time, isAnswer)}
                    </div>

                    <div className = "answerPage_votes"> {answerVotes} </div>

                    <div> 
                        <button className="answerPage_upvote" onClick={() => answerVote(1)}> {"\u2191"}</button>
                        <button className="answerPage_downvote" onClick={() => answerVote(-1)}> {"\u2193"}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AnswerCommentsContainer(props){
    let user = props.user;
    let[answer, setAnswer] = useState(props.currentAns);
    // const[comments, setComments] = useState(props.comments);
    const [highlightPrev, setHighlightPrev] = useState(true); 
    const [comment_page_arr, setComment_page_arr] = useState([]);
    const [curr_comment_page_index, setCurr_comment_page_index] = useState(0);

    let [error, setError] = useState("* indicated mandatory fields");
    let [commentData, setCommentData] = useState("");

    useEffect(() => {
        if (answer) {
        //console.log(question);

        async function getComments(){
            //console.log(question.comments);
            return await axios.post("http://localhost:8000/getCommentArray", answer.comments);
        }

        getComments().then(comments=> {
        //console.log(comments);
        let newest = comments.data.map(x => x[0]);
        //console.log(newest);

        newest = getCommentNewest(newest);
        //console.log(newest);
        let tmp = [];
        for (let i = 0; i < newest.length; i += 3) {
            let chunk = newest.slice(i, i + 3);
            //console.log(chunk);
            tmp = [...tmp, chunk];
        }
        //console.log(tmp);
        setComment_page_arr(tmp);
        })
        .catch(error => {
            console.log(error);
        })
    }
    }, [answer]);

    function handleSubmit(e){
        
        e.preventDefault();
       
        let errMessage = "";
        
        if (user.userId === 0)
        {
            errMessage = "Must be logged in to comment";
            setError(errMessage);
        }
        else if (commentData.length > 140){
            errMessage = "Max characters is 140";
            setError(errMessage);
        }
        else if (commentData.trim().length === 0){
            errMessage = "Your comment should not be empty";
            setError(errMessage);
        }
        
        else{
            handleNewComment();
        }
    }

    async function handleNewComment(){
        let reputation = await axios.get("http://localhost:8000/getReputation/" + user.userId);
        reputation = reputation.data[0].reputation;
        console.log(reputation);
        if(reputation < 50)
        {
            let errMessage = "Your reputation is below 50";
            setError(errMessage);
        }
        else {
            const newComment = {
                comment_by: user.username, //implemnt username later
                text : commentData,
                author_id: user.userId
            };
            console.log(newComment);

            let comment_id = await axios.post("http://localhost:8000/comment_add_id", newComment);
            comment_id = comment_id.data;

            console.log(comment_id);
            
            const updateAnswer = {
                aid: answer._id,
                comment_id: comment_id
            };

            console.log(updateAnswer);


            let updatedAnswer = await axios.post("http://localhost:8000/answer_update_aid", updateAnswer);
            setAnswer(updatedAnswer.data[0]); //set to updated question
        }
    }

    function checkSubmit(e) {
        if(e && e.keyCode === 13) {
           handleSubmit(e); 
        }
     }

     return (
        <div>
            <form className="answersPage_commentOnQuestion" onKeyUp={(e) => checkSubmit(e)}  onSubmit={(e) => handleSubmit(e)}>
                <textarea className="answersPage_commentInput" value={commentData} 
                onChange={(e) => setCommentData(e.target.value)} cols="20" rows="1" placeholder="Enter a comment"></textarea>

                <button type="submit" className="answersPage_submitComment">Comment</button>
                <div className="answersPage_MandatoryFields">{error}</div>
            </form> 
            <button className="commentsPrevButton" style={{backgroundColor: highlightPrev && "grey"}} onClick={ () => {
                                if (curr_comment_page_index === 0){
                                    setHighlightPrev(true);
                                }
                                else 
                                {   
                                    if (curr_comment_page_index - 1 === 0){
                                        setHighlightPrev(true)
                                    }
                                    else {
                                        setHighlightPrev(false);
                                    }
                                    setCurr_comment_page_index(curr_comment_page_index - 1);
                                }
                            }}> Prev</button>
            <button className="commentsNextButton"  onClick={ () => {
                                if(comment_page_arr.length === 0){
                                    // do nothin
                                    }
                                else if (curr_comment_page_index === comment_page_arr.length - 1){
                                    setCurr_comment_page_index(0);
                                    setHighlightPrev(true);
                                }
                                else 
                                {
                                    setCurr_comment_page_index(curr_comment_page_index + 1);
                                    setHighlightPrev(false);
                                }
                            }}> Next</button>

            {comment_page_arr?.length > 0 && <AnswerCommentPage user={user} comments={comment_page_arr[curr_comment_page_index]}
            setComment_page_arr={setComment_page_arr} />}

        </div>
    );
}

function AnswerCommentPage(props){
    let comments = props.comments;
    console.log(comments);
    let arr = [];
    for(let i = 0; i < comments.length; i ++)
        {
            arr.push(<AnswerSingleComment user={props.user} comment={comments[i]} i = {i} key={comments[i]._id} />)
        }
    return React.createElement("div", {}, arr);
}

function AnswerSingleComment(props){
    //console.log(props);
    let user = props.user;
    const [comment, setComment] = useState(props.comment);
    const [commentVotes, setCommentVotes] = useState(0);

    useEffect(() => {
        if(comment){
        setCommentVotes(comment.votes);
    }
    }, [comment]);
    
    useEffect(() => {
        axios.get("http://localhost:8000/getCommentById/" + comment._id)
        .then(function (response) {
          console.log(response?.data);
          setComment(response?.data[0]);
        })
        .catch(function (error) {
          console.log(error);
        });
        }, []);

    async function commentVote(num){

        if(user.userId === 0)
        {
            alert("Must be logged in to vote!")
        }
        else
        {
            console.log(num);
            console.log(comment._id );
            let votes = await axios.post("http://localhost:8000/voteComment/" + num + "/" + comment._id );
            setCommentVotes(votes.data[0].votes);
        }

        //update reputation
    }
    return(
        <div className='questionPage_CommentContainer'>
            <div className='questionPage_CommentText'> {comment && comment.text} </div>

            <div className='questionPage_questionCommentAuthor'> {comment && comment.comment_by} </div>

            <div className='questionPage_votesContainer'>
                <div className = "questionPage_votes"> {comment && commentVotes} </div>
                <div> 
                            <button className="answerPage_upvote" onClick={() => commentVote(1)}> {"\u2191"}</button>
                </div>
            </div>
        
        </div>
    )  
}


function AnswerText(props) {
    const textArr = props.text.split(/\[(.*?)\]\((.*?)\)/);
    return (
        <div className="answersPage_AnswerText">
            {textArr.map((text, index) => {
                if (index % 3 === 1) {
                    // this is the hyperlink text
                    return (
                        <a
                            key={`link-${index}`} // add a unique key to the <a> element
                            href={textArr[index + 1]}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {text}
                        </a>
                    );
                } else if (index % 3 === 2) {
                    // this is the hyperlink URL
                    return null; // don't render the URL
                } else {
                    return text;
                }
            })}
        </div>
    );
}