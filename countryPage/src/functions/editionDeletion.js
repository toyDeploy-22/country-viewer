
import axios from 'axios';

const result = {};

export const edition = async(country) => {
  
try{
  const myUrl = `https://country-viewer-backend.vercel.app/nosql/editcountry/${country.name}`

  const bodyCountry = {
  countryFlag: country.flag,
  countryDescription: country.description,
  countryName: country.name,
}

const newAdded = await axios({
    method: 'post',    
    url: myUrl,
    data: bodyCountry
  });

if(newAdded.status >= 200 && newAdded.status < 300) {
  result.ok = true;
  result.code = 201;
  result.msg = "success";
} else {
  result.ok = false;
  result.code = 400;
  result.msg = "failure";
}

  return result
}
  catch(err){
    console.log(err);
    result.ok = false;
    result.code = 500;
    result.msg = err.message;

    return result
  }
}


export const deletion = async(countryid) => {
 
  try{
  const myUrl = `https://country-viewer-backend.vercel.app/nosql/deletecountry/${countryid}`;
  
  const deletor = await axios({
   method: 'delete',
   url: myUrl
 });
  
  if(deletor.status >= 200 && deletor.status < 300) {
  result.ok = true;
  result.code = 201;
  result.msg = "success"
  } else {
    result.ok = false;
    result.code = 404;
    result.msg = "Not found"
  }
  return result
   } catch(err){
    console.error(err);
    result.ok = false;
    result.code = 500;
    result.msg = err.message;
  }
}