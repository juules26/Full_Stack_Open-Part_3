const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express()

app.use(cors())
app.use(express.json())

app.use(express.static((path.join(__dirname, 'dist'))))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

let notes = [
    { id: 1, content: "HTML is easy", important: true },
    { id: 2, content: "Browser can execute only JavaScript", important: false },
    { id: 3, content: "GET and POST are the most important methods of HTTP protocol", important: true }
];

app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = notes.length + 1; // Simple ID generation
    notes.push(newNote);
    res.status(201).json(newNote);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

