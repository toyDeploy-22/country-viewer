import mysql from 'mysql2';

const { MY_HOST, My_USER, My_DB, My_PWD } = process.env;

const myPool = {
  host: MY_HOST,
  user: My_USER,
  database: My_DB,
  password: My_PWD
};

const countryPool = mysql.createPool(myPool);

const countryPoolAsync = countryPool.promise();

export default countryPoolAsync;