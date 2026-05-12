require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const pg = require('pg');
const bodyparser = require('body-parser');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const corsOption = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionSuccessStatus: 200
}

app.use(cors(corsOption));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// File upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json("No file uploaded");
  }
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(200).json({ url: fileUrl });
});



const dbConfig = process.env.DATABASE_URL ? {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Required for most cloud DBs
} : {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

const db = new pg.Client(dbConfig);

db.connect();

// Seed default profile on startup (table already exists — no CREATE TABLE needed)
async function seedDefaultProfile() {
  try {
    const res = await db.query("SELECT * FROM profile WHERE id = 1");
    if (res.rows.length === 0) {
      await db.query(`
        INSERT INTO profile (id, name, email, bio, avatar) 
        VALUES (1, 'Ashar Siddiqui', 'ashar@example.com', 'Passionate developer building awesome apps.', '')
      `);
      console.log("Default profile seeded.");
    } else {
      console.log("Profile already exists — skipping seed.");
    }
  } catch (err) {
    console.error("Seed error:", err.message);
  }
}
seedDefaultProfile();


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
//-----------------Profile------------------------------

// Fetch logged-in user's profile by email (from JWT payload)
app.get('/profile/me', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json("Email is required");
    const result = await db.query("SELECT id, name, email, bio, avatar FROM profile WHERE email = $1", [email]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json("Profile not found");
    }
  } catch (e) {
    console.log("Error fetching profile: " + e);
    res.status(500).json("Error fetching profile: " + e);
  }
});

// Update profile info (name, bio, avatar) by email
app.put('/profile/me', async (req, res) => {
  try {
    const { email: queryEmail } = req.query;
    const { name, bio, avatar } = req.body;
    if (!queryEmail) return res.status(400).json("Email is required");
    const result = await db.query(
      "UPDATE profile SET name = $1, bio = $2, avatar = $3 WHERE email = $4 RETURNING id, name, email, bio, avatar",
      [name, bio, avatar, queryEmail]
    );
    res.status(200).json(result.rows[0]);
  } catch (e) {
    console.log("Error updating profile: " + e);
    res.status(500).json("Error updating profile: " + e);
  }
});

// Change password — verify current, then save hashed new password
app.patch('/profile/password', async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    if (!email || !currentPassword || !newPassword) return res.status(400).json("All fields are required");
    const result = await db.query("SELECT password FROM profile WHERE email = $1", [email]);
    if (result.rows.length === 0) return res.status(404).json("User not found");
    const isValid = await bcrypt.compare(currentPassword, result.rows[0].password);
    if (!isValid) return res.status(401).json("Current password is incorrect");
    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE profile SET password = $1 WHERE email = $2", [hashed, email]);
    res.status(200).json("Password updated successfully");
  } catch (e) {
    console.log("Error changing password: " + e);
    res.status(500).json("Error changing password: " + e);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



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



//------------------Search-------------------------

app.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const result = await db.query("SELECT * FROM tasks WHERE title LIKE $1", [`%${query}%`]);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json("Error fetching data for search: " + e);
    console.log("Error fetching data for search: " + e);
  }
})

//-------------------Pomodoro------------------------- 

//------------------Get Details-------------------------
app.get('/pomodoro', async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM pomodoro")
    res.status(200).json(result);
  } catch (e) {
    console.log("Error fetching data for pomodoro" + e);
    res.status(500).json("Error fetching data for pomodoro" + e);
  }
})

//------------------Insert Details-------------------------

app.post("/pomodoro", async (req, res) => {
  try {
    const { title, duration, mode } = req.body;
    const result = await db.query("INSERT INTO pomodoro (title, duration, mode) VALUES ($1,$2,$3) RETURNING*", [title, duration, mode]);
    res.status(201).json(result.rows[0]);
  } catch (e) {
    console.log("Error updating data for pomodoro" + e);
    res.status(500).json("Error updating data for pomodoro" + e);
  }
})

//------------------Profile-----------------------------

//-----------------FETCH DETAIL-----------------------

app.get('/profile', async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM profile")
    res.status(200).json(result);
  } catch (e) {
    console.log("Error fetching data for profile: " + e);
    res.status(500).json("Error fetching data for profile: " + e);
  }
})

//------------------GET DETAIL PER ID--------------------

app.put('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, bio, avatar } = req.body;
    const result = await db.query("UPDATE profile SET name = $1, email = $2, bio = $3, avatar = $4 WHERE id = $5 RETURNING*", [name, email, bio, avatar, id]);
    res.status(200).json(result.rows[0]);
  } catch (e) {
    console.log("Error updating data for profile: " + e);
    res.status(500).json("Error updating data for profile: " + e);
  }
})

//------------------UPATE--------------------
app.put('/profile', async (req, res) => {
  try {
    const { name, email, bio, avatar } = req.body;
    const result = await db.query("UPDATE profile SET name = $1, email = $2, bio = $3, avatar = $4 WHERE id = $5 RETURNING*", [name, email, bio, avatar, id]);
    res.status(200).json(result.rows[0]);
  } catch (e) {
    console.log("Error updating data for profile: " + e);
    res.status(500).json("Error updating data for profile: " + e);
  }
})

app.delete('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("DELETE FROM profile WHERE id = $1 RETURNING*", [id]);
    res.status(200).json(result.rows[0]);
  } catch (e) {
    console.log("Error deleting data for profile: " + e);
    res.status(500).json("Error deleting data for profile: " + e);
  }
})


//----------------------LOGIN----------------------

//-------------------INSERT INFO------------------


app.post("/users", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query("INSERT INTO profile (name,email,password) VALUES($1,$2,$3) RETURNING*", [name, email, hashedPassword]);
    res.status(201).json(result.rows[0]);
  } catch (e) {
    console.log("Error inserting data for login" + e);
    res.status(500).json("Error inserting data for login " + e);
  }
})

app.post("/users/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query("SELECT * FROM profile WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(404).json("User not found");
    }
    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json("Invalid password");
    }
    res.status(200).json("User verified");
  } catch (e) {
    console.log("Error verifying user" + e);
    res.status(500).json("Error verifying user" + e);
  }
})

app.get('/posts', authenticateToken, async (req, res) => {
  const user = await db.query("SELECT * FROM profile WHERE email = $1", [req.user.name]);
  res.json(user.rows);
})

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.status(401).json('Error authenticating token');

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403);//403 says that we see you have a token but the token is not longer valid 
    req.user = user
    next()
  })
}

