const express = require('express');
const app = express();
require('dotenv').config();

// Middlewares
const { notFound } = require("./middleware/notFound");
const { verifyToken } = require("./middleware/auth");

const { registerUser, loginUser } = require("./routes/auth/auth");

const { infoUser, getUserTodos, infoUserByElt, updateUser, deleteUser } = require("./routes/user/user");

const { getAllTodos, getTodoById, createTodo, updateTodo, deleteTodo } = require('./routes/todos/todos');

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send("Welcome on my todo app\n");
})

app.post('/register', registerUser);
app.post('/login', loginUser);

app.use(verifyToken);

app.get('/user', infoUser);
app.get('/user/todos', getUserTodos);
app.get('/users/:id', infoUserByElt);
app.put('/users/:id', updateUser);
app.delete('/users/:id', deleteUser);

// Todos
app.get('/todos', getAllTodos);
app.get('/todos/:id', getTodoById);
app.post('/todos', createTodo);
app.put('/todos/:id', updateTodo);
app.delete('/todos/:id', deleteTodo);

// 404 Middleware
app.use(notFound);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
