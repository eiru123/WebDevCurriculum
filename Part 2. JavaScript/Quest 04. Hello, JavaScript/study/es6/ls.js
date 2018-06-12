const fs = require('fs');

fs.readdir(__dirname, function(err, files){
    if(err) return console.error('Unable to read directory contents');
    console.log(`Contents of ${__dirname}:`);
    console.log(files.map(f => '\t' + f).join('\n'));
});

console.log(process.argv);

const debug = process.env.DEBUG ==='1'?
    console.log(100):
(function(){console.log(100)})();

console.log(process.env.DEBUG);

console.log(`Current directory: ${process.cwd()}`);
process.chdir(__dirname);
console.log(`New current directory: ${process.cwd()}`);

const os = require('os');
console.log("Hostname: " + os.hostname());
console.log("OS type: " + os.type());
console.log("OS platform: " + os.platform());
console.log("OS release: " + os.release());
console.log("OS uptime: " + (os.uptime()/60/60/24).toFixed(1) + " days");
console.log("CPU architecture: " + os.arch());
console.log("Number of CPUs: : " + os.cpus().length);
console.log("Total memory: " + (os.totalmem()/1e6).toFixed(1) + " MB");
console.log("Free memory: " + (os.freemem()/1e6).toFixed(1) + " MB");

const exec = require('child_process').exec;

exec('ls', function(err, stdout, stderr){
    if(err)return console.error('Error executing "dir"');
    stdout = stdout.toString();
    console.log(stdout);
    stderr = stderr.toString();
    if(stderr !== ''){
        console.error('error: ');
        console.error(stderr);
    }
});

const ws = fs.createWriteStream('stream.txt', {encoding: 'utf8'});
ws.write('line1 \n');
ws.write('line2 \n');
ws.end();

const rs = fs.createReadStream('stream.txt', {encoding: 'utf8'});
rs.on('data', function(data){
    console.log('>> data: ' + data.replace('\n', '\\n'));
});
rs.on('end', function(data){
    console.log('>> end');
});