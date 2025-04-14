
import Express from 'express';
import cors from 'cors';
// import mysql from 'mysql2/promise';
import mongoose from "mongoose";
import countryModel from "./countryModel.js";
// import countryPoolAsync from './myCountryPool.js';
import { bodyValidator } from './countryValidations.js';


const myCountryRoutes = Express.Router();

// get all countries
myCountryRoutes.get("/allcountries", async(req,res)=>{
  // connection
 
try { 

   // Query
 const myQuery = await countryModel.find({});
 const myResults = { resultsFound: myQuery.length + " countries" }
 
 console.log(myResults);
 res.json(myResults);
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
 
// get country with exact country name (SENSIBLE QUERY)
myCountryRoutes.get("/country/:country", async(req,res)=>{
 try { 
	const firstPart = req.params.country[0].toUpperCase(); // will not find without uppercase
	const secondPart = req.params.country.substring(1).toLowerCase();
	const country_Exact_Name = firstPart + secondPart;
	
	const myResult = await countryModel.findOne({ countryName: country_Exact_Name }) // return object type
 
 if(!myResult) {
	 const myObj = {
		  error: true,
		  title: "Country Not Found",
		  msg: `The country "${country_Exact_Name}" is not found.`
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


// Search by characters
myCountryRoutes.get("/countrysearch/:countryQuery", async(req,res)=>{
 try { 
	
	const countryName = req.params.countryQuery;
	
	if(countryName.length < 2) {
		
		 const myObj = {
		  error: true,
		  title: "Few Characters",
		  msg: `You must type at least two characters in order to search your country.`
	 };	
	
	res.status(404).json(myObj)
	} else {
	const myQuery = {
	 $regex: countryName,
	 $options: "i"
	};
 
	const myResult = await countryModel.find({ countryName: {...myQuery} }); // returns Array object type
	
	if(myResult.length < 1) {
	 const myObj = {
		  error: true,
		  title: "Country Not Found",
		  msg: `No country containing "${countryName}" were found.`
	 };	
	
	res.status(404).json(myObj)
	} else {
		res.json(myResult)
		}}
	} catch(err) {	
	console.error(err);
	const obj = {error: true, title: "Internal Server Error", msg: err.message};
	res.status(500).json(obj);
	}
})


myCountryRoutes.options("/addcountry", cors());
  
myCountryRoutes.post("/addcountry", cors(), async(req, res)=>{

try {
	const checker = bodyValidator("POST", req.body);
	
	 console.log(checker)
	
	if(checker.length > 0) {
		const obj = {
		err: true,
		msg: "The creation country request is not authorized for the following reasons: ",
		reasons: checker		
		};
		
		console.log(obj.reasons);
		res.status(401).json(obj)
	} else {
	
  const { countryId, countryName, continentId, hasFlag, hasDescription } = req.body; 
  
  const country = {
	  countryId: countryId.toUpperCase(),
	  countryName: countryName.substring(0,1).toUpperCase() + countryName.substring(1).toLowerCase(),
	  continent: {
		  continentId: continentId
	  }
  };
  
 const isDuplicate = await countryModel.find({$or: [
			{countryId: country.countryId}, 
			{countryName: country.countryName}
			]});  

  
	if(isDuplicate.length > 0){
	  const obj = {
			reason: "duplicate country",
			error: true,
			title: "Country already exists",
			msg: "The country creation failed because the country Name or country Id entered already exists." 		  
	  }
	  console.log("duplicate");
	  res.status(401).json(obj)
	  
  } else {
	  
	req.body.hasOwnProperty('countryFlag_url') ? Object.assign(country, {countryFlag_url: req.body.countryFlag_url }) : null;  
   req.body.hasOwnProperty('countryDescription') ? Object.assign(country, { countryDescription: req.body.countryDescription }) : null;
   
   // const finalResult = await new countryModel.create(country).save();
	// console.log(country)
	const newCountry = new countryModel(country)
	const finalResult = await newCountry.save();
	
	console.log(finalResult)
	res.status(201).json({ insertedRow: 1 })
	
	}}} catch(err){
	console.error(err);
	const obj = {error: true, title: "Internal Server Error", msg: err.message};
	res.status(500).json(obj);	
	}
  })                    



myCountryRoutes.options("/editcountry/:country", cors());

myCountryRoutes.patch("/editcountry/:country", cors(), async(req,res)=>{
// edit only country flag and (or) country description field
try {

const editCountry = req.params.country.substring(0, 1).toUpperCase() + req.params.country.substring(1).toLowerCase();
const checker = bodyValidator('PATCH', req.body);

if(checker.length > 0) {
		const obj = {
		err: true,
		msg: "The edition country request is not authorized for the following reasons: ",
		reasons: checker		
		};
		
		console.log(obj.reasons);
		res.status(401).json(obj)	
	} else {
		
const countryProps = {};

		req.body.hasOwnProperty('countryFlag_url') ? Object.assign(countryProps, {countryFlag_url: req.body.countryFlag_url }) : null;  
   req.body.hasOwnProperty('countryDescription') ? Object.assign(countryProps, { countryDescription: req.body.countryDescription }) : null;

	const finalResult = await countryModel.findOneAndUpdate({countryName: editCountry}, {...countryProps}, {runValidators: true}); // no need to specify '$set'  
	
	console.log(finalResult)
	
	switch(!finalResult) {
		
		case true:
	console.error(failure);
    res.status(404).json(failure);
	break;
		
		case false:
	const obj = { editedRow: 1 };
	console.log({ok: {...obj}});
	res.status(202).json(obj) // Accepted	
			}
		}
	} catch(err) {
	const obj = {error: true, title: "Internal Server Error", msg: err.message};
	console.error(obj);
	res.status(500).json(obj);	  
	  }
  })




myCountryRoutes.delete("/deletecountry/:country", async(req, res)=>{
	// Delete by country ID or country Name 
	try {
	
    const countryDelete = req.params.country;
	const isCountryName = countryDelete.substring(0, 1).toUpperCase() + countryDelete.substring(1).toLowerCase();
	const isCountryID = countryDelete.toUpperCase();
	
	const finalResult = await countryModel.findOneAndDelete({$or: [
	{countryId: isCountryID}, 
	{countryName: isCountryName}
	]})
	
	if(!finalResult){
	const obj = {
	error: true, 
	title: "No Result found", 
	msg: "Deletion failed because the query did not match any country."};
	console.error(obj)
	res.status(404).json(obj)
	} else {
	console.log(finalResult);
    res.json({deletionRow: 1});
        }
	} catch(err) {
	const obj = {error: true, title: "Internal Server Error", msg: err.message};
	console.error(obj);
	res.status(500).json(obj);	 	
		}
})


export default myCountryRoutes;
