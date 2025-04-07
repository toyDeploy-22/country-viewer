
import React, { useState } from 'react';
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
    let continentSelected = continents.indexOf(newCountry.continent.toUpperCase());

    const checker = await addCountriesChecker(newCountry, cnt);
    console.log(checker) 

    if(continentSelected === -1) {
      setResult("false");
      setMessage("The continent is not in the list. Please select a valid continent in the list to proceed.");
    } else if(checker.ok) {
    if(newCountry.hasFlag && newCountry.flag === ""){
      setResult("false");
      setMessage("You must add a valid URL flag. If not, please uncheck the option and confirm again.");
      console.log(message);
    } else  {
    setSpinner(true);
    const countryBody = {
      countryId: newCountry.id,
	  countryName: newCountry.name,
	  continentId: continents[continentSelected],
	  hasFlag: newCountry.hasFlag,
	  hasDescription: newCountry.description ? true : false	  
    }
     
 // check flag:
      if(newCountry.hasFlag) {
      (countryBody['countryFlag_url'] = newCountry.flag)
      }
  
// check description:
   if(typeof newCountry.description === 'string' && newCountry.description !== '') {
   (countryBody['countryDescription'] = newCountry.description)
   }

  console.log(countryBody)
  await axios({
    method: 'post',
    url: 'http://localhost:5000/addcountry',   
    headers: {'Content-Type': 'application/json'},
    data: countryBody
  });
    setSpinner(false);  
    setResult("true");
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
setTimeout(fnc, 2000) 
}

const closeCanvas = () => {
  setShowCanvas(false);
  setResult("init");
  setMessage("")
}

const closeCanvas_AndReset = () => {

  const reset = {id: "",
  continent: "",
  name: "",
  hasFlag: false,  
  flag: "",  
  description: ""};

  setShowCanvas(false);
  setResult("init");
  setMessage("")
  setNewCountry(reset)
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
<option value="Eu">Europe</option>
<option value="Na">North America</option>
<option value="Sa">South America</option>
<option value="As">Asia</option>
<option value="Af">Middle East/Africa</option>
<option value="Oc">Oceania</option>
<option value="An">Antarctica</option>
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
   <p className="instructions">You can add a description below <b>(160 words max)</b>.</p>
   <textarea 
   id="description"
   name="description"
   value={newCountry.description}
   onChange={handleCountry}
   maxLength={160}
   rows={6} cols={50}>
   </textarea>
   <p style={{fontFamily: 'cursive, monospace, sans-serif', fontSize: '.9em'}} >{newCountry.description.length === 160 ? "no character remaining" : "characters remaining:"} <b className={Number(160 - newCountry.description.length) < 11 && Number(160 - newCountry.description.length) > 0 ? "text-danger" : Number(160 - newCountry.description.length) === 0 ? "d-none" : "text-success"}>{160 - newCountry.description.length}</b></p>
  </div>
 
  { ["true", "false"].indexOf(result) > -1 &&
  <Offcanvas show={showCanvas} onHide={result === "true" ? closeCanvas_AndReset : closeCanvas} placement="top">
        <Offcanvas.Header className="p-0" closeButton>
          <Offcanvas.Title className={`w-100 text-center p-2 text-${result === "false" ? "warning" : "light"} bg-${result === "true" ? "success" : "dark"}`} style={{letterSpacing: '2px'}}>{result === "true" ? "Success !" : "Failure !"}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className={[message].includes("System Message Error") ? "bg-dark text-danger border border-warning" : result === "false" && ![message].includes("System Message Error") ? "bg-dark text-warning border border-danger" : "bg-light text-success fw-bold border border-info"}>
        <br />
        <p>{message}</p>
        </Offcanvas.Body>
      </Offcanvas>
}

<Button 
variant="primary" 
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
{result === "true" ? "Country Submitted" : result === "false" ? "Not Submitted" : spinner ? 'Adding Country...' : 'Submit Country'}
{' '}
{["true", "false"].indexOf(result) > -1 && 
<FontAwesomeIcon className="text-warning" icon={faTriangleExclamation} />
}{''}
{ result === "true" &&
<FontAwesomeIcon className="text-success" icon={faSquareCheck} />
}
</Button>
</form>
</div>
</section>    
  )
  }

export default AddCountries;