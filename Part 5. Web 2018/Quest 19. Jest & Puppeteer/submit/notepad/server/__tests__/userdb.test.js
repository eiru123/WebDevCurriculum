const iconv = require('iconv-lite');
const encodings = require('iconv-lite/encodings');
iconv.encodings = encodings;
const userDB = require('../graphql/userdb.js');
const userdb = new userDB('jest');

afterAll(() => userdb.disconnect());
describe('userdb unit test', () => {
	const id = 'knowre';
	let result;
	// afterAll(() => userdb.disconnect());
	test('userCheck test', async() => {
		result = await userdb.userCheck(id, '1234');

		expect(result).toBeTruthy();
	});
	test('getUser test', async() => {
		result = await userdb.getUsers(id);
		expect(result[0].dataValues).toEqual({
			userId: id,
			focusedTab: 'hello.txt',
			cursorPos: null
		});
	});
	test('getFiles test', async() => {
		result = await userdb.getFiles(id);
		expect(result[0].dataValues).toEqual({
			userId: id,
			filename: 'hello.txt',
			content: 'this is test file',
			open: 1
		});
	});
	test('getContent test', async() => {
		result = await userdb.getContent(id, 'hello.txt');
		expect(result).toEqual({content: 'this is test file'});
	});
	test('createFiles test', async() => {
		result = await userdb.createFiles(id, 'new');
		expect(result.dataValues).toEqual({
			userId: id,
			filename: 'new',
			open: 0
		});
	});
	test('updateFile test', async() => {
		result = await userdb.updateFile(id, 'hello.txt', 'change content');
		expect(result).toEqual([1]);
		result = await userdb.updateFile(id, 'hello.txt', 'this is test file');
		expect(result).toEqual([1]);
	});
	test('deleteFile test', async() => {
		result = await userdb.deleteFile(id, 'new');
		expect(result).toBe(1);
	});
	test('logoutUpdate test', async() => {
		result = await userdb.logoutUpdate(id, {openTabs: ['hello.txt'], focusedTab: 'hello.txt'});
		expect(result).toBeTruthy();
	});
});
test('userdb test', async () => {
	expect.assertions(9);
	const id = 'knowre';
	let result = await userdb.userCheck(id, '1234');

	expect(result).toBeTruthy();
	result = await userdb.getUsers(id);
	expect(result[0].dataValues).toEqual({
		userId: id,
		focusedTab: 'hello.txt',
		cursorPos: null
	});
	result = await userdb.getFiles(id);
	expect(result[0].dataValues).toEqual({
		userId: id,
		filename: 'hello.txt',
		content: 'this is test file',
		open: 1
	});
	result = await userdb.getContent(id, 'hello.txt');
	expect(result).toEqual({content: 'this is test file'});

	result = await userdb.createFiles(id, 'new');
	expect(result.dataValues).toEqual({
		userId: id,
		filename: 'new',
		open: 0
	});
	result = await userdb.updateFile(id, 'hello.txt', 'change content');
	expect(result).toEqual([1]);
	result = await userdb.updateFile(id, 'hello.txt', 'this is test file');
	expect(result).toEqual([1]);
	result = await userdb.deleteFile(id, 'new');
	expect(result).toBe(1);
	result = await userdb.logoutUpdate(id, {openTabs: ['hello.txt'], focusedTab: 'hello.txt'});
	expect(result).toBeTruthy();
	// done();
});