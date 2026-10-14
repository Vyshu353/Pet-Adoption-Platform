require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 8080;
const isProduction = process.env.NODE_ENV === 'production';
const jwtSecret = process.env.JWT_SECRET || (isProduction ? '' : crypto.randomBytes(32).toString('hex'));
const adminUsername = process.env.ADMIN_USERNAME || (isProduction ? '' : 'admin');
const adminPassword = process.env.ADMIN_PASSWORD || (isProduction ? '' : 'pet-admin-dev');

if (!jwtSecret || !adminUsername || !adminPassword) {
  throw new Error('Set JWT_SECRET, ADMIN_USERNAME, and ADMIN_PASSWORD in production.');
}

if (!isProduction) {
  console.warn('Using local development login defaults. Set ADMIN_USERNAME and ADMIN_PASSWORD to override them.');
}

app.use(cors());
app.use(express.json());

const initialPets = [
  {
    id: 1,
    name: 'Milo',
    age: '2 years',
    kind: 'Golden Retriever',
    location: 'Bengaluru',
    category: 'Dog',
    badge: 'Friendly',
    image:
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    name: 'Luna',
    age: '1 year',
    kind: 'Persian Cat',
    location: 'Delhi',
    category: 'Cat',
    badge: 'Gentle',
    image:
      'https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    name: 'Cooper',
    age: '3 years',
    kind: 'Corgi Mix',
    location: 'Hyderabad',
    category: 'Dog',
    badge: 'Energetic',
    image:
      'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    name: 'Poppy',
    age: '8 months',
    kind: 'French Bulldog',
    location: 'Mumbai',
    category: 'Dog',
    badge: 'Playful',
    image:
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    name: 'Sunny',
    age: '8 months',
    kind: 'Parakeet',
    location: 'Pune',
    category: 'Bird',
    badge: 'Curious',
    image:
      'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    name: 'Biscuit',
    age: '9 months',
    kind: 'Mini Rabbit',
    location: 'Chennai',
    category: 'Small Pet',
    badge: 'Sweet',
    image:
      'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 7,
    name: 'Sasha',
    age: '3 years',
    kind: 'Siamese Cat',
    location: 'Jaipur',
    category: 'Cat',
    badge: 'Calm',
    image:
      'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 8,
    name: 'Nori',
    age: '1 year',
    kind: 'Himalayan Cat',
    location: 'Kolkata',
    category: 'Cat',
    badge: 'Affectionate',
    image:
      'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80',
  }
];

const petStatePath = path.join(__dirname, 'pet-state.json');
const petState = JSON.parse(fs.readFileSync(petStatePath, 'utf8'));
const createdPets = petState.createdPets;
const deletedPetIds = new Set(petState.deletedPetIds);
const pets = [
  ...initialPets.filter((pet) => !petState.deletedPetIds.includes(pet.id)),
  ...createdPets,
];

function savePetState() {
  fs.writeFileSync(
    petStatePath,
    JSON.stringify({ createdPets, deletedPetIds: [...deletedPetIds] }, null, 2)
  );
}

const userStatePath = path.join(__dirname, 'user-state.json');
if (!fs.existsSync(userStatePath)) {
  fs.writeFileSync(userStatePath, JSON.stringify({ users: [] }, null, 2));
}
const userState = JSON.parse(fs.readFileSync(userStatePath, 'utf8'));
const users = userState.users;

function saveUserState() {
  fs.writeFileSync(userStatePath, JSON.stringify({ users }, null, 2));
}

const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

app.get('/api/health', asyncHandler(async (req, res) => {
  res.json({ status: 'ok', message: 'Pet adoption backend is running' });
}));

function createAuthResponse(user, role, subject) {
  const accessToken = jwt.sign({ sub: String(subject), role }, jwtSecret, { expiresIn: '1h' });
  return {
    access_token: accessToken,
    token_type: 'Bearer',
    expires_in: 3600,
    user: {
      id: user.id ?? null,
      name: user.name,
      email: user.email ?? null,
      role,
    },
  };
}

