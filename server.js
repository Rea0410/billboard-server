import express from 'express';
import cors from 'cors';
import billboardRoutes from './billboards.js';
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'Public/Images')));


app.use('/api/billboards', billboardRoutes); 

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

