import React from 'react';
import { useState, useEffect } from "react";
import axios from 'axios';
import { getNumQuestionsWithTag, getArrQuestionsWithTag } from './utils';

export default function ShowTags(props){
    const tagArr = props.tags;
    const questions = props.questions;
    const {isEditingTag = false, user, setTagToBeEdited} = props;
    
    let outArr = [];
    let row = [];
    let rowNum = 0;
    let col = 0;
    if(tagArr){
        for(let i = 0; i < tagArr.length; i ++)
        {
            col += 1;
            let tag = tagArr[i];
            let tagContainer = {
                name: tag.name, 
                num: String(getNumQuestionsWithTag(questions, tag._id)),
                tid : tag._id
                };
            
            //console.log(tagContainer.num);
            row.push(tagContainer);

            //console.log(col);

            
            if (col === 3){
                
                outArr.push(<TagRow key={rowNum} arr={row} tags={props.tags} user={user} isEditingTag={isEditingTag} questions={props.questions} setClicked={props.setClicked} setQuestion={props.setQuestion}
                    tagToBeEdited={props.tagToBeEdited} setTagToBeEdited={setTagToBeEdited} setAllQuestionsTitle={props.setAllQuestionsTitle} setHighlightQuestion={props.setHighlightQuestion} setHighlightTags={props.setHighlightTags} setQuestionList={props.setQuestionList}/>)

                col = 0;
                row = [];
                rowNum += 1;
            }
            
            else if (i === tagArr.length - 1){ //last tag
                outArr.push(<TagRow key={rowNum} arr={row} tags={props.tags} user={user} isEditingTag={isEditingTag} questions={props.questions} setClicked={props.setClicked} setQuestion={props.setQuestion} 
                    tagToBeEdited={props.tagToBeEdited} setTagToBeEdited={setTagToBeEdited} setAllQuestionsTitle={props.setAllQuestionsTitle} setHighlightQuestion={props.setHighlightQuestion} setHighlightTags={props.setHighlightTags} setQuestionList={props.setQuestionList}/>)

            }


        }
    }
    

    //console.log(outArr);

    return React.createElement("div", {}, outArr);
}

