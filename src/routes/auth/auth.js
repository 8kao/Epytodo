const db = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const server_error = {"msg": "Internal server error"};
const unknown_user = {"msg": "Not found"};
const bad_param = {"msg": "Bad parameter"};

async function registerUser(req, res) {
    const { email, password, name, firstname } = req.body;

    if (!email || !password || !name || !firstname) {
        return res.status(400).send(bad_param);
    }

    try {
        const [rows] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(409).json({ "msg": "Account already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query('INSERT INTO user (email, password, name, firstname) VALUES (?, ?, ?, ?)', [
            email,
            hashedPassword,
            name,
            firstname
        ]);

        const [user_db] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
        const user = user_db[0]
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                password: user.password,
                name: user.name,
                firstname: user.firstname,
                created_at: user.created_at
            },
            process.env.SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({ "token": token });

    } catch (err) {
        console.error(err);
        res.status(500).send(server_error);
    }
}

async function loginUser(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(401).send(bad_param);
    }

    try {
        const [rows] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(404).send(unknown_user);
        }

        const user = rows[0];

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({msg: "Invalid Credentials"});
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                password: user.password,
                name: user.name,
                firstname: user.firstname,
                created_at: user.created_at
            },
            process.env.SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            "token": token
        });

    } catch (err) {
        console.error(err);
        res.status(500).send(server_error);
    }
}

module.exports = {
    registerUser,
    loginUser
};
