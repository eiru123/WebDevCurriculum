const r2 = require('r2');
const addr = 'http://localhost:3000/graphql';

let loginData;
let commonHeaders = {
	'Content-Type': 'application/json; charset=utf-8',
	'referer': 'login'
};
describe('graphql query & mutation test', () => {
	let query = '';
	function makeRequest (query) {
		return {
			headers: {
				...commonHeaders,
			},
			body: JSON.stringify({
				query: query
			})
		};
	}
	beforeAll(async () => {
		query = `
		mutation {
			login(userId: "knowre", password: "1234"){
				accessToken
				redirectPath
			}
		}`;
		let res = await r2.post(`${addr}`, makeRequest(query)).json;
		loginData = res.data.login;
		commonHeaders['Authorization'] = loginData.accessToken;
		commonHeaders['referer'] = '';
	});
	test('login test', () => {
		expect(loginData.redirectPath).toEqual('/');
		expect(loginData.accessToken).toBeTruthy();
	});
	test('getUser test', async () => {
		query = `
		query {
			getUser {
				userId
				focusedTab
				cursorPos
				existFiles
				openTabs
			}
		}
		`;
		let res = await r2.post(`${addr}`, makeRequest(query)).json;
		
		expect(res.data.getUser).toEqual({
			userId: 'knowre',
			focusedTab: 'hello',
			cursorPos: 0,
			openTabs: ['hello', 'new'],
			existFiles: ['hello', 'new', 'test']
		});
	});
	test('getFile test', async () => {
		query = `
		query{
			getFile(filename: "hello") {
				content
			}
		}
		`;
		let res = await r2.post(`${addr}`, makeRequest(query)).json;

		expect(res.data.getFile).toEqual({
			content: 'this is test'
		});
	});
	test('newFile test', async () => {
		query = `
		mutation{
			newFile(filename: "newFile")
		}
		`;
		let res = await r2.post(`${addr}`, makeRequest(query)).json;
		expect(res.data.newFile).toBeTruthy();
	});
	test('updateFile test', async () => {
		query = `
		mutation{
			updateFile(filename: "newFile", content: "this is test2")
		}
		`;
		let res = await r2.post(`${addr}`, makeRequest(query)).json;
		expect(res.data.updateFile).toBeTruthy();
	});
	test('deleteFile test', async () => {
		query = `
		mutation{
			deleteFile(filename: "newFile")
		}
		`;
		let res = await r2.post(`${addr}`, makeRequest(query)).json;
		expect(res.data.deleteFile).toBeTruthy();
	});
	test('logout test', async () => {
		query = `
		mutation{
			logout(logoutInfo: {
				openTabs: ["hello", "new"],
				focusedTab: "hello"
			})
		}
		`;
		let res = await r2.post(`${addr}`, makeRequest(query)).json;
		console.log(res);
		expect(res.data.logout).toBeTruthy();
	});
});