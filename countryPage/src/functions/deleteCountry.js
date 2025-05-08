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
const { countryFlag_url, countryDescription } = body;

// conditions
if( countryFlag_url === '' && countryDescription === '' ) {
 validation = reasons[0];
} else if(typeof countryFlag_url === 'undefined' && typeof countryDescription === 'undefined') { //added in another else/if block to simplify the visibility
 validation = reasons[0];
} else if(cnt.countryFlag_url === countryFlag_url && cnt.countryDescription === countryDescription){
 validation = reasons[1];
} else if(countryFlag_url !== '' && typeof countryFlag_url !== 'string') {
 validation = reasons[2];
} else if(countryDescription.length > 500 ){
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
        const found = arr.filter((c) => c.countryId.toLowerCase() === cnt.countryId.toLowerCase() || c.countryName.toLowerCase() === cnt.countryName.toLowerCase());

        if(found.length === 0) {
        result.err = true;
        result.code = 404;
        result.title = 'Not Found For Deletion';
        result.msg = "Cannot proceed deletion of '" + cnt.countryName + "' because the country does not appear in the list. It is possible that the country has already been deleted.";    
        } else {
        const url = `https://country-viewer-backend.vercel.app/nosql/deletecountry/${found[0].countryId}`;

        const deletor = await axios({
            url: url, 
            method: 'delete',
            headers: { 'Content-Type': 'application/json' },
            validateStatus: function (status) {
            return status >= 200 && status < 300 // default
                }
            });

        // console.log(deletor.statusText);

        if(deletor.statusText === 'OK') {
        result.err = false;
        result.code = 200;
        result.title = 'Success';
        result.msg = 'The country ' + cnt.countryName + ' has been successfully deleted.';
            } else {
        result.err = true;
        result.code = 400;
        result.title = 'Error';
        result.msg = 'The country ' + cnt.countryName + ' has not been deleted due to an error. Please try again.'; 
            }
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