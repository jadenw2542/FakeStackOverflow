//import Model from '../models/model.js';
//import { useState } from "react";
import React from 'react';
import { useState, useEffect } from "react";
import axios from 'axios';
import ShowTags from './showTags';
export default function TagsPage(props){
    let user = props.user;
    const [tags, setTags] = useState();
    const [questions, setQuestions] = useState();

    useEffect(() => {
        axios.get('http://localhost:8000/getAllQuestions')
        .then(function (response) {
          //console.log(response?.data);
          setQuestions(response?.data);
        })
        .catch(function (error) {
          console.log(error);
        });
        }, []);
  

    useEffect(() => {
      axios.get('http://localhost:8000/getAllTags')
      .then(function (response) {
        console.log(response?.data);
        setTags(response?.data);
      })
      .catch(function (error) {
        console.log(error);
      });
      }, []);


    


    //console.log(tags);

    
    return(
        <div className="tagPage">
            <div className="tagPage_Header">
                {tags && <div className="tagPage_NumOfTags">{ tags.length === 1 ? "1 Tag" : tags.length + " Tags"}</div> }
                <div className="tagPage_AllTags">All Tags</div>
                {user.userId !== 0 && <button className="askQuestionButton" onClick={ () => {
                                    props.setClicked("AskQuestionPage");
                                }}> Ask Question</button>}
            </div>

            {tags && <ShowTags tags={tags} questions={questions} setClicked={props.setClicked} setQuestion={props.setQuestion} setAllQuestionsTitle={props.setAllQuestionsTitle}
            setHighlightQuestion={props.setHighlightQuestion} setHighlightTags={props.setHighlightTags} setQuestionList={props.setQuestionList} 
            tagToBeEdited={props.tagToBeEdited} setTagToBeEdited={props.setTagToBeEdited}/>}
        </div> 
    )

}



