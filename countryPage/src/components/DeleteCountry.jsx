
import React, { useState } from 'react';
import countrySchema from '../functions/countrySchema';
import DeleteComponent from './DeleteComponent';
import ModalDeleteCountry from './ModalDeleteCountry';

function DeleteCountry({ cntrs }) {
  
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState({ ...countrySchema });

  const handleOpen = (cnt) => {
    setSelected(cnt);
    setShow(true)
  }

  const handleClose = () => {
    setShow(false)
  }

    const successAndRefresh = () => {
    setShow(false)
    window.location.reload(false);
    /** 
    This method takes an optional parameter which by default is set to false. If set to true, the browser will do a complete page refresh from the server and not from the cached version of the page. 
    **/

  }



  return(
    <React.Fragment>
    <DeleteComponent cnt={cntrs} wannaDelete={handleOpen} />
    <ModalDeleteCountry propShow={show} propHide={handleClose} propHideRefresh={successAndRefresh} arr={cntrs} country={selected} />
    </React.Fragment>
  )

}

export default DeleteCountry;