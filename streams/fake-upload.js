import {Readable} from 'node:stream';

class OneToHundredStream extends Readable {
    index = 1
    _read(){
        const i = this.index++;
       setTimeout(() => {
           if (i <= 5) {
            const buf = Buffer.from(String(i));
            this.push(buf);
        } else {
            this.push(null);
        }},1000
       )
    }
}

fetch('http://localhost:3334', {
    method: 'POST',
    body: new OneToHundredStream(),
    duplex: 'half'
}).then(response => {
    response.text().then(console.log)
})
