
import React, { useState } from 'react';
import countrySchema from '../functions/countrySchema.js';
// import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import noImage from '../screenshot/no-image.512x512.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faJetFighter } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

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
  const [suggest, setSuggest] = useState([{ ...countrySchema }]);
  const [errorStack, setErrorStack] = useState({ err: false, code: 0, title: '', msg: '' });
  const [fakeSource, setFakeSource] = useState(false);
  const [showMsg, setShowMsg] = useState(true);

  const plc = "Enter country name";  
  const ttl = "Name should contain at least 3 letters";

  const handleCountryName = (e) => {
    setShowMsg(false);
    let { name, value } = e.target;
    let obj = { [name]: value };
    setCountryName(() => obj);
  }

  const submitCountryName = (e) => {
    e.preventDefault();
    setShowMsg(true);
    try {
    setLoader(true);  
    let input = countryName.countryInput;
    if(input.length < 3 || input === '' ) {
      setLoader(false); 
      const obj1 = {
        err: true,
        code: 401,
        title: 'Short Search Characters',
        msg: 'You need to type at least 3 characters in order to complete the search process.'
      }
      setErrorStack(obj1);
    } else {
    // const url = "http://localhost:5000/countrysearch/name?countryname=" + input;
    // const findCountry = await axios.get(url);
    const continents = [1, 2, 3, 4, 5];
    let indexContinent = Math.ceil(Math.random() * continents.length);

    const inputCountry = countries.filter((c) => c.country_name.toLowerCase().includes(input.toLowerCase()));
    
    const findCountry = inputCountry.length === 0 ? [{ country_id: '0000', country_name: input, continent_id: continents[indexContinent === 0 ? indexContinent : indexContinent - 1] }] : inputCountry;

    const suggestion = countries.filter((c) => c.continent_id === findCountry[0].continent_id).filter((c) => c.country_name !== findCountry[0].country_name);

    let index = Math.ceil(Math.random() * suggestion.length);
    let index_2 = Math.ceil(Math.random() * countries.length); 

    let suggestedCountry = suggestion.length > 1 ? suggestion[index === 0 ? index : index - 1] : countries[index_2 === 0 ? index_2 : index_2 - 1];

    if(findCountry[0].country_id === '0000') {
      setLoader(false);
      const obj2 = {
	    error: true,
      code: 404, 
	    title: "No Country found", 
	    msg: "We didn't find any country with the query you have typed. Please try to add the country in the 'Add a Country' section."
	  };

    setSuggest(() => [suggestedCountry]);
    setErrorStack(obj2)
        } else {
      const dataJson = findCountry[0];
      const obj3 = { err: false, code: 200, title: '', msg: '' };
      setErrorStack(() => obj3);
      setResults([ dataJson ]);
      setSuggest(() => [suggestedCountry]);
      setLoader(false);
      }
    }
    } catch(err) {
      setLoader(false);
      const obj4 = {
        err: true,
        code: 500,
        title: 'Internal Server Error',
        msg: 'An Internal Server Error occured. Please try to contact the network administrator if it still persists.'
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

<section className={`resultSection ${!showMsg ? "d-none" : "col-md-2"}`}>
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
    <div className={`countriesList ps-1 ${ results.length >= 2 ? "col-md-2" : "" }`}>
    <h3 className="countries-results-nb"><span>{results.length}</span> { results.length > 1 ? 'Countries' : 'Country' } Found:</h3>
    {
    results.map((countries, _ind) =>
          <div id="countryList-container" key={countries.country_id + _ind}>
          <Link to={"/country/" + countries.country_name} target='_blank'>
          <img onError={()=>setFakeSource(true)} src={fakeSource ? noImage : countries.country_flag} alt={fakeSource ? "Unknown Flag" : countries.country_name} />
          <p>{countries.country_name}</p>
          </Link>
          </div>
        )}
        </div>
        <div className="country-suggestion me-2">
        <h6>A country that might interest:</h6>
        <figure>
        <Link className="countryFound-link" to={"/country/" + suggest[0].country_name} target='_blank'>
        <img src={suggest[0].country_flag} alt={suggest[0].country_name} />
        <figcaption><Button variant="">Visit country</Button></figcaption>
        </Link>
        </figure>
        </div>
        </div>
    }
    
    {
      errorStack.code >= 400 && <div className="countryNotFound p-2">
      <div className="errorContainer-notFound">
      <h2 className="Oops-title mb-2">{errorStack.code === 404 ? "The World is large, but..." : "Ooops"}</h2>
      <h5><span>{errorStack.title}</span>{' '}{errorStack.code === 404 ? <FontAwesomeIcon icon={faGlobe} /> : <FontAwesomeIcon icon={faTriangleExclamation} />}</h5>
      <br />
      <p>{errorStack.msg}</p>
      </div>
      <div className="country-suggestion">
        <h6>A country that might interest:</h6>
        <figure>
        <Link className="countryFound-link" to={"/country/" + suggest[0].country_name} target='_blank'>
        <img src={suggest[0].country_flag} alt={suggest[0].country_name} />
        <figcaption><Button variant="">Visit country</Button></figcaption>
        </Link>
        </figure>
        </div>
      </div>

    }
</section>    
</section>
</div>    
  )
}

export default SearchCountry