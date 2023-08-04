import { useState} from "react";

import React from "react";
import axios from "axios";

export default function EditAnswerPage(props){

    let currAns = props.answerToBeEdited;
    console.log(currAns);
    let [error, setError] = useState("* indicated mandatory fields");
    //let [userNameData, setUserNameData] = useState("");
    let [answerText, setAnswerText] = useState(currAns.text);
    let [question, setQuestion] = useState(props.question);
    console.log(question);

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



        const editAnswer = {
            aid: currAns._id, 
            comments: currAns.comments,
            text: answerText,
            votes: currAns.votes,
            ans_by: currAns.ans_by,
            ans_date_time: currAns.ans_date_time,
            author_id: currAns.author_id
        };
        console.log(editAnswer);

        //console.log(answerPost);

        let ans_id = await axios.post("http://localhost:8000/edit_answer", editAnswer);
        ans_id = ans_id.data;


        let updatedQuestion = await axios.get("http://localhost:8000/given_aid_get_qid/" + currAns._id);

        //console.log(updatedQuestion);

        console.log(updatedQuestion.data[0]);
        console.log(ans_id);
        props.setQuestion(updatedQuestion.data[0]);
        props.setClicked("AnswerPage");
    }

    async function deleteAnswer(){

        let updatedQuestion = await axios.get("http://localhost:8000/given_aid_get_qid/" + currAns._id);
        updatedQuestion = updatedQuestion.data[0];

        const editAnswer = {
            aid: currAns._id, 
            comments: currAns.comments,
            text: currAns.text,
            votes: currAns.votes,
            ans_by: currAns.ans_by,
            ans_date_time: currAns.ans_date_time,
            author_id: currAns.author_id,
            qid: updatedQuestion._id
        };


        
        await axios.post("http://localhost:8000/delete_answer", editAnswer);


        updatedQuestion = await axios.get("http://localhost:8000/given_qid_get_qid/" + updatedQuestion._id);
        
        props.setQuestion(updatedQuestion.data[0]);
        props.setClicked("AnswerPage");      
    }



    return(
    <form className="AddAnswerPage_UsernameForm" id="AddAnswerPage_UsernameFormID" onSubmit={(e) => handleSubmit(e)}> 
        <label className="addAnswerPage_AnswerText">AnswerText*</label> 
        <textarea className="addAnswerPage_AnswerTextInput" id="addAnswerPage_AnswerTextInputID"  value={answerText} onChange={(e) => setAnswerText(e.target.value)} cols="20" rows="20" placeholder="Enter an answer"></textarea>
        <div className="addAnswerPage_footer">
            <button type="submit" className="addAnswerPage_PostQuestionButton">Edit Answer</button>
            <button type="button" className= "deleteQuestion-Bottom__button" onClick={deleteAnswer}>Delete</button>
            <div className="addAnswerPage_MandatoryFields">{error}</div>
        </div>
    </form>
    );
}