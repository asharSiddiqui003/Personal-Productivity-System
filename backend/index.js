require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const pg = require('pg');
const bodyparser = require('body-parser');


const corsOption = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionSuccessStatus: 200
}

app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));



const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect();


// ---------------API Routes--------------------

app.get('/tasks', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM tasks ORDER BY created DESC`);
    res.status(200).json(result.rows);
  } catch (e) {
    console.log("Error Fetching data from the database");
    res.status(500).json("Error failed to load task");
  }
});

//------------------ADD TASK-------------------------

app.post('/addTasks', async (req, res) => {
  try {
    const { task, priority, createdAt } = req.body;
    const result = await db.query(`INSERT INTO tasks (title, priority, created, status) VALUES ($1,$2,$3,$4) RETURNING *`,
      [task, priority, createdAt, 'active']
    );
    res.status(201).json(result.rows[0]);

  } catch (e) {
    console.log("Database error " + e);
    res.status(500).json("Error failed to add task");
  }

});

//----------------DELETE TASK------------------------

app.delete('/tasks/:task_id', async (req, res) => {
  try {
    const { task_id } = req.params;
    if (!task_id) {
      return res.status(400).json({ error: "task_id is required" });
    }
    const result = await db.query(`DELETE FROM tasks WHERE task_id = $1 RETURNING *`, [task_id]);
    res.status(200).json(result.rows[0]);
  } catch (e) {
    console.log("Error deleting data" + e);
    res.status(500).json("Error Deleting Data" + e);
  }
});

//-------------SELECT ONE TASK-----------------------

app.get(`/tasks/:task_id`, async (req, res) => {
  try {
    const { task_id } = req.params;
    const result = await db.query("SELECT title, description, priority, status, created, dueDate FROM tasks WHERE task_id = $1", [task_id]);
    res.status(200).json(result.rows[0]);
  } catch (e) {
    console.log("Error fetching data with id: " + task_id);
    res.status(500).json("Error fetching data with id: " + task_id);
  }
})

//-------------Edit Task---------------------------------

app.put(`/tasks/edit/:task_id`, async (req, res) => {
  try {
    const { task_id } = req.params;
    let { title, description, priority, status, created, dueDate } = req.body;
    if (dueDate === '') dueDate = null;
    const result = await db.query("UPDATE tasks SET title = $1, description = $2, priority = $3, status = $4, created = $5, dueDate = $6 WHERE task_id = $7 RETURNING *"
      , [title, description, priority, status || 'active', created, dueDate, task_id]
    );
    res.status(200).json(result.rows[0]);
  } catch (e) {
    res.status(500).json("Error editing data : " + e);
    console.log("Error editing data : " + e);
  }
})

//-------------------Completed Data---------------
//status of data updated to complete to be saved in the database
app.put('/tasks/completed', async (req, res) => {
  try {
    const { task_id } = req.params;
    const { status } = req.body;
    const result = await db.query("UPDATE task SET status = $1 WHERE task_id=$2", [status, task_id]);
    res.status(200).json(result.rows[0]);
  } catch (e) {
    res.status(500).json("Error editing data : " + e);
    console.log("Error editing data : " + e);
  }
})
app.listen(3000, () => console.log('Server running on port 3000'));



//-----------------Habit Tracker------------------------

//-----------------Fetch Data---------------------------

app.get('/habits', async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM habit");
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json("Error fetching data for habits: " + e);
    console.log("Error fetching data for habits: " + e);
  }

})

//------------------Add Habits-------------------------

app.post("/habits", async (req, res) => {
  try {
    const { title, subtitle, streak, done, icon } = req.body;
    const result = await db.query("INSERT INTO habit (habit_name, subtitle, count, status, icon) VALUES ($1,$2,$3,$4,$5) RETURNING *", [title, subtitle, streak, done, icon]);
    res.status(201).json(result.rows[0]);
  } catch (e) {
    console.log("Error adding data : " + e);
    res.status(500).json("Error adding data : " + e);
  }
})

//----------------Delete Habit---------------------

app.delete('/habits/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }
    const result = await db.query("DELETE FROM habit WHERE id = $1 RETURNING *", [id]);
    res.status(200).json(result.rows[0]);
  } catch (e) {
    console.log("Error deleting data" + e);
    res.status(500).json("Error Deleting Data" + e);
  }
});

//--------------Edit Habit------------------

app.put(`/habits/:id`, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, streak, done, icon } = req.body;
    const result = await db.query("UPDATE habit SET habit_name = $1, subtitle = $2, count = $3, status = $4, icon = $5 WHERE id = $6 RETURNING *",
      [title, subtitle, streak, done, icon, id]);
    res.status(200).json(result.rows[0]);
  } catch (e) {
    console.log("Error editing data" + e);
    res.status(500).json("Error Editing Data" + e);
  }
});
