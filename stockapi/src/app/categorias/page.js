"use client";

import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { buscarDados, enviarDados } from "../../services/api";

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [nome, setNome] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  async function carregar() {
    setCarregando(true);
    setErro("");
    try { setCategorias(await buscarDados("categorias")); }
    catch (error) { setErro(error.message); }
    finally { setCarregando(false); }
  }

  useEffect(() => { carregar(); }, []);

  async function cadastrar(event) {
    event.preventDefault();
    setSalvando(true);
    setMensagem("");
    try {
      await enviarDados("categorias", "POST", { nome: nome.trim() });
      setNome("");
      setMensagem("Categoria cadastrada.");
      await carregar();
    } catch (error) { setMensagem(error.message); }
    finally { setSalvando(false); }
  }

  return (
    <><Header /><main className="container pagina">
      <div className="pagina-topo"><div><p className="sobre-titulo">ESTOQUE</p><h1 className="titulo-pagina">Categorias</h1><p className="texto-pagina">Consulte e cadastre as categorias dos produtos.</p></div><button className="btn btn-secundario" onClick={carregar}>Atualizar</button></div>
      <div className="colunas-pagina">
        <section className="painel"><h2 className="titulo-painel">Nova categoria</h2><form onSubmit={cadastrar} className="formulario"><label htmlFor="nome">Nome da categoria</label><input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} maxLength={60} required placeholder="Ex.: Papelaria" /><button className="btn btn-primario" disabled={salvando}>{salvando ? "Salvando..." : "Cadastrar categoria"}</button>{mensagem && <p className="mensagem-info">{mensagem}</p>}</form></section>
        <section className="painel"><div className="titulo-linha"><h2 className="titulo-painel">Categorias cadastradas</h2><span className="contador">{categorias.length}</span></div>{carregando ? <p className="aviso">Carregando...</p> : erro ? <p className="mensagem-erro">{erro}</p> : categorias.length === 0 ? <p className="aviso">Nenhuma categoria cadastrada na API.</p> : <div className="lista-registros">{categorias.map((categoria) => <article className="registro" key={categoria.id}><span className="registro-icone">#</span><div><strong>{categoria.nome}</strong><small>ID: {categoria.id}</small></div></article>)}</div>}</section>
      </div>
    </main></>
  );
}
