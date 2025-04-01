
import Express from 'express';
import cors from 'cors';
// import mysql from 'mysql2/promise';
import mongoose from "mongoose";
import countryModel from "./countryModel";
// import countryPoolAsync from './myCountryPool.js';
import { mongoTypesCheck, mongoosePatchCheck, mongooseDeleteCheck } from './countryFunctions.js';


const myCountryRoutes = Express.Router();

myCountryRoutes.get("/allcountries", async(req,res)=>{
  // connection
 
try { 

   // Query
 const myResults = await countryModel.find({});
 
 console.log({ resultsFound: myResults.length });
 res.json(results);
} catch(err) {
         const obj = {
			 error: true,
			 title: "Server Error: unable to find countries",
			 msg: err.message
		 };
		 console.error(err);
         res.status(500).json(obj)
	}
})
 
 
myCountryRoutes.get("/country/:country", async(req,res)=>{
 try { 
 
	const country_Exact_Name = req.params.country;
	const myResult = await countryModel.find({ countryName: country_Exact_Name })
 
 if(!myResult) {
	 const myObj = {
		  error: true,
		  title: "Country Not Found",
		  msg: `The country "${countryName}" is not found.`
	 };
		res.status(404).json(myObj)
 } else {
		res.json(myResult) 
		}
	} catch(err) {	
	console.error(err);
	const obj = {error: true, title: "Internal Server Error", msg: err.message};
	res.status(500).json(obj);
	}
})


// Search by name
myCountryRoutes.get("/countrysearch/name", async(req,res)=>{
 try { 
	
	const countryName = req.params.country;
	const myQuery = {
	 $regex: countryName,
	 $options: "i"
	};
 
	const myResult = await countryModel.find({ countryName: {...myQuery} }); 
	
	if(!myResult) {
	 const myObj = {
		  error: true,
		  title: "Country Not Found",
		  msg: `No country containing "${countryName}" were found.`
	 };	
	
	res.status(404).json(myObj)
	} else {
		res.json(myResult) 
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
const checkTypes = mongoTypesCheck(req.body);

if(checkTypes.length > 0) {
	console.error("A or more types not authorized detected");
	res.status(401).json({
		error: true,
		title: "Unauthorized: Incorrect Value",
		msg: `The ${checkTypes.join(", ")} fields must be only composed of letters.` 		
	})
} else {
  const { countryId, countryName, continentId, hasFlag, hasDescription } = req.body; 
  const country = {
	  countryId: countryId.toUpperCase(),
	  countryName: countryName.substring(0,1).toUpperCase() + countryName.substring(1).toLowerCase(),
	  continent: {
		  continentId: continentId
	  }
  };
  
  if(hasFlag === true) {
	if(req.body.countryFlag_url === '' && req.body.countryDescription === '' || typeof req.body.countryFlag_url === 'undefined' && typeof req.body.countryDescription === 'undefined'){
	const obj = {
	 error: true, 
	 title: "Invalid Flag Data", 
	 msg: "If country Flag set to 'yes', flag value cannot be empty."
	 };
	 valid = 0;
	 failure = {...obj} 
	  } else {
		 const checkFlag_url = mongoTypesCheck({countryFlag_url: req.body.countryFlag_url});
		 
		if(checkFlag_url.length > 0){
		console.error("A or more types not authorized detected");
		res.status(401).json({
		error: true,
		title: "Unauthorized: Incorrect Value",
		msg: `The ${checkTypes.join(", ")} fields must be only composed of letters.` })
		} else {
			country.countryFlag_url = req.body.countryFlag
	  }
  };
  
  if(hasDescription === true) {
	 if(req.body.countryDescription === '' && req.body.countryFlag_url === ''  || typeof req.body.countryDescription === 'undefined' && typeof req.body.countryFlag_url === 'undefined'){
	const obj = {
	 error: true, 
	 title: "Invalid Description Data", 
	 msg: "If country Description set to 'yes', the field cannot be empty."
	 };
	 valid = 0;
	 failure = {...obj};
	  } else {
	  const checkDescription = mongoTypesCheck({countryDescription: req.body.countryDescription});
	  if(checkDescription.length > 0) {
		console.error("A or more types not authorized detected");
		res.status(401).json({
		error: true,
		title: "Unauthorized: Incorrect Value",
		msg: `The ${checkTypes.join(", ")} fields must be only composed of letters.` })
	  } else {
	  country.countryDescription = req.body.countryDescription;
	  }
	}
  }
  
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
}}
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
