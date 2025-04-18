
import axios from 'axios';

const result = {};

export const edition = async(country) => {
  
try{
  const myUrl = `http://localhost:5000/nosql/editcountry/${country.name}`

  const bodyCountry = {
  countryFlag: country.flag,
  countryDescription: country.description,
  countryName: country.name,
}
  await axios({
    method: 'post',    
    url: myUrl,
    data: bodyCountry
  });

  result.ok = true;
  result.code = 201;
  result.msg = "success"
}
  catch(err){
    console.log(err);
    result.ok = false;
    result.code = 500;
    result.msg = err
  }
  return result;
}


export const deletion = async(countryName) => {
 
  try{
  const myUrl = `http://localhost:5000/nosql/deletecountry/${countryName}`;
  await axios({
   method: 'delete',
   url: myUrl
 });
  
  result.ok = true;
  result.code = 201;
  result.msg = "success"
   } catch(err){
    console.log(err);
    console.log(err);
    result.ok = false;
    result.code = 500;
    result.msg = err;
  }
}