
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import randomFlags from '../functions/randomFlag.js';
import ExtraCountries from './ExtraCountries.jsx';
import NoImage from '../screenshot/no-image.512x512.png';
import Loaderpage from './Loaderpage.jsx';
import Pageerror from './Pageerror.jsx';

function MainCountries({ countries }) {

const [countriesSet, setCountriesSet] = useState([{ country_id: '', country_name: '', country_description: '', country_flag: '' }]);
const [status, setStatus] = useState(0);
const [hasSource, setHasSource] = useState(true);

const {all} = countries;
const errorStack = { err: true, code: 404, title: 'No Country Available', msg: ['Cannot display countries.', 'Please try to refresh the page.'] };

const errorImg = () => {
  setHasSource(false)
}

useEffect(() => {

async function launchCountries() {

  try {
    
    const data = await all;

    const countryFlagsOk = await data.filter((c)=>typeof c.country_flag !== 'undefined' && c.country_flag !== '');

    const newCountries = randomFlags(countryFlagsOk, 18);

    if(newCountries.code === 200) {
    // console.log(newCountries.length);
    setStatus(200);
    setCountriesSet(newCountries.finalArr);
      } else {
        setStatus(400);
      }
      console.log({status: status})
    } catch(err) {
      setStatus(500);
      console.error({
        status: 500,
        message: err.message
        });
    }
  }
  launchCountries();
}, [all, status]);

return(
  <React.Fragment>
  {
    status === 0 ? 
    <Loaderpage />
    :
    <>
    {status === 200 && 
    <div className="countryContainer">
        <section id="mainCountries">
        <h3 className='mainCountries-title'>Countries</h3> 
      <div id="allCountries">      
      {
        countriesSet.map(
          (country, _ind)=>
          <div className="countryContainer-block" key={country.country_id + _ind}>
          <img 
          onError={()=>errorImg} src={!hasSource ? NoImage : country.country_flag} alt={!hasSource ? 'No Flag' : country.country_name} ></img>
          {/*<img /> gives error contrary to <img></img>*/}
          <Button variant="secondary" className="w-75 p-1 mt-1"><Link className="Link fw-bold text-light text-decoration-none" to={`/country/${country.country_name}`}>{country.country_name}</Link></Button>
          </div>            
        )
      }
      </div>
      </section>
      <ExtraCountries countries={{ ...countries }} />
      </div>
      }
      {
        [400, 500].indexOf(status) > -1 &&
        <Pageerror errStk={ errorStack } />
      }
      </>
      }
  </React.Fragment>
)

}

export default MainCountries