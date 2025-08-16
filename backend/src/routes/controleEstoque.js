const express = require('express');
const router = express.Router();
const controleEstoqueModel = require('../models/controleEstoque');

// Listar entradas de estoque de um produto
router.get('/:id_produto', async (req, res) => {
  try {
    const { id_produto } = req.params;
    const entradas = await controleEstoqueModel.listarEntradasPorProduto(id_produto);
    res.json(entradas);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar entradas de estoque.' });
  }
});

// Registrar nova entrada de estoque
router.post('/', async (req, res) => {
  try {
    const { id_produto, quantidade, data_compra, id_usuario } = req.body;
    if (!id_produto || !quantidade || !data_compra || !id_usuario) {
      return res.status(400).json({ error: 'Campos obrigatórios: id_produto, quantidade, data_compra, id_usuario.' });
    }
    const entrada = await controleEstoqueModel.registrarEntrada({ id_produto, quantidade, data_compra, id_usuario });
    res.status(201).json(entrada);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao registrar entrada de estoque.' });
  }
});

// Editar movimentação de estoque
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantidade, data_compra, id_usuario } = req.body;
    if (!quantidade || !data_compra || !id_usuario) {
      return res.status(400).json({ error: 'Campos obrigatórios: quantidade, data_compra, id_usuario.' });
    }
    const movimentacao = await controleEstoqueModel.editarMovimentacao({ id, quantidade, data_compra, id_usuario });
    if (movimentacao) {
      res.status(200).json(movimentacao);
    } else {
      res.status(404).json({ error: 'Movimentação não encontrada.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erro ao editar movimentação.' });
  }
});

// Excluir movimentação de estoque (lógica)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await controleEstoqueModel.excluirMovimentacao(id);
    if (result) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ error: 'Movimentação não encontrada.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir movimentação.' });
  }
});

module.exports = router;
