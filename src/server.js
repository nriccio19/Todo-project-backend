import express from 'express'
import knex from 'knex'
import bodyParser from 'body-parser'

// Local network configuration
const IP = '192.168.1.23'
const PORT = 8080

const app = express()
//route to the root
app.get(`/`, (req, res) => {
    res.send(`Todos APP`)
})
app.get(`/CreateTask`, (req, res) => {
    res.send({ content: 'Faire des courses.' })
})
app.get(`/delete`, (req, res) => {
    res.send(`deleted task`)
})
app.get(`/TaskDone/:id`, (req, res) => {
    res.send(`task done`)
})
app.get(`/TaskUndone/:id`, (req, res) => {
    res.send(`task undone`)
})
app.get(`/modify`, (req, res) => {
    res.send(`task modified`)
})
app.get(`/list/:filter`, (req, res) => {
    res.send(`task filter`)
})

const db = knex({
    // Connecting to the database
    client: 'pg',
    connection: {
        host: '192.168.1.23',
        user: 'db_user',
        password: 'strongpassword123',
        database: 'todos_db',
    },
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get(`/`, (req, res) => {
    db.select(`*`)
        .from(`task`)
        .then((data) => {
            res.render(`index`, { todos: data })
        })
        .catch((err) => res.status(400).json(err))
})

app.post(`/CreateTask`, (req, res) => {
    const { textTodo } = req.body
    db(`task`)
        .insert({ task: textTodo })
        .returning(`*`)
        .then((_) => {
            res.redirect(`/`)
        })
        .catch((err) => {
            res.status(400).json({ message: `unable to create a new task` })
        })
})

app.post(`/TaskDone`, (req, res) => {
    const { name, id } = req.body
    if (name === `todos_db`) {
        db(`task`)
            .where(`id`, `=`, id)
            .update(`status`, 1)
            .returning(`status`)
            .then((task) => {
                res.json(task[0])
            })
    } else {
        db(`task`)
            .where(`id`, `=`, id)
            .update(`status`, 0)
            .returning(`status`)
            .then((task) => {
                res.json(task[0])
            })
    }
})

app.post(`/TaskUndone`, (req, res) => {
    const { name, id } = req.body
    if (name === `todos_db`) {
        db(`task`)
            .where(`id`, `=`, id)
            .update(`status`, 0)
            .returning(`status`)
            .then((task) => {
                res.json(task[0])
            })
    } else {
        db(`task`)
            .where(`id`, `=`, id)
            .update(`status`, 0)
            .returning(`status`)
            .then((task) => {
                res.json(task[0])
            })
    }
})

// server port connection
app.listen(PORT, IP, () => {
    console.log(`listening on ${IP}:${PORT}`)
})
