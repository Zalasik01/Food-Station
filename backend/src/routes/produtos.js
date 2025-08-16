const express = require('express');
const router = express.Router();
const produtoModel = require('../models/produto');

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, valor, quantidade_estoque, estoque_minimo, ativo } = req.body;
    if (!nome || valor == null || quantidade_estoque == null) {
      return res.status(400).json({ error: 'Campos obrigatórios: nome, valor, quantidade_estoque.' });
    }
    const produtoAtualizado = await produtoModel.editarProduto({ id, nome, valor, quantidade_estoque, estoque_minimo, quantidade: 0, ativo });
    if (!produtoAtualizado) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }
    res.json(produtoAtualizado);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao editar produto.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const produto = await produtoModel.buscarProdutoPorId(id);
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }
    res.json(produto);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar produto.' });
  }
});

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
    const { nome, valor, quantidade_estoque, estoque_minimo } = req.body;
    if (!nome || valor == null || quantidade_estoque == null) {
      return res.status(400).json({ error: 'Campos obrigatórios: nome, valor, quantidade_estoque.' });
    }
    const novoProduto = await produtoModel.criarProduto({ nome, valor, quantidade_estoque, estoque_minimo, quantidade: 0 });
    res.status(201).json(novoProduto);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao cadastrar produto.' });
  }
});

// Nova rota para atualizar estoque
router.post('/:id/atualizar-estoque', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantidade_caixas, quantidade_por_caixa } = req.body;
    
    if (!quantidade_caixas || !quantidade_por_caixa || quantidade_caixas <= 0 || quantidade_por_caixa <= 0) {
      return res.status(400).json({ error: 'Quantidade de caixas e quantidade por caixa devem ser maiores que zero.' });
    }
    
    const resultado = await produtoModel.atualizarEstoque({ id, quantidade_caixas, quantidade_por_caixa });
    res.json({
      produto: resultado.produto,
      movimentacao: resultado.movimentacao
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Erro ao atualizar estoque.' });
  }
});

module.exports = router;
