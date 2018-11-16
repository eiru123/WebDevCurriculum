const r2 = require('r2');
const addr = 'http://localhost:3000/graphql';

let loginData;
let commonHeaders = {
	'Content-Type': 'application/json; charset=utf-8',
	'referer': 'login'
};
describe('graphql query & mutation test', () => {
	let query;
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
		
		// expect(res.data.getUser).toEqual({
		// 	userId: 'knowre',
		// 	focusedTab:
		// });
	});
});