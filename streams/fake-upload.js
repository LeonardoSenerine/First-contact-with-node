import {Readable} from 'node:stream';

// Stream de leitura que gera numeros de 1 a 5, um por segundo.
class OneToHundredStream extends Readable {
    // Valor atual do contador.
    index = 1
    // Metodo chamado automaticamente quando o fetch precisa de mais dados.
    _read(){
        // Copia o valor atual e incrementa para a proxima leitura.
        const i = this.index++;
       // Aguarda 1 segundo antes de enviar o proximo chunk.
       setTimeout(() => {
           // Enquanto i <= 5, continua emitindo dados.
           if (i <= 5) {
            // Converte o numero para Buffer.
            const buf = Buffer.from(String(i));
            // Empurra o chunk para o corpo da requisicao.
            this.push(buf);
        } else {
            // Envia null para sinalizar fim da stream.
            this.push(null);
        }},1000
       )
    }
}

// Envia uma requisicao POST para o servidor local usando stream como body.
fetch('http://localhost:3334', {
    // Define metodo HTTP de envio.
    method: 'POST',
    // Usa a stream criada como corpo da requisicao.
    body: new OneToHundredStream(),
    // Necessario no Node para streaming de request no fetch.
    duplex: 'half'
}).then(response => {
    // Le o texto da resposta e imprime no console.
    response.text().then(console.log)
})
