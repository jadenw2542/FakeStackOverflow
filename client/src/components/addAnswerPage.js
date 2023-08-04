
//import Model from '../models/model.js';
//import AnswersPage from './showAnswersPage.js';
//import getMetaData from './utils.js';
import { useState } from "react";
import React from 'react';
import axios from "axios";

export default function AddAnswerPage(props) {
    let user = props.user;
    let [error, setError] = useState("* indicated mandatory fields");
    //let [userNameData, setUserNameData] = useState("");
    let [answerText, setAnswerText] = useState("");
    let [question, setQuestion] = useState(props.question);
    console.log(setQuestion);
    
    

    function handleSubmit(e){
        e.preventDefault();
        //console.log(userNameData);
        console.log(answerText);
        
        let errorMessage = "";
        // Check for hyperlinks
        const regex = /\[([^\]]*)\]\((\S*)\)/g;
        const matches = answerText.matchAll(regex);
        for (const match of matches) {
            const linkText = match[1];
            const linkUrl = match[2];
            if (linkText.trim() === '') {
                errorMessage = 'The hyperlink text cannot be empty.';
            } else if (!linkUrl) {
                errorMessage = `The hyperlink "${linkText}" has an invalid target URL. It cannot be empty.`;
            } else if (
                !linkUrl.startsWith("https://") &&
                !linkUrl.startsWith("http://")
            ) {
                errorMessage = `The hyperlink "${linkText}" has an invalid target URL. It must begin with "https://" or "http://".`;
            }
        }

        /*
        if(userNameData === "" ){
            errorMessage = "Username field should not be empty";
        }
        */
        if(answerText === ""){
            errorMessage = "Answer field should not be empty";
        }

        if (errorMessage.length > 0) {
            // Display error message
            setError(errorMessage);
        }
        else{
            
            handleNewAnswer();
            //let startTime = Date.now();
        }
    }

    async function handleNewAnswer(){

        const answerPost = {
            text: answerText,
            ans_by: user.username,
            ans_date: new Date(),
            author_id: user.userId
        };

        //console.log(answerPost);

        let ans_id = await axios.post("http://localhost:8000/answers_add_aid", answerPost);
        ans_id = ans_id.data;

        //console.log(ans_id);
        //console.log(question._id);

        const updateQuestion = {
            qid: question._id,
            aid: ans_id
        };

        let updatedQuestion = await axios.post("http://localhost:8000/question_update_aid", updateQuestion);

        console.log(updatedQuestion.data[0]);

        console.log(ans_id);
        props.setQuestion(updatedQuestion.data[0]);
        props.setClicked("AnswerPage");
    }


    return(
    <form className="AddAnswerPage_UsernameForm" id="AddAnswerPage_UsernameFormID" onSubmit={(e) => handleSubmit(e)}> 
        <label className="addAnswerPage_AnswerText">AnswerText*</label> 
        <textarea className="addAnswerPage_AnswerTextInput" id="addAnswerPage_AnswerTextInputID"  value={answerText} onChange={(e) => setAnswerText(e.target.value)} cols="20" rows="20" placeholder="Enter an answer"></textarea>
        <div className="addAnswerPage_footer">
            <button type="submit" className="addAnswerPage_PostQuestionButton">Post Answer</button>
            <div className="addAnswerPage_MandatoryFields">{error}</div>
        </div>
    </form>
    );


}

/*
<label className="addAnswerPage_UsernameLabel">Username*</label>
        <textarea className="addAnswerPage_UsernameInput" id="addAnswerPage_UsernameInputID" value={userNameData} onChange={(e) => setUserNameData(e.target.value)} cols="20" rows="1" placeholder="Enter a username"></textarea>
        
*/