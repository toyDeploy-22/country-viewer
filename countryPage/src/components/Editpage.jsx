
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CloseButton from 'react-bootstrap/CloseButton';
import { editChecker, editCountries } from '../functions/editCountries.js';

function Editpage({ cnt }) {

// states
const [loader, setLoader] = useState(false);
const [editable, setEditable] = useState({ countryName: cnt.country.countryName, countryFlag_url: '', countryDescription: '' });
const [modalShow, setModalShow] = useState(false);
// const [modalResult, setModalResult] = useState({ err: false, code: 0, title: '', msg: '' });
const [errorStack, setErrorStack] = useState({
  err: false,
  code: 0,
  title: '',
  msg: ['']
});

// functions
const handleCountry = (e) => {
let {name, value} = e.target;
let editObject = { ...editable, [name]: value };
setEditable(() => editObject)
}

const cancelediting = () => {
  const initialEdition = { countryFlag_url: '', countryDescription: '' };
  setEditable(()=>initialEdition);
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
    const checker = editChecker("PATCH", cnt, editable);
    if(checker.err) {
      setErrorStack(() => checker);
      setLoader(false);
    } else {
      const submitter = await editCountries(editable);
      setErrorStack(() => submitter);
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
  msg: ['']};
  setErrorStack(() => initialError)
}

return (
  <React.Fragment>
  <div id="editCountry-container">
          <form>
            <h1>Edit {cnt.country.countryName} Country</h1>
          <div className="ids">
            <section className="ids-section">
              <label htmlFor="continent_id">
                Continent ID<span className="req">{'*'}</span>
              </label>
              <br />
              <select id="continent_id" className="continent_id-selection" name="continent_id" autoComplete="on" defaultValue={cnt.country.continent.continentId} disabled>
                {
                  [1, 2, 3, 4, 5].map((c)=><option key={c} value={c}>{
                    c === 1 ? "Europe" : c === 2 ? "America" : c === 3 ? "Asia" : c === 4 ? "Africa/Middle-East" : "Oceania"
                  }</option>)
                }
              </select>
            </section>
<p id="country_id-zone"><small>The continent ID is <span>{cnt.country.continent.continentId}</span></small></p>
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
            <input id="country_name" type="text" className="edit-readOnly" autoComplete="on" name="countryName" value={Object.entries(cnt.country).filter((obj)=>obj[0] === 'countryName')[0].map((p)=>p)[1].substring(0,25)} disabled />
            
          <p className="editcountry-note"><small><b>Note: </b> Due to technical and organizational reasons, the country name, ID and continent ID are not editable.</small></p>
          <hr />

            <label htmlFor="country_flag">
            Flag
            </label>
            <input type="text" className="text-light" id="country_flag" placeholder={cnt.country.countryFlag_url ? cnt.country.countryFlag_url : "ex: http://www.image.com"} autoComplete="on" name="countryFlag_url" value={editable.countryFlag_url} onChange={handleCountry} />
            <br />
        
            <label>
            Description
            </label>
            <textarea className="text-light" cols="6" rows="3" placeholder={cnt.country.countryDescription && cnt.country.countryDescription.length > 15 ? cnt.country.countryDescription.substring(0, Math.ceil(cnt.country.countryDescription.length/9)) + "..." : cnt.country.countryDescription && cnt.country.countryDescription.length < 15 ? cnt.country.countryDescription : "Add some text here if needed..."} name="countryDescription" value={editable.countryDescription} onChange={handleCountry} maxLength={160}></textarea>
            <br />
            {typeof editable.countryDescription !== 'undefined' && editable.countryDescription.length > 0 ? <p className="text-light fst-italic">Characters left: <small className={`text-${editable.countryDescription.length >= 80 && editable.countryDescription.length < 150 ? "primary" : editable.countryDescription.length >= 150 ? "danger" : "light" }`}>{Number(160 - editable.countryDescription.length)}</small></p> : null}
            <br />
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
              <div className="editpage-failure-header">
              <CloseButton className='closeedit-button' onClick={cancelShow} />
              <h5>{errorStack.title}</h5><span className="d-inline-block p-3"></span>
              </div>
              <article>
              {errorStack.msg.map((msg, _ind)=><p key={_ind}>{msg}</p>)}
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