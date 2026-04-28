import http from 'node:http';
import { Transform} from 'node:stream';
import { buffer } from 'node:stream/consumers';
// Stream de transformacao que inverteria sinais numericos.
class InverseNumberStream extends Transform {
    // Recebe chunk, transforma e devolve com callback.
    _transform(chunk, encoding, callback) {
        // Converte o chunk para numero e inverte o sinal.
        const number = Number(chunk.toString()) *-1;
        // Mostra no console o numero invertido.
        console.log(number)
        // Envia para frente o novo valor em Buffer.
        callback(null, Buffer.from(String(number)));
        
    }
}



// Cria servidor HTTP simples para ler stream do corpo da requisicao.
const server = http.createServer((request, response) => {

    // Array para acumular os chunks recebidos.
    const buffers = [];

    // Le cada chunk do corpo da requisicao.
    for await(const chunk of request) {
        // Guarda cada chunk para montar o conteudo completo depois.
        buffers.push(chunk);
    }

    // Concatena tudo e converte para string.
    const fullStreamContent = Buffer.concat(buffers).toString();

    // Mostra o conteudo completo recebido.
    console.log(fullStreamContent)

    // Devolve no response o mesmo conteudo recebido.
    return response.end(fullStreamContent)


   
});

// Inicia o servidor na porta 3334.
server.listen(3334);
