// subcomponent
import React, { useState } from 'react';
// import DeleteCountry from './DeleteCountry.jsx';
// import deleteCountry from '../functions/deleteCountry';
import { deletion } from '../functions/editionDeletion';
import Spinner from 'react-bootstrap/Spinner'; 
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

// after deletion the search and results still appear, style Country not found message (there is no background)

function ModalDeleteCountry({ arr, country, propShow, propHide, propHideRefresh }) {

// Hooks
// const [show, setShow] = useState(propShow);
const [spinner, setSpinner] = useState(false);
const [result, setResult] = useState("init");
const [message, setMessage] = useState("");

async function handleDelete() {
// setShow(false);
// function and spinner
const deletor = async() => {
try {
// const deletor = await deleteCountry(arr, country); // Full object

const deletor = await deletion(country.countryId);

if(deletor.ok) {

setResult("true");
setSpinner(false);
setMessage(`${cnt.country.countryName} country has been successfully deleted from the database.`)

  } else {
setResult("false");
setSpinner(false);
setMessage(() => deletor.code === 404 ? `The deletion of the country ${cnt.country.countryName} failed because the country has not been found. This may occur because the country has been already deleted.` : "The deletion failed because something did not went well this time...Please try again")
  }

} catch(err) {
  setSpinner(false); 
  console.error(err);
  setResult("false");
  setMessage("An error occured during deletion. Please contact your administrator.")
  }
};
 setSpinner(true);
 setTimeout(deletor, 2000)
};

  return (
    <React.Fragment>
      <Modal show={propShow} onHide={result === "true" ? propHideRefresh : propHide} id="modaldelCo" className="text-center">
        <Modal.Header className={result === "init" ? "bg-light" : result === "true" ? "bg-success text-light" : "bg-danger text-light"} closeButton>
        {result === "init" && <Modal.Title>Delete country</Modal.Title>}
        {result === "true" && <Modal.Title>Deletion Successful</Modal.Title>}
        {result === "false" && <Modal.Title>Deletion failed</Modal.Title>}
        </Modal.Header>
        <Modal.Body>
        { result === "init" &&
        <p>Are you sure you want to delete {country.countryName} country ?</p>
        }
        <div id="buttons_container_2">
        { result === "init" && 
        <Button variant="primary" className='m-1' onClick={() => handleDelete(arr, country)} >
        { spinner === true &&
        <Spinner
          as="span"
          variant="warning"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
          />
          }
          {spinner === true ? " Deleting..." : "Yes"}
          </Button>
          }
         
          { result === "false" && 
          <Button variant="dark" className='m-1' onClick={() => handleDelete(arr, country)}>
            Try again
        </Button>
          }
         
          { result === "init" &&
        <Button variant="secondary" className='m-1' onClick={propHide}>
            Close
        </Button>
          }

          {
            result === "true" && 
          <Button variant="success" className='m-1' onClick={propHideRefresh}>
            Finish
          </Button>
          }
        </div>
        { result === "true" &&
        <Badge bg="success">Deletion of {country.countryName} complete.</Badge>
        }
        { result === "false" &&
        <Badge bg="danger">The deletion of {country.countryName} country failed.</Badge>
        }
        </Modal.Body>
        <Modal.Footer>
        {
        result !== "init" &&
        <p className={result === true ? "fst-italic text-success" : "fst-italic text-secondary"}>
        {message}
        </p>
        }
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}

export default ModalDeleteCountry;