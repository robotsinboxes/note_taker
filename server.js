// require dependencies express, path. fs & uniqid to create unique IDs for the notes
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const uniqid = require('uniqid');
const db = require('./db/db.json');

// Set the port
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));  
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
})

app.get('/api/notes', (req, res) => {
    return res.json(db);
})

// POST /api/notes recieves new note to save on request body, add it to db.json and return new note to client. Each note needs a unique id
app.post('/api/notes', (req, res) => {
    console.log(req.body); 
    // set values for new note, including unique id
    var newNote = {
        id: uniqid(),
        title: req.body.title,
        text: req.body.text,
    };
    // push new note
    db.push(newNote);
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
    let noteDelete = db.find(note => note.id === id);
    // if a matching ID is found in Json object
    if (id === note.id) {
        // take out that line item
        db.splice(db.indexOf(noteDelete),1);
        fs.writeFile('./db/db.json', JSON.stringify(db), (err) => {
            res.json(db);
        })
    }
})

// create a listener on PORT
app.listen(PORT, function() {
    console.log(`App listening on port ${PORT}`);
})