const express = require("express");
const app = express();
const multer = require('multer');
const fs = require("fs");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/media');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})
var upload = multer({ storage: storage })

app.use(express.static('public'));
app.get("/", (req,res) => {
    res.sendFile(__dirname + '/index.html');
})

app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
    const file = req.file;
    if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error);
    }
    res.send();
})

app.get('/mediaFiles', async function(req, res) {
    let filePaths = [];
    await fs.readdir(__dirname + "\\public\\media", (err, files) => {
        if(err)
            return console.log(err);

        files.forEach(file => filePaths.push("media/" + file));
        res.send(filePaths);
    });
})

app.listen(8080,()=>{
    console.log("Server started on 8080");
})