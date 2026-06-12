// pages/api/_db.js
import { Pool } from 'pg';

const pool = new Pool({
  user: 'username',
  host: 'host',
  database: 'database',
  password: 'password',
  port: 5432,
});

export default async function (req, res) {
  try {
 const client = await pool.connect();
 // lakukan query ke database
 res.success(true);
  } catch (err) {
 console.error(err);
 res.status(500).json({ message: 'Error connection' });
  } finally {
 pool.end();
  }
}