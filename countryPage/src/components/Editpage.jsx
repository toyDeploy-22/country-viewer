
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import CloseButton from 'react-bootstrap/CloseButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import { editChecker, editCountries } from '../functions/editCountries.js';

function Editpage({ cnt }) {

// states
const [loader, setLoader] = useState(false);
const [editable, setEditable] = useState({ countryName: cnt.country.countryName, countryId: cnt.country.countryId, continentId: cnt.country.continent.continentId, countryFlag_url: cnt.country.countryFlag_url || '', countryDescription: cnt.country.countryDescription || '' });
const [wannaEdit, setWannaEdit] = useState({ hasFlag: true, hasDescription: true });
const [modalShow, setModalShow] = useState(false);
// const [modalResult, setModalResult] = useState({ err: false, code: 0, title: '', msg: '' });
const [errorStack, setErrorStack] = useState({
  err: false,
  code: 0,
  title: '',
  msg: ''
});

// functions
const handleCountry = (e) => {
let {name, value} = e.target;
let editObject = { ...editable, [name]: value };
setEditable(() => editObject)
}

const handleWannaEdit = (e) => {
  let { name, checked } = e.target;
  const obj = {...wannaEdit, [name]: checked};
  setWannaEdit(() => obj)
}

const cancelediting = () => {
  const initialEdition = { countryName: cnt.country.countryName, countryId: cnt.country.countryId, continentId: cnt.country.continent.continentId, countryFlag_url: cnt.country.countryFlag_url || '', countryDescription: cnt.country.countryDescription || '' };
  setEditable(() => initialEdition);
}

const confirmEdit = (e) => {
  e.preventDefault();
  setModalShow(true);
}

const submitCountry = async(e) => {
  e.preventDefault();
  setModalShow(false);
  try {

    setLoader(true);
    const newEditable = {...editable, ...wannaEdit};
    const checker = editChecker("PATCH", cnt, newEditable);

    if(checker.err) {
      setErrorStack(checker);
      setLoader(false);
    } else {
      const submitter = await editCountries(newEditable);

      setErrorStack(submitter);
      setLoader(false);
      // window.location.reload(); to refresh page
      alert("The country has been successfully modified !");
    }
  } catch(err) { 
    console.error(err);
    const obj4 = {
      err: true,
      code: 500,
      title: 'Internal Server Error',
      msg: ['An error occured.', 'Please contact your administrator if the issue persists.']
    };
    setErrorStack(() => obj4);
    setLoader(false); 
     }
}

const cancelShow = () => {
  const initialError = {
  err: false,
  code: 0,
  title: '',
  msg: ''};
  setErrorStack(() => initialError)
}

return (
  <React.Fragment>
  <div id="editCountry-container">
          <form>
            <h1>Edit {cnt.country.countryName} Country</h1>
            <br />
          <div className="ids">
            <section className="ids-section">
              <label htmlFor="continent_id">
                Continent ID<span className="req">{'*'}</span>
              </label>
              <br />
              <select id="continent_id" className="continent_id-selection" name="continent_id" autoComplete="on" disabled>
                {
                  [{name: "North America", id: "NA"}, {name: "South America", id: "SA"}, {name: "Europe", id: "EU"}, {name: "Middle-East/Africa", id: "AF"}, {name: "Asia", id: "AS"}, {name: "Oceania", id: "OC"}, {name: "Antarctica", id: "AN"}].filter((c) => c.id === cnt.country.continent.continentId.toUpperCase()).map((c)=><option key="continentId" value={c.name}>{c.name}</option>)
                }
              </select>
            </section>
<p id="country_id-zone"><small>The continent ID of this country is <span>{cnt.country.continent.continentId}</span></small></p>
            <section className="ids-section">
              <label htmlFor="country_id">
                Country ID<span className="req">*</span>
              </label>
              <br />
              <input id="country_id" type="text" className="edit-readOnly" value={cnt.country.countryId} autoComplete="off" name="countryId" required disabled />
            </section>
          </div>
            <br />
            <div className="other-ids">
            <label htmlFor="country_name">
              Country Name<span className="req">*</span>
            </label>
            <input id="country_name" type="text" className="edit-readOnly text-center" autoComplete="on" name="countryName" value={Object.entries(cnt.country).filter((obj)=>obj[0] === 'countryName')[0].map((p)=>p)[1].substring(0,25)} disabled />
            
          <p className="editcountry-note"><small><b>Note: </b> The country name, country ID and continent ID are not editable.</small></p>
          <hr /><br />

            <label htmlFor="has_countryFlag" style={{letterSpacing: '3px'}}>
            Flag
            </label>
            <br />
            <Form.Check // prettier-ignore
            defaultChecked
            type="switch"
            id="has_countryFlag"
            name="hasFlag"
            onChange={handleWannaEdit}
            label={wannaEdit.hasFlag ? "I want to add a Flag" : "No Flag for now"}
            />
            { wannaEdit.hasFlag &&
            <input type="text" className="mb-2 input_edition" id="country_flag" placeholder={cnt.country.hasOwnProperty("countryFlag_url") ? cnt.country.countryFlag_url : "ex: https://www.image.com"} autoComplete="on" name="countryFlag_url" value={editable.countryFlag_url} onChange={handleCountry} />
            }
            
            <p className="fw-light fst-italic"><FontAwesomeIcon icon={faExclamation} size="sm" style={{color: "#FFD43B",}} /><small>{"("}<b>Note:</b>{ wannaEdit.hasFlag ? " You can add a Flag to your country. Leave this above field if you already have a Flag Link and do not want to change it)." : " No country Flag will be assigned to your country)."}</small></p>
            <br />
        
            <label htmlFor="countryDescription" style={{letterSpacing: '3px'}}>
            Description
            </label>
            <br />
            <Form.Check // prettier-ignore
            defaultChecked
            type="switch"
            id="countryDescription"
            name="hasDescription"
            onChange={handleWannaEdit}
            label={wannaEdit.hasDescription ? "Add a Description" : "No Description for now"}
            />
            <p className="fw-light fst-italic"><FontAwesomeIcon icon={faExclamation} size="sm" style={{color: "#FFD43B",}} /><small><b>Note{": "}</b>{wannaEdit.hasDescription ? "Add a text below to your country." : "No text will be added to your country."}</small></p>

            {
            wannaEdit.hasDescription &&
            <textarea className="text-light" cols="6" rows="5" placeholder={cnt.country.hasOwnProperty("countryDescription") ? cnt.country.countryDescription : "This country has no description yet..."} name="countryDescription" value={editable.countryDescription} onChange={handleCountry} maxLength={160}></textarea>
            }
            
            { wannaEdit.hasDescription &&
            
            <p className="my-2"><small>Characters Left: <b>{editable.countryDescription === '' ? "160" : editable.countryDescription.length === 160 ? "No character left" : 160 - (editable.countryDescription.length)}</b></small></p>
            }

            {/*typeof editable.countryDescription !== 'undefined' && editable.countryDescription.length > 0 ? <p className="text-light fst-italic">Characters left: <small className={`text-${editable.countryDescription.length >= 80 && editable.countryDescription.length < 150 ? "primary" : editable.countryDescription.length >= 150 ? "danger" : "light" }`}>{Number(160 - editable.countryDescription.length)}</small></p> : null*/}
  
            { wannaEdit.hasDescription &&
              <p className="fw-light fst-italic"><FontAwesomeIcon icon={faExclamation} size="sm" style={{color: "#FFD43B",}} /><small>{"("}<b>Note:</b> Leave the description field if you already have a description and you do not want change it.{")"}</small></p>
            }
            {
              errorStack.err === false && errorStack.code === 200 && 
              <div className="editpage-success">
              <p>Success !</p>
              <button className="btn-editpage leaveedit p-2" onClick={cancelediting} >Leave</button>
              </div>
            }
            {
              errorStack.err === true && 
              <div className={errorStack.code === 401 ? "editpage-failure-orange" : "editpage-failure-red"}>
              <div className="editpage-failure-header pt-1 mt-1">
              <CloseButton className='closeedit-button' onClick={cancelShow} />
              <h5 style={{textShadow: 'ghostwhite 0.5px 0.5px', letterSpacing: '1px'}}>{errorStack.title}</h5><span className="d-inline-block p-3"></span>
              </div>
              <article>
              <p>{errorStack.msg}</p>
              <Button className="fw-bold" style={{fontFamily: 'tahoma, sans-serif'}} variant="secondary" size="sm" onClick={cancelShow}>Understood</Button>              
              </article>
              </div>
            }
            <Modal 
            show={modalShow}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
         Edit {editable.countryName} Country
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Confirm changes for {editable.countryName} country ?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={submitCountry} disabled={loader ? true : false } variant={loader ? 'info' : 'primary'}>{ loader ? "Editing..." : "Yes" }</Button>
        <Button onClick={()=>setModalShow(false)} variant="dark" className="text-light">No</Button>
      </Modal.Footer>
    </Modal>
            <br />
            { errorStack.err !== true && errorStack.code !== 200 &&
              <div className="editButtons">
          <button className="btn-editpage confirmedit" onClick={confirmEdit} disabled={loader ? true : false }>{ loader ? "Editing..." : "Confirm" }</button>
          <button className="btn-editpage canceledit" onClick={cancelediting} disabled={ loader ? true : false }>{loader ? "Cannot cancel" : "Cancel" }</button>
          </div>
            }
            </div>
          </form>
        </div>

        </React.Fragment>
  )
}

export default Editpage;