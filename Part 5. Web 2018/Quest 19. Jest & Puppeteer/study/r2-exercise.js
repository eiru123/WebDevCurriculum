const
	r2 = require('r2'),
	PORT = 8002,
	addr = `http://${process.env.KNOWRE_VPN_IP}:${PORT}`,
	commonHeaders = {
		'Content-Type': 'application/json; charset=utf-8',
		'Authorization': `Basic ${process.env.API_KEY_INTERNAL}`
	};

test('test curriculum sub query', async () => {
	let resp = await r2.post(`${addr}/graphql`, {
		headers: commonHeaders,
		body: JSON.stringify({
			query: `
			query {
				DigitalCms {
					Curriculum(id: 3) {
						chapters {
							id
						}
						curriculumTest {
							id
							stapleType
						}
					}
				}
			}
			`
		})
	}).json;

	expect(resp.data).toEqual({
		DigitalCms: {
			Curriculum: {
				chapters: [{
					id: '3'
				},
				{
					id: '4'
				},
				{
					id: '5'
				},
				{
					id: '6'
				},
				{
					id: '7'
				}
				],
				curriculumTest: [{
					id: '17',
					stapleType: 'CURRICULUMTEST1'
				},
				{
					id: '18',
					stapleType: 'CURRICULUMTEST2'
				},
				{
					id: '19',
					stapleType: 'CURRICULUMTEST3'
				}
				]
			}
		}

	});
}, 600000);
