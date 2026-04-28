export async function json(request, response) {
    // Array para acumular os chunks binarios do corpo da requisicao.
    const buffers = [];

    // Le o stream da requisicao chunk por chunk.
    for await(const chunk of request) {
        // Guarda cada parte recebida.
        buffers.push(chunk);
    }

    // Tenta converter o corpo concatenado para JSON.
    try{
        // Junta os chunks, converte para string e faz parse para objeto.
        request.body = JSON.parse(Buffer.concat(buffers).toString())  ;

    }catch{
        // Se nao for JSON valido, define body como nulo.
        request.body=null
    }

    // Define que as respostas do servidor serao enviadas como JSON.
    response.setHeader('Content-Type', 'application/json');
}
