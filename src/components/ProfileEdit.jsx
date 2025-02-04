import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ModalDeletion from './ModalDeletion.jsx';
import NoImage from '../screenshot/no-image.512x512.png';
import Editpage from './Editpage.jsx';

function ProfileEdit({ cnt }) {

const [clickEdit, setClickEdit] = useState(false);
const [hasSource, setHasSource] = useState(true);

// function
const fakeSource = () => {
  setHasSource(false);
}

/*
const trueSource = () => {
  setHasSource("true");
}
*/

return(
  <React.Fragment>
  { !clickEdit && 
    <div id="countryProfile" key={cnt.country.country_id}>
    <div className="backgroundProfile">
        <h1>Discover {cnt.country.country_name} <span>{cnt.country.country_flag ? <img onError={fakeSource} src={!hasSource ? NoImage : cnt.country.country_flag} alt={!hasSource ? 'No Flag' : cnt.country.country_name} width="20" /> : <img src={NoImage} alt={'No Flag'} width="20" />}</span></h1>
        <br />
        <div className="extraOptions">
<Button className="edit-btn" onClick={ () => setClickEdit(true) }>Edit Country</Button>
    <ModalDeletion cnt={cnt} />
  </div>
  <br />
  <div className="countryContainer p-2">
  
  {
  cnt.country.country_flag ?
  <section className="flagDetails">
    <figure>
    <img onError={fakeSource} src={!hasSource ? NoImage : cnt.country.country_flag} alt={!hasSource ? 'No Flag' : cnt.country.country_name} />
    <figcaption>{!hasSource ? 'Flag is unknown' : 'Flag of ' + cnt.country.country_name}</figcaption>
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
  <li>ID: <b>{cnt.country.country_id}</b></li>
  <li>Area: <b>{cnt.country.continent_id === 1 ? 'Europe' : cnt.country.continent_id === 2 ? 'America' : cnt.country.continent_id === 3 ? 'Asia' : cnt.country.continent_id === 4 ? 'Africa-Middle East': 'Oceania' }</b></li>
  </ul>
  </section>
  </div>
  <article>
  <p>{cnt.country.country_description ? cnt.country.country_description : <i>-No description-</i>}</p>
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