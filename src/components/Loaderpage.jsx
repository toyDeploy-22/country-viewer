import Spinner from "react-bootstrap/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlaneDeparture } from "@fortawesome/free-solid-svg-icons";

function Loaderpage() {

return(
    <div id="loaderPage" >
    <br />
    <h1>Please Wait...{'  '} <Spinner animation="grow" /></h1> 
    <br />
    <p>We are looking for the country details... {'  '} <FontAwesomeIcon icon={faPlaneDeparture} className="fa-xl" /></p>    
    </div>
    )
}

export default Loaderpage;