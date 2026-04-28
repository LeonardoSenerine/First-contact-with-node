import {Readable, Writable, Transform } from 'node:stream';
import { buffer } from 'node:stream/consumers';

// Stream de leitura que gera numeros de 1 a 100, um por segundo.
class OneToHundredStream extends Readable {
    // Valor atual do contador.
    index = 1
    // Metodo chamado automaticamente quando o consumidor pede mais dados.
    _read(){
        // Copia o valor atual e incrementa para a proxima leitura.
        const i = this.index++;
       // Aguarda 1 segundo antes de enviar o proximo chunk.
       setTimeout(() => {
           // Enquanto i <= 100, continua emitindo dados.
           if (i <= 100) {
            // Converte o numero para Buffer, formato esperado por streams.
            const buf = Buffer.from(String(i));
            // Empurra o chunk para frente no pipeline.
            this.push(buf);
        } else {
            // Envia null para sinalizar fim da stream.
            this.push(null);
        }},1000
       )
    }
}

// Stream de transformacao que inverte o sinal do numero recebido.
class InverseNumberStream extends Transform {
    // Recebe chunk, transforma e chama callback com novo valor.
    _transform(chunk, encoding, callback) {
        // Converte para numero e multiplica por -1.
        const number = Number(chunk.toString()) *-1;
        // Envia o numero transformado como Buffer para a proxima etapa.
        callback(null, Buffer.from(String(number)));
    }
}

// Stream de escrita que consome o valor final e imprime no console.
class MultiplyByTenStream extends Writable  {
    // Recebe cada chunk final e processa.
    _write(chunk, encoding, callback) {

        // Mostra no console o valor recebido multiplicado por 10.
        console.log(Number(chunk.toString()) * 10)
        // Informa que terminou de processar este chunk.
        callback()
    }
}



// Monta pipeline: gera numeros -> inverte sinal -> multiplica por 10 e imprime.
new OneToHundredStream()
.pipe(new InverseNumberStream())
.pipe(new MultiplyByTenStream())
