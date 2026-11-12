"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import { buscarDados } from "../services/api";

const integrantes = ["Eliza Magalhães Medeiro", "Luis Roberto", "Felipe Orocondo", "Mabylle"];

export default function Home() {
  const [totais, setTotais] = useState({ produtos: 0, categorias: 0, clientes: 0, pedidos: 0 });
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const [produtos, categorias, clientes, pedidos] = await Promise.all([
          buscarDados("produtos"), buscarDados("categorias"), buscarDados("clientes"), buscarDados("pedidos")
        ]);
        setTotais({
          produtos: produtos.length,
          categorias: categorias.length,
          clientes: clientes.length,
          pedidos: pedidos.length
        });
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  return (
    <>
      <Header />
      <section className="hero">
        <div className="container">
          <p className="hero-etiqueta">CONTROLE DE ESTOQUE</p>
          <h1>Painel de controle Stockapi</h1>
          <p>Consulte produtos, organize clientes e acompanhe os pedidos da loja em um só lugar.</p>
          <Link href="/pedidos/criar" className="btn btn-primario hero-botao">Criar pedido</Link>
        </div>
      </section>
      <main className="container pagina">
        <section className="secao">
          <div className="titulo-linha">
            <div>
              <p className="sobre-titulo">NOSSA EQUIPE</p>
              <h2 className="titulo-secao">Integrantes do grupo</h2>
            </div>
          </div>
          <div className="grid-quatro">
            {integrantes.map((nome) => <article className="card-integrante" key={nome}><span className="integrante-inicial">{nome.charAt(0)}</span><h3>{nome}</h3></article>)}
          </div>
        </section>
        <section className="secao">
          <p className="sobre-titulo">DADOS DA API</p>
          <h2 className="titulo-secao">Resumo do sistema</h2>
          {carregando ? <p className="aviso">Carregando informações...</p> : erro ? <p className="mensagem-erro">{erro}</p> : (
            <div className="grid-quatro">
              {[{ nome: "Produtos", valor: totais.produtos, link: "/produtos" }, { nome: "Categorias", valor: totais.categorias, link: "/categorias" }, { nome: "Clientes", valor: totais.clientes, link: "/clientes" }, { nome: "Pedidos", valor: totais.pedidos, link: "/pedidos" }].map((item) => (
                <article className="card-stat" key={item.nome}><span className="stat-titulo">{item.nome}</span><strong className="stat-valor">{item.valor}</strong><Link href={item.link} className="link-acao">Acessar</Link></article>
              ))}
            </div>
          )}
        </section>
        <section className="secao">
          <p className="sobre-titulo">ATALHOS</p>
          <h2 className="titulo-secao">O que deseja fazer?</h2>
          <div className="botoes-grid">
            <Link href="/categorias" className="btn btn-secundario">Ver categorias</Link>
            <Link href="/produtos" className="btn btn-secundario">Ver produtos</Link>
            <Link href="/clientes" className="btn btn-secundario">Ver clientes</Link>
            <Link href="/pedidos" className="btn btn-secundario">Listar pedidos</Link>
            <Link href="/pedidos/criar" className="btn btn-primario">Criar pedido</Link>
          </div>
        </section>
      </main>
    </>
  );
}
