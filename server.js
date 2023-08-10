const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
var uniqid = require('uniqid');


const PORT = 3001;

app.use(express.static('Develop/public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Get for Homepage
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, 'Develop/public/index.html'))
);

//Get for Notes Page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'Develop/public/notes.html'))
);

//Post route to create/save notes
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    if (title && text) {
        const newNote = {
            title,
            text,
            id: uniqid()
        };
        const response = {
            status: 'success',
            body: newNote,
        };
        console.log(response);
        fs.readFile('./Develop/db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                const parsedNotes = JSON.parse(data);
                parsedNotes.push(newNote);
                fs.writeFile(
                    './Develop/db/db.json',
                    JSON.stringify(parsedNotes, null, 4),
                    (writeErr) =>
                        writeErr
                            ? console.error(writeErr)
                            : console.info('Successfully updated notes!')
                );
            }
        })
        res.status(200).json(`${req.method} request received`);
        return;
    }
});

//Get route to retrieve
app.get('/api/notes', (req, res) => {
    fs.readFile('./Develop/db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const existingNote = JSON.parse(data);
            res.json(existingNote);
        }
    })

})

//Delete route
app.delete(`/api/notes/:id`, (req, res) => {
    const { id } = req.params;
    fs.readFile('./Develop/db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedNotes = JSON.parse(data);
            let notesArray = parsedNotes.filter(item => item.id !== id);
            fs.writeFile(
                './Develop/db/db.json',
                JSON.stringify(notesArray, null, 4),
                (writeErr) =>
                    writeErr
                        ? console.error(writeErr)
                        : console.info('Successfully updated notes!')
            );

            res.send("DELETE Request Called")
        }
    })
})

//Catch all path
app.get('/*', (req, res) =>
    res.sendFile(path.join(__dirname, 'Develop/public/index.html'))
);

//Port listener
app.listen(process.env.PORT || 3001);

console.log(`Example app listening at http://localhost:${PORT}`)