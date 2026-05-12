-- Table for storing tasks
CREATE TABLE IF NOT EXISTS tasks (
    task_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT DEFAULT 'Medium',
    status TEXT DEFAULT 'active',
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dueDate TIMESTAMP
);

-- Table for habit tracking
CREATE TABLE IF NOT EXISTS habit (
    id SERIAL PRIMARY KEY,
    habit_name TEXT NOT NULL,
    subtitle TEXT,
    count INTEGER DEFAULT 0,
    status BOOLEAN DEFAULT false,
    icon TEXT
);

-- Table for user profiles and authentication
CREATE TABLE IF NOT EXISTS profile (
    id SERIAL PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    bio TEXT,
    avatar TEXT
);

-- Table for pomodoro sessions
CREATE TABLE IF NOT EXISTS pomodoro (
    id SERIAL PRIMARY KEY,
    title TEXT,
    duration INTEGER,
    mode TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for JWT refresh tokens
CREATE TABLE IF NOT EXISTS refreshTokens (
    id SERIAL PRIMARY KEY,
    token TEXT NOT NULL,
    user_email TEXT NOT NULL
);

-- Seed an initial profile if needed
INSERT INTO profile (id, name, email, bio, avatar) 
VALUES (1, 'Ashar Siddiqui', 'ashar@example.com', 'Passionate developer building awesome apps.', '')
ON CONFLICT (id) DO NOTHING;
