import { useState, useEffect } from "react";

import axios from 'axios';
import React from 'react';
import getMetaData from "./utils";
import ShowTags from "./showTags";

export default function UserProfile(props){
    let user = props.user;
    let questionList = props.questionList;

    const[questionsAnsweredClicked, setquestionsAnsweredClicked] = useState(false);
    const[userTagsClicked, setUserTagsClicked] = useState(false);
    const[userRep, setUserRep] = useState();
    const[regDate, setRegDate] = useState();
    const[questionsAsked, setQuestionsAsked] = useState();
    const[questionsAnswered, setQuestionsAnswered] = useState();
    const[userTags,setUserTags] = useState([]);

    const [userMap, setUserMap] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);
    const [clickedUser, setClickedUser] = useState(null);
    const [clickedUsername, setClickedUsername] = useState(null);
    const [clickedUserRep, setClickedUserRep] = useState();
    const [clickedUserRegDate, setClickedUserRegDate] = useState();
    const [clickedUserQuestionsAsked, setClickedUserQuestionsAsked] = useState([]);
    const [clickedUserQuestionsAnswered, setClickedUserQuestionsAnswered] = useState([]);
    const [clickedUserTags, setClickedUserTags] = useState([]);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState('');
    const [selectedUserInUserMap, setSelectedUserInUserMap] = useState('');
    let startTime = Date.now();
    //console.log(user);
    // on page load
    useEffect(() => {
        axios.get('http://localhost:8000/getReputation/' + user.userId)
        .then(function (response) {
          // console.log(response?.data[0].reputation);
          setUserRep(response?.data[0].reputation);
        })
        .catch(function (error) {
          console.log(error);
        });
        axios.get('http://localhost:8000/getRegisterDate/' + user.userId)
        .then(function (response) {
          // console.log(response?.data[0].register_date);
          setRegDate(response?.data[0].register_date);
        })
        .catch(function (error) {
          console.log(error);
        });
        axios.get('http://localhost:8000/getQuestions/' + user.userId)
        .then(function (response) {
          // console.log(response?.data);
          setQuestionsAsked(response?.data);
        })
        .catch(function (error) {
          console.log(error);
        });
        axios.get('http://localhost:8000/getQuestionsAnswered/' + user.userId)
        .then(function (response) {
          console.log(response?.data);
          let data = [];
          for(let i = 0; i < response.data.length; i++){
            data.push(response.data[i][0]);
          }

          //console.log(data);
          data = Array.from(
            data.reduce((map, obj) => map.set(obj._id, obj), new Map()).values()
          );
          //console.log(data);
          setQuestionsAnswered(data);
        })
        .catch(function (error) {
          console.log(error);
        });
        axios.get('http://localhost:8000/getUserTags/' + user.userId)
        .then(response => {
          // console.log(response.data);
          setUserTags(response.data);
        })
        .catch(error => {
          console.error(error);
        });  
        axios.get('http://localhost:8000/checkAdmin/' + user.userId)
        .then(function (response) {
          const admin = response?.data?.[0]?.admin;
          setIsAdmin(Boolean(admin));
        })
        .catch(function (error) {
          console.log(error);
        });
        axios.get('http://localhost:8000/getAllUsers')
        .then(response => {
          setUserMap(response.data);
        })
        .catch(error => {
          console.error(error);
        });  
        }, [user.userId]);

    const handleUserClick = async (userId) => {
        setClickedUser(userId);
        setClickedUsername(userMap[userId]);
        axios.get('http://localhost:8000/getReputation/' + userId)
        .then(function (response) {
          // console.log(response?.data[0].reputation);
          setClickedUserRep(response?.data[0].reputation);
        })
        .catch(function (error) {
          console.log(error);
        });
        axios.get('http://localhost:8000/getRegisterDate/' + userId)
        .then(function (response) {
          // console.log(response?.data[0].register_date);
          setClickedUserRegDate(response?.data[0].register_date);
        })
        .catch(function (error) {
          console.log(error);
        });
        axios.get('http://localhost:8000/getQuestions/' + userId)
        .then(function (response) {
          // console.log(response?.data);
          setClickedUserQuestionsAsked(response?.data);
        })
        .catch(function (error) {
          console.log(error);
        });
        axios.get('http://localhost:8000/getQuestionsAnswered/' + userId)
        .then(function (response) {
          // console.log(response?.data);
          let data = [];
          for(let i = 0; i < response.data.length; i++){
            data.push(response.data[i][0]);
          }

          console.log(data);
          data = Array.from(
            data.reduce((map, obj) => map.set(obj._id, obj), new Map()).values()
          );
          //console.log(data);
          setClickedUserQuestionsAnswered(data);
          
        })
        .catch(function (error) {
          console.log(error);
        });
        axios.get('http://localhost:8000/getUserTags/' + userId)
        .then(response => {
          // console.log(response.data);
          setClickedUserTags(response.data);
        })
        .catch(error => {
          console.error(error);
        }); 
        
    }
    async function handleDeleteUser(userId){
      if (confirmDelete) {
        try {
          const response = await axios.post(`http://localhost:8000/deleteUser`, { userId });
          console.log(response.data.message); // Success message from the server
          setUserMap(prevUserMap => {
            const updatedUserMap = { ...prevUserMap };
            delete updatedUserMap[userId];
            return updatedUserMap;
          });
        } catch (error) {
          console.error('Error deleting user:', error.response.data.error);
        }
        setConfirmDelete(false);
        setUserIdToDelete('');
        setSelectedUserInUserMap('');
        await axios.post("http://localhost:8000/refresh_tagTable");//delete tags that are not used by any questions 
      } else {
        // Show the confirmation message and set the userIdToDelete
        setConfirmDelete(true);
        setUserIdToDelete(userId);
        setSelectedUserInUserMap(userId);
        await axios.post("http://localhost:8000/refresh_tagTable");//delete tags that are not used by any questions 
      }
    }
    console.log(user);
    return (
      <div>    
        {!isAdmin && (
          <div>
            <div className="userProfile_text"> User Register Date: {getMetaData(startTime,regDate, false).replace('ago', '').replace('asked','')}</div>
            <div className="userProfile_text"> User Repuation: {userRep} </div>
            <div className="userProfile_text"> Questions Asked: </div>
            {questionsAsked && (questionsAsked.length !== 0 ? <UserQuestions questionsAsked= {questionsAsked} setClicked={props.setClicked} setQuestion={props.setQuestion}/> : 
            "You did not ask any questions.")}

            <div className="linkToQuestionsAnswered" onClick={() => {
              setquestionsAnsweredClicked(true);
            }}>{'Questions that you Answered(Click to view)'}</div>

            {questionsAnsweredClicked === true && questionsAnswered && (questionsAnswered.length !== 0 ? <UserAnswers questionsAnswered={questionsAnswered} setClicked={props.setClicked} setQuestion={props.setQuestion} 
            setIsEditingAnswer={props.setIsEditingAnswer}/> : "You did not answer any questions.")}
            
            <div className="linkToQuestionsAnswered" onClick={() => {
              setUserTagsClicked(true);
            }}>{'User Question Tags(Click to view)'}</div>

            {userTagsClicked === true && userTags && (userTags.length !== 0 ? <UserTags user={user} userTags={userTags} questionList={questionList} setClicked={props.setClicked} 
            tagToBeEdited={props.tagToBeEdited} setTagToBeEdited={props.setTagToBeEdited}
            setQuestion={props.setQuestion} />: "You do not have any tags with your questions.")}
          </div>
        )}
        {isAdmin && clickedUser === null && (
          <div>
            <div className="userProfile_text">ADMIN PROFILE</div>
            <div className="userProfile_text">User Register Date: {getMetaData(startTime, regDate, false).replace('ago', '').replace('asked','')}</div>
            <div className="userProfile_text">User Reputation: {userRep}</div>
            <div className="userProfile_text">User Map:</div>
            {Object.keys(userMap).length === 0 ? (
              <div className="userProfile_subtext">No users found.</div>
            ) : (
            <div className="userProfile_subtext">Click on user to view user page</div>
            )}
            <ul>
              {Object.keys(userMap).map(userId => (
              <li className="userProfile_usermap" key={userId}>
                <span className={`userProfile_username ${selectedUserInUserMap === userId ? 'userProfile_username_selected' : ''}`} onClick={() => handleUserClick(userId)}>UserId: {userId} Username: {userMap[userId]}</span>
                {confirmDelete && userIdToDelete === userId ? (
                  <>
                    <span className="userProfile_confirmDelete">Are you sure you want to delete this user?</span>
                    <button className="userProfile_usermap_confirm" onClick={() => handleDeleteUser(userId)}>Confirm</button>
                  </>
                ) : (
                  <button className="userProfile_usermap_delbutton" onClick={() => handleDeleteUser(userId)}>Delete</button>
                )}
              </li>
              ))}
            </ul>
            
          </div>
        )}
        {isAdmin && clickedUser !== null && clickedUser !== user._id && (
            <div>
                <div className="userProfile_text"> Admin view on User: {clickedUsername}</div>
                <div className="userProfile_text"> User Register Date: {getMetaData(startTime, clickedUserRegDate, false).replace('ago', '').replace('asked','')}</div>
                <div className="userProfile_text"> User Repuation: {clickedUserRep} </div>
                <div className="userProfile_text"> Questions Asked: </div>
                {clickedUserQuestionsAsked && (clickedUserQuestionsAsked.length !== 0 ? <UserQuestions questionsAsked= {clickedUserQuestionsAsked} setClicked={props.setClicked} setQuestion={props.setQuestion}/> : "You did not ask any questions.")}

                <div className="linkToQuestionsAnswered" onClick={() => {
                  setquestionsAnsweredClicked(true);
                }}>{'Questions that you Answered(Click to view)'}</div>

                {questionsAnsweredClicked === true && clickedUserQuestionsAnswered && (clickedUserQuestionsAnswered !== 0 ? <UserAnswers questionsAnswered={clickedUserQuestionsAnswered} setClicked={props.setClicked} setQuestion={props.setQuestion} 
                setIsEditingAnswer={props.setIsEditingAnswer}/> : "You did not answer any questions.")}
            
                <div className="linkToQuestionsAnswered" onClick={() => {
                setUserTagsClicked(true);
                }}>{'User Question Tags(Click to view)'}</div>

                {userTagsClicked === true && clickedUserTags && (clickedUserTags !== 0 ? <UserTags user={clickedUser} userTags={clickedUserTags} questionList={questionList} setClicked={props.setClicked} 
                tagToBeEdited={props.tagToBeEdited} setTagToBeEdited={props.setTagToBeEdited}
                setQuestion={props.setQuestion} />: "You do not have any tags with your questions.")}
            </div>
        )}
        </div>
    );    
}

