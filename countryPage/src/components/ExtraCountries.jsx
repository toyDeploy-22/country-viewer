
import React, { useState, useEffect } from 'react';
import randomGame from '../functions/randomGame.js';
import NoImage from '../screenshot/no-image.512x512.png';
import Button from 'react-bootstrap/Button';
import countrySchema from '../functions/countrySchema.js';

// import ExtraSection from './components/extraSection.js';
// import axios from 'axios';

function ExtraCountries({ countries }) {

const [proposals, setProposal] = useState([]);
const [answer, setAnswer] = useState([{...countrySchema}]); // Array of Object instead of Object more safe because some properties are not mandatory.  
const [selected, setSelected] = useState(""); //selected answer
const [answerResult, setAnswerResult] = useState("init"); // constant "answer" is alread used
const [hasSource, setHasSource] = useState(true);
const [errorStack, setErrorStack] = useState([{ err: false, title: '', msg: '' }]);

useEffect(()=>{
 // randomGame(cnt, proposition, answer, error) 
 randomGame(countries, setProposal, setAnswer, setErrorStack);
}, []);


 const handleResult = (e) => {
  // Can also use e.target.attributes.country.value
   let suggest = e.target.value;
   setSelected(suggest);
 }
  
const errorImg = () => {
  setHasSource(false)
}

 const submitResult = () => {
  selected === "" || typeof selected !== "string" ? setAnswerResult("empty") :
   selected.toLowerCase() === answer[0].countryName.toLowerCase() ? 
     setAnswerResult("true") : setAnswerResult("false")
 }

const randomColors = () => {
  const colors = ['primary', 'secondary', 'success', 'warning', 'info', 'dark'];
  const randomIndex = Math.floor(Math.random() * colors.length)
  return colors[randomIndex === 0 ? randomIndex : randomIndex - 1] 
}

const playAgain = () => {
  setErrorStack(()=>[{ err: false, title: '', msg: '' }]);
  setSelected(""); 
  setAnswerResult("init");
  randomGame(countries, setProposal, setAnswer, setErrorStack);
}

const tryAgain = () => {
  setSelected(""); 
  setAnswerResult("init"); 
}
  
  return(
<section id="extraCountries">
      {
    countries.loading && <div className="loadingContainer">
   <h4><span>Loading Question</span></h4>
   <br />
   <p>The question will appear here...</p> 
    </div>
      }

{
errorStack[0].err === true ?
<div id="errorQuestion">
<p>The countries cannot display here due to an error.</p>
<p><i>Please try to refresh the page.</i></p>
</div>
:
<div id="questionContainer">
<div className="extraCountries-block"></div>
<h5 id="play-h5">Play With Us!</h5> 
<h5>Which one of these nations represents this flag below ?</h5>
<img onError={()=>errorImg} src={!hasSource ? NoImage : answer[0].countryFlag_url} alt={!hasSource ? "No Image" : "country flag"} />    
<ol type="A">
{
proposals.map((land, _ind)=>
<Button 
variant={`outline-${randomColors()}`}
key={land.countryId + "-" + _ind}
value={land.countryName}
onClick={handleResult}
>
{land.countryName}
</Button>)
}
</ol>
{
selected === "" ? <p className="fw-bold bg-dark text-light p-2">Select the country above and confirm !</p> : <p className="fw-bold text-dark bg-none p-1">This is the country flag of <span className="d-inline-block bg-primary text-light p-1 border-primary rounded-end border-opacity-25">{selected}</span></p>
}
  <div id="answerContainer">
  {answerResult === "true" &&
  <div id="correctAnswer">
  <p>Correct !</p>
  <Button 
  variant="success"
  onClick={playAgain}>Next Question</Button>
  </div>
  }
  {answerResult === "false" &&
  <div id="incorrectAnswer"> 
  <p>Incorrect !</p>
  </div>}
  {answerResult === "empty" && 
  <div id="emptyAnswer" style={{color: "#DE7F02"}}> 
  <p className="fw-bold">{"*"}Please select a country before confirming.</p>
  </div>
  }
</div>
{/*
{answerResult !== "true" && <button onClick={submitResult}>{answerResult === "false" ? "try again" : "confirm"}</button>}
*/}
{answerResult !== "true" && <div id="optionsBtns">
{ answerResult === "false" ?
  <button onClick={tryAgain}>Try again</ button>
  :
  <button onClick={submitResult}>Validate Answer</button>
  }
<button onClick={playAgain}>Skip Question</button>
</div>}  
</div>
}    
</section>    
  )
}

export default ExtraCountries;