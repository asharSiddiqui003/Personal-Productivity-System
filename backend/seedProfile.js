require('dotenv').config();
const pg = require('pg');

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function seed() {
  try {
    await db.connect();
    await db.query(`
      CREATE TABLE IF NOT EXISTS profile (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255),
          email VARCHAR(255),
          bio TEXT,
          avatar VARCHAR(255)
      );
    `);
    const res = await db.query("SELECT * FROM profile WHERE id = 1");
    if (res.rows.length === 0) {
      await db.query(`
        INSERT INTO profile (id, name, email, bio, avatar) 
        VALUES (1, 'Ashar Siddiqui', 'ashar@example.com', 'Passionate developer building awesome apps.', '')
      `);
      console.log("Profile seeded.");
    } else {
      console.log("Profile already exists.");
    }
  } catch (err) {
    console.error(err);
  } finally {
    await db.end();
  }
}

seed();
