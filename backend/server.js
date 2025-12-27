const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const multer = require('multer');
const path = require('path');
const JWT_SECRET = 'safetour_secret';

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Post = require('./models/community');
const SOS = require('./models/sos');
const DangerZone = require('./models/dangerzone');
const Alert = require('./models/alert');
const alertRoutes = require('./routes/alertroutes');
const userRoutes = require('./routes/userRoutes');



const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/alerts', alertRoutes);
app.use('/api/users', userRoutes);
mongoose
  .connect('mongodb://127.0.0.1:27017/safetour')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// test route
app.get('/', (req, res) => {
  res.send('SafeTour Backend Running');
});

app.post('/api/signup', async (req, res) => {
  const { name, age, email, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    age,
    email,
    password: hashedPassword,
    role,
  });

  await user.save();
  res.status(201).json({ message: 'User created' });
});
app.post('/api/login', async (req, res) => {
  console.log('LOGIN BODY:', req.body);
  const { email, password , latitude, longitude} = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: 'Invalid password' });
  if (latitude && longitude) {
    user.latitude = latitude;
    user.longitude = longitude;
    await user.save();
  }
  const token = jwt.sign(
    { id: user._id, role: user.role, name: user.name, age: user.age },
    JWT_SECRET
  );

  res.json({
    token,
    id: user._id.toString(),
    role: user.role,
    name: user.name,
    age: user.age,
  });
});

app.post('/api/sos', async (req, res) => {
  try {
    const sos = new SOS(req.body);
    await sos.save();

    console.log('🚨 SOS saved to DB');
    res.status(201).json({ message: 'SOS saved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save SOS' });
  }
});

// Get all SOS (for Authority)
app.get('/api/sos', async (req, res) => {
  const sosList = await SOS.find().sort({ createdAt: -1 });
  res.json(sosList);
});



// Save new post
app.post('/api/posts', async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();

    console.log('📝 Post saved to DB');
    res.status(201).json({ message: 'Post saved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save post' });
  }
});

// Get all posts
app.get('/api/posts', async (req, res) => {
  const posts = await Post.find().sort({ _id: -1 });
  res.json(posts);
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });



app.post('/api/upload', upload.single('image'), (req, res) => {
  // 🔥 CRITICAL FIX: NO HARDCODED IP
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  res.json({
    imageUrl: `${baseUrl}/uploads/${req.file.filename}`,
  });
});
// Add danger zone (Authority)
app.post('/api/zones', async (req, res) => {
  try {
    const zone = new DangerZone(req.body);
    await zone.save();
    res.status(201).json({ message: 'Zone added' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add zone' });
  }
});

// Get all danger zones (Tourists)
app.get('/api/zones', async (req, res) => {
  const zones = await DangerZone.find();
  res.json(zones);
});

app.post('/api/alerts', async (req, res) => {
  try {
    const alert = new Alert(req.body);
    await alert.save();
    res.status(201).json({ message: 'Alert broadcasted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send alert' });
  }
});

// Tourists fetch all alerts
app.get('/api/alerts', async (req, res) => {
  const alerts = await Alert.find().sort({ createdAt: -1 });
  res.json(alerts);
});



const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});