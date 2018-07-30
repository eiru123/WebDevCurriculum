class Notepad {
	/* TODO: 그 외에 또 어떤 클래스와 메소드가 정의되어야 할까요? */
	constructor(){
		this.dom = document.querySelector(".app");
		this.menubar = null;
		this.tabs = null;
		this.content = null;
		this.login = null;

		this.setApp();
	}
	setApp(){
		this.menubar = new Menubar(this.dom);
		this.tabs = new Tabs(this.dom);
		this.content = new Content(this.dom);
		this.login = new Login(this.dom);

		this.dom.appendChild(this.menubar.dom);
		this.dom.appendChild(this.tabs.dom);
		this.dom.appendChild(this.content.dom);
		this.dom.appendChild(this.login.dom);

		this.setEventListeners();
	}
	adjustEventLiseners(){
		if(this.tabs.getLogin()){
			this.setEventListeners();
		}else{
			this.removeEventListeners();
		}
	}
	setEventListeners(){
		// new File event
		this.dom.addEventListener('new', (e)=>{
			const name = e.fileName;
			this.tabs.addTab(name, this.content, true);
		});
		// open event
		this.dom.addEventListener('open', (e)=>{
			const name = e.fileName;
			if(this.content.writeArea.hasAttribute('readonly')) 
				this.content.removeReadOnly();
			this.tabs.addTab(name, this.content);
		});
		// save event
		this.dom.addEventListener('save', ()=>{
			if(this.tabs.isEmpty()){
				alert('저장할 파일을 선택하세요.');
				return false;
			}
			const name = this.tabs.getFocusedTab();
			this.content.saveFile(name);
		});
		// move tab event
		this.dom.addEventListener('moveTab', (e)=>{
			this.content.openFile(e.fileName);
		});
		// close event
		this.dom.addEventListener('close', (e)=>{
			const name = this.tabs.getFocusedTab();
			this.tabs.closeTab(name, this.content);
		});
		// delete event
		this.dom.addEventListener('delete', ()=>{
			const name = this.tabs.getFocusedTab();
			fetch('http://localhost:8080/delete/' + name, {
				method: 'DELETE'
			})
			.then((res)=>{
				if(res.status === 200 || res.status === 201){
					console.log('success');
				}else{
					console.error(res.statusText);
				}
			});
			this.dom.dispatchEvent(new Event('close'));
		});
		this.dom.addEventListener('login-area', (e)=>{
			if(e.success) this.menubar.loginButtonChange();
			else if(e.success === false) {
				alert('잘못된 아이디 또는 비밀번호입니다.');
				return false;
			}
			this.login.toggleInvisible();
		});
		this.dom.addEventListener('logout', ()=> {
			const tabs = this.tabs.getTabs();
			const focusedTabs = this.tabs.getFocusedTab();
			const cursorPosition = this.content.getCursorPosition();
			const username = this.login.getUserName();

			const data = {
				tabs: tabs,
				focusedTabs: focusedTabs,
				cursorPosition: cursorPosition,
				username: username
			};
			// document.cookie = data;

			fetch('http://localhost:8080/logout', {
				method: 'POST',
				body: JSON.stringify(data),
				headers: new Headers({
					'Content-Type': 'application/json'
				})
			}).then((res)=>{
				if(res.status === 200){
					console.log('success');
					this.menubar.loginButtonChange();
				} 
			}).catch((err) => {
				console.error(err);
			});
		});
		this.dom.addEventListener('setReadOnly', ()=>{
			this.content.setReadOnly();
		});
	}
	removeEventListeners(){

	}
};

