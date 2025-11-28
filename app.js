const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const db = require('./db/dbconect')
const router = require('./Controlsrouter')
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
 origin: "https://resturant-fernted.vercel.app",
  credentials: true
}));

app.use('/api', router);



app.get('/', (req, res) => {
  res.send('Welcome to the Restaurant ');
});

module.exports=app
