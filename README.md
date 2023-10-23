## Stack Overflow Clone
- Languages: MongoDB, ExpressJS, ReactJS, NodeJS, HTML, CSS, Github
- Features user authentication, voting system, key-word based question search, and responsive user interface

## Dependencies
- python3
- node.js
- mongoose
- nodemon
- axios
- mongodb

## Instructions to setup and run project
- Initialize database with your admin username and password: "node server/init.js mongodb://127.0.0.1:27017/fake_so admin password"
- the admin email will be admin + "@gmail.com"
- Start server: type "node server/server.js"
- Start client: go to client folder and type "npm start"

## Search 

if a user surrounds individual words with [] then all questions with a tagname in [] should be displayed. 
The search results should be displayed when the user presses the ENTER key. 
Also, a search string can contain a combination of [tagnames] and non-tag words, that is, not surrounded with [].
For example, if the search string is [react][android] javascript then all questions tagged with react or android or both should be considered. 
Also, questions with the non-tag word javascript in their text/title should be considered
