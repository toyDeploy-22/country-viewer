


async function statementPostCheck(country, sql, connection) {
let failure = [];

try {
let myStatement = "";
const plc = 'countries';
const columns = Object.keys(country);
const values = Object.values(country);
const totalCol = columns.filter((col) => col === 'country_flag' || col === 'country_description').length;

// Get statement
if(totalCol === 2){
	myStatement = "INSERT INTO ?? (??, ??, ??, ??, ??) VALUES(?,?,?,?,?)"
	} else if(totalCol > 0){
	myStatement = "INSERT INTO ?? (??, ??, ??, ??) VALUES(?,?,?,?)"
	} else {
	myStatement = "INSERT INTO ?? (??, ??, ??) VALUES(?,?,?)"
	}

const formatter = sql.format(myStatement, [plc, ...columns, ...values]);
  
   // query
  const myQuery = await connection.query(formatter);
  failure.push(myQuery);
  /*
If creation successful:  [{"fieldCount":0,"affectedRows":1,"insertId":0,"info":"","serverStatus":2,"warningStatus":0,"changedRows":0},null]
  */
  
  const result = myQuery[0].affectedRows;
  return result;
	} catch(err) {
		const obj = { error: true, msg: err, query: failure }
		return obj; 
	}   

}





  async function statementPatchCheck(props, val, sql, connection) {
	  const failure = [];
	  try {
  let placeholder = [];
  const valNoCountries = val.filter((v)=> v !== 'countries');
  const findEntries = props.filter((prop) => prop === 'country_flag' || prop === 'country_description').length;
  let myStatement = '';
  
  props.forEach((update)=>{
	  let i = props.indexOf(update);
	  placeholder.push(update, valNoCountries[i])
	  });
  
  if( findEntries === 2){
	  myStatement = "UPDATE ?? SET ?? = ?, ?? = ? WHERE ?? = ?"  
  } else if(findEntries === 1) {
	  myStatement = "UPDATE ?? SET ?? = ? WHERE ?? = ?"  
  } else {
	  const obj = {error: true, title: "No Update Received", msg: "In order for the update to be successful, you need to amend at least one field."};
	  console.error(obj);
	  return obj;
  }
  
  // query
  const formatter = sql.format(myStatement, [val[0], ...placeholder]);
  const myQuery = await connection.query(formatter);
  failure.push(myQuery);
  
  
 /* 
 SQL query when POST or PATCH is successful :
 
 [
	{
		"fieldCount": 0,
		"affectedRows": 1,
		"insertId": 0,
		"info": "Rows matched: 1  Changed: 1  Warnings: 0",
		"serverStatus": 34,
		"warningStatus": 0,
		"changedRows": 1
	},
	null
]


IF NOT country Found:

	/** 
	If not found mysql sends :
	[
	{
		"fieldCount": 0,
		"affectedRows": 0,
		"insertId": 0,
		"info": "Rows matched: 0  Changed: 0  Warnings: 0",
		"serverStatus": 34,
		"warningStatus": 0,
		"changedRows": 0
	},
	null
]
	**/

	const result = myQuery[0].affectedRows;
	return result
	  } catch(err) {
	const obj = { error: true, msg: err, query: failure }
	return obj;   
	  }
  }
  
  
 async function statementDeleteCheck(val, query, connection) {
	const failure = [];
	try {
    const myStatement = "DELETE FROM ?? WHERE ?? = ?";
	const formatter = query.format(myStatement, val);

     // query      
    const myQuery = await connection.query(formatter);
	const result = {affectedRows: myQuery[0].affectedRows};
	return result;
	 } catch(err) {
		const obj = { error: true, msg: err, query: failure };
		console.error(obj);
		return obj
	 }
 }


export { statementPostCheck, statementPatchCheck, statementDeleteCheck }