
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import randomFlags from '../functions/randomFlag.js';
import ExtraCountries from './ExtraCountries.jsx';
import NoImage from '../screenshot/no-image.512x512.png';
import Pageerror from './Pageerror.jsx';

function MainCountries({ countries }) {

const [countriesSet, setCountriesSet] = useState([{ country_id: '', country_name: '', country_description: '', country_flag: '' }]);
const [hasSource, setHasSource] = useState(true);
const errorStack = { err: true, code: 404, title: 'No Country to Display', msg: ['No Country Available.', 'Please try to refresh the page.'] };

const errorImg = () => {
  setHasSource(false)
}

useEffect(() => {
const countryFlagsOk = countries.all.filter((c)=>typeof c.country_flag !== 'undefined' && c.country_flag !== '');
const newCountries = randomFlags(countryFlagsOk, 18);
console.log(newCountries.length);
setCountriesSet(()=>newCountries);
}, []);

return(
  <React.Fragment>
  {
    countriesSet.length > 0 ? 
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
      :
      <Pageerror errStk={ errorStack } />
      }
  </React.Fragment>
)

}

export default MainCountries