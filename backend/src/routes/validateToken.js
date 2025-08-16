const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config');

router.post('/', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ sucesso: false, mensagem: 'Token não fornecido.' });
  }
  try {
    jwt.verify(token, config.jwt.secret);
    return res.status(200).json({ sucesso: true });
  } catch (err) {
    return res.status(401).json({ sucesso: false, mensagem: 'Token inválido ou expirado.' });
  }
});

module.exports = router;
