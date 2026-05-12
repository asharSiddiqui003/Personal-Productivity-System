const express = require("express");
const app = express();
const cors = require("cors");
const pg = require('pg');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const corsOption = {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionSuccessStatus: 200
}

app.use(cors(corsOption));
app.use(express.json());

const dbConfig = process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
} : {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
};

const db = new pg.Client(dbConfig);

db.connect();



//-----------------Creating TOKENS------------------

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Verify the user exists in the database
        const result = await db.query("SELECT * FROM profile WHERE email = $1", [email]);
        if (result.rows.length === 0) {
            return res.status(404).json("User not found");
        }

        // 2. Verify the password matches
        const dbUser = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, dbUser.password);
        if (!isPasswordValid) {
            return res.status(401).json("Invalid password");
        }

        // 3. Generate tokens ONLY if password is valid
        const userPayload = { name: email };
        const accessToken = jwt.sign(userPayload, process.env.ACCESS_TOKEN, { expiresIn: '15m' });
        const refreshToken = jwt.sign(userPayload, process.env.REFRESH_TOKEN, { expiresIn: '7d' });

        // 4. Save refresh token to database
        await db.query("INSERT INTO refreshTokens (token, user_email) VALUES ($1,$2) RETURNING *", [refreshToken, email]);

        res.json({ accessToken: accessToken, refreshToken: refreshToken });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json("Server error during login");
    }
})

//-----------------Creating NEW Access TOKEN--------

app.post('/token', async (req, res) => {
    const refreshToken = req.body.token;
    if (!refreshToken) return res.status(401).json("Token missing");

    // Check if the token actually exists in the database
    try {
        const dbCheck = await db.query("SELECT * FROM refreshTokens WHERE token = $1", [refreshToken]);
        if (dbCheck.rows.length === 0) {
            return res.status(403).json("Refresh token has been revoked (logged out)");
        }
    } catch (dbErr) {
        return res.status(500).json("Database error checking token");
    }

    try {
        const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
        const accessToken = jwt.sign({ name: user.name }, process.env.ACCESS_TOKEN, { expiresIn: '15m' });
        res.json({ accessToken: accessToken });
    } catch (err) {
        res.status(403).json("Invalid refresh token");
    }
})

//-----------------DELETE REFRESH TOKEN----------------

app.delete('/logout', async (req, res) => {
    const refreshToken = req.body.token;
    if (!refreshToken) return res.status(400).json("Token required");

    try {
        await db.query("DELETE FROM refreshTokens WHERE token = $1", [refreshToken]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json("Error deleting token");
    }
})


//-----------------OAuth--------------------

app.post('/auth/google', async (req, res) => {
    const { access_token } = req.body;
    try {
        // Get user info from Google
        const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        const googleUser = await googleRes.json();
        if (!googleUser.email) return res.status(400).json("Invalid Google token");

        let result = await db.query("SELECT * FROM profile WHERE email = $1", [googleUser.email]);
        if (result.rows.length === 0) {
            result = await db.query(
                "INSERT INTO profile (name, email) VALUES ($1, $2) RETURNING *",
                [googleUser.name, googleUser.email]
            );
        }

        const payload = { name: googleUser.email };
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN, { expiresIn: '7d' });
        await db.query("INSERT INTO refreshTokens (token, user_email) VALUES ($1, $2)", [refreshToken, googleUser.email]);

        res.json({ accessToken, refreshToken });
    } catch (err) {
        console.error("Google auth error:", err);
        res.status(500).json("Google authentication failed");
    }
});

app.listen(process.env.AUTH_PORT, () => {
    console.log(`Auth server running on port ${process.env.AUTH_PORT}`)
})


