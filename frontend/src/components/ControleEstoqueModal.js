
import React, { useState, useEffect } from 'react';

const ControleEstoqueModal = ({ open, onClose, onSave, idProduto, editMovimentacao, atualizarMovimentacaoLocal, adicionarMovimentacaoLocal }) => {
  const [quantidade, setQuantidade] = useState('');
  const [dataCompra, setDataCompra] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // Preencher campos se for edição
  useEffect(() => {
    if (open) {
      if (editMovimentacao) {
        setQuantidade(editMovimentacao.quantidade);
        setDataCompra(editMovimentacao.data_compra ? editMovimentacao.data_compra.split('T')[0] : '');
        setMsg('');
      } else {
        const hoje = new Date().toISOString().split('T')[0];
        setDataCompra(hoje);
        setQuantidade('');
        setMsg('');
      }
    }
  }, [open, editMovimentacao]);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      // Obter dados do usuário do localStorage
      const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
      const idUsuario = usuario.id;

      if (!idUsuario) {
        setMsg('Erro: usuário não identificado.');
        setLoading(false);
        return;
      }

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
      let res;
      if (editMovimentacao) {
        // Atualizar movimentação
        res = await fetch(`${apiUrl}/controle-estoque/${editMovimentacao.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quantidade: parseInt(quantidade),
            data_compra: dataCompra,
            id_usuario: idUsuario
          })
        });
      } else {
        // Nova movimentação
        res = await fetch(`${apiUrl}/controle-estoque`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_produto: idProduto,
            quantidade: parseInt(quantidade),
            data_compra: dataCompra,
            id_usuario: idUsuario
          })
        });
      }
      if (res.ok) {
        const mov = await res.json();
        setMsg(editMovimentacao ? 'Movimentação atualizada!' : 'Entrada registrada com sucesso!');
        if (editMovimentacao && atualizarMovimentacaoLocal) atualizarMovimentacaoLocal(mov);
        if (!editMovimentacao && adicionarMovimentacaoLocal) adicionarMovimentacaoLocal(mov);
        setTimeout(() => {
          onSave && onSave();
        }, 1200);
      } else {
        setMsg('Erro ao salvar movimentação.');
      }
    } catch {
      setMsg('Erro ao salvar movimentação.');
    }
    setLoading(false);
  };

  if (!open) return null;
  return (
    <div className="controle-estoque-modal__backdrop">
      <div className="controle-estoque-modal__container">
        <h2>{editMovimentacao ? 'Editar Movimentação' : 'Registrar Entrada de Mercadoria'}</h2>
        <form onSubmit={handleSubmit} className="controle-estoque-modal__form">
          <label>Data da Compra</label>
          <input type="date" value={dataCompra} onChange={e => setDataCompra(e.target.value)} required />
          <label>Quantidade Comprada</label>
          <input type="number" min="1" value={quantidade} onChange={e => setQuantidade(e.target.value)} required />
          <div className="controle-estoque-modal__actions">
            <button type="button" onClick={onClose} disabled={loading}>Cancelar</button>
            <button type="submit" disabled={loading}>{loading ? 'Salvando...' : (editMovimentacao ? 'Atualizar' : 'Registrar')}</button>
          </div>
        </form>
        {msg && <div className="controle-estoque-modal__msg">{msg}</div>}
      </div>
    </div>
  );
};

export default ControleEstoqueModal;
