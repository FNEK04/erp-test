const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middlewares/auth');
const fileController = require('../controllers/fileController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.post('/file/upload', auth, upload.single('file'), fileController.upload);
router.get('/file/list', auth, fileController.list);
router.get('/file/:id', auth, fileController.info);
router.get('/file/download/:id', auth, fileController.download);
router.delete('/file/delete/:id', auth, fileController.delete);
router.put('/file/update/:id', auth, upload.single('file'), fileController.update);

module.exports = router; 