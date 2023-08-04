import { useState, useEffect } from "react";
import axios from 'axios';
import React from 'react';
import {getQuestionNewest, getQuestionActive} from './utils.js';
//import AnswersPage from './showAnswersPage.js';
//import { highlightQuestion } from './utils.js';
//import Model from '../models/model.js';

export default function HomePage(props) {
    let user = props.user;
    const current_questions = props.questionList;


    const [highlightPrev, setHighlightPrev] = useState(true); 


    const [sortQuestions, modifyQuestion] = useState(current_questions); //not updating?
    const [allAnswers, setAllAnswers] = useState();

    const [question_page_arr, setQuestion_page_arr] = useState([]);

    const [curr_question_page_index, setCurr_question_page_index] = useState(0);

    //console.log(question_page_arr);
    //console.log(curr_question_page_index);

    // useEffect hook to update the sortQuestions state whenever the questionList prop is changed.

    useEffect(() => {
        if (current_questions) {
            modifyQuestion(getQuestionNewest(current_questions));
            console.log(sortQuestions);
        }

    }, [current_questions]);

    useEffect(() => {
      if (sortQuestions) {
        let tmp = [];
        for (let i = 0; i < sortQuestions.length; i += 5) {
          let chunk = sortQuestions.slice(i, i + 5);
          //console.log(chunk);
          tmp = [...tmp, chunk];
        }
        
        //console.log(tmp);
        setQuestion_page_arr(tmp);
      }
  }, [sortQuestions]);

    
    useEffect(() => {
      axios.get('http://localhost:8000/getAllAnswers')
      .then(function (response) {
        //console.log(response?.data);
        setAllAnswers(response?.data);
      })
      .catch(function (error) {
        console.log(error);
      });
      }, []);




    function updateQuestions(status, questions){
        //sortBy(status); // is not needed

        if (status === "newest"){
            console.log("newest");
            let qlist = getQuestionNewest(questions);
            modifyQuestion(qlist);
            console.log(qlist);
        }
        if (status === "active"){
            console.log("active");
            let qlist = getQuestionActive(questions, allAnswers);
            modifyQuestion(qlist);
        }
        if (status === "unanswered"){

            let questionsWithNoAnswers = [];
            for(let i = 0; i < questions.length; i++)
            {
              if (questions[i].answers.length === 0){ //if theere are no ansIds in that question
                questionsWithNoAnswers.push(questions[i]);
              }
            }
            modifyQuestion(questionsWithNoAnswers);
        }
        setCurr_question_page_index(0);
        setHighlightPrev(true);
    }

    return (
    <div>
        <div className="questionsTop">
            <div className="allQuestionsTitle"> {props.allQuestionsTitle === "" ? "All Questions" : "Questions with " + props.allQuestionsTitle} </div>
            {user.userId !== 0 && <button className="askQuestionButton" onClick={ () => {
                                    props.setClicked("AskQuestionPage");
                                }}> Ask Question</button>}
        </div>

        <div className="questionsInfo">
            <div className="numberOfQuestions"> {(sortQuestions.length) === 1? "1 Question" : sortQuestions.length + " Questions"}  </div>
            <div className="questionInfoButtons"> 
                <button className="newest" onClick={() => updateQuestions("newest", current_questions)}>Newest</button>
                <button className="active" onClick={() => updateQuestions("active", current_questions)}>Active</button>
                <button className="unanswered" onClick={() => updateQuestions("unanswered", current_questions)}>Unanswered</button>
            </div>
        </div>

        <ShowQuestions user={user} questions={question_page_arr?.length > 0 && question_page_arr[curr_question_page_index]} 
        setIsEditingAnswer={props.setIsEditingAnswer} setClicked={props.setClicked} setQuestion={props.setQuestion}/>
        <div className="questionsPrevAndNextButton">
          <button className="questionsPrevButton" style={{backgroundColor: highlightPrev && "grey"}} onClick={ () => {
                                      if (curr_question_page_index === 0){
                                        setHighlightPrev(true);
                                      }
                                      else 
                                      {
                                        if (curr_question_page_index - 1 === 0){
                                            setHighlightPrev(true)
                                        }
                                        else {
                                            setHighlightPrev(false);
                                        }
                                        setCurr_question_page_index(curr_question_page_index - 1);
                                      }
                                  }}> Prev</button>
          <button className="questionsNextButton"  onClick={ () => {
                                      if(question_page_arr.length === 0){
                                        // do nothin
                                      }
                                      else if (curr_question_page_index === question_page_arr.length - 1){
                                        setCurr_question_page_index(0);
                                        setHighlightPrev(true);
                                      }
                                      else 
                                      {
                                        setCurr_question_page_index(curr_question_page_index + 1);
                                        setHighlightPrev(false);
                                      }
                                  }}> Next</button>
        </div>
    </div>
    );
  }


  function ShowQuestions(props){ //can only return one tag
    //console.log(props);
    //console.log(props.questions);
    let allQuestions = props.questions;
    let startTime = Date.now();


    let elements = [];
    
    for (let index = 0; index < allQuestions.length; index++){

        let currentQuestion = allQuestions[index];
        let currentQuestionDate = new Date(allQuestions[index].ask_date_time);

        
        let author = currentQuestion.asked_by + "\u00a0";
        let metadata = ""
        let summary = currentQuestion.summary;

        //console.log(currentQuestion);
        let timeDiff = startTime - currentQuestionDate.getTime();
        let timeDiffSecs  = timeDiff / 1000;
        //console.log(timeDiffSecs)
  
        if (timeDiffSecs < 60) {
            metadata = " asked " + Math.round(timeDiffSecs) + " seconds ago";
  
        }
        else{
          let timeDiffMinutes = timeDiffSecs / 60;
          //console.log(timeDiffMinutes);
          if (timeDiffMinutes < 60) {
            metadata = " asked " + Math.round(timeDiffMinutes) + " minutes ago";
          }
  
          else{
            let timeDiffHours = timeDiffMinutes /60;
            //console.log(timeDiffHours);
            if(timeDiffHours < 24){
                metadata = " asked " + Math.round(timeDiffHours) + " hours ago";
            }
            else{
              let timeDiffDays =  timeDiffHours / 24;
              let month = ["Jan","Feb","March","April","May","June","July","Aug","Sept","Oct","Nov","Dec"];
              let minutes = currentQuestionDate.getMinutes();
              let hours = currentQuestionDate.getHours()
              if (minutes < 10){
                minutes = "0" + minutes;
              }
              if (hours < 10){
                hours = "0" + hours;
              }
              //console.log(currentQuestion.ask_date_time.getDate());
              if(timeDiffDays < 365){
                metadata = " asked " + month[currentQuestionDate.getMonth()] + " " + currentQuestionDate.getDate() + " at " +
                hours + ":" + minutes;
              }
              else{
                metadata = " asked " + month[currentQuestionDate.getMonth()] + " " + currentQuestionDate.getDate() + ", " +
                currentQuestionDate.getFullYear() + " at " + hours + ":" + minutes;
              }
              }
  
            }
          }

        


        let e = <div className="questionExample" key={allQuestions[index]._id}>
                        <div className="questionAnswersAndViews">
                            <div className="answerNum">{(currentQuestion.answers.length) === 1? "1 answer" : currentQuestion.answers.length + " answers"}</div>
                            <div className="viewNum">{(currentQuestion.views) === 1? "1 view" : currentQuestion.views + " views"}</div>
                        </div>
                        <div className="questionTitleAndTagsMetaData">
                            <div className="questionTitleAndTags">
                                <div className="questionTitle" onClick={ () => {
                                    props.setClicked("AnswerPage");
                                    props.setQuestion(currentQuestion);
                                    props.setIsEditingAnswer(false);
                                }} > {currentQuestion.title} </div>

                                <div className="questionSummary">
                                    {summary}
                                </div>
                                <ShowQuestionTags question={currentQuestion}/>
                            </div>


                            <div className="metadataContainer">
                                <div className="authorContainer">{author}</div>
                                <div className="metadata"> {metadata}</div>
                            </div>
                        </div>
                    </div>;

        elements.push(e);
    }


    let out = React.createElement("div", {}, elements);
    return out;
    
  }

function ShowQuestionTags(props) {
    const [tagName, setTagName] = useState([]);
    let currentQuestion = props.question;

    useEffect(() => {
      currentQuestion.tags.map(x => 
        axios.get('http://localhost:8000/getTagBytid/' + x)
        .then(function (response) {
          //console.log(response?.data[0]);
          //console.log([...tagName, response?.data[0].name]);
          setTagName(tagName => [...tagName, {name : response?.data[0].name , tid: response?.data[0]._id}] );
        })
        .catch(function (error) {
          console.log(error);
        })
    )}, []);

    /**
    useEffect(()=> {
    if (tagName.length > 0){
      console.log(tagName);
    }
    }, [tagName]);
    */

    return (<div className="questionTags">
      {tagName?.length > 0 && tagName.map( x => (<span className="tags" key={x.tid}> {x.name} </span>))}
       </div>);
  }

  