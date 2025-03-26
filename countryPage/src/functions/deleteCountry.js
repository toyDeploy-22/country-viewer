import axios from 'axios';

let result = {};
/*
const deleteChecker = (cnt, body) => {

// variables
const reasons = [{
    err: true,
    code: 401,
    title: "Incomplete Fields",
    msg: "You need to amend either the country flag, country description, or both in order to confirm your edition."
}, {
    err: true,
    code: 401,
    title: "Duplicate Fields",
    msg: "No change have been detected. Make sure that you have enter the new details in the specific fields."
    }, {
    err: true,
    code: 401,
    title: "Incorrect country flag edition",
    msg: "The country flag, if filled in, needs to be a text, ideally a URL."
}, {
    err: true,
    code: 401,
    title: "Incorrect country description edition",
    msg: "The country edition, if filled in, needs to be a text up to 500 characters."
}];

const success = {
    err: false,
    title: "Success",
    msg: ''
};

let validation = {};
const { country_flag, country_description } = body;

// conditions
if( country_flag === '' && country_description === '' ) {
 validation = reasons[0];
} else if(typeof country_flag === 'undefined' && typeof country_description === 'undefined') { //added in another else/if block to simplify the visibility
 validation = reasons[0];
} else if(cnt.country_flag === country_flag && cnt.country_description === country_description){
 validation = reasons[1];
} else if(country_flag !== '' && typeof country_flag !== 'string') {
 validation = reasons[2];
} else if(country_description.length > 500 ){
    validation = { ...reasons[3] };
} else {
 validation = { ...success };
    }
    return validation;
}
*/

// full object of the country selected to retrieve id and name
const deleteCountry = async(arr, cnt) => {
    try {
        const found = arr.filter((c) => c.country_name === cnt.country_name || c.country_id === cnt.country_id);

        if(found.length === 0) {
        result.err = true;
        result.code = 404;
        result.title = 'Not Found For Deletion';
        result.msg = "Cannot proceed deletion of '" + cnt.country_name + "' because the country does not appear in the list. It is possible that the country has already been deleted.";    
        } else {
        const url = `http://localhost:5000/deletecountry/${cnt.country_name}`;

        const deletor = await axios.delete(url, {headers: { 'Content-Type': 'application/json' }});

        console.log(deletor.status);

        result.err = false;
        result.code = 200;
        result.title = 'Success';
        result.msg = 'The country ' + cnt + ' has been successfully deleted.';
        }
        return result;
    } catch(err) {
        console.error(err);
        result.err = true;
        result.code = 500;
        result.title = 'Internal Server Error';
        result.msg = 'An error occured. Please contact the administrator if the issue persists';
        return result;
    }
}


export default deleteCountry;