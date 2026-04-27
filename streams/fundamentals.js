import {Readable, Writable, Transform } from 'node:stream';
import { buffer } from 'node:stream/consumers';

class OneToHundredStream extends Readable {
    index = 1
    _read(){
        const i = this.index++;
       setTimeout(() => {
           if (i <= 100) {
            const buf = Buffer.from(String(i));
            this.push(buf);
        } else {
            this.push(null);
        }},1000
       )
    }
}

class InverseNumberStream extends Transform {
    _transform(chunk, encoding, callback) {
        const number = Number(chunk.toString()) *-1;
        callback(null, Buffer.from(String(number)));
    }
}

class MultiplyByTenStream extends Writable  {
    _write(chunk, encoding, callback) {

        console.log(Number(chunk.toString()) * 10)
        callback()
    }
}



new OneToHundredStream()
.pipe(new InverseNumberStream())
.pipe(new MultiplyByTenStream())