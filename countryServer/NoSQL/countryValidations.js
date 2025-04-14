
const noNumbers_NoSpecial = new RegExp(/[0-9+\]\(\)\{\}\'\'\?\¿\,\;\_\!\|\*\+\"\"\$\%\º\ª]/gm)

function mongoTypesCheck(obj) {
	  
	  let result = [];
	  const checkType = (k, v) => { const arr = typeof v !== "string" || noNumbers_NoSpecial.test(v) ? [k]: []; return arr }; 
	  
	  const checkTypes = (object) => {const arr = []; for(const [k, v] of Object.entries(object)){if(typeof v !== "string" || noNumbers_NoSpecial.test(v)){arr.push(k)}} return arr };
	  
	  const flagUrlKey = obj.hasOwnProperty("countryFlag_url");
	  const descriptionKey = obj.hasOwnProperty("countryDescription");
	  
	  if(flagUrlKey && !descriptionKey) {
		result = checkType("countryFlag_url", obj.countryFlag_url)
	  } else if(!flagUrlKey && descriptionKey) {
		result = checkType("countryDescription", obj.countryDescription) 
	  } else {
		  const body = { countryId: obj.countryId, countryName: obj.countryName, 
		  continentId: obj.continentId };
		 result = checkTypes(body);
	  }
	  
	  return result // return array
}

function bodyValidator(req, body) {
		
	const results = [];
	
	const checkTypes = mongoTypesCheck(body);
	const requiredKeys = ["countryId", "countryName", "continentId", "hasFlag", "hasDescription"].filter((k) => !body.hasOwnProperty(k) ? k : null);
	const authorizedContinents = ["NA", "SA", "EU", "AF", "AS", "OC", "AN"];
	const checkFlag_url = mongoTypesCheck({countryFlag_url: body.countryFlag_url});
	const checkDescription = mongoTypesCheck({countryDescription: body.countryDescription});
	
	const reasons = [

		{
			reason: "Invalid Continent ID",
			error: true,
			title: "Invalid Continent ID Value",
			msg: "The contient ID is not recognized. Please make sure that the continent ID is selected from the list." 
		},
		{ 
			reason: "countryFlag value empty",
			error: true, 
			title: "Invalid Flag Data", 
			msg: "If country Flag set to 'yes', country flag value cannot be empty."
		},
		{	reason: "countryFlag value unauthorized",
			error: true,
			title: "Incorrect countryFlag Value",
			msg: "The country flag field must be only composed of letters."
		},
		{	reason: "countryDescription value unauthorized",
			error: true,
			title: "Incorrect countryDescription Value",
			msg: "The country description field must be only composed of letters."
		},
		{
			reason: "countryDescription value empty",
			error: true, 
			title: "Invalid countryDescription Input", 
			msg: "If country description set to 'yes', description field cannot be empty."
		}
	];
	
	if(req === 'POST') {
		
	if(checkTypes.length > 0 || requiredKeys.length > 0 ){
		const fieldsReason = {
			reason: "Incorrect Field name",
			error: true,
			title: "Required Fields Not Detected",
			fields: checkTypes.length > 0 ? checkTypes : requiredKeys, // Array
			msg: `The ${checkTypes.length > 0 ? checkTypes.join(", and ") : requiredKeys.join(", and ")} fields must exist and values must only be letters.` 
		}
		results.push(fieldsReason)
		
		return results
	} 
	
	authorizedContinents.indexOf(body.continentId.toUpperCase()) === -1 && req === 'POST' ? results.push(reasons.filter((err) => err.reason === "Invalid Continent ID")[0]): null;
		
		if(body.hasFlag === true) {
			
			checkFlag_url.length > 0 ? results.push(reasons.filter((err) => err.reason === "countryFlag value unauthorized")[0]) : null;
			
			body.countryFlag_url === '' ? results.push(reasons.filter((err) => err.reason === "countryFlag value empty")[0]) : null;
			
			!body.hasOwnProperty("countryFlag_url") ? results.push(reasons.filter((err) => err.reason === "countryFlag value unauthorized")[0]) : null;
			
			checkFlag_url.length > 0 ? results.push(reasons.filter((err) => err.reason === "countryFlag value unauthorized")[0]) : null;
		}
		
		if(body.hasDescription === true) {
			
			checkDescription.length > 0 ? results.push(reasons.filter((err) => err.reason === "countryDescription value unauthorized")[0]) : null;
			
			body.countryDescription === '' ? results.push(reasons.filter((err) => err.reason === "countryDescription value empty")[0]) : null;
			
			!body.hasOwnProperty("countryDescription") ? results.push(reasons.filter((err) => err.reason === "countryDescription value empty")[0]) : null;
		}
		
		return results
		}
}

export { bodyValidator }