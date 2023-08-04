// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import './stylesheets/App.css';
//import FakeStackOverflow from './components/fakestackoverflow.js'
import Banner from './components/banner';
import Body from './components/body';
import LoginPage from "./components/loginPage.js";
import RegisterPage from "./components/registerPage.js";
import WelcomePage from './components/welcomePage';
// import Model from './models/model';
import { useState, useEffect } from "react";
import React from 'react';
import axios from 'axios';

export default function App() {
  const [questionList, setQuestionList] = useState(); //state changing shown questions
  const [allQuestionsTitle, setAllQuestionsTitle] = useState(""); //use this to set the title
  const [clicked, setClicked] = useState("WelcomePage"); //state for changing Pages
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState();


  useEffect(() => {
  axios.get('http://localhost:8000/getAllQuestions')
  .then(function (response) {
    console.log(response?.data);
    setQuestionList(response?.data);
  })
  .catch(function (error) {
    console.log(error);
  });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8000/checkLoggedIn', { withCredentials: true })
    .then(function (response) {
      console.log(response?.data);
      setIsLoggedIn(true);
      setUser(response?.data);
      setClicked("HomePage");
    })
    .catch(function (error) {
      console.log(error);
    });
    }, [isLoggedIn]);
  //dont need db
  return (
    <section className="fakeso">
      {!isLoggedIn && questionList && <div className="bodyContent"> 
        {clicked === "WelcomePage" && (
          <WelcomePage
          setClicked={setClicked}
          questionList={questionList}
          setQuestionList={setQuestionList}
          allQuestionsTitle={allQuestionsTitle}
          setAllQuestionsTitle={setAllQuestionsTitle}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
        />)}
        {clicked === "RegisterPage" && (
          <RegisterPage
          questionList={questionList}
          setQuestionList={setQuestionList}
          allQuestionsTitle={allQuestionsTitle}
          setAllQuestionsTitle={setAllQuestionsTitle}
          setClicked={setClicked}
          />
        )}
        {clicked === "LoginPage" && (
          <LoginPage
          isLoggedIn = {isLoggedIn}
          setIsLoggedIn = {setIsLoggedIn}
          setClicked={setClicked}
          questionList={questionList}
          setQuestionList={setQuestionList}
          allQuestionsTitle={allQuestionsTitle}
          setAllQuestionsTitle={setAllQuestionsTitle}
          />
        )}
      </div>}
      {isLoggedIn && questionList && user && <div className="bodyContent"> 
        <Banner user={user} isLoggedIn = {isLoggedIn} setIsLoggedIn = {setIsLoggedIn}questionList = {questionList} setQuestionList = {setQuestionList}
        allQuestionsTitle={allQuestionsTitle} setAllQuestionsTitle={setAllQuestionsTitle}
        clicked={clicked} setClicked={setClicked}/>
        <Body user={user} questionList = {questionList} setQuestionList = {setQuestionList}
        allQuestionsTitle={allQuestionsTitle} setAllQuestionsTitle={setAllQuestionsTitle}
        clicked={clicked} setClicked={setClicked}/>
      </div>}
    </section>
  );
}
 /**{questionList && <Banner questionList = {questionList} setQuestionList = {setQuestionList}
      allQuestionsTitle={allQuestionsTitle} setAllQuestionsTitle={setAllQuestionsTitle}
      clicked={clicked} setClicked={setClicked}/>}
      {questionList && <Body questionList = {questionList} setQuestionList = {setQuestionList}
      allQuestionsTitle={allQuestionsTitle} setAllQuestionsTitle={setAllQuestionsTitle}
      clicked={clicked} setClicked={setClicked}/>}
      **/