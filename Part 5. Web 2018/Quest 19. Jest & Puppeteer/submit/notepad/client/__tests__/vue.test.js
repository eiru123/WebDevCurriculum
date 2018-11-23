const puppeteer = require('puppeteer');
const hostUrl = 'http://localhost:8080/';

describe('notepad vue test', async() => {
	let browser;
	let page;

	beforeAll(async () => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		page.on('dialog', async dialog => {
			await dialog.message();
			await dialog.accept('newFile');
		});
	});
	afterAll(async () => {
		await browser.close();
	});

	test('login test', async () => {
		await page.goto('http://localhost:8080');
		let url = await page.url();
		expect(url).toBe(`${hostUrl}login`);
		await page.type('input[type="text"]', 'knowre');
		await page.type('input[type="password"]', '1234');
		await page.click('input[type="submit"]');
		await page.waitFor(1000);
		url = await page.url();
		expect(url).toBe(`${hostUrl}`);
	}, 20000);
	
	test('notepad function test', async() => {
		const write = await page.$('.write-space');
		await write.click({ clickCount: 3 }); 
		await page.keyboard.press("Backspace");
		await write.type("hello vue test");
		await page.click('.save');
		await page.waitFor(1000);

		const tab = await page.$$('.tab');
		expect(tab.length).toBe(2);
		
		await tab[1].click();
		await page.waitFor(1000);
		let focusedFileName = await page.$eval('.focus>span', el => el.innerHTML);
		let content = await page.$eval('.write-space', el => el.value);
		expect(focusedFileName).toBe('new');
		expect(content).toBe('');
		
		await tab[0].click();
		await page.waitFor(1000);
		focusedFileName = await page.$eval('.focus>span', el => el.innerHTML);
		content = await page.$eval('.write-space', el => el.value);
		expect(focusedFileName).toBe('hello');
		expect(content).toBe('hello vue test');

		await page.click('.newfile');
		await page.waitFor(1000);
		focusedFileName = await page.$eval('.focus>span', el => el.innerHTML);
		expect(focusedFileName).toBe('newFile');

		await page.click('.delete');
		await page.waitFor(1000);
		let focusedFile = await page.$('.focus');
		expect(focusedFile).toBeNull();

		await tab[0].click();
		await page.waitFor(1000);
		await write.click({ clickCount: 3 }); 
		await page.keyboard.press("Backspace");
		await write.type("this is test");
		await page.click('.save');
		await page.waitFor(1000);

		await tab[0].click();
		await page.waitFor(1000);
		await page.click('.logout');
		await page.waitFor(1000);
		let url = await page.url();
		expect(url).toBe(`${hostUrl}login`);
	}, 30000);
});