import { DataBase } from "./database.js";
import { randomUUID } from "node:crypto";
import { buildRouthPath } from "./utils/build-route-path.js";
// Instancia unica do banco em memoria/arquivo para todas as rotas.
const database = new DataBase();

// Lista central de rotas da API.
export const routes = [
  // Rota para listar usuarios cadastrados.
  {
    // Metodo HTTP aceito por esta rota.
    method: "GET",
    // Caminho da rota convertido para regex.
    path: buildRouthPath("/users"),
    // Funcao chamada quando a rota combina.
    handler: (request, response) => {
      // Busca todos os usuarios na tabela "users".
      const users = database.select("users");

      // Retorna os usuarios em JSON.
      return response.end(JSON.stringify(users));
    },
  },
  // Rota para criar um novo usuario.
  {
    // Metodo HTTP aceito por esta rota.
    method: "POST",
    // Caminho da rota convertido para regex.
    path: buildRouthPath("/users"),
    // Funcao chamada quando a rota combina.
    handler: (request, response) => {
      // Le nome e email enviados no corpo da requisicao.
      const { name, email } = request.body;

      // Monta o objeto do novo usuario.
      const user = {
        // Gera um ID unico para o usuario.
        id: randomUUID(),
        // Atribui o nome recebido.
        name,
        // Atribui o email recebido.
        email,
      };

      // Salva o novo usuario na tabela "users".
      database.insert("users", user);

      // Define status 201 (criado) e tipo de resposta JSON.
      response.writeHead(201, { "Content-Type": "application/json" });
      // Retorna o usuario criado em JSON.
      return response.end(JSON.stringify(user));
    },
  },
  // Rota para remover um usuario por ID.
  {
    // Metodo HTTP aceito por esta rota.
    method: "DELETE",
    // Caminho com parametro dinamico :id.
    path: buildRouthPath("/users/:id"),
    // Funcao chamada quando a rota combina.
    handler: (request, response) => {
      // Le o ID extraido da URL.
      const { id } = request.params;

      // Remove o usuario correspondente ao ID.
      database.delete("users", id);
      // Retorna 204 (sem conteudo) apos remover.
      return response.writeHead(204).end();
    },
  },
  // Rota para atualizar nome/email de um usuario por ID.
  {
    // Metodo HTTP aceito por esta rota.
    method: "PUT",
    // Caminho com parametro dinamico :id.
    path: buildRouthPath("/users/:id"),
    // Funcao chamada quando a rota combina.
    handler: (request, response) => {
      // Le o ID extraido da URL.
      const { id } = request.params;
      // Le os novos dados recebidos no corpo da requisicao.
      const { name, email } = request.body;

      // Atualiza o usuario alvo com os novos dados.
      database.update("users", id, { name, email });
      // Retorna 204 (sem conteudo) apos atualizar.
      return response.writeHead(204).end();
    },
  },
];