class Menubar {
	constructor(parentDom){
		const template = document.querySelector("#menubar");
		this.dom = document.importNode(template.content, true).querySelector(".menubar");
		this.parentDom = parentDom;

		this.existFiles = new Set();
		this.exist();

		this.newFile();
		this.openFile();
		this.saveFile();
		this.deleteFile();
		this.login();
		this.logout();
	}
	exist(){
		console.log('exist');
		fetch('http://localhost:8080/exist')
		.then((res) => {
			if(res.status === 200 || res.status === 201){
				return res.json();
			}
		})
		.then((data) => {
			data.fileNames.forEach(file => {
				this.existFiles.add(file);
			});
		})
		.catch(err => console.error(err));
	}
	newFile(){
		const button = this.dom.querySelector('.new-file');
		button.addEventListener('click', ()=>{
			const event = new Event('new');
			event.fileName = prompt('파일명을 입력하세요.');
			if(!event.fileName) {
				alert('파일명을 입력하세요.');
				return false;
			}else if(this.existFiles.has(event.fileName)){
				alert('같은 이름의 파일이 이미 존재합니다.');
				return false;
			}
			this.parentDom.dispatchEvent(event);
		});
	}
	openFile(){
		const button = this.dom.querySelector('.open');
		button.addEventListener('change', () => {
			const event = new Event('open');
			
			event.fileName = button.files[0]['name'];
			button.value='';
			this.parentDom.dispatchEvent(event);
		});
	}
	saveFile(){
		const button = this.dom.querySelector('.save');
		button.addEventListener('click', ()=>{
			const event = new Event('save');
			
			this.parentDom.dispatchEvent(event);
		});
	}
	deleteFile(){
		const button = this.dom.querySelector('.delete');
		button.addEventListener('click', ()=>{
			const event = new Event('delete');

			this.parentDom.dispatchEvent(event);
		});
	}
	login(){
		const button = this.dom.querySelector('.login');
		button.addEventListener('click', () => {
			const event = new Event('login-area');
			
			this.parentDom.dispatchEvent(event);
		});
	}
	logout(){
		const button = this.dom.querySelector('.logout');
		button.addEventListener('click', () => {
			const event = new Event('logout');
			let success = false;
			if(!confirm('로그아웃 하시겠습니까?')) return false;
			// this.loginButtonChange();
			// fetch('http://localhost:8080/logout').then((res) => {
			// 		return res.json();
			// 	}).then((data)=>{
			// 		if(data.success) success = data.success;
			// 	}).catch(err => console.error(err));
			// if(!success) return false;
			this.parentDom.dispatchEvent(event);
		});
	}
	loginButtonChange(){
		const login = this.dom.querySelector('.loginli');
		const logout = this.dom.querySelector('.logoutli');

		if(login.classList.contains('invisible')){
			logout.classList.add('invisible');
			login.classList.remove('invisible');
		}else{
			login.classList.add('invisible');
			logout.classList.remove('invisible');
		}
	}
}

