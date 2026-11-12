"use client";

import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { buscarDados, enviarDados } from "../../services/api";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ nome: "", email: "", telefone: "" });
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  async function carregar() {
    setCarregando(true);
    setErro("");
    try { setClientes(await buscarDados("clientes")); }
    catch (error) { setErro(error.message); }
    finally { setCarregando(false); }
  }

  useEffect(() => { carregar(); }, []);

  function alterar(event) { setForm({ ...form, [event.target.name]: event.target.value }); }

  async function cadastrar(event) {
    event.preventDefault();
    setSalvando(true);
    setMensagem("");
    try {
      await enviarDados("clientes", "POST", { nome: form.nome.trim(), email: form.email.trim() || undefined, telefone: form.telefone.trim() || undefined });
      setForm({ nome: "", email: "", telefone: "" });
      setMensagem("Cliente cadastrado.");
      await carregar();
    } catch (error) { setMensagem(error.message); }
    finally { setSalvando(false); }
  }

  return (
    <><Header /><main className="container pagina">
      <div className="pagina-topo"><div><p className="sobre-titulo">CADASTROS</p><h1 className="titulo-pagina">Clientes</h1><p className="texto-pagina">Consulte os clientes e registre novos cadastros.</p></div><button className="btn btn-secundario" onClick={carregar}>Atualizar</button></div>
      <div className="colunas-pagina">
        <section className="painel"><h2 className="titulo-painel">Novo cliente</h2><form onSubmit={cadastrar} className="formulario"><label htmlFor="nome">Nome</label><input id="nome" name="nome" value={form.nome} onChange={alterar} required maxLength={100} placeholder="Nome do cliente" /><label htmlFor="email">E-mail</label><input id="email" name="email" type="email" value={form.email} onChange={alterar} placeholder="cliente@email.com" /><label htmlFor="telefone">Telefone</label><input id="telefone" name="telefone" value={form.telefone} onChange={alterar} maxLength={20} placeholder="(00) 00000-0000" /><button className="btn btn-primario" disabled={salvando}>{salvando ? "Salvando..." : "Cadastrar cliente"}</button>{mensagem && <p className="mensagem-info">{mensagem}</p>}</form></section>
        <section className="painel"><div className="titulo-linha"><h2 className="titulo-painel">Clientes cadastrados</h2><span className="contador">{clientes.length}</span></div>{carregando ? <p className="aviso">Carregando...</p> : erro ? <p className="mensagem-erro">{erro}</p> : clientes.length === 0 ? <p className="aviso">Nenhum cliente cadastrado na API.</p> : <div className="lista-registros">{clientes.map((cliente) => <article className="registro" key={cliente.id}><span className="registro-icone">{cliente.nome?.charAt(0)?.toUpperCase()}</span><div><strong>{cliente.nome}</strong><small>{cliente.email || "E-mail não informado"}</small><small>{cliente.telefone || `ID: ${cliente.id}`}</small></div></article>)}</div>}</section>
      </div>
    </main></>
  );
}
