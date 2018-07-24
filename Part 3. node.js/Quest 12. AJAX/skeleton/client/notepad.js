class Notepad {
	/* TODO: 그 외에 또 어떤 클래스와 메소드가 정의되어야 할까요? */
	constructor(){
		this.dom = document.querySelector(".app");
		this.menubar = null;
		this.tabs = null;
		this.content = null;
		this.setApp();
	}
	setApp(){
		this.menubar = new Menubar(this.dom);
		this.tabs = new Tabs(this.dom);
		this.content = new Content(this.dom);

		this.dom.appendChild(this.menubar.dom);
		this.dom.appendChild(this.tabs.dom);
		this.dom.appendChild(this.content.dom);

		this.setEventListeners();
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
			this.dom.dispatchEvent(new Event('close'));
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
		});
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
	}
	exist(){
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
}

class Tabs {
	constructor(parentDom){
		const template = document.querySelector("#tabs");
		this.dom = document.importNode(template.content, true).querySelector(".tabs");
		this.parentDom = parentDom;
		this.tabs = new Map();
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
		this.dom.appendChild(newTab.dom);
		if(newEvent) content.newFile(name);
		else content.openFile(name);
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
	}
	isEmpty(){
		if(this.tabs.size === 0) return true;
		else return false;
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
		fetch('http://localhost:8080/new', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: new Headers({
				'Content-Type': 'application/json'
			})
		}).then((res) => {
			if(res.status === 200 || res.status === 201){
				console.log('success');
			}else{
				console.error(res.statusText);
			}
		})
		.then(() => {
			this.writeArea.value = '';
			this.writeArea.classList.remove('invisible');
		}).catch(err => console.error(err));
	}
	openFile(name){
		const data = 'http://localhost:8080/show?name=' + name;
		
		fetch(data)
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
		fetch('http://localhost:8080/save', {
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
	closeTab(){
		this.writeArea.value = '';
	}
}