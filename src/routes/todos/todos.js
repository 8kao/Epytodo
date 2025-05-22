const db = require('../../config/db');

async function getAllTodos(req, res) {
    try {
        const [todos] = await db.query(`SELECT id, title, description, date_format(created_at, '%Y-%m-%d %H:%i:%S') AS created_at,
        date_format(due_time, '%Y-%m-%d %H:%i:%S') AS due_time, user_id, status
        FROM todo`);
        res.status(200).json(todos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
}

async function getTodoById(req, res) {
    try {
        const [check] = await db.query(`SELECT id, title, description, date_format(created_at, '%Y-%m-%d %H:%i:%S') AS created_at,
        date_format(due_time, '%Y-%m-%d %H:%i:%S') AS due_time, user_id, status
        FROM todo WHERE id = ?`, [req.params.id]);
        if (!check.length) {
            return res.status(404).json({ msg: "Not found" });
        }
        const todo = {
            id: check[0].id,
            title: check[0].title,
            description: check[0].description,
            created_at: check[0].created_at,
            due_time: check[0].due_time,
            user_id: check[0].user_id,
            status: check[0].status,
        };
        res.status(200).json(todo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
}

async function createTodo(req, res) {
    const { title, description, due_time, status , user_id} = req.body;

    try {
        if (!title || !description || !due_time || !status || !user_id) {
            return res.status(400).json({ msg: "Bad parameter" });
        }
        const [check] = await db.query('SELECT * FROM user WHERE id = ?', [req.user.id]);
        if (!check.length) {
            return res.status(404).json({ msg: "Not found" });
        }
        const [result] = await db.query(
            'INSERT INTO todo (title, description, due_time, status, user_id) VALUES (?, ?, ?, ?, ?)',
            [title, description, due_time, status, req.user.id]
        );

        const [todos] = await db.query(`SELECT id, title, description, date_format(created_at, '%Y-%m-%d %H:%i:%S') AS created_at,
        date_format(due_time, '%Y-%m-%d %H:%i:%S') AS due_time, user_id, status
        FROM todo WHERE id = ?`, [result.insertId]);
        res.status(201).json(todos[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
}

async function updateTodo(req, res) {
    const { title, description, due_time, status, user_id } = req.body;

    try {
        if (!title || !description || !due_time || !user_id || !status) {
            return res.status(401).json({ msg: "Bad parameter" });
        }
        const [check] = await db.query('SELECT * FROM todo WHERE id = ?', [req.params.id]);
        if (!check.length) {
            return res.status(404).json({ msg: "Not found" });
        }

        const [result] = await db.query(
            'UPDATE todo SET title = ?, description = ?, due_time = ?, status = ? WHERE id = ? AND user_id = ?',
            [title, description, due_time, status, req.params.id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Bad parameter' });
        }

        const [todos] = await db.query(`SELECT id, title, description, date_format(created_at, '%Y-%m-%d %H:%i:%S') AS created_at,
        date_format(due_time, '%Y-%m-%d %H:%i:%S') AS due_time, user_id, status
        FROM todo WHERE id = ?`, [req.params.id]);
        res.status(200).json(todos[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
}

async function deleteTodo(req, res) {
    try {
        const [check] = await db.query('SELECT * FROM todo WHERE id = ?', [req.params.id]);
        if (!check.length) {
            return res.status(404).json({ msg: "Not found" });
        }
        const [result] = await db.query(
            'DELETE FROM todo WHERE id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Not found' });
        }

        res.status(200).json({ msg: `Successfully deleted record number : ${req.params.id}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
}

module.exports = {
    getAllTodos,
    getTodoById,
    createTodo,
    updateTodo,
    deleteTodo
};
