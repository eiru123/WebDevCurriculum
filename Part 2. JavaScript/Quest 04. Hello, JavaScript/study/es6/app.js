const amanda_calculate = require('./amanda.js');
const tyler = require('./tyler.js');

console.log(amanda_calculate(1, 2, 5));
console.log(tyler(2));

const debug1 = require('./debug')('one');
const debug2 = require('./debug')('two');

debug1('started first debugger!');
debug2('started second debugger!');

setTimeout(function(){
    debug1('after some time...');
    debug2('what happens?');
}, 2000);