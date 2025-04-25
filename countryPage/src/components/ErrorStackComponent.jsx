
import noImage from '../screenshot/no-image.512x512.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
// import { faJetFighter } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

function ErrorStackComponent({ stack, sug }) {
return(
<>
{stack.code === 404 ? 
<div id="countryNotFound" className="p-2 mt-3">
      <div className="errorContainer-notFound p-2">
      <h2 className="Oops-title p-2 mb-2">{"The World is large, but..."}</h2>
      <h5><span>{stack.title}</span>{' '}<FontAwesomeIcon icon={faGlobe} /></h5>
      <br />
      <p>{stack.msg}</p>
      </div>
      <div className="country-suggestion py-2">
        <h6>A country that might interest:</h6>
        <figure className="py-4">
        <Link className="countryFound-link" to={"/country/" + sug.countryName} target='_blank'>
        <img src={sug.hasOwnProperty('countryFlag_url') ? sug.countryFlag_url : noImage} alt={sug.hasOwnProperty('countryFlag_url') ? sug.countryName : "No Image Available"} />
        <figcaption><Button className="text-light" variant="">Visit country</Button></figcaption>
        </Link>
        </figure>
        </div>
      </div>
	
	:

<div id="countryNotFound" className="p-2 mt-3">
      <div className="errorContainer-notFound p-2">
      <h2 className="Oops-title p-2 mb-2">{"Ooops..."}</h2>
      <h5><span>{stack.title}</span>{' '}<FontAwesomeIcon icon={faTriangleExclamation} /></h5>
      <br />
      <p>{stack.msg}</p>
      </div>
	{ stack.code !== 401 && 
      <div className="country-suggestion py-2">
        <h6>{"A country that might interest:"}</h6>
        <figure className="py-4">
        <Link className="countryFound-link" to={"/country/" + sug.countryName} target='_blank'>
        <img src={sug.hasOwnProperty('countryFlag_url') ? sug.countryFlag_url : noImage} alt={sug.hasOwnProperty('countryFlag_url') ? sug.countryName : "No Image Available"} />
        <figcaption><Button className="text-light" variant="">Visit country</Button></figcaption>
        </Link>
        </figure>
        </div>
	}
      </div>}
</>)
}

export default ErrorStackComponent;