class Tabs {
	constructor(parentDom){
		const template = document.querySelector("#tabs");
		this.dom = document.importNode(template.content, true).querySelector(".tabs-area");
		this.parentDom = parentDom;
		this.tabs = new Map();
		this.loginBool = false;
		this.setLoginCheck();
	}
	addTab(name, content, newEvent){
		if(this.tabs.has(name)){
			this.tabs.get(name).dom.dispatchEvent(new Event('focus'));
			return;
		}
		const newTab = new Tab(name, this.parentDom);
		this.tabs.forEach((element, key, map)=>{
			element.dom.classList.remove('focus');
		});
		this.tabs.set(name, newTab);
		this.dom.querySelector('.tabs').appendChild(newTab.dom);
		if(newEvent) content.newFile(name);
		else content.openFile(name);
	}
	getTabs(){
		const openedTabs = []
		this.tabs.keys().forEach((value, key, map)=>{
			openedTabs.push(key);
		});
		console.log(openedTabs);
		return this.tabs.keys();
	}
	// 로그인이 되어있는지 아닌지 체크하여 login 관련 창에 아이디나 사용자없음을 표시
	setLoginCheck(id){
		const loginCheck = this.dom.querySelector('.login-check');
		if(this.loginBool){
			loginCheck.innerHTML = id;
		}else{
			loginCheck.innerHTML = '사용자 없음';
		}
	}	
	setLogin(login){
		this.loginBool = login;
	}
	getLogin(){
		return this.loginBool;
	}
	getFocusedTab(){
		let name;
		this.tabs.forEach(tab => {
			if(tab.dom.classList.contains('focus'))
				name = tab.name;
		});

		return name;
	}
	closeTab(name, content){
		content.closeTab();
		this.tabs.get(name).dom.remove();
		this.tabs.delete(name);
		if(this.tabs.size === 0){
			this.parentDom.dispatchEvent(new Event('setReadOnly'));
		}
	}
	isEmpty(){
		if(this.tabs.size === 0) return true;
		else return false;
	}
	// 로그아웃시 모든 탭 삭제
	tabsClear(){
		this.tabs.map((value, key, map) => {
			value.dom.remove();
		});
		this.tabs.clear();
		this.parentDom.dispatchEvent(new Event('setReadOnly'));
	}
}
class Tab {
	constructor(name, parentDom){
		const template = document.querySelector("#tab");
		this.dom = document.importNode(template.content, true).querySelector(".tab");
		this.name = name;
		this.parentDom = parentDom;
		this.dom.querySelector('.tab-name').innerHTML = this.name;
		
		this.focusEvent('click');
		this.focusEvent('focus');
		this.addCloseEvent();
		this.dom.dispatchEvent(new Event('focus'));
	}
	focusEvent(eventName){
		this.dom.addEventListener(eventName, (e) => {
			e.stopImmediatePropagation();
			
			const tabs = document.querySelectorAll('.tab');
			tabs.forEach((element)=>{
				element.classList.remove('focus');
				element.querySelector('.close').classList.add('invisible');
			});
			this.dom.classList.add('focus');
			this.dom.querySelector('.close').classList.remove('invisible');

			const event = new Event('moveTab');

			event.fileName = this.name;
			this.parentDom.dispatchEvent(event);
		});
	}
	addCloseEvent(){
		this.dom.querySelector('.close').addEventListener('click', (e)=>{
			e.stopImmediatePropagation();
			
			const event = new Event('close');
			this.parentDom.dispatchEvent(event);
		});
	}
}
class Content {
	constructor(parentDom){
		const template = document.querySelector("#content");
		this.dom = document.importNode(template.content, true).querySelector(".content");
		this.parentDom = parentDom;
		this.writeArea = this.dom.querySelector('.write-space');
	}
	newFile(name){
		const data = {name: name};
		fetch('http://localhost:8080/file', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: new Headers({
				'Content-Type': 'application/json'
			})
		}).then((res) => {
			if(res.status === 200 || res.status === 201){
				this.writeArea.value = '';
				this.writeArea.classList.remove('invisible');
			}else{
				console.error(res.statusText);
			}
		})
		.catch(err => console.error(err));
	}
	openFile(name){
		const data = 'http://localhost:8080/file?name=' + name;
		
		fetch(data, {
			headers: new Headers({Accept: 'text/plain'})
		})
		.then((res) => {
			if(res.status === 200 || res.status === 201){
				return res.json();
			}else{
				console.error(res.statusText);
			}
		})
		.then((data) => {
			this.writeArea.value = data.data || '';
			this.writeArea.classList.remove('invisible');
		})
		.catch(err => console.error(err));
	}
	saveFile(name){
		const htmlData = this.writeArea.value || '';
		const saveData = {
			name: name,
			data: htmlData
		};
		fetch('http://localhost:8080/file', {
			method: 'PUT',
			body: JSON.stringify(saveData),
			headers: new Headers({
				'Content-Type': 'application/json'
			})
		}).then((res) => {
			if(res.status === 200 || res.status === 201){
				res.text().then(text => {
					console.log(text);
				});
			}else{
				console.error(res.statusText);
			}
		}).catch(err => console.error(err));
	}
	setReadOnly(){
		this.writeArea.setAttribute('readonly', 'true');
	}
	removeReadOnly(){
		this.writeArea.removeAttribute('readonly');
	}
	getCursorPosition(){
		return this.writeArea.selectionStart;
	}
	closeTab(){
		this.writeArea.value = '';
	}
}
class Login{
	constructor(parentDom){
		const template = document.querySelector("#login");
		this.dom = document.importNode(template.content, true).querySelector(".login-form");
		this.parentDom = parentDom;
		this.username = null;
		this.buttonListener();
	}
	buttonListener(){
		const button = this.dom.querySelector('.submit');
		button.addEventListener('click', ()=>{
				const username = this.dom.querySelector('[name="name"]').value;
				const password = this.dom.querySelector('[name="password"]').value;

				if(!username || !password) {
					alert('아이디 또는 비밀번호를 입력하세요.');
					return false;
				}
				const loginData = {
					username: username,
					password: password
				};
				fetch('http://localhost:8080/login', {
					method: 'POST',
					body: JSON.stringify(loginData),
					headers: new Headers({
						'Content-Type': 'application/json'
					})
				}).then((res) => {
					if(res.status === 200 || res.status === 201){
						console.log('success');
						return res.json();
					}
				}).then((data) => {
					console.log(data);
					const event = new Event('login-area');
					event.success = data.success;
					this.parentDom.dispatchEvent(event);
					if(data.success){
						this.username = username;
					}
					
				}).catch(err => console.error(err));
		});
	}
	getUserName(){
		return this.username;
	}
	toggleInvisible(){
		if(this.dom.classList.contains('invisible')) this.dom.classList.remove('invisible');
		else this.dom.classList.add('invisible');
	}
}