function TagRow(props){
    let tags = props.arr;
    let {isEditingTag, user, setTagToBeEdited} = props;
    //console.log(tags[0].tid);
    if(tags.length === 1 ){
        return(<div className="tagPage_TagRow">
                <Tag  key={tags[0].tid} tags={props.tags} user={user} isEditingTag={isEditingTag} questions={props.questions} tid={tags[0].tid} name={tags[0].name} num={tags[0].num} tagToBeEdited={props.tagToBeEdited} setTagToBeEdited={setTagToBeEdited} setAllQuestionsTitle={props.setAllQuestionsTitle}
                setClicked={props.setClicked} setQuestion={props.setQuestion} setHighlightQuestion={props.setHighlightQuestion} setHighlightTags={props.setHighlightTags} setQuestionList={props.setQuestionList}/>
                <div className="tagPage_PlaceHolder"></div>
                <div className="tagPage_PlaceHolder"></div>
                </div>

        );
    }

    if (tags.length === 2){
        return(<div className="tagPage_TagRow">
                <Tag  key={tags[0].tid} tags={props.tags} user={user} isEditingTag={isEditingTag} questions={props.questions} tid={tags[0].tid} name={tags[0].name} num={tags[0].num} tagToBeEdited={props.tagToBeEdited} setTagToBeEdited={setTagToBeEdited} setAllQuestionsTitle={props.setAllQuestionsTitle}
                setClicked={props.setClicked} setQuestion={props.setQuestion} setHighlightQuestion={props.setHighlightQuestion} setHighlightTags={props.setHighlightTags} setQuestionList={props.setQuestionList}/>
                <Tag  key={tags[1].tid} tid={tags[1].tid} name={tags[1].name} num={tags[1].num} tagToBeEdited={props.tagToBeEdited} setTagToBeEdited={setTagToBeEdited} setAllQuestionsTitle={props.setAllQuestionsTitle}
                setClicked={props.setClicked} setQuestion={props.setQuestion} setHighlightQuestion={props.setHighlightQuestion} setHighlightTags={props.setHighlightTags} setQuestionList={props.setQuestionList}/>
                <div className="tagPage_PlaceHolder"></div>
                </div>

        );
    }

    if (tags.length === 3){
        return(<div className="tagPage_TagRow">
                <Tag  key={tags[0].tid} tags={props.tags} user={user} isEditingTag={isEditingTag} questions={props.questions} tid={tags[0].tid} name={tags[0].name} num={tags[0].num} tagToBeEdited={props.tagToBeEdited} setTagToBeEdited={setTagToBeEdited} setAllQuestionsTitle={props.setAllQuestionsTitle}
                setClicked={props.setClicked} setQuestion={props.setQuestion} setHighlightQuestion={props.setHighlightQuestion} setHighlightTags={props.setHighlightTags} setQuestionList={props.setQuestionList}/>
                <Tag  key={tags[1].tid} tags={props.tags} user={user} isEditingTag={isEditingTag} questions={props.questions} tid={tags[1].tid} name={tags[1].name} num={tags[1].num} tagToBeEdited={props.tagToBeEdited} setTagToBeEdited={setTagToBeEdited} setAllQuestionsTitle={props.setAllQuestionsTitle}
                setClicked={props.setClicked} setQuestion={props.setQuestion} setHighlightQuestion={props.setHighlightQuestion} setHighlightTags={props.setHighlightTags} setQuestionList={props.setQuestionList}/>
                <Tag  key={tags[2].tid} tags={props.tags} user={user} isEditingTag={isEditingTag} questions={props.questions} tid={tags[2].tid} name={tags[2].name} num={tags[2].num} tagToBeEdited={props.tagToBeEdited} setTagToBeEdited={setTagToBeEdited} setAllQuestionsTitle={props.setAllQuestionsTitle}
                setClicked={props.setClicked} setQuestion={props.setQuestion} setHighlightQuestion={props.setHighlightQuestion} setHighlightTags={props.setHighlightTags} setQuestionList={props.setQuestionList}/>
                </div>

        );
    }

}

function Tag(props) {
    const { tags, user, isEditingTag, name, num, setTagToBeEdited, setClicked} = props;
     

    const [editableTag, setEditableTag] = useState([]);
    
    useEffect(() => {
      if (user && isEditingTag) {
        let userId = 0;
        if (user.userId) {
          userId = user.userId;
        } else {
          userId = user;
        }
        axios
          .get('http://localhost:8000/getNonEditableUserTags/' + userId, {
            params: {
              tags: tags,
            },
          })
          .then((response) => {
            const nonEditabletags = response.data;
            tags.filter(
              (tag) => !nonEditabletags.some(({ name }) => name === tag.name)
            );
            const nonEditabletagsSet = new Set(nonEditabletags);
    
            setEditableTag(
              tags.filter((tag) => !nonEditabletagsSet.has(tag.name))
            );
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }, [user, isEditingTag, tags]);
    
    
    const handleEdit = (name) => {
      console.log(props.tagToBeEdited);
      setTagToBeEdited(name);
      setClicked("EditTagPage");
    };
  
    //const handleDelete = () => {
      // handle delete logic here
    //};
    return (
      <div className="tagPage_TagContainer">
        <div
          className="tagPage_TagName"
          onClick={isEditingTag ? () => {} : () => {
            props.setQuestionList(getArrQuestionsWithTag(props.questions, props.tid))
            props.setHighlightQuestion(true);
            props.setHighlightTags(false);
            props.setClicked("HomePage");
            props.setAllQuestionsTitle(props.name);
          }}
        >
          {name}
        </div>
        <div className="tagPage_TagNum">{num} questions</div>
        {isEditingTag && editableTag.some(tag => tag.name === name) && (
          <div className="tagPage_TagButtonsDiv">
            <button className="tagPage_TagButtons"onClick={() => handleEdit(name)}>Edit/Delete</button>
          </div>
        )}
      {isEditingTag && !editableTag.some(tag => tag.name === name) && (
        <div className="tagPage_TagButtonsNonEditable">
          Non-editable: Tag used by another user
        </div>
      )}
  </div>
    );
  }
  