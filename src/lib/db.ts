import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  port: parseInt(process.env.DB_PORT!, 10),
  password: process.env.DB_PASS!,
  database: process.env.DB_NAME!,
  waitForConnections: true,
  connectionLimit: 100, 
  queueLimit: 0,
});

export default pool;