

import axios from 'axios';

let result = {};

const editChecker = (req, cnt, body) => {

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
    msg: "The country edition, if filled in, needs to be a text up to 160 characters only."
}];

const success = {
    err: false,
    title: "Success",
    msg: ''
};

let validation = {};
const { countryFlag_url, countryDescription } = body;

// conditions
if( req !== "PATCH" && countryFlag_url === '' && countryDescription === '' ) {
 validation = reasons[0];
} else if( req !== "PATCH" && typeof countryFlag_url === 'undefined' && typeof countryDescription === 'undefined') { //added in another else/if block to simplify the visibility
 validation = reasons[0];
} else if(cnt.countryFlag_url === countryFlag_url && cnt.countryDescription === countryDescription){
 validation = reasons[1];
} else if(countryFlag_url !== '' && ['string', 'undefined'].indexOf(typeof countryFlag_url) === -1) {
 validation = reasons[2];
} else if(countryDescription.length > 160 ){
    validation = { ...reasons[3] };
} else {
 validation = { ...success };
    }
    return validation;
}

const editCountries = async(cnt) => {
    try {
        let currBody = {};
        let newBody = {};
        const url = `http://localhost:5000/nosql/editcountry/${cnt.countryName}`;
        const validProps = Object.entries(cnt);
        const flag = validProps.filter((cf)=>cf[0] === "countryFlag_url")[0]; // returns 1D array 
        const description = validProps.filter((cd)=>cd[0] === "countryDescription")[0]; // returns 1D array

        if(flag.indexOf('') < 0 && description.indexOf('') < 0 ) {
           currBody.hasFlag = true;
           currBody.countryFlag = flag[1];
           currBody.hasDescription = true; 
           currBody.countryDescription = description[1];
        } else if(flag.indexOf('') < 0 && description.indexOf('') >= 0 ) {
            currBody.hasFlag = true;
            currBody.countryFlag = flag[1];
        } else if(description.indexOf('') < 0 && flag.indexOf('') >= 0) {
            currBody.hasDescription = true;
            currBody.countryDescription = description[1];
        } else {
           result.err = true; 
           result.code = 401;
           result.title = "No update detected";
           result.msg = 'There is no update detected on the flag URL nor description. Please try to modify these fields and confirm again.';
           return result;
        }
        
        for (let [key, value] of Object.entries(currBody)) {
            if(value !== '') {
                newBody[key] = value;
            }
        };

        const editor = await axios.patch(url, { ...newBody  }, {headers: { 'Content-Type': 'application/json' }});

        console.log(editor.data);

        result.err = false;
        result.code = 200;
        result.title = 'Success';
        result.msg = 'Data successfully modified.';

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

const addCountriesChecker = async(body, arr) => {
    console.log(arr.length)
    const duplicate = await arr.filter((c) => c.countryId.toLowerCase() === body.id.toLowerCase())
    let result = {// ok: boolean, msg: string
    };
    // const continents = ["Europe", "North America", "South America", "Asia", "Middle East and Africa", "Oceania", "Antarctica"];
    const continents = ["EU", "NA", "SA", "AS", "OC", "AF", "AN"];
    const noNumbers = new RegExp(/[0-9]/);
    const noSpecial = new RegExp(/[+\]\(\)\{\}\'\'\?\¿\,\;\_\!\|\*\+\"\"\$\%\º\ª]/gm);
    // No number allowed for all sequence const noNumbers = new RegExp(/^[^0-9]+$/);

    let reasons = [
        { reasonId: 1, 
        title: 'Country Initials Value Type Incorrect',
        message: 'The country initials field is mandatory and must only contain letters.'}, 
        { reasonId: 2, 
        title: 'Country Initials Already Exists',
        message: 'The country initials you have entered already exists in the list. Please delete the existing country or create a country with other initials. '},
        { reasonId: 3,
        title: 'Country Initials Too Short', 
        message: 'The country initials must contain 2 letters at least.'},
        { reasonId: 4,
        title: 'Continent Value Invalid', 
        message: 'Make sure that you select the continent in the list.'},
        { reasonId: 5,
        title: 'Country Name Too Short', 
        message: 'The country name should at least contain 3 letters.'},
        { reasonId: 6,
        title: 'Country Name Incorrect', 
        message: 'The country name field must only contain letters.'},
        { reasonId: 7,
        title: 'Country Name Number', 
        message: 'The country name cannot contain any number.'},
        {
            reasonId: 8,
            title: 'Too Long Description',
            message: 'A valid description can only contain 160 characters.'
        },
        {
            reasonId: 9,
            title: 'Country Initials Too long', 
            message: 'The country initials cannot contain more than 7 characters.'
        },
        { reasonId: 10,
        title: 'Country Name With Special Character', 
        message: 'The country name cannot contain any special character.'},
        { reasonId: 11,
        title: 'Country Name Too Long', 
        message: 'The country name cannot contain more than 40 characters.'},
        {
            reasonId: 12,
            title: 'Too Short Description',
            message: 'A valid description must contain at least 10 characters.'
        },

    ]

    if(typeof body.id !== 'string' || body.id === '') {
        result.ok = false;
        result.message = reasons[0].message
    } else if(duplicate.length > 0) {
        result.ok = false;
        result.message = reasons[1].message
    } else if(body.id.length < 3) {
        result.ok = false;
        result.message = reasons[2].message
    } else if(body.id.length > 7) {
        result.ok = false;
        result.message = reasons.filter((r) => r.reasonId === 9).map((r) => r.message)[0]
    } else if(continents.indexOf(body.continent.toUpperCase()) === -1 ) {
        result.ok = false;
        result.message = reasons[3].message
    } else if(body.name.length < 2) {
        result.ok = false;
        result.message = reasons[4].message
    } else if(typeof body.name !== 'string' || body.name === '') {
        result.ok = false;
        result.message = reasons[5].message
    } else if(body.name.length > 40 ) {
        result.ok = false;
        result.message = reasons.filter((r) => r.reasonId === 11).map((r) => r.message)[0]
    } else if(!noNumbers.test(body.name)) {
        result.ok = false;
        result.message = reasons[6]
    } else if(!noSpecial.test(body.name)) {
        result.ok = false;
        result.message = reasons.filter((r) => r.reasonId === 10).map((r) => r.message)[0]
    } else if(body.hasOwnProperty("description") && body.description.length > 250) {
        result.ok = false;
        result.message = reasons[7]
    } else if(body.hasOwnProperty("description") && body.description < 10) {
        result.ok = false;
        result.message = reasons.filter((r) => r.reasonId === 12).map((r) => r.message)[0]
    } else {
        result.ok = true;
        result.message = `The country ${body.name} has been successfully added !`
    }

    return result;
}

export { editChecker, editCountries, addCountriesChecker }