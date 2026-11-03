import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${cleanName}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 150 * 1024 * 1024, // 150 MB max limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedMime = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'video/x-matroska',
      'application/pdf',
    ];
    if (allowedMime.includes(file.mimetype) || file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
  },
});

// Upload API Route
app.post('/api/upload', (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size exceeds maximum allowed limit of 150MB.' });
      }
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const file = req.file;
    const isVideo = file.mimetype.startsWith('video/');
    const isImage = file.mimetype.startsWith('image/');
    const category = isVideo ? 'video' : isImage ? 'image' : 'document';
    const fileUrl = `/uploads/${file.filename}`;

    return res.status(200).json({
      success: true,
      url: fileUrl,
      filename: file.filename,
      originalName: file.originalname,
      fileType: file.mimetype,
      size: file.size,
      category,
    });
  });
});

// List Uploads API Route
app.get('/api/uploads', (_req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const fileList = files
      .filter((file) => !file.startsWith('.'))
      .map((file) => {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);
        const ext = path.extname(file).toLowerCase();
        const isVideo = ['.mp4', '.webm', '.mov', '.mkv'].includes(ext);
        const isImage = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext);
        const category = isVideo ? 'video' : isImage ? 'image' : 'document';
        return {
          filename: file,
          url: `/uploads/${file}`,
          size: stats.size,
          category,
          updatedAt: stats.mtime.toISOString(),
        };
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    res.json({ files: fileList });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read upload directory' });
  }
});

// Delete Upload API Route
app.delete('/api/uploads/:filename', (req, res) => {
  try {
    const filename = path.basename(req.params.filename);
    const filePath = path.join(uploadsDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return res.json({ success: true, message: 'File deleted successfully' });
    }
    return res.status(404).json({ error: 'File not found' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Data store directory
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const storeFile = path.join(dataDir, 'store.json');

function getStore() {
  if (fs.existsSync(storeFile)) {
    try {
      return JSON.parse(fs.readFileSync(storeFile, 'utf8'));
    } catch {
      return {};
    }
  }
  return {};
}

function saveStore(data: Record<string, any>) {
  try {
    fs.writeFileSync(storeFile, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing storeFile:', err);
  }
}

// Get Full Stored Portfolio Data
app.get('/api/data', (_req, res) => {
  const store = getStore();
  res.json({
    settings: store.settings || null,
    projects: store.projects || null,
    services: store.services || null,
    inquiries: store.inquiries || [],
  });
});

// Admin Passcode Fallback verification route for initial owner bootstrap
app.post('/api/admin/verify-passcode', (req, res) => {
  const { passcode } = req.body;
  const validPasscode = process.env.ADMIN_PASSCODE || 'kinetic2026';
  if (passcode === validPasscode) {
    return res.json({ success: true, authorized: true, role: 'admin' });
  }
  return res.status(401).json({ success: false, error: 'Invalid administrator credentials' });
});

// Server-side Admin Settings Save
app.post('/api/admin/save-settings', (req, res) => {
  const store = getStore();
  store.settings = { ...(store.settings || {}), ...req.body, updatedAt: new Date().toISOString() };
  saveStore(store);
  res.json({ success: true, settings: store.settings });
});

// Server-side Admin Project Save
app.post('/api/admin/save-project', (req, res) => {
  const store = getStore();
  const projects = store.projects || [];
  const project = req.body;
  const idx = projects.findIndex((p: any) => p.id === project.id);
  if (idx >= 0) {
    projects[idx] = project;
  } else {
    projects.push(project);
  }
  store.projects = projects;
  saveStore(store);
  res.json({ success: true, project });
});

// Server-side Admin Project Delete
app.post('/api/admin/delete-project', (req, res) => {
  const { id } = req.body;
  const store = getStore();
  store.projects = (store.projects || []).filter((p: any) => p.id !== id);
  saveStore(store);
  res.json({ success: true, id });
});

// Server-side Admin Service Save
app.post('/api/admin/save-service', (req, res) => {
  const store = getStore();
  const services = store.services || [];
  const service = req.body;
  const idx = services.findIndex((s: any) => s.id === service.id);
  if (idx >= 0) {
    services[idx] = service;
  } else {
    services.push(service);
  }
  store.services = services;
  saveStore(store);
  res.json({ success: true, service });
});

// Server-side Admin Service Delete
app.post('/api/admin/delete-service', (req, res) => {
  const { id } = req.body;
  const store = getStore();
  store.services = (store.services || []).filter((s: any) => s.id !== id);
  saveStore(store);
  res.json({ success: true, id });
});

// Server-side Inquiry Submission
app.post('/api/inquiry', (req, res) => {
  const inquiry = req.body;
  if (!inquiry.fullName || !inquiry.email || !inquiry.description) {
    return res.status(400).json({ error: 'Missing required inquiry fields.' });
  }
  const store = getStore();
  store.inquiries = store.inquiries || [];
  store.inquiries.unshift({
    id: `inq-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    ...inquiry,
    status: 'new',
    createdAt: new Date().toISOString(),
  });
  saveStore(store);
  res.json({ success: true, inquiry });
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    storage: 'hybrid-local-and-firebase',
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Vite middleware in dev
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production build
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`> KINETIC Video Editor Portfolio running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
