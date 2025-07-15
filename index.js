const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const app = express();
const port = 8000;

const path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// const upload = multer({
//     dest: 'uploads/',
// });

mongoose.connect('mongodb://localhost:27017/fileUploader', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
.catch(err => console.log("MongoDB connection error:", err));

const File = require('./models/File');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    return cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
    }
});

const upload = multer({ storage: storage });  

app.get('/', (req, res) => {
    res.render('home.ejs', {
        message: null,
        file: null,
        imageURL: null,
        searchMessage: null
    });
});


/* This code snippet is setting up a POST route at '/upload' in the Express application. When a POST
request is made to this route, it uses the `upload.single('file')` middleware provided by Multer to
handle file uploads. */
// app.post('/upload', upload.single('file'), (req, res) => {
//     console.log(req.file);
//     console.log(req.body);
//     res.render('home.ejs', {
//         message: 'File uploaded successfully',
//         file: req.file
//     });
// });

app.post('/upload', upload.single('file'), async (req, res) => {
    const fileData = await File.create({
        originalName: req.file.originalname,
        storedName: req.file.filename,
        path: req.file.path
    });

    res.render('home.ejs', {
        message: 'File uploaded successfully',
        file: req.file,
        imageURL: `/uploads/${req.file.filename}`,
        searchMessage: null
    });
});

app.use('/uploads', express.static('uploads')); // To serve static files

app.get('/fetch', async (req, res) => {
    const name = req.query.name;
    const file = await File.findOne({ originalName: name });

    if (!file) {
        return res.render('home.ejs', {
            message: null,
            file: null,
            imageURL: null,
            searchMessage: "No file found with that name"
        });
    }

    res.render('home.ejs', {
        message: null,
        file: null,
        imageURL: `/uploads/${file.storedName}`,
        searchMessage: null
    });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
