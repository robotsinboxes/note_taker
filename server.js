// require dependencies express, path. fs & uniqid to create unique IDs for the notes
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const uniqid = require('uniqid');

// Set the port
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// connects to routes
// require('./routes/home')(app);
// require('./routes/notes')(app);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Develop/index.html'));
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'Develop/notes.html'));
})

app.get('/api/notes', (req, res) => {
    return res.json(db);
})

// POST /api/notes recieves new note to save on request body, add it to db.json and return new note to client. Each note needs a unique id
app.post('/api/notes', (req, res) => {
    let newNote = req.body;
    // set unique id
    newNote.id = uniqid();
    // push new note
    data.push(newNote);
    // write new note to db.json, then stringify the data
    fs.writeFile('', JSON.stringify(db), (err) => {
        if (err) throw err;
        res.json(db);
    });
    console.log(db);
})

// delete note in db.json based on given id
app.delete('/api/notes/:id', (req, res) => {
    // grab note id to delete and store in var id
    let id = req.params.id;
    // find the note with the assoc id
    let noteDelete = data.find(note => note.id === id);
    // if a matching ID is found in Json object
    if (id === note.id) {
        // take out that line item
        data.splice(data.indexOf(noteDelete),1);
        fs.writeFile('./db/db.json', JSON.stringify(db), (err) => {
            res.json(data);
        })
    }
})

// create a listener on PORT
app.listen(PORT, function() {
    console.log(`App listening on port ${PORT}`);
})