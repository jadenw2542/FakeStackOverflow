// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.

let userArgs = process.argv.slice(2)

const express = require("express")
const session = require("express-session")

const app = express()
const port = 8000
const cors = require("cors")

const bcrypt = require("bcrypt")
// Use the cors middleware
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(
  session({
    name:'mySessionCookie',
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {secure:false} 
  })
);



var answerTable = require('./models/answers.js');
var questionTable = require('./models/questions.js');
var tagTable = require('./models/tags.js');
var commentTable = require('./models/comments.js');
var userTable = require('./models/user.js');

const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017/fake_so";
const client = new MongoClient(uri);


// Connect to the MongoDB database
let mongoose = require("mongoose");
const tags = require("./models/tags");
mongoose.connect('mongodb://127.0.0.1:27017/fake_so', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));
db.on("connected", function () {
  console.log("Connected to database");
});

app.get('/', (req, res) => {
  res.send('Hello, world!');
});


// Run the server on port 8000
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

process.on("SIGINT", () => {
    console.log("Server closed. Database instance disconnected.");
    process.exit(0);
})


//sends an array of questions to client
app.get('/getAllQuestions', async (req, res) => {
  //console.log(await questionTable.find({}))

  try{
    res.send(await questionTable.find({}));
  }
  catch(error){
    console.log(error);
    res.sendStatus(500);
  }
});


//sends an array of tags to client
app.get('/getAllTags', async (req, res) => {
  //console.log(await questionTable.find({}))
  try{
    res.send(await tagTable.find({}));
  }
  catch(error){
    console.log(error);
    res.sendStatus(500);
  }
});

//sends an array of questions to client
app.get('/getAllAnswers', async (req, res) => {
  //console.log(await questionTable.find({}))

  try{
    res.send(await answerTable.find({}));
  }
  catch(error){
    console.log(error);
    res.sendStatus(500);
  }
});



// gets Tag object given a tid
app.get('/getTagBytid/:tid', async (req, res) => {
  try{
    let tid = req.params.tid;
    //console.log(tid);
    res.send(await tagTable.find({_id: tid}));
  }
  catch(error){
    console.log(error);
    res.sendStatus(500);
  }
});



//increment num of view for a question id, returns question
app.post('/increaseView/:id', async (req, res) => {
  try{
    let id = req.params.id;
    //console.log("increaseView");
    //console.log(id);

    const query = { _id: id};
    const update = { $inc: { views: 1 } };

    await questionTable.updateOne(
      query,
      update
   );
   res.send(await questionTable.find({_id: id}));
   
  }
  catch(error){
    console.log(error);
    res.sendStatus(500);
  }
  });

// increment or decrement for a question id, increments/decrements reputation, returns updated votes
app.post('/voteQuestion/:num/:qid', async (req, res) => {
  try{
    let num = parseInt(req.params.num);
    let qid = req.params.qid;
    console.log(num);
    //console.log("increaseView");
    //console.log(id);

    let query = { _id: qid};
    let update = { $inc: { votes: num } };

    await questionTable.updateOne(
      query,
      update
   );

  let uid = await questionTable.find({_id: qid}, "author_id");

  uid = uid[0].author_id;


  query = { _id: uid};
  if(num == -1){
    update = { $inc: { reputation: -10 } };
  }
  else{
    update = { $inc: { reputation: 5 } };
  }

  await userTable.updateOne(
     query,
     update
  );
   
   res.send(await questionTable.find({_id: qid}, "votes"));
   
  }
  catch(error){
    console.log(error);
    res.sendStatus(500);
  }
  });


// increment or decrement for a answer id, returns updated votes
app.post('/voteAnswer/:num/:id', async (req, res) => {
  try{
    let num = parseInt(req.params.num);
    let id = req.params.id;
    console.log(num);
    //console.log("increaseView");
    //console.log(id);

    let query = { _id: id};
    let update = { $inc: { votes: num } };

    await answerTable.updateOne(
      query,
      update
    );

    let uid = await answerTable.find({_id: id}, "author_id");
    console.log(uid);
    uid = uid[0].author_id;
    console.log(uid);
  
    query = { _id: uid};
    if(num == -1){
      update = { $inc: { reputation: -10 } };
    }
    else{
      update = { $inc: { reputation: 5 } };
    }
  
    await userTable.updateOne(
       query,
       update
    );

  
    res.send(await answerTable.find({_id: id}, "votes"));
    
  }
  catch(error){
    console.log(error);
    res.sendStatus(500);
  }
  });

