
function checkFlag(arr, nb) {
  
  const result = {};
  try {
  const authorizedKeys = ['country_id', 'country_name', 'country_description', 'country_flag'];

  const ifTrueDenied_nb = {
    is_not_a_number: typeof nb !== "number",
    is_not_a_large_number: nb < 2,
    is_a_too_large_number: nb > 25,
  };

  const results_nb = Object.entries(ifTrueDenied_nb).filter((err) => err[1] === true).map((k) => k[0]);

  if(results_nb.length === 0) {
  const ifTrueDenied_arr = {
    has_not_an_Array_format: typeof arr !== "object",
    has_incorrect_format_data_or_is_empty: !arr[0],
    has_an_uknown_key: arr.filter((obj) => Object.keys(obj).filter((k) => authorizedKeys.indexOf(k) === -1)),
    has_lower_countries_than_the_required_number: nb > arr.length
    }
    const results_arr = Object.entries(ifTrueDenied_arr).filter((err) => err[1] === true).map((k) => k[0]);

    if(results_arr.length === 0) {
    result.code = 200;
    result.title = "Checking successful"
    result.message = ''
    } else {
    result.code = 401;
    result.title = "Unauthorized Array Format"
    result.message = `The Array submitted ${results_arr.map((nb, _ind, arr) => `${nb[0].replaceAll("_"," ")}${_ind + 1 === arr.length ? "" : ", "}`)}`
    }
  } else {
    result.code = 401;
    result.title = "Unauthorized Number Format"
    result.message = `The number submitted ${results_nb.map((nb, _ind, arr) => `${nb[0].replaceAll("_"," ")}${_ind + 1 === arr.length ? "" : ", "}`)}`;
    }
    return result
  } catch(err) {
    console.error(err);
    result.code = 500;
    result.title = "Internal Server Error";
    result.message = err.message;
    return result;
  }
}


function randomFlags(arr, nb) {

  const finalResult = {}

  try {
      const keyChecker = checkFlag(arr, nb);
      Object.assign(finalResult, keyChecker);

      if(keyChecker.code === 200) {
      const finalArr = [];
      let splicedArr = arr;
      let x = 0;

  while(x < nb) {
    let random = Math.floor(Math.random() * (splicedArr.length - 1));
    let index = random === 0 ? random : random - 1;
    let splicer = splicedArr.splice(index, 1)[0];
    finalArr.push(splicer);
    x++
    }
    finalResult.finalArr = finalArr.filter((id) => !id.country_id === false)
    } else {
    finalResult.finalArr = []
    }
    return finalResult 
      } catch(err) {
    console.error(err);
    finalResult.code = 500;
    finalResult.title = "Internal Server Error";
    finalResult.message = err.message;
  }
return finalResult;
} 

export default randomFlags;