
import Express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import countryPoolAsync from './myCountryPool.js';
import { statementPostCheck, statementPatchCheck, statementDeleteCheck } from './countryFunctions.js';


const myCountryRoutes = Express.Router();

myCountryRoutes.get("/allcountries", async(req,res)=>{
  // connection
  // Alternatively, there is also the possibility of manually acquiring a connection from the pool and returning it later:
 
try { 
 const conn = await countryPoolAsync.getConnection();
   
   // Query
 const myStatement = "SELECT * FROM ??";
 const plc = "countries";
 const formatter = mysql.format(myStatement, [plc]);
 
 const myQuery = await conn.query(formatter);
 const results = myQuery[0].map(country => country);
 conn.release();
 
 console.log({ resultsFound: results.length });
 res.json(results);
} catch(err) {
         const obj = {
			 error: true,
			 title: "Unable to get all the results",
			 msg: err.message
		 };
		 console.error(err);
         res.status(500).json(obj)
	}
})
 
// search with exact name
myCountryRoutes.get("/country/:country", async(req,res)=>{
 try { 
 
 const conn = await countryPoolAsync.getConnection();
 const countryName = req.params.country;
 const plc1 = "countries";
 const plc2 = "country_name";
 const myStatement = "SELECT * FROM ?? WHERE ?? = ? LIMIT 1";
 const formatter = mysql.format(myStatement, [plc1, plc2, countryName]);
 
  // query
 const myQuery = await conn.query(formatter);
 // because myQuery returns a 2D array: [[{result}],[table schema]]
 const result = myQuery[0]; // Will send only one object
 // if 0 result found, returns empty array
 conn.release();
 
 if(result.length > 0) {
	 const obj = result[0];
	 res.json(obj)
 } else {
	 const obj = {
	 error: true, 
	 title: "No Result found", 
	 msg: "The query does not have any result."
	 };
	 console.error(obj);
	 res.status(404).json(obj)	 
		}
	} catch(err) {	
	console.error(err);
	const obj = {error: true, title: "Internal Server Error", msg: err.message};
	res.status(500).json(obj);
	}
})




// Search with occurence letters include letters query
myCountryRoutes.get("/countrysearch/name", async(req,res)=>{
 try { 
 
 const conn = await countryPoolAsync.getConnection();
 const plc1 = "countries";
 const plc2 = "country_name";
 const query = req.query.countryname;
 const plc3 = "%" + query + "%";
 const myStatement = "SELECT * FROM ?? WHERE LOWER(??) LIKE ?";
 // LOWER = convert query in lowercase
 const formatter = mysql.format(myStatement, [plc1, plc2, plc3]);

  // query
 const myQuery = await conn.query(formatter);
 // because myQuery returns a 2D array: [[{result}],[table schema]]
 const result = myQuery[0];
 // if 0 result found, returns empty array
 conn.release();
 
 if(result.length > 0) {
	 const obj = result; // Will send array of objects as results
	 res.json(obj)
 } else {
	 const obj = {
	 error: true, 
	 title: "No Result found", 
	 msg: "The country name search does not have any result."
	 };
	 console.error(obj);
	 res.status(404).json(obj)	 
		}
	} catch(err) {	
	console.error(err);
	const obj = {error: true, title: "Internal Server Error", msg: err.message};
	res.status(500).json(obj);
	}
})


myCountryRoutes.options("/addcountry", cors());
  
