const path = require('path');
const fs = require('fs');
const File = require('../models/file');

exports.upload = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const { originalname, mimetype, size, filename } = req.file;
  const ext = path.extname(originalname).slice(1);
  const file = await File.create({
    userId: req.user.id,
    name: originalname,
    extension: ext,
    mimeType: mimetype,
    size,
    path: filename,
  });
  res.json({ id: file.id });
};

exports.list = async (req, res) => {
  const list_size = parseInt(req.query.list_size) || 10;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * list_size;
  const { count, rows } = await File.findAndCountAll({
    where: { userId: req.user.id },
    limit: list_size,
    offset,
    order: [['id', 'DESC']],
  });
  res.json({ total: count, files: rows });
};

exports.info = async (req, res) => {
  const file = await File.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!file) return res.status(404).json({ message: 'File not found' });
  res.json(file);
};

exports.download = async (req, res) => {
  const file = await File.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!file) return res.status(404).json({ message: 'File not found' });
  const filePath = path.join(__dirname, '../uploads', file.path);
  res.download(filePath, file.name);
};

exports.delete = async (req, res) => {
  const file = await File.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!file) return res.status(404).json({ message: 'File not found' });
  const filePath = path.join(__dirname, '../uploads', file.path);
  try { fs.unlinkSync(filePath); } catch {}
  await file.destroy();
  res.json({ message: 'File deleted' });
};

exports.update = async (req, res) => {
  const file = await File.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!file) return res.status(404).json({ message: 'File not found' });
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  // Удаляем старый файл
  const oldPath = path.join(__dirname, '../uploads', file.path);
  try { fs.unlinkSync(oldPath); } catch {}
  // Обновляем параметры
  const { originalname, mimetype, size, filename } = req.file;
  const ext = path.extname(originalname).slice(1);
  file.name = originalname;
  file.extension = ext;
  file.mimeType = mimetype;
  file.size = size;
  file.path = filename;
  file.uploadDate = new Date();
  await file.save();
  res.json({ message: 'File updated' });
}; 