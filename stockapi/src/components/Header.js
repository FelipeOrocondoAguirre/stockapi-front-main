"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [aberto, setAberto] = useState(false);
  const [pedidosAbertos, setPedidosAbertos] = useState(false);

  function fecharMenu() {
    setAberto(false);
    setPedidosAbertos(false);
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link href="/" className="logo" onClick={fecharMenu}>Stockapi</Link>
        <button className="btn-menu" onClick={() => setAberto(!aberto)} aria-label="Abrir ou fechar menu" aria-expanded={aberto}>
          {aberto ? "✕" : "☰"}
        </button>
        <nav className={`nav-menu ${aberto ? "aberto" : ""}`}>
          <Link href="/categorias" className="nav-link" onClick={fecharMenu}>Categorias</Link>
          <Link href="/produtos" className="nav-link" onClick={fecharMenu}>Produtos</Link>
          <Link href="/clientes" className="nav-link" onClick={fecharMenu}>Clientes</Link>
          <div className="dropdown">
            <button className="dropdown-btn" onClick={() => setPedidosAbertos(!pedidosAbertos)} aria-expanded={pedidosAbertos}>Pedidos ▾</button>
            <div className={`dropdown-menu ${pedidosAbertos ? "dropdown-aberto" : ""}`}>
              <Link href="/pedidos" className="dropdown-link" onClick={fecharMenu}>Listar pedidos</Link>
              <Link href="/pedidos/criar" className="dropdown-link" onClick={fecharMenu}>Criar pedido</Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
