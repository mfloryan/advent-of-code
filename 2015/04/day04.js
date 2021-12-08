var crypto = require('crypto');

let found = false
let i = 0
do {
    var name = 'bgvyzdsv' + i;
    var hash = crypto.createHash('md5').update(name).digest('hex');
    if (hash.startsWith('000000')) {
        console.log(i)
        found = true
    }
    i++

} while (!found)