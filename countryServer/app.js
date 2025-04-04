// Core
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// 3rd party
import Express from "express";
import cors from "cors";

// Local
// import myCountryRoutes from "./SQL/myCountryRoutes.js";
import countryPoolAsync from "./NoSQL/myCountryPool.js";
import myCountryRoutes from "./NoSQL/myCountryRoutes.js";

// Variables
const myServer = Express();
let connectionData = new Object();
const {MY_PORT, MY_MONGO_DB, MY_MONGO_LOCAL} = process.env;
const options = { dbName: MY_MONGO_DB };
const successPage = join(dirname(fileURLToPath(import.meta.url)), "htmlSuccessPage.html");

// const myPort = process.env.MY_PORT || 5000;

/*
const countryPoolConn = async() => {
	try {
		const conn = await countryPoolAsync.getConnection();
		console.log("Countries database connection successful!" + "\n" + "Your connection ID: " + conn.threadId)
	}
	catch(err){
		console.error("Countries database connection failed:", err.stack)
	}
}
*/

// Middlewares
myServer.use(Express.json());
myServer.use(cors());
// myServer.use("/sql", myCountryRoutes);
myServer.use("/nosql", myCountryRoutes);

myServer.get("/", (req, res) => {
	try {
		if(connectionData.hasOwnProperty('db_Host')) {
		console.log("DB data collection successful");
		for (const [k, v] of Object.entries(connectionData)) {
			res.setHeader(k, v)
			}
		res.sendFile(successPage)
		} else {
		res.status(400).send("The database could not connect this time. Please try to refresh the page.")
		}
	} catch(err) {
		console.error(err);
		res.status(500).send("Ooops, something wrong occurs. Please try to connect again and contact your administrator if you see this page back.")
		}
})

// Method
// await countryPoolConn();


myServer.listen(MY_PORT || 5000, async() => {
	console.log("server connected !");
	const conn = await countryPoolAsync(MY_MONGO_LOCAL, options);
	connectionData = {...conn} // overwrite
	console.log("Database connected !")
})

myServer.on("error", 
            (err) => console.error("ErrorMessage-Event: ", err.message)
           )

