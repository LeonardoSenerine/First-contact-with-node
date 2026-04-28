import http from "node:http";
import { json } from "./middlewares/json.js";
import { routes } from "./routes.js";

// Cria o servidor HTTP principal da aplicacao.
const server = http.createServer(async (request, response) => {
  // Extrai o metodo (GET/POST/PUT/DELETE...) e a URL da requisicao atual.
  const { method, url } = request;

  // Tenta ler o corpo da requisicao e converter para JSON.
  await json(request, response);

  // Procura a primeira rota que combine com metodo e caminho da requisicao.
  const route = routes.find((route) => {
    // Compara metodo e testa a URL com regex da rota.
    return route.method == method && route.path.test(url);
  });

  // Se encontrou rota valida, processa a requisicao nela.
  if (route) {
    // Captura parametros dinamicos da URL (ex.: /users/:id).
    const routeParams = request.url.match(route.path);

    // Salva os parametros extraidos dentro de request.params para o handler usar.
    request.params = { ...routeParams.groups };

    // Executa o handler da rota e encerra o fluxo aqui.
    return route.handler(request, response);
  }

  // Se nenhuma rota combinou, responde com 404.
  return response.writeHead(404).end("Not Found");
});

// Inicia o servidor na porta 3333.
server.listen(3333);
