//import Model from "../models/model.js";
import { useState } from "react";
import React from "react";
import axios from "axios";
export function AskQuestionPage(props) {
    let user = props.user;
    let [questionTitleData, setQuestionTitleData] = useState("");
    let [questionTextData, setQuestionTextData] = useState("");
    let [questionSummaryData, setQuestionSummaryData] = useState("");
    let [questionTagsData, setQuestionTagsData] = useState("");
    
    //let [userNameData, setUserNameData] = useState("");
    let [error, setError] = useState("* indicated mandatory fields");

    const handleSubmit = (event) => {
        event.preventDefault();

        // Validate input
        let errorMessage = "";
        if (questionTitleData.length === 0 || questionTitleData.length > 50) {
            errorMessage =
                "Title should not be empty and should be limited to 50 characters or less.";
        } else if (questionTextData.length === 0) {
            errorMessage = "Text should not be empty.";
        }
        else if (questionSummaryData.length === 0) {
            errorMessage = "Summary should not be empty.";
        }
        else if (questionSummaryData.length > 140) {
            errorMessage = "Summary be limited to 140 characters or less.";
        }
        // else if (userNameData.length === 0) {
         //   errorMessage = "Username should not be empty.";} 
         else if (questionTagsData.length === 0) {
            errorMessage = "Tags should not be empty.";
        } else {
            const tagList = questionTagsData.split(/\s+/);
            if (tagList.length > 5) {
                errorMessage = "You can only use up to 5 tags.";
            } else {
                for (const tag of tagList) {
                    if (tag.length > 10) {
                        errorMessage =
                            "Each tag cannot be more than 10 characters.";
                        break;
                    }
                }
            }
        }

        // Check for hyperlinks
        const regex = /\[([^\]]*)\]\((\S*)\)/g;
        const matches = questionTextData.matchAll(regex);
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

        if (errorMessage.length > 0) {
            // Display error message
            setError(errorMessage);
        } else {
            handleNewQuestion();
        }
    }
    async function handleNewQuestion() {
        let reputation = 0;
        try {
            console.log("ds");
            const response = await axios.get('http://localhost:8000/checkLoggedIn', { withCredentials: true });
            const userId = response.data.userId;

            console.log(user);
            const reputationResponse = await axios.get('http://localhost:8000/getReputation/' + user.userId);
            reputation = reputationResponse.data[0].reputation;
            console.log(`User ${userId} has reputation ${reputation}`);
        } catch (error) {
            console.error(error);
        }

        const tagsTable = await axios.get("http://localhost:8000/getAllTags");
        const tagsTableData = await tagsTable.data
        const tagNames = questionTagsData.split(" ");
        const tags = [];

        if(reputation < 50) // if there are tags that r new, return error
        {
            for (let i = 0; i < tagNames.length; i++) {
                // find the tag in the tags array with a matching name
                const tag = tagsTableData.find((t) => t.name === tagNames[i]);

                if (tag) {
                    //tags.push(tag._id);
                } else {
                    setError("You do not have enough reputation to make a new tag: " + tagNames[i]);
                    return;
                }
            }
        }
        
        
        
        // loop through each tag name in the tagNames array
        for (let i = 0; i < tagNames.length; i++) {
            // find the tag in the tags array with a matching name
            const tag = tagsTableData.find((t) => t.name === tagNames[i]);

            // if the tag exists, add its id to the tags array
            if (tag) {
                tags.push(tag._id);
            } else {
                // if the tag does not exist, create a new tag and add it to the tags array and the tags array
                let newTag = await (
                    await axios.post("http://localhost:8000/update_tag", {
                        tag_name: tagNames[i].toLowerCase(),
                        userId : user.userId
                    })
                ).data;
                tags.push(newTag);
            }
        }
        const newQuestion = {
            answers: [],
            ask_date_time: new Date(),
            asked_by: user.username, 
            author_id: user.userId,
            tags: tags,
            text: questionTextData.trim(),
            summary: questionSummaryData.trim(),
            title: questionTitleData.trim(),
            views: 0,

        };

        await axios.post("http://localhost:8000/update_questions", newQuestion);
        const updatedQuestionList = await axios.get("http://localhost:8000/getAllQuestions");
        // clear the form inputs
        setQuestionTitleData("");
        setQuestionTextData("");
        setQuestionTagsData("");
        setQuestionSummaryData("");
        //setUserNameData("");
        setError("* indicated mandatory fields");

        props.setAllQuestionsTitle("");
        props.setQuestionList(updatedQuestionList.data);
        props.setClicked("HomePage");
    };

    return (
        <div className = "bodyContent">
            <form className = "askQuestion-Form" onSubmit={(e) => handleSubmit(e)}> 

                <div className = "askQuestion-Form__Div"> 
                <label className = "askQuestion-label" htmlFor="askQuestion-Title"> Question Title* </label>
                <label className = "askQuestion-label-description" htmlFor="askQuestion-Title">  Limit title to 100 characters or less </label>
                <textarea className="askQuestion-textarea" name="askQuestion-Title" value={questionTitleData} onChange={(e) => setQuestionTitleData(e.target.value)} placeholder="Enter question title here"></textarea>
                </div>

                <div className = "askQuestion-Form__Div">
                <label className = "askQuestion-label" htmlFor="askQuestion-Text"> Question Text* </label>
                <label className = "askQuestion-label-description" htmlFor="askQuestion-Text"> Add details </label>
                <textarea className="askQuestion-textarea-text" name="askQuestion-Text" value={questionTextData} onChange={(e) => setQuestionTextData(e.target.value)} placeholder="Enter question text here"></textarea>
                </div>

                <div className = "askQuestion-Form__Div">
                <label className = "askQuestion-label" htmlFor="askQuestion-Text"> Question Summary* </label>
                <label className = "askQuestion-label-description" htmlFor="askQuestion-Text"> Add details </label>
                <textarea className="askQuestion-textarea-text" name="askQuestion-Text" value={questionSummaryData} onChange={(e) => setQuestionSummaryData(e.target.value)} placeholder="Enter summary text here"></textarea>
                </div>

                <div className = "askQuestion-Form__Div">
                <label className = "askQuestion-label" htmlFor="askQuestion-Tags"> Tags* </label>
                <label className = "askQuestion-label-description" htmlFor="askQuestion-Tags"> Add keywords separated by whitespace </label>
                <textarea className="askQuestion-textarea" name="askQuestion-Tags" value={questionTagsData} onChange={(e) => setQuestionTagsData(e.target.value)}placeholder='Enter tags here (Ex: "html css react")'></textarea>
                </div>

                <div className = "askQuestion-Bottom">
                    <button type="submit" className = "askQuestion-Bottom__button"> Post Question </button>
                    <div className = "askQuestion-Bottom__text">{error}</div>
                </div>
            </form>
        </div>
    );
}

/**
                <div className = "askQuestion-Form__Div">
                <label className = "askQuestion-label" htmlFor="askQuestion-Username"> Username* </label>
                <textarea className="askQuestion-textarea" name="askQuestion-Username" value={userNameData} onChange={(e) => setUserNameData(e.target.value)} placeholder="Enter username here"></textarea>
                </div>
                <div className = "askQuestion-Bottom">
                    <button type="submit" className = "askQuestion-Bottom__button"> Post Question </button>
                    <div className = "askQuestion-Bottom__text">{error}</div>
                </div>
 */