const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');

const app = express();

const { API_VERSION } = require('./config');
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const mdAuth = require('./middleware/auth');
// app.use(mdAuth.authenticateUser);

const userRoutes = require('./routers/user');
const authRoutes = require('./routers/auth');
const chapterRoutes = require('./routers/chapter');
const characterRoutes = require('./routers/character');
const messageRoutes = require('./routers/message');
const storyRoutes = require('./routers/story');
const reviewRoutes = require('./routers/review');
const readStatusRoutes = require('./routers/readstatus');

app.use(`/api/${API_VERSION}`, userRoutes);
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, chapterRoutes);
app.use(`/api/${API_VERSION}`, characterRoutes);
app.use(`/api/${API_VERSION}`, messageRoutes);
app.use(`/api/${API_VERSION}`, storyRoutes);
app.use(`/api/${API_VERSION}`, reviewRoutes);
app.use(`/api/${API_VERSION}`, readStatusRoutes);

const server = http.createServer(app);

module.exports = server;
