"use client";

import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { buscarDados, enviarDados } from "../../services/api";

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({ nome: "", preco: "", descricao: "", quantidade_estoque: "0", categoria_id: "" });
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [busca, setBusca] = useState("");

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      const [listaProdutos, listaCategorias] = await Promise.all([buscarDados("produtos"), buscarDados("categorias")]);
      setProdutos(listaProdutos);
      setCategorias(listaCategorias);
    } catch (error) { setErro(error.message); }
    finally { setCarregando(false); }
  }

  useEffect(() => { carregar(); }, []);

  function alterar(event) { setForm({ ...form, [event.target.name]: event.target.value }); }

  async function cadastrar(event) {
    event.preventDefault();
    setSalvando(true);
    setMensagem("");
    const dados = {
      nome: form.nome.trim(),
      preco: Number(form.preco),
      descricao: form.descricao.trim() || undefined,
      quantidade_estoque: Number(form.quantidade_estoque),
      categoria_id: form.categoria_id ? Number(form.categoria_id) : null
    };
    try {
      await enviarDados("produtos", "POST", dados);
      setForm({ nome: "", preco: "", descricao: "", quantidade_estoque: "0", categoria_id: "" });
      setMensagem("Produto cadastrado.");
      await carregar();
    } catch (error) { setMensagem(error.message); }
    finally { setSalvando(false); }
  }

  function nomeCategoria(id) { return categorias.find((categoria) => Number(categoria.id) === Number(id))?.nome || "Sem categoria"; }
  const produtosFiltrados = produtos.filter((produto) => produto.nome?.toLowerCase().includes(busca.toLowerCase()));

  return (
    <><Header /><main className="container pagina">
      <div className="pagina-topo"><div><p className="sobre-titulo">ESTOQUE</p><h1 className="titulo-pagina">Produtos</h1><p className="texto-pagina">Cadastre e consulte os produtos disponíveis.</p></div><button className="btn btn-secundario" onClick={carregar}>Atualizar</button></div>
      <div className="colunas-pagina">
        <section className="painel"><h2 className="titulo-painel">Novo produto</h2><form onSubmit={cadastrar} className="formulario"><label htmlFor="nome">Nome do produto</label><input id="nome" name="nome" value={form.nome} onChange={alterar} maxLength={100} required placeholder="Nome do produto" /><label htmlFor="descricao">Descrição</label><textarea id="descricao" name="descricao" value={form.descricao} onChange={alterar} rows="3" placeholder="Descrição (opcional)" /><div className="form-duplo"><div><label htmlFor="preco">Preço (R$)</label><input id="preco" name="preco" type="number" min="0.01" step="0.01" value={form.preco} onChange={alterar} required /></div><div><label htmlFor="quantidade_estoque">Quantidade</label><input id="quantidade_estoque" name="quantidade_estoque" type="number" min="0" step="1" value={form.quantidade_estoque} onChange={alterar} required /></div></div><label htmlFor="categoria_id">Categoria</label><select id="categoria_id" name="categoria_id" value={form.categoria_id} onChange={alterar}><option value="">Sem categoria</option>{categorias.map((categoria) => <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>)}</select><button className="btn btn-primario" disabled={salvando}>{salvando ? "Salvando..." : "Cadastrar produto"}</button>{mensagem && <p className="mensagem-info">{mensagem}</p>}</form></section>
        <section className="painel"><div className="titulo-linha"><h2 className="titulo-painel">Produtos cadastrados</h2><span className="contador">{produtos.length}</span></div><input className="campo-busca" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar produto..." />{carregando ? <p className="aviso">Carregando...</p> : erro ? <p className="mensagem-erro">{erro}</p> : produtosFiltrados.length === 0 ? <p className="aviso">Nenhum produto encontrado.</p> : <div className="lista-registros">{produtosFiltrados.map((produto) => <article className="registro produto-registro" key={produto.id}><div><strong>{produto.nome}</strong><small>{nomeCategoria(produto.categoria_id)} · ID: {produto.id}</small><small>Estoque: {produto.quantidade_estoque ?? 0} unidade(s)</small></div><strong className="preco-produto">{Number(produto.preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong></article>)}</div>}</section>
      </div>
    </main></>
  );
}