myCountryRoutes.post("/addcountry", cors(), async(req, res)=>{

try {
let valid = 1;
let failure = {};
const conn = await countryPoolAsync.getConnection();

const { countryId, countryName, continentId, hasFlag, hasDescription } = req.body; 

  const country = {
	  country_id: countryId.toUpperCase(),
	  country_name: countryName.substring(0,1).toUpperCase() + countryName.substring(1).toLowerCase(),
	  continent_id: continentId
  };
  
  if(hasFlag === true) {
	if(req.body.countryFlag === '' && req.body.countryDescription === '' || typeof req.body.countryFlag === 'undefined' && typeof req.body.countryDescription === 'undefined'){
	const obj = {
	 error: true, 
	 title: "Invalid Flag Data", 
	 msg: "If set to 'yes', flag value cannot be empty."
	 };
	 valid = 0;
	 failure = {...obj}
	 conn.release();	 
	  } else {
		country.country_flag = req.body.countryFlag;
	  }
  };
  
  if(hasDescription === true) {
	 if(req.body.countryDescription === '' && req.body.countryFlag === ''  || typeof req.body.countryDescription === 'undefined' && typeof req.body.countryFlag === 'undefined'){
	const obj = {
	 error: true, 
	 title: "Invalid Description Data", 
	 msg: "If set to 'yes', description value cannot be empty."
	 };
	 valid = 0;
	 failure = {...obj};
	 conn.release();
	  } else {
	  country.country_description = req.body.countryDescription;
	}
  }

/*  
No needed because PRIMARY KEY set to country_id (so no duplicate allowed)
&& country_name column set to UNIQUE
const checkerStatement = "SELECT * FROM ?? WHERE ?? = ? OR ?? = ?";
const checkerFormat = mysql.format(checkerStatement, [plc1, plc2, country.country_name, plc3, country.country_id]);
  
const checkerQuery = await conn.query(checkerFormat);
const checkerResult = checkerQuery.length;


if(checkerResult > 0){
	conn.release();
    const obj = {error: true, title: "Duplicate Country", msg: "The country ID or name does already exist in the database."};
	console.error(JSON.stringify(obj));
    res.status(401).json(obj);
  }

*/  
if(valid === 0) {
	res.status(401).json(failure);
} else {
	const finalResult = await statementPostCheck(country, mysql, conn);
	  
 switch (finalResult === 1) {
	case true:
	const obj = { affectedRows: 1 };
	console.log(obj);
	conn.release(); // don't include it in the function statementPostCheck
	res.status(201).json(obj);
	break;
	
	case false: 
	console.error(finalResult);
	conn.release(); // don't include it in the function statementPostCheck
	res.status(400).json(finalResult);	
		}
}
	} catch(err){
	console.error(err);
	const obj = {error: true, title: "Internal Server Error", msg: err};
	res.status(500).json(obj);	
	}
  })                    






myCountryRoutes.options("/editcountry/:country", cors());

myCountryRoutes.patch("/editcountry/:country", cors(), async(req,res)=>{

try {
let valid = 1;
let failure = {};
const conn = await countryPoolAsync.getConnection();
const editCountry = req.params.country;

// Object.keys && Object.values manual 
const countryProps = [ ];
const countryVal = ["countries"];

if(req.body.hasFlag === true){
	if(req.body.countryFlag === '' || typeof req.body.countryFlag === 'undefined'){
	const obj = {
	 error: true, 
	 title: "Invalid Flag Data", 
	 msg: "If set to 'yes', flag value cannot be empty."
	 };
	 conn.release();
	 valid = 0;
	 failure = {...obj};
	 } else {
  countryProps.push("country_flag");
  countryVal.push(req.body.countryFlag);
		}
	}


if(req.body.hasDescription === true){
	if(req.body.countryDescription === '' || typeof req.body.countryDescription === 'undefined'){
	 const obj = {
	 error: true, 
	 title: "Invalid Description Data", 
	 msg: "If set to 'yes', description value cannot be empty."
	 };
	 conn.release();
	 valid = 0;
	 failure = {...obj};
	  } else {
	countryProps.push("country_description");
	countryVal.push(req.body.countryDescription);
		}
	} 


 if(valid === 0) {
	console.error(failure);
	conn.release();
	res.status(401).json(failure);	 	 
 } else {
	countryProps.push("country_name");
	countryVal.push(editCountry);
	const finalResult = await statementPatchCheck(countryProps, countryVal, mysql, conn); 
	
	switch(finalResult === 1) {
		
		case true:
	const obj = { affectedRows: 1 };
	conn.release(); 
	console.log(obj);
    res.status(202).json(obj);
	break;
		
		case false:
	conn.release();
	console.log(obj);
	res.status(404).json(finalResult)	
			}
		}
	} catch(err) {
	const obj = {error: true, title: "Internal Server Error", msg: err};
	console.error(obj);
	res.status(500).json(obj);	  
	  }
  })




myCountryRoutes.delete("/deletecountry/:country", async(req, res)=>{
	try {
	const conn = await countryPoolAsync.getConnection();
    const placeholders = {
	plc1: 'countries',
	plc2: 'country_name',
	plc3: req.params.country,
	};
	const country = Object.values(placeholders);
	
	
	const result = await statementDeleteCheck(country, mysql, conn);
    conn.release();
	
	if(result.affectedRows === 0){
	const obj = {
	error: true, 
	title: "No Result found", 
	msg: "Deletion failed because the query does not have any result."};
	console.error(obj)
	res.status(404).json(obj)
	} else {
	console.log(result);
    res.json(result);
        }
	} catch(err) {
	const obj = {error: true, title: "Internal Server Error", msg: err};
	console.error(obj);
	res.status(500).json(obj);	 	
		}
})


export default myCountryRoutes;
