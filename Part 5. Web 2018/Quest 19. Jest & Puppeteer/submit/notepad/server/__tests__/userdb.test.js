const iconv = require('iconv-lite');
const encodings = require('iconv-lite/encodings');
iconv.encodings = encodings;
const userDB = require('../graphql/userdb.js');
const userdb = new userDB('jest');

afterAll(() => userdb.disconnect());
test('userdb test', async (done) => {
	expect.assertions(1);
	const result = await userdb.userCheck('knowre', '1234');

	expect(result).toBeTruthy();
	done();
});