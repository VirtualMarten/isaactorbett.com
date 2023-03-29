const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express()
const port = 3000
const posts_directory = 'posts';

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static('posts'));

app.get('/posts/:offset', (req, res) => {
    files = []
    fs.readdirSync(posts_directory).forEach(file => {
        let create_date = fs.statSync(path.join(posts_directory, file)).ctime;
        files.push({
            date: create_date,
            name: file
        });
    });
    res.send(files)
});

app.listen(port, () => console.log(`Listening on port ${port}.`));