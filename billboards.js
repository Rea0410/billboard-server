import express from 'express';
import multer from 'multer';
import path from 'path';
import db from './db.js';

const router = express.Router();

// ✅ Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Public/Images');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); 
cb(null, Date.now() + '-' + file.fieldname + ext);

  },
});

const upload = multer({ storage: storage });

// ✅ Billboard upload route
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

    // console.log('📝 Body:', data);
    // console.log('📂 Files:', req.files);

    const query = `
      INSERT INTO billboards 
      (name, price, lat, lang, address, size, type, status, imageL, imageR, image2)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [
      data.name, data.price, data.lat, data.lang,
      data.address, data.size, data.type, data.status,
      imageL, imageR, image2
    ], (err, result) => {
      if (err) {
        console.error("❌ MySQL Error:", err);
        return res.status(500).send("Database insert failed");
      }

      res.json({ id: result.insertId, ...data, imageL, imageR, image2 });
    });
  });
});

router.get('/', (req, res) => {
  res.json({ message: "API working without DB" });
});

// Optional: Serve images statically
router.use('/uploads', express.static('public/images')); 

export default router;
