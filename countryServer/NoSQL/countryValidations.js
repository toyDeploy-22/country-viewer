
const noNumbers_NoSpecial = new RegExp(/[0-9+\]\/\s(\)\{\}\'\'\?\¿\,\;\_\!\|\*\+\"\"\$\%\º\ª]/gm)

function mongoTypesCheck(obj) {
	  
	  let result = [];
	  const checkType = (k, v) => { if(["countryFlag_url", "countryDescription"].indexOf(k) === -1) { const arr = typeof v !== "string" || noNumbers_NoSpecial.test(v) ? [k]: []; return arr } else { return []} }; 
	  
	  const checkTypes = (object) => {const arr = []; for(const [k, v] of Object.entries(object)){if(["countryFlag_url", "countryDescription"].indexOf(k) === -1) {typeof v !== "string" || noNumbers_NoSpecial.test(v) ? arr.push(k) : null}} return arr };
	  
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
	let validation;
	
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
			reason: "Invalid required values",
			error: true,
			title: "Incorrect values",
			msg: "Some required key values are invalid. Please make sure that there are not special characters nor numbers." 
		},
		{ 
			reason: "countryFlag value empty",
			error: true, 
			title: "Invalid Flag Data", 
			msg: "If country Flag set to 'yes', country flag value cannot be empty, nor contain less than 3 characters."
		},
		{	reason: "countryFlag value unauthorized",
			error: true,
			title: "Incorrect countryFlag Value",
			msg: "The country flag field must exist and has to be composed of letters only (at least 3 characters)."
		},
		{	reason: "countryDescription value unauthorized",
			error: true,
			title: "Incorrect countryDescription Value",
			msg: "The country description field must exist and has to be composed of letters only (at least 10 characters)."
		},
		{
			reason: "countryDescription value empty",
			error: true, 
			title: "Invalid countryDescription Input", 
			msg: "If country description set to 'yes', description field cannot be empty, nor contain less than 10 characters."
		},
		{
			reason: "Flag or Description not not checked",
			error: true, 
			title: "Flag or Description checked values not detected", 
			msg: "You need to check or uncheck flag and description options to confirm the edition."
		},
		{
			reason: "Missing required Fields",
			error: true, 
			title: "Required Fields Not Detected", 
			msg: "" // To modify on the fly
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
		validation = 0;
		} else {
		validation = 1
		}
	} else if(req === 'PATCH') {
		
		const requiredPatchKeys = ["countryId", "countryName", "continentId"];
		const arr = Object.keys(body).filter((k) => requiredPatchKeys.indexOf(k) > -1);
		/*
		for(let [k,v] of Object.entries(body)) {
			requiredPatchKeys.indexOf(k) === -1 ? arr.push(k) : null;
		}
		*/
		
		if(arr.length !== 3){
		validation = 0;
		results.push(reasons.filter((err) => err.reason === "Missing required Fields").map((err) => {return {reason: err.reason, error: true, msg: `On the three required fields, only ${arr.join(", and ")} were received in the request.`}} )[0])
	
		} else {
		const patchKeys = Object.keys(body);
		
	const patchVal = Object.values({ ...body.countryId, ...body.countryName, ...body.continentId });
		
		patchVal.filter((v) => noNumbers_NoSpecial.test(v) === true).length > 0 ? (validation = 0, results.push(reasons.filter((err) => err.reason === "Invalid required values")[0])) : validation = 1;
		
		}
	}
	
	if(validation === 1) {
		
		authorizedContinents.indexOf(body.continentId.toUpperCase()) === -1 ? results.push(reasons.filter((err) => err.reason === "Invalid Continent ID")[0]): null;
	
	if(req === 'POST') {
		
		if(body.hasFlag === true) {
			
			if(!body.hasOwnProperty("countryFlag_url")) {
				 results.filter((r) => r.reason === "countryFlag value unauthorized").length === 0 ? results.push(reasons.filter((err) => err.reason === "countryFlag value unauthorized")[0]) : null;
			} else {
			
			checkFlag_url.length > 0 ? results.push(reasons.filter((err) => err.reason === "countryFlag value unauthorized")[0]) : null;
			
			body.countryFlag_url === '' || body.countryFlag_url.length < 3 ? results.push(reasons.filter((err) => err.reason === "countryFlag value empty")[0]) : null;
			
		}}
		
		if(body.hasDescription === true) {
			
			if(!body.hasOwnProperty("countryDescription")){
				
				results.push(reasons.filter((err) => err.reason === "Incorrect countryDescription Value"));
				
			} else {
			checkDescription.length > 0 ? results.push(reasons.filter((err) => err.reason === "countryDescription value unauthorized")[0]) : null;
			
			!body.hasOwnProperty("countryDescription") && results.filter((r) => r.reason === "countryDescription value unauthorized").length === 0 ? results.push(reasons.filter((err) => err.reason === "countryDescription value unauthorized")[0]) : null;
			
			body.countryDescription === '' || body.countryDescription.length < 10 ? results.push(reasons.filter((err) => err.reason === "countryDescription value empty")[0]) : null;
			
			}
		}} else if (req === 'PATCH') {
		
		const Not_hasFlag_key = !body.hasOwnProperty('hasFlag') || !body.hasOwnProperty('hasDescription');
		
		const Not_hasFlag_type = typeof body.hasFlag !== 'boolean' || typeof body.hasDescription !== 'boolean';

		Not_hasFlag_key || Not_hasFlag_type ? results.push(reasons.filter((err) => err.reason === 'Flag or Description not not checked')[0]) : null;
	
		if(body.hasFlag === true) {
			
			if(!body.hasOwnProperty("countryFlag_url")) {
				
				results.filter((r) => r.reason === "countryFlag value unauthorized").length === 0 ? results.push(reasons.filter((err) => err.reason === "countryFlag value unauthorized")[0]) : null;
			
			} else {			
			
			checkFlag_url.length > 0 ? results.push(reasons.filter((err) => err.reason === "countryFlag value unauthorized")[0]) : null;
			
			body.countryFlag_url === '' || body.countryFlag_url.length < 3  ? results.push(reasons.filter((err) => err.reason === "countryFlag value empty")[0]) : null;
			}
		}
		
		if(body.hasDescription === true) {
			
			if(!body.hasOwnProperty("countryDescription")){
				
			results.filter((r) => r.reason === "countryDescription value unauthorized").length === 0 ? results.push(reasons.filter((err) => err.reason === "countryDescription value unauthorized")[0]) : null;
				
			} else {
			
			checkDescription.length > 0 ? results.push(reasons.filter((err) => err.reason === "countryDescription value unauthorized")[0]) : null;
			
			body.countryDescription === '' || body.countryDescription.length < 10 ? results.push(reasons.filter((err) => err.reason === "countryDescription value empty")[0]) : null;
			
		}
	}}}
			
		return results.filter((elem) => elem !== undefined && elem !== null)
}

export { bodyValidator }