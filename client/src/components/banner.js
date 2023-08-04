//import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './searchBar.js';

export default function Banner(props) {
  const {
    user, 
    setUserId,
    isLoggedIn, 
    setIsLoggedIn,
    questionList,
    setQuestionList,
    allQuestionsTitle,
    setAllQuestionsTitle,
    clicked,
    setClicked
  } = props;

  console.log(setUserId);
  console.log(isLoggedIn);

  //const [username, setUsername] = useState(user.username);

  /** 
  useEffect(() => {
    axios.get('http://localhost:8000/')
      .then(res => {
        setUser(res.data);
      })
      .catch(err => console.error(err));
  }, []);
  */

  const handleLogout = () => {
    axios.get('http://localhost:8000/logout', { withCredentials: true })
      .then(res => {
        //setUsername('');
        setIsLoggedIn(false);
        setClicked("WelcomePage");
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="header">
      <div className="emptyHeader"> </div>
      <div className="headerDetails">
        <div className="pageTitle">Fake Stack OverFlow</div>
        <div className="user" style={{ fontSize: '3rem' }}>
          Welcome, {user.username}
          {user.username &&
            <button onClick={handleLogout} style={{ backgroundColor: 'red', color: 'white', fontWeight: 'bold', padding: '10px' }}>Logout</button>
          }
        </div>
        <SearchBar 
          questionList={questionList} 
          setQuestionList={setQuestionList}
          allQuestionsTitle={allQuestionsTitle} 
          setAllQuestionsTitle={setAllQuestionsTitle} 
          clicked={clicked} 
          setClicked={setClicked}
        />
      </div>
    </div>
  );
}