// increment or decrement for a answer id, returns updated votes
app.post('/voteComment/:num/:id', async (req, res) => {
  try{
    let num = parseInt(req.params.num);
    let id = req.params.id;
    console.log(num);
    //console.log("increaseView");
    //console.log(id);

    const query = { _id: id};
    const update = { $inc: { votes: num } };

    await commentTable.updateOne(
      query,
      update
    );
    res.send(await commentTable.find({_id: id}));
    
  }
  catch(error){
    console.log(error);
    res.sendStatus(500);
  }
  });

// gets comment object given a comment id
app.get('/getCommentById/:id', async (req, res) => {
  try{
    let id = req.params.id;
    //console.log(tid);
    res.send(await commentTable.find({_id: id}));
  }
  catch(error){
    console.log(error);
    res.sendStatus(500);
  }
});

//given an arrary of comment object ids, return an array of comment objects
app.post('/getCommentArray', async (req, res) => {
  try{
    let arr = req.body;
    let comments = [];
    //console.log(arr);
    for(let i = 0; i < arr.length; i++){
      console.log(await commentTable.find({_id: arr[i]}));
      comments.push(await commentTable.find({_id: arr[i]}));
    }
    //console.log(comments);
    res.send(comments);
  }
  catch(error){
    console.log(error);
    res.sendStatus(500);
  }
});

