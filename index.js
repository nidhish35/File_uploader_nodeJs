const express = require('express');
const multer = require('multer');
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
        file: null
    });
});


app.post('/upload', upload.single('file'), (req, res) => {
    console.log(req.file);
    console.log(req.body);
    res.render('home.ejs', {
        message: 'File uploaded successfully',
        file: req.file
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
