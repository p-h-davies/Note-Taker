const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

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

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    // If all the required properties are present
    if (title && text) {
        // Variable for the object we will save
        const newNote = {
            title,
            text
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
                // Convert string into JSON object
                const parsedNotes = JSON.parse(data);
                // Add a new note
                parsedNotes.push(newNote);
                // Write updated notes back to the file
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

app.get('/api/notes', (req, res) => {
    res.status(200).json(`${req.method} request received to get notes`);
})




app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);

