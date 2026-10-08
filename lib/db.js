import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  // Aiven obliga a usar SSL: aquí leemos el certificado que descargaste
  ssl: { ca: fs.readFileSync(path.join(process.cwd(), 'certs/ca.pem')) },
});

export default pool;