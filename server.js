import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'backend_data.json');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Helper to load persisted backend data
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading backend_data.json:', err.message);
  }
  return {
    students: [],
    staffUsers: [],
    items: [], // Initially EMPTY as requested!
    orders: [],
  };
}

// Helper to save data to disk
function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving backend_data.json:', err.message);
  }
}

let db = loadData();

// -----------------------------------------------------------------
// HEALTH
// -----------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// -----------------------------------------------------------------
// AUTHENTICATION: STUDENT
// -----------------------------------------------------------------
app.post('/api/auth/student/signup', (req, res) => {
  const { name, rollNo, email, phone, department, password } = req.body;

  if (!name || !rollNo || !password) {
    return res.status(400).json({ success: false, error: 'Name, Roll Number, and Password are required.' });
  }

  const normalizedRoll = rollNo.trim().toUpperCase();
  const existing = db.students.find(
    (s) => s.rollNo.toUpperCase() === normalizedRoll || (email && s.email && s.email.toLowerCase() === email.trim().toLowerCase())
  );

  if (existing) {
    return res.status(409).json({ success: false, error: 'A student with this Roll Number or Email is already registered.' });
  }

  const newStudent = {
    id: `student_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    name: name.trim(),
    rollNo: normalizedRoll,
    email: email ? email.trim().toLowerCase() : '',
    phone: phone ? phone.trim() : '',
    department: department ? department.trim() : 'General',
    password: password.trim(), // In production, hash with bcrypt
    createdAt: new Date().toISOString(),
  };

  db.students.push(newStudent);
  saveData(db);

  // Return clean user object (without password)
  const user = {
    role: 'STUDENT',
    id: newStudent.id,
    name: newStudent.name,
    rollNo: newStudent.rollNo,
    email: newStudent.email,
    department: newStudent.department,
  };

  return res.status(201).json({ success: true, user });
});

app.post('/api/auth/student/signin', (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ success: false, error: 'Roll Number / Email and Password are required.' });
  }

  const cleanIdent = identifier.trim().toUpperCase();
  const student = db.students.find(
    (s) => s.rollNo.toUpperCase() === cleanIdent || s.email.toUpperCase() === cleanIdent
  );

  if (!student) {
    return res.status(404).json({ success: false, error: 'No student found with this Roll Number or Email. Please sign up first.' });
  }

  if (student.password !== password.trim()) {
    return res.status(401).json({ success: false, error: 'Incorrect password. Please try again.' });
  }

  const user = {
    role: 'STUDENT',
    id: student.id,
    name: student.name,
    rollNo: student.rollNo,
    email: student.email,
    department: student.department,
  };

  return res.json({ success: true, user });
});

// -----------------------------------------------------------------
// AUTHENTICATION: STAFF & NEW CANTEEN REGISTRATION
// -----------------------------------------------------------------
app.post('/api/auth/staff/signup', (req, res) => {
  const { canteenName, managerName, staffId, email, phone, counterLocation, password } = req.body;

  if (!canteenName || !managerName || !staffId || !password) {
    return res.status(400).json({ success: false, error: 'Canteen Name, Manager Name, Staff ID, and Password are required.' });
  }

  const cleanStaffId = staffId.trim().toLowerCase();
  const existing = db.staffUsers.find((s) => s.staffId.toLowerCase() === cleanStaffId);

  if (existing) {
    return res.status(409).json({ success: false, error: 'Staff ID is already registered. Please choose a different Staff ID.' });
  }

  const newStaff = {
    id: `staff_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    canteenName: canteenName.trim(),
    managerName: managerName.trim(),
    staffId: cleanStaffId,
    email: email ? email.trim().toLowerCase() : '',
    phone: phone ? phone.trim() : '',
    counterLocation: counterLocation ? counterLocation.trim() : 'Main Counter',
    password: password.trim(),
    createdAt: new Date().toISOString(),
  };

  db.staffUsers.push(newStaff);
  saveData(db);

  const user = {
    role: 'STAFF',
    id: newStaff.id,
    name: newStaff.managerName,
    staffId: newStaff.staffId,
    canteenName: newStaff.canteenName,
    counterLocation: newStaff.counterLocation,
  };

  return res.status(201).json({ success: true, user });
});