//add a new comment and return its id
app.post('/comment_add_id', async(req,res)=>{
  try{
    let comment = req.body;
    //console.log(comment);
    let date = new Date();
    //console.log(comment);
    let new_comment = new commentTable({
      comment_by: comment["comment_by"],
      text: comment["text"],
      comment_date_time: date,
      author_id: comment["author_id"]
    });
    await new_comment.save();
    res.json(new_comment["_id"]);

  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// add comment id to the question and return updated question
app.post('/comment_update_qid', async(req,res)=>{
  try{
    let data=req.body;
    //console.log(data);

    const query = { _id: data["qid"]};
    const update = { $push: { comments: data["comment_id"]} };

    await questionTable.updateOne(
      query,
      update
   );

   res.send(await questionTable.find({_id: data["qid"]}));

  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// add comment id to the answer and return updated answer
app.post('/answer_update_aid', async(req,res)=>{
  try{
    let data=req.body;
    //console.log(data);

    const query = { _id: data["aid"]};
    const update = { $push: { comments: data["comment_id"]} };

    await answerTable.updateOne(
      query,
      update
   );

   res.send(await answerTable.find({_id: data["aid"]}));

  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//add a new answer and return its id
app.post('/answers_add_aid', async(req,res)=>{
  try{
    let ans = req.body;
    let date = new Date();
    //console.log(date);
    //console.log(ans);
    let new_ans = new answerTable({
      text: ans["text"],
      ans_by: ans["ans_by"],
      ans_date_time: date,
      author_id: ans["author_id"]
    });
    await new_ans.save();
    res.json(new_ans["_id"]);

  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// add answer id to the question
app.post('/question_update_aid', async(req,res)=>{
  try{
    let data=req.body;
    //console.log(data);

    const query = { _id: data["qid"]};
    const update = { $push: { answers: data["aid"]} };

    await questionTable.updateOne(
      query,
      update
   );

   res.send(await questionTable.find({_id: data["qid"]}));

  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});



//update tags add new tag
app.post('/update_tag', async(req,res)=>{
  try{
    let tag= req.body.tag_name;
    console.log(tag);
    let new_tag=new tagTable({
      name:tag,
    });
    await new_tag.save();
    res.json(new_tag["_id"]);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


//update questions add new questsion
app.post('/update_questions',async (req,res)=>{
  try{
    let data=req.body;
    console.log(data["tags"]);
    let questions=questionTable({
      answers:data["answers"],
      ask_date_time:data["ask_date_time"],
      asked_by:data["asked_by"],
      author_id: data["author_id"],
      tags:data["tags"],
      text:data["text"],
      summary: data["summary"],
      title:data["title"],
      views:data["views"],
    });
    await questions.save();
    res.json(questions);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
    return;
  }
});


//edit quesiton given qid and edited question info
app.post('/edit_questions',async (req,res)=>{
  try{
    let data=req.body;
    let qid = data['qid'];
    console.log(data["tags"]);
    let questions={
      answers:data["answers"],
      comments: data["comments"],
      ask_date_time:data["ask_date_time"],
      asked_by:data["asked_by"],
      author_id: data["author_id"],
      tags:data["tags"],
      text:data["text"],
      summary: data["summary"],
      title:data["title"],
      views:data["views"],
      votes:data["votes"]
    };

    const update = { $set: questions };
    await questionTable.findOneAndUpdate({_id: qid}, update)
    res.json(questions);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
    return;
  }
});


//given qid, delete questions, answers, comments associated with it
app.post('/delete_question',async (req,res)=>{
  try{
    let data=req.body;
    let qid = data['qid'];
    console.log(data["tags"]);
    let questions={
      answers:data["answers"],
      comments: data["comments"],
      ask_date_time:data["ask_date_time"],
      asked_by:data["asked_by"],
      author_id: data["author_id"],
      tags:data["tags"],
      text:data["text"],
      summary: data["summary"],
      title:data["title"],
      views:data["views"],
      votes:data["votes"]
    };


    for(let i = 0; i < questions.answers.length; i++){
      let aid = questions.answers[i];
      console.log(aid);

      ans = await answerTable.find({_id: aid});

      console.log("shibar");
      console.log(ans);

      let ansComments = ans[0].comments;

      console.log(ansComments)

      for(let i = 0; i < ansComments.length; i++){
        let cid = ansComments[i];
        await commentTable.deleteOne({"_id" : cid});
      }  


      //await commentTable.deleteOne({"_id" : cid});
   
      
      await answerTable.deleteOne({"_id" : aid});
    }



    for(let i = 0; i < questions.comments.length; i++){
      let cid = questions.comments[i];
      await commentTable.deleteOne({"_id" : cid});
    }

    console.log(await questionTable.deleteOne({"_id" : qid}));

    let allQuestions = await questionTable.find({});
    res.json(allQuestions);

  } catch (error) {
    console.log(error);
    res.sendStatus(500);
    return;
  }
});


// edit answer given answer object
app.post('/edit_answer',async (req,res)=>{
  try{
    let data=req.body;
    let aid = data['aid'];
    let answers={
      comments: data['comments'],
      text: data['text'],
      votes: data['votes'],
      ans_by: data['ans_by'],
      ans_date_time: data['ans_date_time'],
      author_id: data['author_id']
    };

    const update = { $set: answers };
    await answerTable.findOneAndUpdate({_id: aid}, update)

    res.json(answers);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
    return;
  }
});

//given a aid, get the qid
app.get('/given_aid_get_qid/:aid',async (req,res)=>{
  try{
    let aid = req.params.aid;

    let q = await questionTable.find({answers: aid});

    res.json(q);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
    return;
  }
});


// get updated question
app.get('/given_qid_get_qid/:qid',async (req,res)=>{
  try{
    let qid = req.params.qid;

    let q = await questionTable.find({_id: qid});

    res.json(q);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
    return;
  }
});

//given aid, delete its comments, remove aid from the question
app.post('/delete_answer',async (req,res)=>{
  try{
    let data=req.body;
    let aid = data['aid'];
    let answers={
      comments: data['comments'],
      text: data['text'],
      votes: data['votes'],
      ans_by: data['ans_by'],
      ans_date_time: data['ans_date_time'],
      author_id: data['author_id'],
      qid: data['qid']
    };

    for(let i = 0; i < answers.comments.length; i++){
      let cid = answers.comments[i];
      await commentTable.deleteOne({"_id" : cid});
    }  

    await questionTable.findOneAndUpdate(
      { _id: answers.qid },
      { $pull: { answers: aid } } );

    await answerTable.deleteOne({"_id" : aid});

    let allQuestions = await questionTable.find({});
    res.json(allQuestions);

  } catch (error) {
    console.log(error);
    res.sendStatus(500);
    return;
  }
});

//delete tags in tagsTable that r not used at all in answersTable
app.post('/refresh_tagTable', async(req,res)=>{
  try{
    let allTags = await tagTable.find({});
    //console.log(allTags);
    for(let i = 0; i < allTags.length; i++){
      let tid = allTags[i]._id;
      console.log(tid);
      questionsWithTag = await questionTable.find({tags: tid})
      console.log(questionsWithTag.length);

      if(questionsWithTag.length == 0){
        console.log("del")
        await tagTable.deleteOne({"_id" : tid});
        console.log(tid);
      }
    }

    
    allTags = await tagTable.find({});
    res.json(allTags);
    
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});



//register new user
app.post('/registerUser', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const user = await userTable.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const newUser = new userTable({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      register_date: new Date()
    });
    await newUser.save();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// handle login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userTable.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: "Email not registered!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.admin = user.admin;
    req.session.reputation = user.reputation;
    res.send({ message: "Successfully logged in!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "An error occurred while logging in" });
  }
});

// guest log in
app.post("/loginGuest", async (req, res) => {
  console.log(req.session);
  req.session.userId = 0;
  req.session.username = "Guest";
  res.send({ message: "Successfully logged in!" });
});

// check log in
app.get('/checkLoggedIn', (req, res) => {
  // Check if user is logged in, e.g. by verifying a session or token
  console.log("test");
  console.log(req.session);
  if (req.session.username) {
    // If user is logged in, return the username or other user data as JSON
    res.json({
      userId: req.session.userId,
      username: req.session.username});
  } else {
    // If user is not logged in, return an error status code and message
    res.status(401).json({ error: 'User not logged in' });
  }
});
app.get('/checkAdmin/:userId', async (req, res) => {
  const userId = req.params.userId;
  try{
    let isAdmin = await userTable.find({_id: userId}, "admin");
    console.log(isAdmin);
    res.json(isAdmin);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//return reputation of session user
app.get('/getReputation/:userId', async (req, res) => {
  const userId = req.params.userId;
  try{
    let rep = await userTable.find({_id: userId}, "reputation");
    // console.log(rep);
    res.json(rep);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


app.get('/getRegisterDate/:userId', async (req, res) => {
  const userId = req.params.userId;
  try{
    let date = await userTable.find({_id: userId}, "register_date");
    // console.log(date);
    res.json(date);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//returns questions that user asked
app.get('/getQuestions/:userId', async (req, res) => {
  const userId = req.params.userId;
  try{
    let q = await questionTable.find({author_id: userId});
    res.json(q);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/getAnsweredQuestions/:userId', async (req, res) => {
  const userId = req.params.userId;
  console.log(userId);
  try {
    // Find all answers by the given userId
    const answers = await answerTable.find({ ans_by: userId }).exec();

    // Collect all question ids from the answers
    const questionIds = answers.map((answer) => answer._id);

    // Find all questions that have at least one answer from the user
    const questions = await questionTable.find({ answers: { $in: questionIds } }).exec();

    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/getAllUsers', async (req, res) => {
  try {
    const users = await userTable.find({}, {_id: 1, username: 1});
    const userMap = users.reduce((acc, user) => {
      acc[user._id] = user.username;
      return acc;
    }, {});
    res.send(userMap);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "An error occurred while retrieving users" });
  }
});

app.get("/logout", async (req, res) => {
  req.session.userId = null
  req.session.username = null
  res.send("logged out")
})

//returns questions that user answered
app.get('/getQuestionsAnswered/:userId', async (req, res) => {
  const userId = req.params.userId;
  let questions = [];
  try{
    answersIds = await answerTable.find({author_id: userId}, "_id");
    for(let i = 0; i < answersIds.length; i ++){
      let q = await questionTable.find({answers: answersIds[i]._id});
      questions.push(q);
    }

    console.log(questions);

    res.json(questions);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
//returns tags of questions user asked
app.get('/getUserTags/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const questions = await questionTable.find({ author_id: userId }).populate({ path: 'tags', select: '_id name' });
    const tagsMap = new Map();
    questions.forEach(q => {
      q.tags.forEach(t => {
        if (!tagsMap.has(t.name)) {
          tagsMap.set(t.name, { _id: t._id, name: t.name });
        }
      });
    });
    const tags = Array.from(tagsMap.values());
    res.status(200).json(tags);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving tags');
  }
});

app.get('/getNonEditableUserTags/:userId', async (req, res) => {
  const userId = req.params.userId;
  const tagArr = req.query.tags;

  try {
    // extract tagids
    const tagIds = await tagTable.find({ name: { $in: tagArr.map(tag => tag.name) } }).distinct('_id');
    // return all questions with tagIds
    const questions = await questionTable.find({ tags: { $in: tagIds } }).populate('tags');

    //isolate non user questions
    const nonUserQ = questions.filter(question => question.author_id.toString() !== userId.toString());
    
    const dupTags = new Set();
    nonUserQ.forEach(question => {
    question.tags.forEach(tag => {
      dupTags.add(tag.name);
    });
    });
    res.status(200).json(Array.from(dupTags));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/edit_question_tags', async (req, res) => {
  const { old_tag, new_tag } = req.body;

  try {
    // Find the tag object with the old_tag name
    const oldTag = await tagTable.findOne({ name: old_tag });
    if (!oldTag) {
      return res.status(404).json({ error: `Tag "${old_tag}" not found` });
    }

    // Find the tag object with the new_tag name
    const newTag = await tagTable.findOne({ name: new_tag });
    if (!newTag) {
      return res.status(404).json({ error: `Tag "${new_tag}" not found` });
    }

    // Find all questions that have the oldTag and update their tags array
    const result = await questionTable.updateMany(
      { tags: oldTag._id },
      { $set: { 'tags.$': newTag._id } }
    );

    res.json({ message: `${result.nModified} questions updated` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/delete_tag', async (req, res) => {
  const tagToBeDeleted = req.body.tagToBeDeleted; // Assuming the tag name is sent in the request body
  
  try {
    // Find the tag object to be deleted
    const tag = await tagTable.findOne({ name: tagToBeDeleted });
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }
    
    // Delete the tag from the questionTable
    await questionTable.updateMany({ tags: tag._id }, { $pull: { tags: tag._id } });
    
    // Delete the tag object
    await tagTable.deleteOne({ name: tagToBeDeleted });
    
    return res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
});

app.post('/deleteUser', async (req, res) => {
  try {
    const userId = req.body.userId;
    
    // Remove associated user answers and comments of questions 
    const questions = await questionTable.find();
    //console.log(questions);
    for (const question of questions) {
      const updatedAnswers = [];
      for (const answer of question.answers) {
        const answerObj = await answerTable.findById(answer).exec();
        const userObj = await userTable.findById(answerObj.author_id).exec();
        if (userObj.id === userId) {
          await commentTable.deleteMany({ _id: { $in: answer.comments } });
        } else {
          updatedAnswers.push(answer);
        }
      }
      const updatedComments = [];
      for (const comment of question.comments) {
        const commentObj = await commentTable.findById(comment).exec();
        const commentUserObj = await userTable.findById(commentObj.author_id).exec();
        if (commentUserObj.id !== userId) {
          updatedComments.push(comment);
        }
      }
      question.answers = updatedAnswers;
      question.comments = updatedComments;
      await question.save();
    }
    // Remove associated user comments of answers 
    const answers = await answerTable.find();
    for (const answer of answers){
      const updatedComments = [];
      for (const comment of answer.comments) {
        const commentObj = await commentTable.findById(comment).exec();
        const commentUserObj = await userTable.findById(commentObj.author_id).exec();
        if (commentUserObj.id !== userId) {
          updatedComments.push(comment);
        }
      }
      answer.comments = updatedComments;
      await answer.save();
    }
    await questionTable.deleteMany({ author_id: userId });
    await answerTable.deleteMany({ author_id: userId });
    await commentTable.deleteMany({ author_id: userId });
    await userTable.deleteOne({ _id: userId });
  
    res.status(200).json({ message: `User with ID ${userId} and associated data deleted successfully.` });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'An error occurred while deleting the user.' });
  }
  
});



app.get("/logout", async (req, res) => {
  req.session.userId = null
  req.session.username = null
  res.send("logged out")
});



