import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import ModalDeletion from './ModalDeletion.jsx';
import NoImage from '../screenshot/no-image.512x512.png';
import Editpage from './Editpage.jsx';

function ProfileEdit({ cnt }) {

const [clickEdit, setClickEdit] = useState(false);
// const [hasSource, setHasSource] = useState(true);

// variables
const continents = [{id: "eu", name: "Europe"}, {id: "na", name: "North America"}, {id: "sa", name: "South America"}, {id: "af", name: "Middle East/Africa"}, {id: "as", name: "Asia"}, {id: "oc", name: "Oceania" }, {id: "an", name: "Antarctica"}];

// function

/*
const trueSource = () => {
  setHasSource("true");
}
*/

return(
  <React.Fragment>
  { !clickEdit && 
    <div id="countryProfile" key={cnt.country.countryId}>
    <div className="backgroundProfile">
        <h1 className='my-3'><span>{cnt.country.hasOwnProperty("countryFlag_url") ? <img src={cnt.country.countryFlag_url} alt={cnt.country.countryName} width="20" /> : <img src={NoImage} alt={'No Flag'} width="20" />}</span> Discover {cnt.country.countryName} <span>{cnt.country.hasOwnProperty("countryFlag_url") ? <img src={cnt.country.countryFlag_url} alt={cnt.country.countryName} width="20" /> : <img src={NoImage} alt={'No Flag'} width="20" />}</span></h1>
        <br />
        <div className="extraOptions">
        <div className="goBack_logo"><Link to="/"><FontAwesomeIcon icon={faArrowLeftLong} size="lg" style={{color: "#63E6BE",}} /></Link>{' '}<span style={{ color: '#63E6BE', fontWeight: '700', fontFamily: 'Courier New, Courier, monospace' }}>Go Back</span></div><br />
        <div id="btns">
<Button className="edit-btn" onClick={ () => setClickEdit(true) }>Edit Country</Button>
    <ModalDeletion cnt={cnt} />
    </div>
  </div>
  <br />
  <div className="countryContainer p-2">
  
  {
  cnt.country.hasOwnProperty("countryFlag_url") ?
  <section className="flagDetails">
    <figure>
    <img src={cnt.country.countryFlag_url} 
    alt={cnt.country.countryName} />
    <figcaption>{'Flag of ' + cnt.country.countryName}</figcaption>
    </figure>
  </section>
    :
    <section className="flagDetails">
    <figure>
    <img src={NoImage} alt={'country illustration unavailable'} />
    <figcaption>Flag is unknown</figcaption>
    </figure>
  </section>
  }

  <section className="descriptionDetails">
  <ul>
  <li>Country ID: <b>{cnt.country.countryId}</b></li>
  <li>Area: <b>{continents.filter((c) => c.id === cnt.country.continent.continentId.toLowerCase()).map((c) => c.name)[0] }</b></li>
  </ul>
  </section>
  </div>
  <article>
  <p>{cnt.country.hasOwnProperty("countryDescription") ? cnt.country.countryDescription : <i>-No description-</i>}</p>
  <br />
  </article>
  </div>
</div>
}

{
  clickEdit && < Editpage cnt={cnt} />
}

</React.Fragment>
    )
}

export default ProfileEdit;