# Stockapi

Aplicação web responsiva para consultar e gerenciar categorias, produtos, clientes e pedidos usando a API Stockapi do IFRO.

## Como executar

1. Abra a pasta `stockapi` no VS Code.
2. Abra o terminal dentro dessa pasta.
3. Execute `npm install`.
4. Execute `npm run dev`.
5. Acesse `http://localhost:3000`.

## Páginas

- `/` - Início e integrantes do grupo.
- `/categorias` - Consulta e cadastro de categorias.
- `/produtos` - Consulta e cadastro de produtos.
- `/clientes` - Consulta e cadastro de clientes.
- `/pedidos` - Lista pedidos e permite atualizar o status.
- `/pedidos/criar` - Criação de pedidos com cliente, produtos e quantidades.

## API

A aplicação utiliza `https://stock.dev.vilhena.ifro.edu.br/api` por meio de Fetch API.