app.post('/api/auth/register', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body || {};
  const normalizedName = typeof name === 'string' ? name.trim() : '';
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (normalizedName.length < 2 || normalizedName.length > 80) {
    return res.status(400).json({ message: 'Name must be between 2 and 80 characters' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || normalizedEmail.length > 254) {
    return res.status(400).json({ message: 'Enter a valid email address' });
  }

  if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
    return res.status(400).json({ message: 'Password must be between 8 and 128 characters' });
  }

  if (users.some((user) => user.email === normalizedEmail)) {
    return res.status(409).json({ message: 'An account with this email already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  if (users.some((user) => user.email === normalizedEmail)) {
    return res.status(409).json({ message: 'An account with this email already exists' });
  }

  const user = {
    id: users.reduce((highestId, item) => Math.max(highestId, item.id), 0) + 1,
    name: normalizedName,
    email: normalizedEmail,
    passwordHash,
  };
  users.push(user);
  saveUserState();
  return res.status(201).json(createAuthResponse(user, 'user', user.id));
}));

app.post('/api/auth/login', asyncHandler(async (req, res) => {
  const { username, email, password } = req.body || {};

  if (typeof password !== 'string' || (typeof username !== 'string' && typeof email !== 'string')) {
    return res.status(400).json({ message: 'Email or username and password are required' });
  }

  if (typeof username === 'string' && username === adminUsername && password === adminPassword) {
    return res.json(createAuthResponse({ name: 'Administrator' }, 'admin', adminUsername));
  }

  if (typeof email !== 'string') {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find((account) => account.email === normalizedEmail);

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  return res.json(createAuthResponse(user, 'user', user.id));
}));

function requireAdmin(req, res, next) {
  const authorization = req.get('Authorization') || '';
  const [scheme, token] = authorization.split(/\s+/);

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Bearer token required' });
  }

  try {
    req.auth = jwt.verify(token, jwtSecret);
    if (req.auth.role !== 'admin') {
      return res.status(403).json({ message: 'Administrator access required' });
    }
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

app.get('/api/pets', asyncHandler(async (req, res) => {
  res.json(pets);
}));

app.post('/api/pets', requireAdmin, asyncHandler(async (req, res) => {
  const requiredFields = ['name', 'age', 'kind', 'location', 'category', 'badge', 'image'];
  const missingFields = requiredFields.filter(
    (field) => typeof req.body?.[field] !== 'string' || !req.body[field].trim()
  );

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: 'Missing or invalid required fields',
      fields: missingFields,
    });
  }

  const values = requiredFields.map((field) => req.body[field].trim());
  const pet = {
    id: Math.max(0, ...pets.map((item) => item.id)) + 1,
    ...Object.fromEntries(requiredFields.map((field, index) => [field, values[index]])),
  };
  pets.push(pet);
  createdPets.push(pet);
  savePetState();
  return res.status(201).json(pet);
}));

app.get('/api/pets/:id', asyncHandler(async (req, res) => {
  const pet = pets.find((item) => String(item.id) === req.params.id);
  if (!pet) {
    return res.status(404).json({ message: 'Pet not found' });
  }

  return res.json(pet);
}));

app.delete('/api/pets/:id', requireAdmin, asyncHandler(async (req, res) => {
  const petIndex = pets.findIndex((item) => String(item.id) === req.params.id);
  if (petIndex === -1) {
    return res.status(404).json({ message: 'Pet not found' });
  }

  const [deletedPet] = pets.splice(petIndex, 1);
  const createdPetIndex = createdPets.findIndex((item) => item.id === deletedPet.id);
  if (createdPetIndex === -1) {
    deletedPetIds.add(deletedPet.id);
  } else {
    createdPets.splice(createdPetIndex, 1);
  }
  savePetState();
  return res.json({ message: 'Pet deleted successfully', pet: deletedPet });
}));

app.use((error, req, res, next) => {
  console.error('Request failed:', error);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Pet adoption backend running on http://localhost:${PORT}`);
});
