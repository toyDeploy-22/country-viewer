
import { useState } from 'react';
import { addCountriesChecker } from '../functions/editCountries';
import Form from 'react-bootstrap/Form'; // For switch checkbox
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation, faSquareCheck } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

/*
{
  const country = {
   id: req.body.countryId,
   continent: req.body.continentId, // fe <select>
   name: req.body.countryName,
   flag: req.body.countryFlag, // not mandatory field
   description: req.body.countryDescription // fe:<textarea> not mandatory field
 }

*/

function AddCountries({ cnt }) {

// 1) Hooks  
const [newCountry, setNewCountry] = useState({
  id: "",
  continent: "",
  name: "",
  hasFlag: false,
  hasDescription: false,  
  flag: "",  
  description: ""
});

const [spinner, setSpinner] = useState(false);
const [result, setResult] = useState("init");
const [message, setMessage] = useState("");
const [showCanvas, setShowCanvas] = useState(false);

// 2) variables  
// const instruction = "Please tell us if you have a URL link for the country";

// 3) Functions  
const handleCountry = (e) => {

let {name, checked, value} = e.target;

setNewCountry((info)=>({
  ...info, 
  [name]: name === "hasFlag" ? checked : value
  }))
}

const submitCountry = async(e) => {
  e.preventDefault();
  const fnc = async() => {
  try{
    setShowCanvas(true);
    const continents = ["EU", "NA", "SA", "AS", "OC", "AF", "AN"];
    const conditions = {
      flagTrue: newCountry.hasFlag  === true,
       flagType: typeof newCountry.flag !== "string",
       descriptionType: typeof newCountry.description !== "string",

       emptyDescription: newCountry.description === '', 
       fewDescription: newCountry.description.length < 10,
       longDescription: newCountry.description.length > 160
    };
    let continentSelected = continents.indexOf(newCountry.continent.toUpperCase());

    const checker = await addCountriesChecker(newCountry, cnt);
    console.log(checker) 

    if(continentSelected === -1) {
      setSpinner(false);
      setResult("false");
      setMessage("The continent is not in the list. Please select a valid continent in the list to proceed.");
    } else if(checker.ok) {
    if((conditions.flagTrue && conditions.flagType) || (conditions.descriptionType)){
      setSpinner(false);
      setResult("false");
      setMessage("You must add a valid URL flag and description. If not, please uncheck the specific option and confirm again.");
      console.log(message);
    } else  {

    const countryBody = {
    countryId: newCountry.id,
	  countryName: newCountry.name,
	  continentId: continents[continentSelected],
	  hasFlag: newCountry.hasFlag
    }
     
 // check flag:
      if(countryBody.hasFlag === false) {
      (countryBody['countryFlag_url'] = newCountry.flag)
      }
  
// check description:
/*
   if((!conditions.descriptionType) && (conditions.emptyDescription) && (conditions.fewDescription))
   */
   if(!conditions.descriptionType) {
    (!conditions.emptyDescription) && (!conditions.fewDescription) && (!conditions.longDescription) ?
   Object.assign(countryBody, { hasDescription: true, countryDescription: newCountry['description']} ) : Object.assign(countryBody, { hasDescription: false })
   } else {
    countryBody['hasDescription'] = false; // To avoid error types messages
   }

  console.log(countryBody)
  await axios({
    method: 'post',
    url: 'https://country-viewer-backend.vercel.app/nosql/addcountry',   
    headers: {'Content-Type': 'application/json'},
    data: countryBody
  });
    setSpinner(false);  
    setResult("true");
    setMessage(checker.message)
    }
  } else {
    setSpinner(false);   
    setResult("false");
    setMessage(checker.message)
  }
} catch(err)  {
    console.error(err);
    setSpinner(false);   
    setResult("false");
    setMessage("System Message Error: Please try again")
    // setMessage(`System Message Error ${err.response.status}: ${err.response.data.msg.message}`)
  }
}
setSpinner(true);
setTimeout(fnc, 2000) 
}

const closeCanvas = () => {
  setShowCanvas(false);
  setResult("init");
  setMessage("")
}

const closeCanvas_AndReset = (e) => {

  const reset = {id: "",
  continent: "EU",
  name: "",
  hasFlag: false,
  hasDescription: true,  
  flag: "",  
  description: ""};
  setShowCanvas(false);
  setResult("init");
  setMessage("");
  setNewCountry(reset);
  window.location.reload()
}
  
return(
<section id="addCountries">
<div className="paddingAxe">
<form id="addCountryForm" className="form" onSubmit={submitCountry}>
<h2 className="display-3" id="addCountry-title">Add Country</h2>
<p><i>Please fill the below details 
    to add your country:</i></p>
<br />
    <label htmlFor="name" className="labelForm">I{")"} Country Name</label>
    <div className="form-row">
    <p className="requiredField"><span className="p-1"></span>*Type the country name</p>
    <input
     type="text"
     id="name"
     name="name"
     value={newCountry.name}       
     onChange={handleCountry}
     required       
     />
     </div>
     <br />    
      <label htmlFor="id" className="labelForm">II{")"} Country Initials</label>
      <div className="form-row">
      <p className="requiredField"><span className="p-1"></span>*Enter the country initials</p>
      <input
       type="text"
       id="id"
       name="id"
       value={newCountry.id}
       onChange={handleCountry}         
       required
         />
      </div>
    <br />
   <label htmlFor="continent" className="labelForm">III{")"} Continent</label>
   <div className="form-row">
   <p className="requiredField"><span className="p-1"></span>*Choose the continent </p> 
      <select
      style={{ 
        width: '40%',
        textAlign: 'center',
        backgroundColor: 'unset',
        border: 'inset .5px lightgray'
      }}
       id="continent"
       name="continent"
       required
       onChange={handleCountry}
       defaultValue=""         
      >
<option disabled value="">Click here to select</option>         
<option value="EU">Europe</option>
<option value="NA">North America</option>
<option value="SA">South America</option>
<option value="AS">Asia</option>
<option value="AF">Middle East/Africa</option>
<option value="OC">Oceania</option>
<option value="AN">Antarctica</option>
</select>
</div>
<br />

<label htmlFor="flag" className="labelForm">IV{")"} Flag</label>
<p id="hasFlag-title">Do you have a link for your flag ?</p>
<div className="hasFlag-form">
<p className="hasFlag-no">
<Badge pill bg={!newCountry.hasFlag ? "secondary" : ""}  className={`p-2 ${!newCountry.hasFlag ? "" : "hasFlag-no-badge"}`} >No</Badge>
</p>
<span className='p-2'></span>
<Form.Check // prettier-ignore
type="switch"
name="hasFlag"
id="flag"
onChange={handleCountry}
/>
<span className='p-2'></span>
<p className="hasFlag-yes">
<Badge pill bg={newCountry.hasFlag ? "info" : ""}  className={`p-2 ${newCountry.hasFlag ? "" : "hasFlag-yes-badge"}`} >Yes</Badge> 
</p>
</div>
<br />

  <label htmlFor="flag-img" className="d-none labelForm">III{"-3)"} Flag Image</label>
  <p className={newCountry.hasFlag ? "d-block" : "d-none"} style={{marginRight: '10%'}}>Please enter the link of your country flag:</p>
   <div className={newCountry.hasFlag ? "form-row" : "d-none"}>
   <p className="invisible requiredField"><span className="p-1"></span>*Enter the country flag link</p>
      <input
       id="flag-img"
       name="flag"
       value={newCountry.flag}
       onChange={handleCountry} 
       placeholder="Example: https://myflag.com/image/country/china"
       />
       </div>

   {(newCountry.hasFlag && newCountry.flag === '') || (newCountry.hasFlag && newCountry.flag.length === 0) ?
     <p className="instructions" 
     style={{
      color: "green",
      fontSize: ".9em",
      marginRight: "10%",
      fontFamily: `calibri, 'Courier New', Courier, sans-serif`
      }}><b>The flag field cannot be empty if flag case is checked.</b></p>
        : null}
    <br />       

    <label htmlFor="description" className="labelForm">V{")"} Description</label>
    <div id="decription-form">
   <p className="instructions">You can add a description below <b>(160 words max)</b>. If you don't want to, please leave it empty.</p>
   <p className="mt-auto" style={{fontFamily: 'cursive, monospace, sans-serif', fontSize: '1.02em'}} >{newCountry.description.length === 160 ? "no character remaining" : "Characters Remaining:"} <b className={Number(160 - newCountry.description.length) < 11 && Number(160 - newCountry.description.length) > 0 ? "text-danger" : Number(160 - newCountry.description.length) === 0 ? "d-none" : Number(160 - newCountry.description.length) >= 11 && Number(160 - newCountry.description.length) <= 60 ? "mid-Characters-Remain" : "text-success"}>{160 - newCountry.description.length}</b></p>
   <textarea 
   id="description"
   name="description"
   value={newCountry.description}
   onChange={handleCountry}
   maxLength={160}
   rows={6} cols={50}>
   </textarea>
   {newCountry.description.length <= 9 ? <p className="mt-auto fw-light fst-italic"><small>{"("}<b>Note:</b> If desired, your description must contain <b>10 characters mimnimum</b>.{")"}</small></p> : <br />}
   
  </div>
 
  { ["true", "false"].indexOf(result) > -1 &&
  <Offcanvas show={showCanvas} onHide={result === "true" ? closeCanvas_AndReset : closeCanvas} placement="top">
        <Offcanvas.Header className="p-0" closeButton>
          <Offcanvas.Title className={`w-100 text-center p-2 text-${result === "false" ? "warning" : "light"} bg-${result === "true" ? "success" : "dark"}`} style={{letterSpacing: '2px'}}>{result === "true" ? "Success !" : "Failure !"}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className={`text-center ${[message].includes("System Message Error") ? "bg-dark text-danger border border-warning" : result === "false" && ![message].includes("System Message Error") ? "bg-dark text-warning border border-danger" : "bg-light text-success fw-bold border border-info"}`}>
        <br />
        <p>{message}</p>
        </Offcanvas.Body>
      </Offcanvas>
}

<Button 
variant={result === "true" ? "dark" : "primary"} 
className="text-light border border-secondary"
size="lg"
style={{ marginRight: '10%' }}
type="submit"
disabled={spinner ? true : false}
>
{ spinner &&
<Spinner
as="span"
animation="border"
size="sm"
role="status"
aria-hidden="true"
/>
}
{result === "true" ? "Submitted" : result === "false" ? "Not Submitted" : spinner ? ' Adding Country...' : 'Submit Country'}
{' '}
{["true", "init"].indexOf(result) === -1 && 
<FontAwesomeIcon className="text-warning" icon={faTriangleExclamation} />
}{''}
{ result === "true" &&
<FontAwesomeIcon icon={faSquareCheck} beat style={{color: "#63E6BE",}} />
}
</Button>
<br />
</form>
</div>
</section>    
  )
  }

export default AddCountries;