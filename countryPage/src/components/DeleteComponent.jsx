
import React, { useState } from 'react';
import countrySchema from '../functions/countrySchema.js';
// import ModalDeleteCountry from './ModalDeleteCountry.jsx';
// import axios from 'axios';
import ModalDeleteCountry from './ModalDeleteCountry';
import Spinner from 'react-bootstrap/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlaneArrival } from '@fortawesome/free-solid-svg-icons';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import noImage from '../screenshot/no-image.512x512.png';
// import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function DeleteComponent ({ cnt }) {

  const [countryName, setCountryName] = useState({ countryInput: '' });
  const [selected, setSelected] = useState({ countryName: '', countryId: '' });
  const [loader, setLoader] = useState(false);
  const [results, setResults] = useState([{ ...countrySchema }]);
  const [errorStack, setErrorStack] = useState({ err: false, code: 0, title: '', msg: '' });
  const [fakeSource, setFakeSource] = useState(false);
  const [show, setShow] = useState(false);

  const navigate = useNavigate();
  const plc = "Enter country name or country ID";  
  const ttl = "Name should contain at least 2 letters";

  const handleCountryName = (e) => {
    /**
    const closeShow = {country: [{...countrySchema}], show: false}
    setClickDelete(closeShow);
    **/
    let { name, value } = e.target;
    let obj = { [name]: value };
    setCountryName(() => obj);
  }

  const submitCountryName = (e) => {
    e.preventDefault();
    try {
    setLoader(true);  
    let input = countryName.countryInput;
    if(input.length < 2 || input === '' ) { 
      const obj1 = {
        err: true,
        code: 401,
        title: 'Short Search Characters',
        msg: 'You need to type at least 2 characters in order to complete the search process.'
      }
      setErrorStack(obj1);
      setLoader(false)
    } else {
    // const url = "http://localhost:5000/countrysearch/name?countryname=" + input;
    // const findCountry = await axios.get(url)

    const inputCountry = cnt.filter((c) => c.countryName.toLowerCase().includes(input.toLowerCase()) || c.countryId.toUpperCase().includes(input.toUpperCase()));

    const findCountry = inputCountry.length === 0 ? [{ countryId: '0000', countryName: input, continentId: 0 }] : inputCountry;

    if(findCountry[0].countryId === '0000') {
      setLoader(false);
      const obj2 = {
	    err: true,
        code: 404, 
	    title: "No Country found", 
	    msg: `We cannot proceed to the deletion because there is no country name nor id with the name '${input}'. Please make sure that the name is correctly entered and try again.`
	  };

    setErrorStack(obj2)
        } else {
      const dataJson = findCountry;
      const obj3 = { err: false, code: 200, title: '', msg: '' };
      setErrorStack(() => obj3);
      setResults( dataJson );
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

  const wannaDelete = (name, id) => {
    setSelected(() => ({ countryName: name, countryId: id }));
    setShow(true)
  }

   /*
    const handleOpen = () => {
  
      setShow(true)
    }
    */
  
      const successAndRefresh = () => {
      setShow(false)
      window.location.reload(true);
      /** 
      This method takes an optional parameter which by default is set to false. If set to true, the browser will do a complete page refresh from the server and not from the cached version of the page. 
      **/
  
    }

   const handleClose = () => {
    setShow(false);
    navigate(-1);
    window.location.reload(true);
  }

/*
  const wannaDelete = (cnt) => {
    const item = {country: [cnt], show: true}
    setClickDelete(item);
    setTimeout(()=>console.log(clickDelete), 500)
  }
  */
    
return(
<React.Fragment>
<div id="deleteCountries">

<section id="searchNameContainer-2">
<form onSubmit={submitCountryName}>
<fieldset>
<legend><h2>Delete a Country</h2></legend>
</fieldset>

<div id="search-and-btn-2">
<input id="searchByName-2"
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

<section className="resultSection">
{
  loader &&
<div className="loading">
<Spinner animation="border" variant="warning" />
<h2>Looking for the country to be deleted...<FontAwesomeIcon icon={faPlaneArrival} /></h2>
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
    <div id="countriesFound-2" className="p-1 p-md-3">
    <div className={`countriesList ps-1 ${ results.length >= 2 ? "col-md-2" : "" }`}>
    <h3 className="countries-results-nb"><span className='nb'>{results.length}</span> { results.length > 1 ? 'Countries' : 'Country' } Found:</h3>
    <br />
    {
    results.map((countries, _ind) =>
          <div id="countryList-container-2" className="mb-2" key={countries.countryId + _ind}>
          <p><span>{_ind + 1}</span></p>
          <span className="p-2">{' '}</span>
          <Link to={"/country/" + countries.countryName} className="link" target='_blank'>
          <p>{countries.countryName}</p>
          </Link>
          <span className="p-2">{' '}</span>
          <Link to={"/country/" + countries.countryName} className="image" target='_blank'>
          <img onError={()=>setFakeSource(true)} src={fakeSource ? noImage : countries.countryFlag_url} alt={fakeSource ? "Unknown Flag" : countries.countryName} />
          </Link>
          <span className="p-2">{' '}</span>
          <FontAwesomeIcon className="trashIcon" onClick={() => wannaDelete(countries.countryName, countries.countryId)} icon={faTrashCan} />
          </div>
        )}
        </div>
        </div>
    }
    
    {
      errorStack.code >= 400 && <div className="countryNotFound-2 p-2">
      <div className="errorContainer-notFound">
      <h2 className="Oops-title mb-2">{errorStack.code === 404 ? "Where is it ?" : "Ooops"}</h2>
      <h5 className="errorContainer-title"><span>{errorStack.title}</span>{' '}{errorStack.code === 404 ? <FontAwesomeIcon icon={faGlobe} /> : <FontAwesomeIcon icon={faTriangleExclamation} />}</h5>
      <br />
      <p className="errorContainer-text">{errorStack.msg}</p>
      </div></div>
    }

</section>    
</section>
</div> 
<ModalDeleteCountry propShow={show} propHide={handleClose} propHideRefresh={successAndRefresh} arr={cnt} country={selected} />
</React.Fragment>   
  )
}

export default DeleteComponent;