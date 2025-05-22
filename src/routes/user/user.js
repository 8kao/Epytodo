const db = require('../../config/db');
const bcrypt = require('bcryptjs');

async function infoUser(req, res) {
    try {
        const [users] = await db.query('SELECT * FROM user WHERE email = ?', [req.user.email]);
        if (!users.length) {
            return res.status(404).json({ msg: "Not found" });
        }

        const user = users[0];
        const table = {
            id: user.id,
            email: user.email,
            password: user.password,
            created_at: user.created_at,
            firstname: user.firstname,
            name: user.name
        };
        res.status(200).json(table);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal Server Error" });
    }
}

async function getUserTodos(req, res) {
    try {
        const [todos] = await db.query('SELECT * FROM todo WHERE user_id = ?', [req.user.id]);
        res.status(200).json(todos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal Server Error" });
    }
}

async function infoUserByElt(req, res) {
    try {
        let user;
        console.log(isNaN(req.params.id));
        if (isNaN(req.params.id)) {
            const [users] = await db.query('SELECT * FROM user WHERE email = ?', [req.params.id]);
            user = users[0];
        } else {
            const [users] = await db.query('SELECT * FROM user WHERE id = ?', [req.params.id]);
            user = users[0];
        }
        
        if (!user) {
            return res.status(404).json({ msg: "Not found" });
        }

        const table = {
            id: user.id,
            email: user.email,
            password: user.password,
            created_at: user.created_at,
            firstname: user.firstname,
            name: user.name
        };

        res.status(200).json(table);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal Server Error" });
    }
}

async function updateUser(req, res) {
    const { email, password, firstname, name } = req.body;

    try {
        const [check] = await db.query('SELECT * FROM user WHERE id = ?', [req.params.id]);
        if (!check.length) {
            return res.status(404).json({ msg: "Not found" });
        }

        if (!email || !password || !firstname || !name) {
            return res.status(401).json({ msg: "Bad parameter" });
        }

        const [result] = await db.query(
            'UPDATE user SET email = ?, password = ?, firstname = ?, name = ? WHERE id = ?',
            [email, password, firstname, name, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(401).json({ msg: "Bad parameter" });
        }

        const [users] = await db.query('SELECT * FROM user WHERE id = ?', [req.params.id]);
        const user = users[0];

        const hashedPassword = await bcrypt.hash(user.password, 10);

        const table = {
            id: user.id,
            email: user.email,
            password: hashedPassword,
            created_at: user.created_at,
            firstname: user.firstname,
            name: user.name
        };

        res.status(200).json(table);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal Server Error" });
    }
}


async function deleteUser(req, res) {
    try {
        const [todo_result] = await db.query('DELETE FROM todo WHERE user_id = ?', [req.params.id]);
        const [result] = await db.query('DELETE FROM user WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: "Not found" });
        }

        res.status(200).json({ msg: `Successfully deleted record number : ${req.params.id}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal Server Error" });
    }
}

module.exports = {
    infoUser,
    getUserTodos,
    infoUserByElt,
    updateUser,
    deleteUser
};
