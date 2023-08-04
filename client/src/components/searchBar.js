import { useState, useEffect } from "react";
import React from 'react';
import axios from 'axios';
//import HomePage from "./homePage";
export default function SearchBar(props) {
    const {
        questionList,
        setQuestionList,
        allQuestionsTitle,
        setAllQuestionsTitle,
        clicked,
        setClicked
      } = props;


    console.log(questionList);
    console.log(allQuestionsTitle);
    console.log(clicked);

    const [searchTerm, setSearchTerm] = useState(''); // state for searchbar
    const [questionTableData, setQuestionTableData] = useState([]);
    const [tagsTableData, setTagsTableData] = useState([]);

    useEffect(() => {
      async function fetchData() {
        const questionTable = await axios.get("http://localhost:8000/getAllQuestions");
        setQuestionTableData(questionTable.data);
        const tagsTable = await axios.get("http://localhost:8000/getAllTags");
        setTagsTableData(tagsTable.data);
      }
      fetchData();
    }, []);
    
    const handleSearch = (event) => {
      if (event.key === 'Enter') {
        const results = []
        console.log(searchTerm);
        console.log(questionTableData);
        setAllQuestionsTitle(searchTerm);
        const words = searchTerm.match(/\[.*?\]|\S+/g).map(word => word.trim()); // Split by [] or non-space characters
        
        // Get the tag names specified in the searcharg
        const tags = words
            .filter(word => word.startsWith('[') && word.endsWith(']'))
            .map(tag => tag.slice(1, -1).toLowerCase()); // Remove the [] and lowercase

        // Get the non-tag words specified in the searcharg
        const nonTagWords = words
            .filter(word => !word.startsWith('[') || !word.endsWith(']'))
            .map(word => word.toLowerCase());

        // Loop through each question in the database
        for (const question of questionTableData) {
            console.log(tagsTableData);
            // Check if the question has at least one tag in the searcharg
            const hasTags = tags.some(tag => question.tags.some(tagId => tagsTableData.find(t => t._id === tagId).name.toLowerCase() === tag));

            // Check if the question contains at least one non-tag word in the searcharg
            const containsNonTagWord = nonTagWords.some(word => {
                const regex = new RegExp("\\b" + word + "\\b", "i");
                return regex.test(question.title) || regex.test(question.text);
            });

            if (hasTags || containsNonTagWord) {
                results.push(question);
            }
        }
        setQuestionList(results);
        console.log(results);
        setClicked("HomePage");
      }
    };
    
    return(
        <input
          className="searchBar"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyUp={handleSearch}
        ></input>
    );
}
