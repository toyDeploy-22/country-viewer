
import React, { useState } from 'react';
import countrySchema from '../functions/countrySchema.js';
// import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import noImage from '../screenshot/no-image.512x512.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
// import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
// import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faJetFighter } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import ErrorStackComponent from './ErrorStackComponent.jsx';

/*
Suppose we pass countries.all through props in app.js

<Router>
<Routes>
<Route path='searchCountries' element={<searchCountries countries={{all: allCountries, loading: spinner, result: result }}/>}/>
</Routes>
</Router>
*/

function SearchCountry({ countries }) {

  const [countryName, setCountryName] = useState({ countryInput: '' });
  const [loader, setLoader] = useState(false);
  const [results, setResults] = useState([{ ...countrySchema }]);
  const [suggest, setSuggest] = useState({ ...countrySchema });
  const [errorStack, setErrorStack] = useState({ err: false, code: 0, title: '', msg: '' });
  const [fakeSource, setFakeSource] = useState(false);
  const [showMsg, setShowMsg] = useState(true);

  const plc = "Enter country name or country ID";  
  const ttl = "Name should contain at least 2 letters";

  const handleCountryName = (e) => {
    setShowMsg(false);
    let { name, value } = e.target;
    let obj = { [name]: value };
    setCountryName(obj);
  }

  const submitCountryName = (e) => {
    e.preventDefault();
    setLoader(true);
    setShowMsg(true);
    try {  
    let input = countryName.countryInput;
    if(input.length < 2 || input === '' ) {
      setLoader(false); 
      const obj1 = {
        err: true,
        code: 401,
        title: 'Short Search Characters',
        msg: "You need to type at least 2 characters in order to complete the search process. If you don't know the country ID, just type the first or last letters of the country name you are looking for."
      }
      setErrorStack(obj1);
      
    } else {
    // const url = "http://localhost:5000/countrysearch/name?countryname=" + input;
    // const findCountry = await axios.get(url);
    const continents = ["NA", "SA", "EU", "AF", "AS", "OC", "AN"];
   
     const getContinent = () => { 
     const randomizer = Math.ceil(Math.random() * continents.length);
     const randomContinent = continents[randomizer === 0 ? randomizer : randomizer - 1];
     return randomContinent 
    }

    let indexContinent = getContinent();

    const inputCountry = countries.filter((c) => c.countryName.toLowerCase().includes(countryName.countryInput.toLowerCase()) || c.countryId.toLowerCase().includes(countryName.countryInput.toLowerCase()));
    
    const findCountry = inputCountry.length === 0 ? [{ notFound: true, countryId: "", countryName: "", continent: {continentId: indexContinent} }] : inputCountry.map((cnt) => cnt);

    const suggestion = countries.filter((c) => c.continent.continentId === findCountry[0].continent.continentId).filter((c) => c.countryName !== findCountry[0].countryName);

    let index = Math.ceil(Math.random() * suggestion.length);
    let index_2 = Math.ceil(Math.random() * countries.length); 

    let suggestedCountry = suggestion.length > 1 ? suggestion[index === 0 ? index : index - 1] : countries[index_2 === 0 ? index_2 : index_2 - 1];

    if(findCountry[0].hasOwnProperty('notFound')) {
      setLoader(false);
      const obj2 = {
	    error: true,
      code: 404, 
	    title: "No Country found", 
	    msg: "We didn't find any country with the query you have typed. Please try to add the country in the 'Add a Country' section."
	  };

    setSuggest(suggestedCountry);
    setErrorStack(obj2)
        } else {
      const dataJson = findCountry;
      const obj3 = { err: false, code: 200, title: '', msg: '' };
      setErrorStack(obj3);
      setResults( dataJson );
      setSuggest(suggestedCountry);
      setLoader(false);
      }
    }
    } catch(err) {
      setLoader(false);
      const obj4 = {
        err: true,
        code: 500,
        title: 'Internal Server Error',
        msg: 'An Internal Server Error occured. Please contact the network administrator if this error persists.'
      };
      console.error(err);
      setErrorStack(obj4);
    }
  }
    
return(
<div id="searchCountries">

<section id="searchNameContainer">
<form onSubmit={submitCountryName}>
<fieldset>
<legend><h2>Search a Country</h2></legend>
</fieldset>

<div id="search-and-btn">
<input id="searchByName"
className="text-dark" 
type="text" placeholder={plc} 
name="countryInput"
value={countryName.countryInput}
onChange={handleCountryName}
/>
<br />
<button type="submit">Search</button>
</div>
{countryName.countryInput === '' && <p className="indication-letters"><small>{ttl}</small></p>}
</form>

<section className={`resultSection my-2 ${!showMsg ? "d-none" : "col-md-2"}`}>
{
  loader &&
<div className="loading">
<Spinner animation="border" variant="info" />
<h2 className="text-primary">Searching for results... {' '}<FontAwesomeIcon icon={faJetFighter} /></h2>
</div>
}

{
  countryName.countryInput === "" && errorStack.code === 0 &&
  <div className="countriesResultsInit">
  <p><FontAwesomeIcon icon={faArrowDown} />{' '}<small>Countries results will appear below</small>{' '}<FontAwesomeIcon icon={faArrowDown} /></p>
  </div>
}

{ 
  errorStack.code === 200 &&                      
    <div id="countriesFound" className="p-1 p-md-3">
    <div className={`countriesList py-2 ps-1 ${ results.length >= 2 ? "col-md-2" : "" }`}>
    <h3 className="countries-results-nb"><span>{results.length}</span> { results.length > 1 ? 'Countries' : 'Country' } Found:</h3>
    {
    results.map((countries, _ind) =>
          <div id="countryList-container" key={countries.countryId + _ind}>
          <Link to={"/country/" + countries.countryName} target='_blank'>
          <img onError={()=>setFakeSource(true)} src={fakeSource ? noImage : countries.countryFlag_url} alt={fakeSource ? "Unknown Flag" : countries.countryName} />
          <p>{countries.countryName}</p>
          </Link>
          </div>
        )}
        </div>
        <div className="country-suggestion me-2">
        <h6>A country that might interest:</h6>
        <figure>
        <Link className="countryFound-link" to={"/country/" + suggest.countryName} target='_blank'>
        <img src={suggest.hasOwnProperty("countryFlag_url") ? suggest.countryFlag_url : noImage} alt={suggest.hasOwnProperty("countryFlag_url") ? suggest.countryName : "No Image Available"} />
        <figcaption><Button variant="success">Visit country</Button></figcaption>
        </Link>
        </figure>
        </div>
        </div>
    }
    
    {
      errorStack.code >= 400 && <ErrorStackComponent stack={errorStack} sug={suggest} />
    }
</section>    
</section>
</div>    
  )
}

export default SearchCountry