import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "antartika",
  waitForConnections: true,
  connectionLimit: 1000000000, 
  queueLimit: 0,
});

export default pool;
