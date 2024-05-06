const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const colors = require('colors');

const app = express();
const port = 3000;

const uploadDirectory = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}

const storage = multer.diskStorage({
    destination: uploadDirectory,
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const singleUpload = multer({ storage: storage }).single('file');

const multiUpload = multer({ 
    storage: storage,
    limits: { 
        files: 5 // Change this value according to your requirement
    }
}).array('files');

app.use(cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN,
    optionsSuccessStatus: 200
}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.post('/upload/single', (req, res) => {
    singleUpload(req, res, (err) => {
        if (err) {
            console.error('Erreur lors du téléchargement du fichier:'.red, err);
            return res.status(400).send('Une erreur est survenue lors du téléchargement du fichier.');
        }
        if (!req.file) {
            console.error('Aucun fichier téléchargé.'.red);
            return res.status(400).send('Aucun fichier n\'a été téléchargé.');
        }
        console.log('Fichier téléchargé:'.green, req.file.originalname);
        res.send({ filename: req.file.originalname });
    });
});

app.post('/upload/multi', (req, res) => {
    multiUpload(req, res, (err) => {
        if (err) {
            console.error('Erreur lors du téléchargement des fichiers:'.red, err);
            return res.status(400).send('Une erreur est survenue lors du téléchargement des fichiers.');
        }
        if (!req.files || req.files.length === 0) {
            console.error('Aucun fichier téléchargé.'.red);
            return res.status(400).send('Aucun fichier n\'a été téléchargé.');
        }
        console.log('Fichiers téléchargés:'.green);
        req.files.forEach(file => {
            console.log(file.originalname);
        });
        res.send({ filenames: req.files.map(file => file.originalname) });
    });
});

app.get('/images', (req, res) => {
    fs.readdir(uploadDirectory, (err, files) => {
        if (err) {
            console.error('Erreur lors de la lecture du répertoire des images:'.red, err);
            return res.status(500).send('Une erreur est survenue lors de la lecture du répertoire des images.');
        }
        const images = files.filter(file => {
            const extname = path.extname(file).toLowerCase();
            return extname === '.png' || extname === '.jpg' || extname === '.jpeg' || extname === '.gif';
        });
        res.send({ images });
    });
});

app.get('/stats', (req, res) => {
    fs.readdir(uploadDirectory, (err, files) => {
        if (err) {
            console.error('Erreur lors de la lecture du répertoire des images:'.red, err);
            return res.status(500).send('Une erreur est survenue lors de la lecture du répertoire des images.');
        }
        let totalSize = 0;
        files.forEach(file => {
            const filePath = path.join(uploadDirectory, file);
            const stats = fs.statSync(filePath);
            totalSize += stats.size;
        });
        const formattedSize = bytesToSize(totalSize);
        res.send({ totalSize: formattedSize });
    });
});

app.delete('/delete/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(uploadDirectory, filename);
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Erreur lors de la suppression du fichier:'.red, err);
            return res.status(500).send('Une erreur est survenue lors de la suppression du fichier.');
        }
        console.log('Fichier supprimé:'.green, filename);
        res.send('Fichier supprimé avec succès.');
    });
});

function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

// Route pour récupérer les fichiers en fonction de leur type
app.get('/files/:type', (req, res) => {
    const fileType = req.params.type.toLowerCase();
    fs.readdir(uploadDirectory, (err, files) => {
        if (err) {
            console.error('Erreur lors de la lecture du répertoire des fichiers:'.red, err);
            return res.status(500).send('Une erreur est survenue lors de la lecture du répertoire des fichiers.');
        }

        let filteredFiles;
        switch (fileType) {
            case 'image':
                filteredFiles = files.filter(file => {
                    const extname = path.extname(file).toLowerCase();
                    return extname === '.png' || extname === '.jpg' || extname === '.jpeg' || extname === '.gif';
                });
                break;
            case 'video':
                filteredFiles = files.filter(file => {
                    const extname = path.extname(file).toLowerCase();
                    return extname === '.mp4' || extname === '.avi' || extname === '.mkv' || extname === '.mov';
                });
                break;
            case 'document':
                filteredFiles = files.filter(file => {
                    const extname = path.extname(file).toLowerCase();
                    return extname === '.pdf' || extname === '.doc' || extname === '.docx' || extname === '.txt';
                });
                break;
            case 'zip':
                filteredFiles = files.filter(file => {
                    const extname = path.extname(file).toLowerCase();
                    return extname === '.zip' || extname === '.rar' || extname === '.7z';
                });
                break;
            case 'music':
                filteredFiles = files.filter(file => {
                    const extname = path.extname(file).toLowerCase();
                    return extname === '.mp3' || extname === '.wav' || extname === '.flac';
                });
                break;
            default:
                filteredFiles = [];
                break;
        }

        res.send({ files: filteredFiles });
    });
});

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`.cyan);
});
