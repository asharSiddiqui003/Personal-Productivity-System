const express = require('express');
const cors = require('cors');
const app = express();
const pg = require('pg');
const bodyparser = require('body-parser');

const corsOption = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT" , "DELETE"],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
  optionSuccessStatus: 200
}

app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// Add this to check if body-parser is working
app.use((req, res, next) => {
  console.log('Body after parsing:', req.body);
  next();
});


const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "tasks",
  password: "HUB2425",
  port: 5432,
});

db.connect();


// ---------------API Routes--------------------

app.get('/', (req, res) => {
  console.log("GET is working");
  res.send("GET is working!!!");
});

//------------------ADD TASK-------------------------

app.post('/addTasks',async (req,res) => {
  try{
     const { task, priority} = req.body;
  const result = await db.query(`INSERT INTO tasks (description, priority) VALUES ($1,$2) RETURNING *`,
    [task, priority]
  );
  res.status(201).json(result.rows[0]);

  } catch (e){
    console.log("Database error" + e);
    res.status(500).json("Error failed to add task");
  }
 
});

app.listen(3000, () => console.log('Server running on port 3000'));