// db.js
import mysql from 'mysql2';

const db = mysql.createConnection({
  host: '127.0.0.1',      // don't use 'localhost' to avoid socket issues
  port: 3307,             // ✅ confirmed from your my.ini
  user: 'root',           // default user
  password: '',           // if blank in XAMPP
  database: 'viewbear'    // make sure this DB exists in phpMyAdmin
});

db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Successfully connected to MySQL!');
  }
});

export default db;
