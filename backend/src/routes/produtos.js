const express = require('express');
const router = express.Router();
const produtoModel = require('../models/produto');

router.get('/', async (req, res) => {
  try {
    const produtos = await produtoModel.listarProdutos();
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar produtos.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nome, preco, quantidade_estoque } = req.body;
    if (!nome || preco == null || quantidade_estoque == null) {
      return res.status(400).json({ error: 'Campos obrigatórios: nome, preco, quantidade_estoque.' });
    }
    const novoProduto = await produtoModel.criarProduto({ nome, preco, quantidade_estoque });
    res.status(201).json(novoProduto);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao cadastrar produto.' });
  }
});

module.exports = router;
