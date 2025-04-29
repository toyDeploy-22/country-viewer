
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import countrySchema from '../functions/countrySchema.js';
import Button from 'react-bootstrap/Button';
import randomFlags from '../functions/randomFlag.js';
import ExtraCountries from './ExtraCountries.jsx';
import NoImage from '../screenshot/no-image.512x512.png';
import Loaderpage from './Loaderpage.jsx';
import Pageerror from './Pageerror.jsx';

function MainCountries({ countries }) {

const [countriesSet, setCountriesSet] = useState([{ ...countrySchema }]);
const [status, setStatus] = useState(0);
const [hasSource, setHasSource] = useState(true);

const errorStack = { err: true, code: 404, title: 'No Country Available', msg: ['Cannot display countries.', 'Please try to refresh the page.'] };

const errorImg = () => {
  setHasSource(false)
}

useEffect(() => {

async function launchCountries() {

  try {
    
    const data = await countries.all;

    const countryFlagsOk = await data.filter((c)=> c.hasOwnProperty('countryFlag_url') && c.countryFlag_url.length >= 4);

    const newCountries = randomFlags(countryFlagsOk, 18);

    if(newCountries.code === 200) {
    // console.log(newCountries.length);
    setStatus(200);
    setCountriesSet(newCountries.finalArr);
      } else {
        setStatus(400);
      }
      console.log(newCountries)
    } catch(err) {
      setStatus(500);
      console.error({
        status: 500,
        message: err.message
        });
    }
  }
  launchCountries();
}, [countries, status]);

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
          <div className="countryContainer-block" key={country.countryId + _ind}>
          <img 
          onError={()=>errorImg} src={!hasSource ? NoImage : country.countryFlag_url} alt={!hasSource ? 'No Flag' : country.countryName} ></img>
          {/*<img /> gives error contrary to <img></img>*/}
          <Button variant="secondary" className="w-75 p-1 mt-1"><Link className="Link fw-bold text-light text-decoration-none" to={`/country/${country.countryName}`}>{country.countryName}</Link></Button>
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