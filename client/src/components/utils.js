
import axios from 'axios';

export default function getMetaData(startTime, date, isAnswer)
{
    let timeDiff = startTime - new Date(date).getTime()

    date = new Date(date);
    
   //console.log(startTime)
    //console.log(date);
      
    let timeDiffSecs  = timeDiff / 1000;
    let strOut = "";
    if (isAnswer)
    {
      strOut += "answered ";
    }
    else{
      strOut += "asked ";
    }
    //console.log(timeDiffSecs)

    if (timeDiffSecs < 60) {
      strOut += Math.round(timeDiffSecs) + " seconds ago";

    }
    else{
      let timeDiffMinutes = timeDiffSecs / 60;
      //console.log(timeDiffMinutes);
      if (timeDiffMinutes < 60) {
        strOut +=  Math.round(timeDiffMinutes) + " minutes ago";
      }

      else{
        let timeDiffHours = timeDiffMinutes /60;
        //console.log(timeDiffHours);
        if(timeDiffHours < 24){
            strOut +=  Math.round(timeDiffHours) + " hours ago";
        }
        else{
          let timeDiffDays =  timeDiffHours / 24;
          let month = ["Jan","Feb","March","April","May","June","July","Aug","Sept","Oct","Nov","Dec"];
          let minutes = date.getMinutes();
          let hours = date.getHours()
          if (minutes < 10){
            minutes = "0" + minutes;
          }
          if (hours < 10){
            hours = "0" + hours;
          }

          if(timeDiffDays < 365){
            strOut += month[date.getMonth()] + " " + date.getDate() + " at " + 
            hours + ":" + minutes;
          }
          else{
            strOut += month[date.getMonth()] + " " + date.getDate() + ", " + 
            date.getFullYear() + " at " + hours + ":" + minutes; 
          }
          }

        }
      }

    return strOut;

}

/** 
export function highlightTag(){
  let tagsLink = document.querySelector("tagsLink");
  tagsLink.style.backgroundColor = "grey";

  let questionLink = document.querySelector("questionLink");
  questionLink.style.backgroundColor = "white";
}

export function highlightQuestion(){
  let tagsLink = document.querySelector("tagsLink");
  console.log(tagsLink);
  tagsLink.style.backgroundColor = "white";

  let questionLink = document.querySelector("questionLink");
  questionLink.style.backgroundColor = "grey";
}
**/


export function getTagBytid(id)
{
  let tag = {
    tid : 0,
    name : "",
  };

  axios.get('http://localhost:8000/getTagBytid/' + id)
  .then(function (response) {
    //console.log(response?.data);
    
    tag.tid = response.data[0]._id;
    tag.name = response.data[0].name;
    console.log(tag)
    return tag;  

  })
  .catch(function (error) {
    console.log(error);
  });

  return tag;
}


// return an array of questions from newest to oldest
export function getQuestionNewest(questions){
  return questions.sort(function(a,b){
    return new Date(b.ask_date_time) - new Date(a.ask_date_time);
  });
}

export function getAnswerNewest(arr){
  return arr.sort(function(a,b){
    return new Date(b.ask_date_time) - new Date(a.ask_date_time);
  });
}

export function getCommentNewest(arr){
  return arr.sort(function(a,b){
    return new Date(b.comment_date_time) - new Date(a.comment_date_time);
  });
}

// return array of all questions in the model sorted by answer activity. The most recently answered questions must appear first.
// im not sure if this even works, need more testing lol
export function  getQuestionActive(questions, allAnswers){
  console.log(allAnswers);

  let questionsWithAnswers = [];
  let questionsWithNoAnswers = [];
  for(let i = 0; i < questions.length; i++)
  {
    if (questions[i].answers.length === 0){ //if theere are no ansIds in that question
      questionsWithNoAnswers.push(questions[i]);
    }
    else{
      questionsWithAnswers.push(questions[i]);
    }
  }
  //console.log(questionsWithAnswers);
  //console.log(questionsWithNoAnswers);

  let answersSorted = questionsWithAnswers.sort(function(a,b){
      let bb = sortAnsIds(b.answers, allAnswers)[0]; //bb is an ansid
      //console.log(bb);
      bb = new Date(allAnswers.find(function(element){return element._id === bb}).ans_date_time);
      //console.log(bb);
      let aa = sortAnsIds(a.answers, allAnswers)[0]; //bb is an ansid
      aa = new Date(allAnswers.find(function(element){return element._id === aa}).ans_date_time);
      //console.log(aa);
      return new Date(bb) - new Date(aa);
  });
  
  questionsWithNoAnswers.forEach(element => {
    answersSorted.push(element);
  });

  console.log(answersSorted)
  
  return answersSorted;
}

//sortss ansIds by date, gotta test
//returns an array of sorted ansIds;
export function sortAnsIds(ansIds, allAnswers){
  //console.log(this.data.answers);
  return ansIds.sort(function(a,b){
    //console.log(a);
    //let c = db.data.answers.find(e => e.aid === a);
    //console.log(c);
    return new Date(allAnswers.find(function (element) { return element._id === b}).ans_date_time) - 
    new Date(allAnswers.find(function (element) { return element._id === a}).ans_date_time);
  });
}

//reutrns the number of questions with a tag
export function getNumQuestionsWithTag(questions, tid)
{
  let count = 0;
  if(questions){
    for (let i = 0; i < questions.length; i++){
      if (questions[i].tags.find(function (element) { return element === tid}) !== undefined){
        count +=1;
      }
    }
  }

  return count;
}
//returns array of questions with a tag
export function  getArrQuestionsWithTag(questions, tid)
{
  //console.log(db);
  //console.log(tid);
  let arr = [];
  for (let i = 0; i < questions.length; i++){
    if (questions[i].tags.find(function (element) { return element === tid}) !== undefined){
      arr.push(questions[i]);
    }
  }

  return arr.sort(function(a,b){
    return new Date(b.askDate) - new Date(a.askDate);
  });
}

// given a question, returns a list of answers from newest to oldest
export function getAnswersListNewest(question, allAnswers){
  console.log(allAnswers);
  let answers = [];
  for (let i = 0; i < allAnswers.length; i++){
    if (question.answers.find(function (element) { return element === allAnswers[i]._id}) !== undefined){
      answers.push(allAnswers[i]);
    }
  }

  return answers.sort(function(a,b){
    return new Date(b.ansDate) - new Date(a.ansDate);
  });
}