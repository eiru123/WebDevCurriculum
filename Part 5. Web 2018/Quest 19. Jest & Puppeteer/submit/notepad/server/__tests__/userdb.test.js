const iconv = require('iconv-lite');
const encodings = require('iconv-lite/encodings');
iconv.encodings = encodings;
const userDB = require('../graphql/userdb.js');
const userdb = new userDB('jest');

afterAll(() => userdb.disconnect());
test('userdb test', async (done) => {
	expect.assertions(3);
	const id = 'knowre';
	let result = await userdb.userCheck(id, '1234');

	expect(result).toBeTruthy();
	result = await userdb.getUsers(id);
	expect(result[0].dataValues).toEqual({
		userId: id,
		focusedTab: null,
		cursorPos: null
	});
	result = await userdb.getFiles(id);
	expect(result[0].dataValues).toEqual({
		userId: id,
		filename: 'hello.txt',
		content: 'this is test file',
		open: 1
	});
	done();
});