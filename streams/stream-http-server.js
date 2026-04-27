import http from 'node:http';
import { Transform} from 'node:stream';
import { buffer } from 'node:stream/consumers';
class InverseNumberStream extends Transform {
    _transform(chunk, encoding, callback) {
        const number = Number(chunk.toString()) *-1;
        console.log(number)
        callback(null, Buffer.from(String(number)));
        
    }
}



const server = http.createServer((request, response) => {

    const buffers = [];

    for await(const chunk of request) {
        buffers.push(chunk);
    }

    const fullStreamContent = Buffer.concat(buffers).toString();

    console.log(fullStreamContent)

    return response.end(fullStreamContent)


   
});

server.listen(3334);