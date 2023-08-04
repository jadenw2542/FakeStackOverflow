import { useState} from "react";

import React from "react";
import axios from "axios";

export default function EditTagPage(props){
    let currTag = props.tagToBeEdited;
    let [tagText, setTagText] = useState(currTag);
    let [error, setError] = useState("* indicated mandatory fields");

    function handleSubmit(e){
        e.preventDefault();
        let errorMessage = "";
        if(tagText === ""){
            errorMessage = "Tag field should not be empty";
        }
        if(tagText.length > 10) {
            errorMessage =
                "Each tag cannot be more than 10 characters.";
        }
        if(tagText === currTag){
            errorMessage = "Tag not edited!"
        }
        if (errorMessage.length > 0) {
            // Display error message
            setError(errorMessage);
        }
        else{
            
            handleNewTag();
            //let startTime = Date.now();
        }
    }
    async function handleNewTag() {
        const tagsTable = await axios.get("http://localhost:8000/getAllTags");
        const tagsTableData = await tagsTable.data;
        //const tags = [];

        const tag = tagsTableData.find((t) => t.name === tagText);
        if(!tag){
            //tag doenst exist, create a new tag
            let newTag = await (
                await axios.post("http://localhost:8000/update_tag", {
                    tag_name: tagText.toLowerCase(),
                })
            ).data;
            console.log(newTag);
        }
        //axios function replace all questions with old tag to have new tag
        await axios.post("http://localhost:8000/edit_question_tags",{
            old_tag: currTag,
            new_tag: tagText
        })
       deleteTag(currTag);
    }   
    async function deleteTag(tagToBeDeleted){
        await axios.post("http://localhost:8000/delete_tag",{
            tagToBeDeleted: tagToBeDeleted
        })
        props.setClicked("TagsPage");
    }
    return(
        <form className="AddAnswerPage_UsernameForm" id="AddAnswerPage_UsernameFormID" onSubmit={(e) => handleSubmit(e)}> 
            <label className="addAnswerPage_AnswerText">Tag*</label> 
            <textarea className="addAnswerPage_AnswerTextInput" id="addAnswerPage_AnswerTextInputID"  value={tagText} onChange={(e) => setTagText(e.target.value)} cols="20" rows="10" placeholder="Enter a tag"></textarea>
            <div className="addAnswerPage_footer">
                <button type="submit" className="addAnswerPage_PostQuestionButton">Edit Tag</button>
                <button type="button" className= "deleteQuestion-Bottom__button" onClick={() => deleteTag(tagText)}>Delete</button>
                <div className="addAnswerPage_MandatoryFields">{error}</div>
            </div>
        </form>
        );
}
