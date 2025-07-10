import express from 'express';
import multer from 'multer';
import path from 'path';
import db from './db.js';

const router = express.Router();

// ✅ Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images'); // Make sure this is lowercase and matches folder name
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); 
    cb(null, Date.now() + '-' + file.fieldname + ext);
  },
});
const upload = multer({ storage });

// ✅ Upload route
router.post('/addbillboard/billboards', (req, res) => {
  upload.fields([
    { name: 'imageL' },
    { name: 'imageR' },
    { name: 'image2' }
  ])(req, res, (err) => {
    if (err) {
      console.error("❌ Multer error:", err);
      return res.status(500).send("File upload failed");
    }

    const data = req.body;
    const imageR = req.files?.imageR?.[0]?.filename || '';
    const imageL = req.files?.imageL?.[0]?.filename || '';
    const image2 = req.files?.image2?.[0]?.filename || '';

    const query = `
      INSERT INTO billboards 
      (name, price, lat, lang, address, size, type, status, imageL, imageR, image2)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id
    `;

    const values = [
      data.name, data.price, data.lat, data.lang,
      data.address, data.size, data.type, data.status,
      imageL, imageR, image2
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("❌ PostgreSQL Error:", err);
        return res.status(500).send("Database insert failed");
      }

      res.json({
        id: result.rows[0].id,
        ...data,
        imageL,
        imageR,
        image2
      });
    });
  });
});

// ✅ GET route to list billboards
router.get('/', (req, res) => {
  db.query('SELECT * FROM billboards', (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result.rows);
  });
});

// ✅ Serve images
router.use('/uploads', express.static('public/images'));

export default router;
