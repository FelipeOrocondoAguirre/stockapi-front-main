"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../../../components/Header";
import { buscarDados, enviarDados } from "../../../services/api";

export default function CriarPedidoPage() {
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [clienteId, setClienteId] = useState("");
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState("1");
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const [listaClientes, listaProdutos] = await Promise.all([buscarDados("clientes"), buscarDados("produtos")]);
        setClientes(listaClientes);
        setProdutos(listaProdutos);
      } catch (error) { setErro(error.message); }
      finally { setCarregando(false); }
    }
    carregar();
  }, []);

  function adicionarItem() {
    const produto = produtos.find((item) => Number(item.id) === Number(produtoId));
    const qtd = Number(quantidade);
    if (!produto || !Number.isInteger(qtd) || qtd < 1) {
      setErro("Selecione um produto e informe uma quantidade válida.");
      return;
    }
    const itemExistente = itens.find((item) => Number(item.produto_id) === Number(produto.id));
    if (itemExistente) {
      setItens(itens.map((item) => item.produto_id === produto.id ? { ...item, quantidade: item.quantidade + qtd } : item));
    } else {
      setItens([...itens, { produto_id: produto.id, nome: produto.nome, preco: Number(produto.preco), quantidade: qtd }]);
    }
    setProdutoId("");
    setQuantidade("1");
    setErro("");
  }

  function removerItem(id) { setItens(itens.filter((item) => Number(item.produto_id) !== Number(id))); }
  const total = itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0);

  async function criarPedido(event) {
    event.preventDefault();
    setErro("");
    setMensagem("");
    if (!clienteId || itens.length === 0) {
      setErro("Selecione um cliente e adicione pelo menos um produto.");
      return;
    }
    setSalvando(true);
    try {
      const pedido = await enviarDados("pedidos", "POST", { cliente_id: Number(clienteId) });
      for (const item of itens) {
        await enviarDados("itens_pedido", "POST", {
          pedido_id: Number(pedido.id),
          produto_id: Number(item.produto_id),
          quantidade: Number(item.quantidade),
          preco_unitario: Number(item.preco)
        });
      }
      setMensagem(`Pedido #${pedido.id} criado com sucesso.`);
      setClienteId("");
      setItens([]);
    } catch (error) {
      setErro(`${error.message} Verifique a lista de pedidos para conferir se o pedido chegou a ser criado.`);
    } finally { setSalvando(false); }
  }

  return (
    <><Header /><main className="container pagina">
      <div className="pagina-topo"><div><p className="sobre-titulo">NOVO REGISTRO</p><h1 className="titulo-pagina">Criar pedido</h1><p className="texto-pagina">Escolha o cliente e adicione os produtos e suas quantidades.</p></div><Link href="/pedidos" className="btn btn-secundario">Voltar aos pedidos</Link></div>
      {carregando ? <p className="aviso">Carregando clientes e produtos...</p> : erro && <p className="mensagem-erro">{erro}</p>}
      <form className="criar-pedido-grid" onSubmit={criarPedido}>
        <section className="painel"><h2 className="titulo-painel">Dados do pedido</h2><div className="formulario"><label htmlFor="cliente">Cliente</label><select id="cliente" value={clienteId} onChange={(e) => setClienteId(e.target.value)} required><option value="">Selecione um cliente</option>{clientes.map((cliente) => <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>)}</select><div className="linha-divisoria"></div><h3 className="titulo-painel">Adicionar produto</h3><label htmlFor="produto">Produto</label><select id="produto" value={produtoId} onChange={(e) => setProdutoId(e.target.value)}><option value="">Selecione um produto</option>{produtos.map((produto) => <option key={produto.id} value={produto.id}>{produto.nome} — {Number(produto.preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</option>)}</select><label htmlFor="quantidade">Quantidade</label><input id="quantidade" type="number" min="1" step="1" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} /><button type="button" className="btn btn-secundario" onClick={adicionarItem}>Adicionar ao pedido</button></div></section>
        <section className="painel"><div className="titulo-linha"><h2 className="titulo-painel">Itens do pedido</h2><span className="contador">{itens.length}</span></div>{itens.length === 0 ? <p className="aviso">Nenhum produto adicionado.</p> : <div className="lista-registros">{itens.map((item) => <article className="registro item-pedido" key={item.produto_id}><div><strong>{item.nome}</strong><small>{item.quantidade} × {item.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</small></div><div className="item-total"><strong>{(item.quantidade * item.preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong><button type="button" className="btn-remover" onClick={() => removerItem(item.produto_id)}>Remover</button></div></article>)}</div>}<div className="total-pedido"><span>Total dos itens</span><strong>{total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong></div><button type="submit" className="btn btn-primario botao-criar" disabled={salvando || carregando}>{salvando ? "Criando pedido..." : "Finalizar pedido"}</button>{mensagem && <p className="mensagem-sucesso">{mensagem}</p>}</section>
      </form>
    </main></>
  );
}
