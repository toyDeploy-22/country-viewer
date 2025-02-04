// component used for useparams and fto redirect properly to the country profile

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loaderpage from './Loaderpage.jsx';
import countrySchema from '../functions/countrySchema.js';
import ProfileEdit from './ProfileEdit.jsx';
import Pageerror from './Pageerror.jsx';
// import axios from 'axios';

function CountryProfile({ countries }) {

const [loader, setLoader] = useState(false);
const [countrySelected, setCountrySelected] = useState({...countrySchema});
const [errorStack, setErrorStack] = useState({ err: false, code: 0, title: '', msg: [''] });

let { country } = useParams();

useEffect(() => {
    function fetchCountry(arr, cnt) {
      try {
        setLoader(true);
        let userCountry = arr.filter((c) => c.country_name.toLowerCase() === cnt.toLowerCase());
        if(userCountry.length === 0) {
          const obj3 = { err: true, code: 404, title: 'No Country Found', msg: [`We did not find any country under the name '${cnt}'.`, "Please check the name or try to add the country."]}
          setLoader(false);
          setErrorStack(() => obj3);
        } else {
        const countryJson = userCountry[0];
        setCountrySelected(() => countryJson);
        setLoader(false);
      }} catch (err) {
        console.error(err);
        const obj4 = { err: true, code: 500, title: 'Internal Server Error', msg: ['An internal server error occured.', 'Please contact your administrator if the issue persists.']}
        setLoader(false);
        setErrorStack(() => obj4);
      }
    }
    fetchCountry(countries, country);
}, [])


return(
    <React.Fragment>
    {
    loader ? <Loaderpage />
    :
    !errorStack.err ? <ProfileEdit cnt = {{ country: countrySelected }} />
    :
    <Pageerror errStk={ errorStack } />
  }
</React.Fragment>
  )
}

export default CountryProfile;