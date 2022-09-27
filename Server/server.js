require("dotenv").config();
const express = require("express");
const db = require("./database/conn")
const app = express();
const { response } = require("express");
const { json } = require("body-parser");

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());

app.get("/api/todo", async (req, res) => {
    try {
        let client = await db.connect();
        const result = await db.query("SELECT * FROM todos");
        res.json(result.rows);
        client.release();
    } catch (error) {
        console.error(error);
        res.send("ERROR: ", error);
    }
})

app.post('/api/todo', async (req, res) => {
    try {
        let client = await db.connect();
        const { task } = req.body;
        const { rows } = await db.query('INSERT INTO todos (task) VALUES($1) RETURNING *', [task]);
        res.send({ data: (rows), message: "New task has been created" });
        console.log({ rows });
        client.release();
    } catch (error) {
        console.error(error);
    }
})

app.patch('/api/todo/:id', async (req, res) => {
    try {
        let client = await db.connect();
        const { task } = req.body;
        const currentTask = await db.query('SELECT * FROM todos WHERE id = $1', [req.params.id]);
        const taskObj = {
            task: task || currentTask.rows[0].task
        }

        const updatedTask = await db.query('UPDATE todos SET task = $1 WHERE id = $2 RETURNING *', [taskObj.task, req.params.id]);
        res.send(updatedTask.rows[0]);
        client.release();
    } catch (error) {
        res.send(error.message);
    }
})

app.delete('/api/todo/:id', async (req, res) => {
    try {
        let client = await db.connect();
        const taskToBeDeleted = await db.query('SELECT * FROM todos WHERE id = $1', [req.params.id]);
        const deletedTask = await db.query('DELETE FROM todos WHERE id = $1', [req.params.id]);
        res.json(deletedTask.rows);
        client.release();
    } catch (error) {
        console.error(error);
    }
})

app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
})