require('dotenv').config() // Load environment variables from .env file
const express = require('express')
const databaseConnection = require('./config/database')
const routeApi = require('./route/api')

const app = express()
const port = process.env.PORT || 8081
const hostName = process.env.HOST_NAME || 'localhost'

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', routeApi)

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err});
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
})
