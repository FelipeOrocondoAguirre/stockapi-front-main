export const API_URL = "https://stock.dev.vilhena.ifro.edu.br/api";

export async function buscarDados(rota) {
  const resposta = await fetch(`${API_URL}/${rota}`);
  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.erro || "Não foi possível carregar os dados.");
  }

  return dados;
}

export async function enviarDados(rota, metodo, dados) {
  const resposta = await fetch(`${API_URL}/${rota}`, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  });

  const resultado = resposta.status === 204 ? null : await resposta.json();

  if (!resposta.ok) {
    throw new Error(resultado?.erro || resultado?.erros?.join(", ") || "Não foi possível salvar os dados.");
  }

  return resultado;
}
