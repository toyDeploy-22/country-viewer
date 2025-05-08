

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
    title: "Duplicate Values",
    msg: "No change have been detected. Please make some changes and confirm again your edition request."
    }, {
    err: true,
    code: 401,
    title: "Incorrect country flag edition",
    msg: "The country flag, if desired, must be a text, ideally a URL, with at least 3 characters."
}, {
    err: true,
    code: 401,
    title: "Incorrect country description edition",
    msg: "The country edition, if desired, must be a text between 10 and 160 characters."
}, {
    err: true,
    code: 401,
    title: "Incorrect validation options",
    msg: "Please use only the checkbox to specify if you want to add or remove the flag and/or description."
},
{
    err: true,
    code: 401,
    title: "Incorrect Flag/Description values",
    msg: "If activated, the flag or description field is required and cannot be empty."
},
{
    err: true, 
    code: 401,
    title: "Missing fields",
    msg: 'Some required fields are missing. The edition request cannot be sent.'
},
{
    err: true, 
    code: 401,
    title: "Incorrect values",
    msg: 'Some values cannot be sent for edition. Please check your answers and try again.',
},
{
    err: true,
    code: 401,
    title: 'Different Country Data',
    msg: 'The country Id or country Name of the request does not correspond with the initial one. Please make sure that these details are equal and confirm again. '
},
{
    err: true,
    code: 401,
    title: "Incorrect Value Type",
    msg: "The values must be text only."
},
{
    err: true,
    code: 401,
    title: "country Flag Too Long",
    msg: "For security reasons, the country flag cannot contain more than 250 characters."
}
];
    
const success = {
    err: false,
    title: "Success",
    msg: ''
};

let validation = {};

const requiredFields = ["countryName", "countryId", "continentId", "hasFlag", "hasDescription"];

const checkProps = {

    missingKeys: Object.keys(body).filter((k) => k !== 'countryFlag_url' && k !== 'countryDescription').filter((k) => requiredFields.indexOf(k) === -1),

    invalidFlag: body.hasFlag && body.countryFlag_url === '',

    invalidDescription: body.hasDescription && body.countryDescription === '',
    
    invalidValues: Object.entries(body).filter((v) => v[1] === ''),

    minLengthFlag: body.hasFlag && body.countryFlag_url.length < 3,

    maxLengthFlag: body.hasFlag && body.countryFlag_url.length > 250,

    maxLengthDescription: ((body.hasDescription && body.countryDescription.length < 10) || (body.hasDescription && body.countryDescription.length > 160)),

    has_BOTHProps: body.hasOwnProperty('countryFlag_url') && body.hasOwnProperty('countryDescription'),

    hasHAS_IncorrectTYPES: typeof body.hasFlag !== 'boolean' || typeof body.hasDescription !== 'boolean',

    hasUndefinedTypes: Object.values(body).filter((v) => typeof v === 'undefined') || Object.entries(body).filter((k) => k[0] === 'countryFlag_url' || k[0] === 'countryDescription').filter((v) => typeof v[1] !== 'string'),

    duplicatesVal:  (cnt.country.countryDescription === body.countryDescription && cnt.country.countryFlag_url === body.countryFlag_url),

    duplicate_NameId_False: (cnt.country.countryName.toLowerCase() !== body.countryName.toLowerCase()) || (cnt.country.countryId.toLowerCase() !== body.countryId.toLowerCase())

    };

// const { countryFlag_url, countryDescription } = body;

// conditions
if(req === "PATCH") {
    // console.log(checkProps)
    if(checkProps.missingKeys.length > 0) {
    validation = reasons[0]
} else if(checkProps.invalidFlag || checkProps.invalidDescription) {
validation = reasons.filter((err) => err.title === 'Incorrect Flag/Description values')[0] 
} else if(checkProps.minLengthFlag) {
        validation = reasons[2];
    } else if (checkProps.maxLengthFlag) {
        validation = reasons.filter((err) => err.title === 'country Flag Too Long')[0]
    } else if(checkProps.maxLengthDescription) {
        validation = reasons.filter((err) => err.title === 'Incorrect country description edition')[0]
    } else if(checkProps.hasHAS_IncorrectTYPES) {
        validation = reasons[4];
} else if(body.hasFlag && body.hasDescription && checkProps.duplicatesVal ) {
        validation = reasons[1]
    } else if(checkProps.duplicate_NameId_False) {
        validation = reasons.filter((err) => err.title === 'Different Country Data')[0]
    } else if(checkProps.hasUndefinedTypes.length > 0) {
        validation = reasons.filter((err) => err.title === 'Incorrect Value Type')[0]
    }} else if( req !== "PATCH" && checkProps.invalidValues ) {
 validation = reasons[0];
} else if( req !== "PATCH" && checkProps.hasUndefinedTypes.length > 0) { //added in another else/if block to simplify the visibility
 validation = reasons[0];
} else {
        validation = { ...success };
    }

    return validation;
}

