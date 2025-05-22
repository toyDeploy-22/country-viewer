
import React from 'react';
// import countrySchema from '../functions/countrySchema';
import DeleteComponent from './DeleteComponent';


function DeleteCountry({ cntrs }) {


  return(
    <React.Fragment>
    <DeleteComponent cnt={cntrs} />
    </React.Fragment>
  )

}

export default DeleteCountry;