function UserQuestions(props){
    
    let questionsAsked = props.questionsAsked
    // console.log(questionsAsked);
    let elements = [];
    for(let i = 0; i < questionsAsked.length; i++){
    let e = <div className="questionTitle" key={questionsAsked[i]._id} onClick={ () => {
                props.setClicked("EditQuestionPage");
                props.setQuestion(questionsAsked[i]);
            }} > {questionsAsked[i].title} </div>;

    elements.push(e);
    }

    // console.log(elements);
    
    let out = React.createElement("div", {}, elements);
    return out
}

function UserAnswers(props){
  let questionsAnswered = props.questionsAnswered;
  // console.log(questionsAnswered);
  let elements = [];
  for(let i = 0; i < questionsAnswered.length; i++){
  let e = <div className="questionTitle" key={questionsAnswered[i]._id} onClick={ () => {
                props.setClicked("AnswerPage");
                props.setQuestion(questionsAnswered[i]);
                props.setIsEditingAnswer(true);
          }} > {questionsAnswered[i].title} </div>;

  console.log(e);

  elements.push(e);
  }

  console.log(elements);
  
  let out = React.createElement("div", {}, elements);
  return out
}

function UserTags(props){
  let userTags = props.userTags;
  let questionList = props.questionList;
  console.log(props.user);
  return (
    <div>
      <ShowTags user={props.user} tags={userTags} questions={questionList} isEditingTag={true} setClicked={props.setClicked} setQuestion={props.setQuestion} setAllQuestionsTitle={props.setAllQuestionsTitle}
            setHighlightQuestion={props.setHighlightQuestion} setHighlightTags={props.setHighlightTags} setQuestionList={props.setQuestionList}
            tagToBeEdited={props.tagToBeEdited} setTagToBeEdited={props.setTagToBeEdited}/>
    </div>
  )
}

/*
The page displays a menu as described in
the home use case. In the main section of the
page, the length of time the user has been a
member of fake stack overflow and the
reputation of the user is shown. Below this
information, a set of question titles asked by
the user is listed. Each question title is a link
which when clicked shows the New question
page. In this page the user can modify the
existing question and post it again or delete it.
The form displays the existing information for
the question in appropriate fields. Note
posting modifications is not considered a new
question. Deleting a question will delete all
answers and comments associated with it.
The menu also shows links to view all tags
created and all questions answered by the
user. When a link is clicked, the
corresponding set of tags and answered
questions are listed.
The set of tags are displayed in the same
format as described in the Tags page. Each
entry in the list of tags being displayed has an
option for the user to delete or edit the tag. If
a user deletes a tag, it will not be shown with
a question. However, a tag can be edited or
18
deleted only if it is not being used by any
other user.
The questions answered by the user are
displayed in the same format as Newest
questions in the Home page. Clicking a
question link shows the answers page for that
question. Their answer/s for the question is
displayed first followed by the rest in Newest
order. A user can edit or delete the answer. If
a user deletes an answer then all its votes
and comments are also deleted. The changes
should be reflected in the home page and
questions page appropriately
*/