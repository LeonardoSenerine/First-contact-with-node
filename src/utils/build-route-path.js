export function buildRouthPath(path) {
  // Regex que identifica parametros no formato :param dentro da rota.
  const routerParametersRegex = /:([a-zA-Z]+)/g;

  // Substitui :param por grupos nomeados de regex para capturar valores da URL.
  const pathWithParams = path.replaceAll(
    routerParametersRegex,
    "(?<$1>[a-z0-9\-_]+)",
  );

  // Cria uma regex de rota ancorada no inicio da URL.
  const pathRegex = new RegExp(`^${pathWithParams}`)

  // Retorna a regex pronta para comparacao no roteador.
  return pathRegex
}
