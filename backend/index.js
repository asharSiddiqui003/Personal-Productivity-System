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
    const result = await db.query(`SELECT * FROM tasks ORDER BY created DESC`);
    res.status(200).json(result.rows);
  } catch(e){
    console.log("Error Fetching data from the database");
    res.status(500).json("Error failed to load task");
  }
});

//------------------ADD TASK-------------------------

app.post('/addTasks',async (req,res) => {
  try{
     const { task, priority, createdAt} = req.body;
  const result = await db.query(`INSERT INTO tasks (title, priority, created, status) VALUES ($1,$2,$3,$4) RETURNING *`,
    [task, priority, createdAt, 'active']
  );
  res.status(201).json(result.rows[0]);

  } catch (e){
    console.log("Database error " + e);
    res.status(500).json("Error failed to add task");
  }
 
});

//----------------DELETE TASK------------------------

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

//-------------SELECT ONE TASK-----------------------

app.get(`/tasks/:task_id`,async(req,res) => {
  try{
    const { task_id } = req.params;
    const result = await db.query("SELECT title, description, priority, status FROM tasks WHERE task_id = $1",[task_id]);
    res.status(200).json(result.rows[0]);
  } catch(e){
    console.log("Error fetching data with id: " + task_id);
    res.status(500).json("Error fetching data with id: " + task_id);
  }
})

app.put(`/tasks/edit/:task_id`, async(req,res) => {
  try{
    const { task_id } = req.params;
    const { title, description, priority, status } = req.body;
    const result = await db.query("UPDATE tasks SET title = $1, description = $2, priority = $3, status = $4 WHERE task_id=$5 RETURNING *"
      ,[title,description,priority, status || 'active', task_id]
    );
    res.status(200).json(result.rows[0]);
  } catch (e){
    res.status(500).json("Error editing data : " + e);
    console.log("Error editing data : " + e);
  }
})

//-------------------Completed Data---------------
app.put('/tasks/completed', async(req,res) => {
  try{
    const {task_id} = req.params;
    const { status } = req.body;
    const result = await db.query("UPDATE task SET status = $1 WHERE task_id=$2",[status,task_id]);
    res.status(200).json(result.rows[0]);
  } catch(e){
    res.status(500).json("Error editing data : " + e);
    console.log("Error editing data : " + e);
  }
})
app.listen(3000, () => console.log('Server running on port 3000'));

