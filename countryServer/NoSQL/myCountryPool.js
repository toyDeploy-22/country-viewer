
import mongoose from "mongoose";

let result;

async function countryPoolAsync(URI, opts) {
	try {
	result = new Object();
	
	await mongoose.connect(URI, opts);
	result.Db_Service = "Mongo DB";
	result.Db_Database = "country-viewer";
	result.db_Host = "cgf6u.mongodb.net"
	}
	catch(err){
	result = new Object({...err})
	}
	return result
}

export default countryPoolAsync;