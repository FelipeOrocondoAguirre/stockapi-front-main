"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import { buscarDados, enviarDados } from "../../services/api";

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      const [listaPedidos, listaClientes, listaItens] = await Promise.all([buscarDados("pedidos"), buscarDados("clientes"), buscarDados("itens_pedido")]);
      setPedidos(listaPedidos);
      setClientes(listaClientes);
      setItens(listaItens);
    } catch (error) { setErro(error.message); }
    finally { setCarregando(false); }
  }

  useEffect(() => { carregar(); }, []);

  function nomeCliente(id) { return clientes.find((cliente) => Number(cliente.id) === Number(id))?.nome || `Cliente #${id}`; }
  function quantidadeItens(id) { return itens.filter((item) => Number(item.pedido_id) === Number(id) || Number(item.pedido_numero) === Number(id)).length; }

  async function atualizarStatus(id, status) {
    try {
      await enviarDados(`pedidos/${id}`, "PUT", { status });
      await carregar();
    } catch (error) { setErro(error.message); }
  }

  return (
    <><Header /><main className="container pagina">
      <div className="pagina-topo"><div><p className="sobre-titulo">MOVIMENTAÇÕES</p><h1 className="titulo-pagina">Pedidos</h1><p className="texto-pagina">Consulte os pedidos e acompanhe seus status.</p></div><div className="acoes-topo"><button className="btn btn-secundario" onClick={carregar}>Atualizar</button><Link href="/pedidos/criar" className="btn btn-primario">Criar pedido</Link></div></div>
      <section className="painel"><div className="titulo-linha"><h2 className="titulo-painel">Pedidos cadastrados</h2><span className="contador">{pedidos.length}</span></div>
        {carregando ? <p className="aviso">Carregando pedidos...</p> : erro ? <p className="mensagem-erro">{erro}</p> : pedidos.length === 0 ? <p className="aviso">Nenhum pedido cadastrado na API.</p> : <div className="tabela-rolagem"><table className="tabela"><thead><tr><th>Pedido</th><th>Cliente</th><th>Data</th><th>Itens</th><th>Status</th></tr></thead><tbody>{pedidos.map((pedido) => <tr key={pedido.id}><td>#{pedido.id}</td><td>{nomeCliente(pedido.cliente_id)}</td><td>{pedido.data_pedido ? new Date(pedido.data_pedido).toLocaleString("pt-BR") : "-"}</td><td>{quantidadeItens(pedido.id)}</td><td><select className="select-status" value={pedido.status || "pendente"} onChange={(e) => atualizarStatus(pedido.id, e.target.value)}><option value="pendente">Pendente</option><option value="em andamento">Em andamento</option><option value="concluido">Concluído</option><option value="cancelado">Cancelado</option></select></td></tr>)}</tbody></table></div>}
      </section>
    </main></>
  );
}
