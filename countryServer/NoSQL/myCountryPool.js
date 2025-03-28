import mongoose from "mongoose";


const countryPoolAsync = async(uri) => {
	try {
		await mongoose.connect(uri);
		const connDetails = {
			db_Name: "Country-Viewer",
			db_Service: "MongoDB",
			db_Host: "cgf6u.mongodb.net",
			db_Port: 27017
		}; 
		return connDetails
	} catch(err) {
		return "PoolAsync Connection failed: " + err.message;
	}
}

export default countryPoolAsync;