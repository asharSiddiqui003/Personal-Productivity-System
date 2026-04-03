const express = require('express');
const cors = require('cors');
const app = express();
const pg = require('pg');
const bodyparser = require('body-parser');

const corsOption = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT" , "DELETE"],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
  optionSuccessStatus: 200
}

app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));



const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "tasks",
  password: "HUB2425",
  port: 5432,
});

db.connect();


// ---------------API Routes--------------------

app.get('/tasks', async(req, res) => {
  try{
    const result = await db.query(`SELECT * FROM tasks`);
    res.status(200).json(result.rows);
  } catch(e){
    console.log("Error Fetching data from the database");
    res.status(500).json("Error failed to load task");
  }
});

//------------------ADD TASK-------------------------

app.post('/addTasks',async (req,res) => {
  try{
     const { task, priority} = req.body;
  const result = await db.query(`INSERT INTO tasks (title, priority) VALUES ($1,$2) RETURNING *`,
    [task, priority]
  );
  res.status(201).json(result.rows[0]);

  } catch (e){
    console.log("Database error " + e);
    res.status(500).json("Error failed to add task");
  }
 
});

app.delete('/tasks/:task_id', async (req,res) => {
  try{
    const { task_id } = req.params;
    if(!task_id) {
      return res.status(400).json({error: "task_id is required"});
    }
    const result = await db.query(`DELETE FROM tasks WHERE task_id = $1 RETURNING *`,[task_id]);
    res.status(200).json(result.rows[0]);
  } catch(e){
    console.log("Error deleting data" + e);
    res.status(500).json("Error Deleting Data" + e);
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));