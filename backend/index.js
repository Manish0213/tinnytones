const express = require('express')
const cors = require('cors') // CORS middleware import
const app = express()
const connectDB = require('./db');
const paintingRoutes = require('./Routes/paintingRoutes');
const artistAuthRoutes = require('./Routes/artistAuthRoute');
const userAuthRoutes = require('./Routes/userAuthRoute');

const port = 5000

const path = require('path');
const uploadsPath = path.join(__dirname, 'uploads');

// Use express.json middleware to parse JSON request body
app.use(express.json())
app.use('/uploads', express.static(uploadsPath));


// Use CORS middleware for cross-origin requests
app.use(cors())

connectDB();


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api', paintingRoutes); 
app.use('/admin', artistAuthRoutes);
app.use('/user', userAuthRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
