
const noNumbers_NoSpecial = new RegExp(/[0-9+\]\(\)\{\}\'\'\?\¿\,\;\_\!\|\*\+\"\"\$\%\º\ª]/gm)

function mongoTypesCheck(obj) {
	  
	  let result;
	  const checkType = (k, v) => { const arr = typeof v !== "string" || noNumbers_NoSpecial.test(v) ? [k]: []; return arr }; 
	  const checkTypes = (object) => {const arr = []; for([k, v] of Object.entries(object)){if(typeof v !== "string" || noNumbers_NoSpecial.test(v)){arr.push(k)}} return arr };
	  const flagUrlKey = obj.hasOwnProperty("countryFlag_url");
	  const descriptionKey = obj.hasOwnProperty("countryDescription");
	  
	  if(flagUrlKey) {
		result = checkType("countryFlag_url", obj.countryFlag_url)
	  } else if(descriptionKey) {
		result = checkType("countryDescription", obj.countryDescription) 
	  } else {
		  const body = { countryId: obj.countryId, countryName: obj.countryName, 
		  continentId: obj.continentId };
		 result = checkTypes(body)
	  }
	  
	  return result // return array
}

export { mongoTypesCheck }