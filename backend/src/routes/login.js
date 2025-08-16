const express = require('express');
const router = express.Router();
const usuarioModel = require('../models/usuario');
const jwt = require('jsonwebtoken');
const config = require('../config');

router.post('/', async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    if (!email || !senha) {
      return res.status(400).json({ 
        sucesso: false,
        mensagem: 'Email e senha são obrigatórios.' 
      });
    }

    // Buscar usuário por email
    const usuario = await usuarioModel.buscarPorEmail(email);
    
    if (!usuario) {
      return res.status(401).json({ 
        sucesso: false,
        mensagem: 'Email ou senha inválidos.' 
      });
    }

    // Verificar se a senha está correta (SHA256)
    const senhaHash = usuarioModel.hashSenhaSHA256(senha);
    const senhaValida = usuario.senha === senhaHash;
    
    if (!senhaValida) {
      return res.status(401).json({ 
        sucesso: false,
        mensagem: 'Email ou senha inválidos.' 
      });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { 
        id: usuario.id, 
        uuid: usuario.uuid,
        email: usuario.email, 
        nome: usuario.nome 
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.json({ 
      sucesso: true,
      token, 
      usuario: {
        id: usuario.id,
        uuid: usuario.uuid,
        nome: usuario.nome,
        email: usuario.email,
        situacao: usuario.situacao
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ 
      sucesso: false,
      mensagem: 'Erro interno do servidor.' 
    });
  }
});

module.exports = router;