app.post('/api/auth/staff/signin', (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ success: false, error: 'Staff ID / Username and Password are required.' });
  }

  const cleanIdent = identifier.trim().toLowerCase();
  const staff = db.staffUsers.find(
    (s) => s.staffId.toLowerCase() === cleanIdent || s.email.toLowerCase() === cleanIdent
  );

  if (!staff) {
    return res.status(404).json({ success: false, error: 'No canteen staff found with this ID. Please sign up your canteen first.' });
  }

  if (staff.password !== password.trim()) {
    return res.status(401).json({ success: false, error: 'Incorrect security password. Please try again.' });
  }

  const user = {
    role: 'STAFF',
    id: staff.id,
    name: staff.managerName,
    staffId: staff.staffId,
    canteenName: staff.canteenName,
    counterLocation: staff.counterLocation,
  };

  return res.json({ success: true, user });
});

// -----------------------------------------------------------------
// MENU ITEMS
// -----------------------------------------------------------------
app.get('/api/items', (req, res) => {
  // Returns items from db (initially [] as specified)
  res.json(db.items || []);
});

app.post('/api/items', (req, res) => {
  const { name, price, quantity, category, isVeg, imageUrl, prepTime, description } = req.body;
  if (!name || price === undefined || quantity === undefined) {
    return res.status(400).json({ error: 'Name, price, and quantity are required.' });
  }

  const newItem = {
    id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    name: name.trim(),
    price: Number(price),
    quantity: Number(quantity),
    category: category || 'Snacks',
    isVeg: Boolean(isVeg),
    imageUrl: imageUrl || '',
    prepTime: Number(prepTime) || 10,
    description: description ? description.trim() : '',
    createdAt: new Date().toISOString(),
  };

  db.items.unshift(newItem);
  saveData(db);
  res.status(201).json(newItem);
});

app.patch('/api/items/:id', (req, res) => {
  const idx = db.items.findIndex((it) => it.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Item not found' });

  db.items[idx] = { ...db.items[idx], ...req.body };
  saveData(db);
  res.json(db.items[idx]);
});

app.delete('/api/items/:id', (req, res) => {
  db.items = db.items.filter((it) => it.id !== req.params.id);
  saveData(db);
  res.json({ success: true });
});

// -----------------------------------------------------------------
// ORDERS
// -----------------------------------------------------------------
app.get('/api/orders', (req, res) => {
  const { studentRoll } = req.query;
  if (studentRoll) {
    const filtered = db.orders.filter((o) => o.studentRoll === studentRoll);
    return res.json(filtered);
  }
  res.json(db.orders || []);
});

app.post('/api/orders', (req, res) => {
  const token = `CB-${Math.floor(100 + Math.random() * 900)}`;
  const newOrder = {
    ...req.body,
    id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    token,
    status: 'RECEIVED',
    remainingTimeMinutes: req.body.estimatedPrepTime || 15,
    paymentMethod: 'OFFLINE_COUNTER',
    paymentStatus: 'UNPAID_PENDING_PICKUP',
    createdAt: new Date().toISOString(),
  };

  // Decrement quantity in stock
  if (Array.isArray(newOrder.items)) {
    newOrder.items.forEach((ordered) => {
      const item = db.items.find((it) => it.id === ordered.id);
      if (item) {
        item.quantity = Math.max(0, item.quantity - ordered.quantity);
      }
    });
  }

  db.orders.unshift(newOrder);
  saveData(db);
  res.status(201).json(newOrder);
});

app.patch('/api/orders/:id/status', (req, res) => {
  const idx = db.orders.findIndex((o) => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Order not found' });

  const { status, remainingTimeMinutes } = req.body;
  if (status) db.orders[idx].status = status;
  if (remainingTimeMinutes !== undefined) db.orders[idx].remainingTimeMinutes = Number(remainingTimeMinutes);

  if (status === 'COMPLETED') {
    db.orders[idx].paymentStatus = 'PAID_COLLECTED';
    db.orders[idx].remainingTimeMinutes = 0;
  }
  db.orders[idx].updatedAt = new Date().toISOString();

  saveData(db);
  res.json(db.orders[idx]);
});

// -----------------------------------------------------------------
// SERVE FRONTEND (STATIC ASSETS & SPA ROUTING FOR PRODUCTION/RENDER)
// -----------------------------------------------------------------
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // Catch-all handler for Single Page Application routing (compatible with Express 4 & 5)
  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 CampusBite Server listening on port ${PORT}`);
});

