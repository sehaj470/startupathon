// server/server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');

const challengeRoutes = require('./routes/admin/challengesRoutes');
const founderRoutes = require('./routes/admin/foundersRoutes');
const completerRoutes = require('./routes/admin/completersRoutes');
const subscriberRoutes = require('./routes/admin/subscribersRoutes');
const authRoutes = require('./routes/authRoutes');
const publicChallenges = require('./routes/public/publicChallenges');
const publicCompleters = require('./routes/public/publicCompleters');
const publicSubscribers = require('./routes/public/publicSubscribers');



const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true
}));

app.use(express.json());

mongoose.connect('mongodb+srv://sehajsaran47:DoctorVehmaDa@5911@cluster0.9siwc.mongodb.net/startupthonDB?retryWrites=true&w=majority&appName=Cluster0')

// Connect to DB
connectDB();

// Routes

app.use((req, res, next) => {
    console.log('Request:', {
        method: req.method,
        path: req.path,
        headers: req.headers,
        body: req.body
    });
    next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/challenges', express.static(path.join(__dirname, 'uploads/challenges')));
app.use('/uploads/completers', express.static(path.join(__dirname, 'uploads/completers')));

app.use('/api/auth', authRoutes);
app.use('/api/admin/challenges', challengeRoutes);
app.use('/api/admin/founders', founderRoutes);
app.use('/api/admin/completers', completerRoutes);
app.use('/api/admin/subscribers', subscriberRoutes);

app.use('/api/subscribers', publicSubscribers);
app.use('/api/challenges', publicChallenges);
app.use('/api/completers', publicCompleters);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
