const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/jobs', jobRoutes);

module.exports = app;