const editCountries = async(cnt) => {
    try {
        let currBody = { ...cnt };

        const url = `http://https://country-viewer-backend.vercel.app/nosql/editcountry/${currBody.countryName}`;

        /*
        const flag = validProps.filter((cf)=>cf[0] === "countryFlag_url")[0]; // returns 1D array 
        const description = validProps.filter((cd)=>cd[0] === "countryDescription")[0]; // returns 1D array
        */

        const editor = await axios.patch(url, currBody, {headers: { 'Content-Type': 'application/json' }});

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

    const duplicateId = await arr.filter((c) => c.countryId.toLowerCase() === body.id.toLowerCase());

    const duplicateName = await arr.filter((c) => c.countryName.toLowerCase() === body.name.toLowerCase());

    let result = {// ok: boolean, msg: string
    };
    // const continents = ["Europe", "North America", "South America", "Asia", "Middle East and Africa", "Oceania", "Antarctica"];
    const continents = ["EU", "NA", "SA", "AS", "OC", "AF", "AN"];
    const noNumbers = new RegExp(/[0-9]/);
    // const noSpecial = new RegExp(/[\]\[\/\s(\)\{\}\'\'\?\¿\,\;\_\!\|\*\+\"\"\$\%\º\ª]/gm);
    const noSpecial = new RegExp(/[][/s(){}''?¿,;_!|*+""$%ºª]/gm)
    // No number allowed for all sequence const noNumbers = new RegExp(/^[^0-9]+$/);

    let reasons = [
        { reasonId: 1, 
        title: 'Country Initials Value Type Incorrect',
        message: 'The country initials field is mandatory.'}, 
        { reasonId: 2, 
        title: 'Country Initials Already Exists',
        message: 'The country initials you have entered already exists in the list. Please delete the existing country or create a country with other initials. '},
        { reasonId: 3,
        title: 'Country Initials Too Short', 
        message: 'The country initials must contain 2 letters at least.'},
        { reasonId: 4,
        title: 'Continent Value Invalid', 
        message: 'Make sure that the continent you have selected is in the list.'},
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
            message: 'A valid description cannot contain more than 160 characters.'
        },
        {
            reasonId: 9,
            title: 'Country Initials Too long', 
            message: 'The country initials cannot contain more than 7 characters.'
        },
        { reasonId: 10,
        title: 'Country Name With Special Character', 
        message: 'The country name cannot contain any special character, except for the "-" character (example: United-States).'},
        { reasonId: 11,
        title: 'Country Name Too Long', 
        message: 'The country name cannot contain more than 40 characters.'},
        {
            reasonId: 12,
            title: 'Too Short Description',
            message: 'A valid description must contain at least 10 characters.'
        },
        {
            reasonId: 13,
            title: 'Country Flag Invalid',
            message: "The country flag is not mandatory. Make sure to set this option to 'yes' only if you have a valid link address with more than 3 characters."
        },
        { reasonId: 14, 
        title: 'Country Name Already Exists',
        message: 'The country Name you have entered already exists in the list. Please delete the existing country or create a country with another name. '},
        { reasonId: 15,
        title: 'Country Initials With Special Character', 
        message: 'The country Initials cannot contain any special character.'},
        { 
        reasonId: 16,
        title: 'Country Intials Number', 
        message: 'The country Initials cannot contain any number.'
        },
        {
            reasonId: 17,
            title: 'Too Long Country Flag',
            message: 'The country Flag cannot exceed 250 characters.'
        },
    ]

    
    if(noNumbers.test(body.id)) {
        result.ok = false;
        result.message = reasons.filter((r) => r.reasonId === 16).map((r) => r.message)[0]
    } else if(noSpecial.test(body.id)) {
        result.ok = false;
        result.message = reasons.filter((r) => r.reasonId === 15).map((r) => r.message)[0]
    } else if(duplicateId.length > 0) {
        result.ok = false;
        result.message = reasons[1].message
    } else if(duplicateName.length > 0) {
        result.ok = false;
        result.message = reasons.filter((r) => r.reasonId === 14).map((r) => r.message)[0]
    } else if(body.id.length < 3 || typeof body.id !== "string") {
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
    } else if(noNumbers.test(body.name)) {
        result.ok = false;
        result.message = reasons[6].message
    } else if(noSpecial.test(body.name)) {
        result.ok = false;
        result.message = reasons.filter((r) => r.reasonId === 10).map((r) => r.message)[0]
    } else if (body.hasFlag && body.flag.length < 3) {
        result.ok = false;
        result.message = reasons.filter((r) => r.reasonId === 13).map((r) => r.message)[0] 
    } else if(body.hasOwnProperty("description") && body.description.length > 160) {
        result.ok = false;
        result.message = reasons[7]
    } else if(body.description.length > 0 && body.description.length < 10) {
        result.ok = false;
        result.message = reasons.filter((r) => r.reasonId === 12).map((r) => r.message)[0]
    } else if (body.hasFlag && body.flag.length > 250) {
        result.ok = false;
        result.message = reasons.filter((r) => r.reasonId === 17).map((r) => r.message)[0]
    } else {
        result.ok = true;
        result.message = `The country ${body.name} has been successfully added !`
    }

    return result;
}

export { editChecker, editCountries, addCountriesChecker }