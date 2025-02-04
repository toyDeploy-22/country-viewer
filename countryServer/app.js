
import Express from "express";
import cors from "cors";
import countryPoolAsync from "./myCountryPool.js";
import myCountryRoutes from "./myCountryRoutes.js";

// Variables
const myServer = Express();

const myPort = process.env.MY_PORT || 5000;


const countryPoolConn = async() => {
	try {
		const conn = await countryPoolAsync.getConnection();
		console.log("Countries database connection successful!" + "\n" + "Your connection ID: " + conn.threadId)
	}
	catch(err){
		console.error("Countries database connection failed:", err.stack)
	}
}


// Middlewares
myServer.use(Express.json());
myServer.use(cors());
myServer.use("/", myCountryRoutes);

// Method
await countryPoolConn();

myServer.listen(myPort, ()=>
console.log("server connected !")
)

myServer.on("error", 
            (err)=>console.error("server not connected:", err)
           )

