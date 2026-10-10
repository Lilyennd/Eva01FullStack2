import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';


function leerCertificado() {
  if (process.env.DB_CA_CERT) {
    return process.env.DB_CA_CERT.replace(/\\n/g, '\n');
  }
  const ruta = path.join(process.cwd(), 'certs', 'ca.pem');
  if (fs.existsSync(ruta)) return fs.readFileSync(ruta);
  console.error('Falta el certificado de Aiven: define DB_CA_CERT o agrega certs/ca.pem');
  return undefined;
}

const ca = leerCertificado();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true,
  ssl: ca ? { ca } : undefined,
});

export default pool;