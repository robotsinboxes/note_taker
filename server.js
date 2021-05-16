// require dependencies express, path. fs & uniqid to create unique IDs for the notes
const express = require('express');
const app = express();
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const { v4 : uuidv4 } = require('uuid');

let db = fs.readFileSync('./db/db.json');
let notes = JSON.parse(db);

// Set the port
const PORT = process.env.PORT || 3008;

// handles data parsing
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static('public'));
app.use(express.json());

// GET routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
})

app.get('/api/notes', async(req, res) => {
    try {
        const asyncReadFile = promisify(fs.readFile);
        const notes = await asyncReadFile('./db/db.json', 'utf-8'); 
        if (notes) {
            console.log(notes);
            const parsedNotes = JSON.parse(notes);
            res.json(parsedNotes);
    }
    } catch (error) {
        console.log(error);
    } 
})


// POST /api/notes recieves new note to save on request body, add it to db.json and return new note to client. Each note needs a unique id
app.post('/api/notes', async(req, res) => {
    // set values for new note, including unique id
    let newNote = req.body;
    newNote.id = uuidv4();
    // push new note
    // write new note to db.json, then stringify the data
    try {
        const asyncReadFile = promisify(fs.readFile);
        const notes = await asyncReadFile('./db/db.json', 'utf-8'); 
        const parsedNotes = JSON.parse(notes);
        parsedNotes.push(newNote);
       const asyncWriteFile = promisify(fs.writeFile);
       const allNotes = await asyncWriteFile('./db/db.json', JSON.stringify(parsedNotes));
       res.json(allNotes);
    } catch (error) {
        console.log(error);
    }
})

// app.delete('/api/notes/:id', (req, res) => {
//     const currentNote = req.params.id;
//     notes = notes.filter(item => item.id != currentNote);
//     fs.writeFile("./db/db.json", JSON.stringify(notes), function (err) {
//       if (err) {
//         console.log(err);
//       } 
//       console.log("success");
//     })
//     res.json(notes);
// });


// catch all to direct home
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
})

// create a listener on PORT
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})