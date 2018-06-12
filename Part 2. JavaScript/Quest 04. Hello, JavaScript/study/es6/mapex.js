

function a(){
    console.log(`a: calling b`);
    b();
    console.log(`a: done`);
}
function b(){
    console.log(`b: calling c`);
    c();
    console.log(`b: done`);
}
function c(){
    console.log(`c: throwing error`);
    throw new Error(`c error`);
    console.log(`c: done`);
}

function d(){
    console.log(`d: calling c`);
    c();
    console.log(`d: done`);
}

try{
    a();
}catch(err){
    console.log(err.stack);
}
try{
    d();
}catch(err){
    console.log(err.stack);
}


class FibonacciSequence{
    [Symbol.iterator](){
        let a = 0, b = 1;
        return{
            next(){
                let rval = {value: b, done: false};
                b += a;
                a = rval.value;
                return rval;
            }
        };
    }
}

const fib = new FibonacciSequence();
let i = 0;
for(let n of fib){
    console.log(n);
    if(++i > 9) break;
}
function* rainbow(){
    yield 'red';
    yield 'orange';
    yield 'yellow';
    yield 'green';
    yield 'blue';
    yield 'navy';
    yield 'violet';
}
const it = rainbow();
it.next();
it.next();
it.next();
it.next();
it.next();
it.next();
it.next();
it.next();

const it2 = rainbow();
for(let ie of it2){
    console.log(ie);
}
function* interrogate(){
    let name = yield `What is your name?`;
    let color = yield `What is your favorite color?`;
    return `${name}'s favorite color is ${color}.`;
}

const EventEmitter = require('events').EventEmitter;

class Countdown extends EventEmitter{
    constructor(seconds, superstitious){
        super();
        this.seconds = seconds;
        this.superstitious = !superstitious;
    }
    go(){
        const countdown = this;
        const timeoutIds = [];
        return new Promise(function(resolve, reject){
            for(let i = countdown.seconds; i >= 0; i--){
                timeoutIds.push(setTimeout(function(){
                    if(countdown.superstitious && i===13){
                        timeoutIds.forEach(clearTimeout);
                        return reject(new Error("Oh my god!!"));
                    }
                    countdown.emit('tick', i);
                    if(i===0)resolve();
                }, (countdown.seconds - i) * 1000));
            }
        });
    }
}

const cd = new Countdown(11);

cd.on('tick', function(i){
    if(i>0) console.log(i + '...');
});

function launch(){
    return new Promise(function(resolve, reject){
        if(Math.random() < 0.5) {
            reject("reject!!");
            return;
        }
        console.log("Lift off");
        setTimeout(function(){
            resolve("In orbit!!");
        }, 2*1000);
    });
}
function addTimeout(fn, timeout){
    if(timeout === undefined) timeout = 1000;
    return function(...args){
        return new Promise(function(resolve, reject){
            const tid = setTimeout(reject, timeout, new Error("Promise timed out"));
            fn(...args)
            .then(function(...args){
                clearTimeout(tid);
                resolve(...args);
            })
            .catch(function(...args){
                clearTimeout(tid);
                reject(...args);
            });
        });
    }
}

function nfcall(f, ...args){
    return new Promise(function(resolve, reject){
        f.call(null, ...args, function(err, ...args){
            if(err) return reject(err);
            resolve(args.length < 2 ? args[0]: args);
        });
    });
}

function ptimeout(delay){
    return new Promise(function(resolve, reject){
        setTimeout(resolve, delay);
    });
}
function grun(g){
    const it = g();
    (function iterate(val){
        const x = it.next(val);
        if(!x.done){
            if(x.value instanceof Promise){
                x.value.then(iterate).catch(err => it.throw(err));
            }else{
                setTimeout(iterate, 0, x.value);
            }
        }
    })();
}
// function* theFutureIsNow(){
//     const dataA = yield nfcall(fs.readFile, 'a.txt');
//     const dataB = yield nfcall(fs.readFile, 'b.txt');
//     const dataC = yield nfcall(fs.readFile, 'c.txt');
//     yield ptimeout(60*1000);
//     yield nfcall(fs.writeFile, 'd.txt', dataA + dataB + dataC);
// }
// grun(theFutureIsNow);
cd.go()
    .then(addTimeout(launch, 11*1000))
    .then(function(msg){
        console.log(msg);
    })
    .catch(function(...err){
        for(let e of err){
            if(e instanceof Error)
                console.log(err.message);
            else
                console.log(e);
        }
    });

const moment = require('moment-timezone');

// const d = new Date(Date.UTC(1930, 4, 10));

// d.toLocaleDateString();
// d.toLocaleFormat();
// d.toLocaleTimeString();
// d.toTimeString();
// d.toUTCString();

// moment(d).format("YYYY-MM-DD");
// moment(d).format("YYYY-MM-DD HH:mm");
// moment(d).format("YYYY-MM-DD HH:mm Z");
// moment(d).format("YYYY-MM-DD HH:mm [UTC]Z");
// moment(d).format("YYYY년 M월 D일 HH:mm");

// moment(d).format("dddd, MMMM [the] Do. YYYY");

// moment(d).format("h:mm a");

// const beer99 = "99 bottles of beer on the wall " +
//     "take 1 down and pass it around -- " +
//     "98 bottles of beer on the wall.";
// const matches = beer99.match(/[\-0-9a-z.]/ig);
// const matches = beer99.match(/[.0-9a-\-]/ig);

function sanitizeATag(aTag){
    const parts = aTag.match(/<a (.*)?>(.*?)<\/a>/i);
    console.log(parts);
    const attributes = parts[1].split(/\s+/);
    console.log(attributes);

    return '<a ' + attributes.filter(attr => /^(?:class|id|href)[\s=]/i.test(attr))
    .join(' ')
    + '>'
    + parts[2]
    + '</a>';
}

const html = `<a class="foo" href="/foo" id="foo">Foo</a>\n` +
`<A href='/bar' Class="bar">Bar</a>\n` +
`<a href="/baz">Baz</a>\n` +
`<a onclick="javascript:alert('qux!')" href="/qux">Qux</a>`;

console.log(html.replace(/<a .*?>(.*?)<\/a>/ig, function(m, g1, offset){
    console.log(`<a> tag found at ${offset}. contents: ${g1}`);
}));
console.log(html.replace(/<a .*?<\/a>/ig, sanitizeATag));
const temp = sanitizeATag(html);
console.log(temp);

let input = [
    "john@doe.com",
    "john@doe.com is my email",
    "my email is john@doe.com",
    "use john@doe.com, my email",
    "my email:john@doe.com"
];

let emailMatcher =
    /\b[a-z][a-z0-9._-]*@[a-z][a-z0-9_-]+(?:\.[a-z]+)?\b/ig;
console.log(input.map(s => s.replace(emailMatcher, '<a href="mailto:$&">$&</a>')));

let users = ["mary", "nick", "arthur", "sam", "yvette"];
let text = "User @arthur started the backup and 15:15, " +
"and @nick and @yvette restored it at 18:35.";
let userRegex = new RegExp(`@(?:${users.join('|')})]\\b`, 'g');
console.log(userRegex);
text.match(userRegex);

