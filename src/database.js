import fs from "node:fs/promises";

// Resolve o caminho absoluto do arquivo db.json com base neste modulo.
const databasePatch = new URL("../db.json", import.meta.url);

// Classe simples de persistencia em JSON local.
export class DataBase {
  // Campo privado que guarda os dados em memoria.
  #database = {};

  // Carrega os dados do arquivo quando a classe e instanciada.
  constructor() {
    // Le o arquivo db.json como texto UTF-8.
    fs.readFile(databasePatch, "utf8")
      // Se a leitura funcionar, converte texto JSON para objeto JS.
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      // Se o arquivo nao existir/der erro, tenta persistir estado inicial vazio.
      .catch(() => {
        this.#persist();
      });
  }

  // Escreve o estado atual da memoria no arquivo db.json.
  #persist() {
    fs.writeFile(databasePatch, JSON.stringify(this.#database));
  }

  // Retorna todos os registros de uma tabela.
  select(table) {
    // Se a tabela nao existir ainda, devolve array vazio.
    const data = this.#database[table] ?? [];

    // Entrega os dados encontrados para quem chamou.
    return data;
  }
  // Insere um novo registro em uma tabela.
  insert(table, data) {
    // Se a tabela ja e um array, apenas adiciona o item.
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      // Se a tabela nao existe, cria um array com o primeiro item.
      this.#database[table] = [data];
    }

    // Persiste no arquivo apos inserir.
    this.#persist();
    // Retorna o dado inserido.
    return data;
  }

  // Remove um registro da tabela com base no ID.
  delete(table, id) {
    // Procura a posicao do registro que tenha o ID informado.
    const rowIndex = this.#database[table].findIndex((row) => row.id == id);

    // Se encontrou, remove o item daquela posicao.
    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      // Intencao: persistir apos remover (aqui faltou chamar a funcao com parenteses).
      this.#persist();
    }
  }

  // Atualiza um registro da tabela com base no ID.
  update(table, id, data) {
    // Procura a posicao do registro que tenha o ID informado.
    const rowIndex = this.#database[table].findIndex((row) => row.id == id);

    // Se encontrou, substitui o item mantendo o mesmo ID.
    if (rowIndex > -1) {
      this.#database[table][rowIndex] = { id, ...data };
      // Intencao: persistir apos atualizar (aqui faltou chamar a funcao com parenteses).
      this.#persist();
    }
  }
}
