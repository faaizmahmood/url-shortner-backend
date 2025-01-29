const express = require('express');
const cluster = require('cluster');
const os = require('os');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: ['http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}));

app.use((req, res, next) => {
    console.log(`${new Date().toLocaleString()}  Request made at: ${req.originalUrl}`);
    next();
});

// Basic Route
app.get('/api', (req, res) => {
    res.status(200).json({
        message: 'working',
        worker: `worker ${process.pid}`
    });
});

// Routes
const userRouter = require('./routes/user');
const oauthRouter = require('./routes/oauth');
const profileRouter = require('./routes/profile');
const URLRouter = require('./routes/urlShorten');
const URLRedirect = require('./routes/urlRedirect');
const URLUpdate = require('./routes/urlUpdate');
const URLDeleteRouter = require('./routes/urlDelete');

// Endpoints
app.use('/api/auth', userRouter);
app.use('/api/auth', oauthRouter);
app.use('/api/user', profileRouter);
app.use('/api/url', URLRouter);
app.use('/api/url', URLRedirect);
app.use('/api/url', URLUpdate);
app.use('/api/url', URLDeleteRouter);

// Cluster Setup
if (cluster.isPrimary) {
    for (let i = 0; i < os.cpus().length; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        if (code !== 0) {
            console.error(`Worker ${worker.process.pid} exited with code ${code} due to signal ${signal}. Restarting...`);
        } else {
            console.log(`Worker ${worker.process.pid} exited normally. Restarting...`);
        }
        cluster.fork();
    });
} else {
    console.log(`Worker ${process.pid} is running`);

    // Start the server for each worker
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`App is Running at Port: ${PORT}`);
    });
}
