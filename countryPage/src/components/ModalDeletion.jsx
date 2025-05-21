// subcomponent
import React, { useState } from 'react';
import { deletion } from '../functions/editionDeletion.js';
import Spinner from 'react-bootstrap/Spinner'; 
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ModalDeletion({ cnt }) {

// Hooks
const [show, setShow] = useState(false);
const [spinner, setSpinner] = useState(false);
const [result, setResult] = useState("init");
const [message, setMessage] = useState("");

const handleDelete = async() => {
// setShow(false);
// function and spinner
try {
setSpinner(true);
const deletor = await deletion(cnt.country.countryId); // Full object

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
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  /*
  const handleLeave = () => {
    setShow(false);
    location.href = ""
  }
*/
  return (
    <React.Fragment>
      <Button className="delete-btn" onClick={handleShow}>
        Delete Country
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header className={result === "init" ? "bg-light" : result === "true" ? "bg-success text-light" : "bg-danger text-light"} closeButton>
        {result === "init" && <Modal.Title>Delete country</Modal.Title>}
        {result === "true" && <Modal.Title>Deletion Successful</Modal.Title>}
        {result === "false" && <Modal.Title>Deletion failed</Modal.Title>}
        </Modal.Header>
        <Modal.Body>
        { result === "init" &&
        <p>Are you sure you want to delete {cnt.country.countryName} country ?</p>
        }
        <div id="buttons_container">
        { result === "init" && 
        <Button variant="primary" className='m-1' onClick={handleDelete} >
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
          {spinner === true ? "Deleting..." : "Yes"}
          </Button>
          }
         
          { result === "false" && 
          <Button variant="dark" className='m-1' onClick={handleDelete}>
            Try again
        </Button>
          }
         
          { result === "init" || result === "true" ?
        <Button variant="secondary" className='m-1' onClick={handleClose}>
            Close
        </Button>
          :
          null
          }
        </div>
        { result === "true" &&
        <Badge bg="success">Deletion of {cnt.country.countryName} complete.</Badge>
        }
        { result === "false" &&
        <Badge bg="danger">The deletion of {cnt.country.countryName} country not complete.</Badge>
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

export default ModalDeletion;