const iconv = require('iconv-lite');
const encodings = require('iconv-lite/encodings');
iconv.encodings = encodings;
const userdb = require('../graphql/userdb.js');

test('userdb test', async (done) => {
	console.log(await userdb.userCheck('knowre', '1234'));
	done();
});