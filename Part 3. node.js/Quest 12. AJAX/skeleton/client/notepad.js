class Notepad {
	/* TODO: 그 외에 또 어떤 클래스와 메소드가 정의되어야 할까요? */
	constructor(){
		this.dom = document.querySelector(".app");
		this.menubar = null;
		this.tabs = null;
		this.content = null;
		this.i = 1;
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
		this.dom.addEventListener('new', ()=>{
			const name = "untitle-" + this.i + ".txt";
			this.tabs.addTab(name);

			this.content.newFile(name);
			this.i++;
		});
		this.dom.addEventListener('open', (e)=>{
			const name = e.fileName;

			this.tabs.addTab(name);
			this.content.openFile(name);
		});
		this.dom.addEventListener('save', ()=>{
			const name = this.tabs.getFocusTab();
			console.log(name);
			this.content.saveFile(name);
		});
		this.dom.addEventListener('moveTab', (e)=>{
			this.content.openFile(e.fileName);
		});
	}
};

class Menubar {
	constructor(parentDom){
		const template = document.querySelector("#menubar");
		this.dom = document.importNode(template.content, true).querySelector(".menubar");
		this.parentDom = parentDom;
		this.newFile();
		this.openFile();
		this.saveFile();
	}
	newFile(){
		const button = this.dom.querySelector('.new-file');
		button.addEventListener('click', ()=>{
			const event = new Event('new');

			this.parentDom.dispatchEvent(event);
		});
	}
	openFile(){
		const button = this.dom.querySelector('.open');
		button.addEventListener('change', () => {
			const event = new Event('open');

			event.fileName = button.files[0]['name'];
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
		this.tabs = [];
		//test
	}
	addTab(name){
		const newTab = new Tab(name, this.parentDom);
		this.tabs.forEach((element)=>{
			console.log(element)
			element.dom.classList.remove('focus');
		});
		this.tabs.push(newTab);
		this.dom.appendChild(newTab.dom);
	}
	getFocusTab(){
		let name;
		this.tabs.forEach(tab => {
			console.log(tab);
			if(tab.dom.classList.contains('focus'))
				name = tab.name;
		});
		return name;
	}
}
class Tab {
	constructor(name, parentDom){
		const template = document.querySelector("#tab");
		this.dom = document.importNode(template.content, true).querySelector(".tab");
		this.name = name;
		this.parentDom = parentDom;
		this.dom.querySelector('.tab-name').innerHTML = this.name;
		this.addClickEvent();
	}
	addClickEvent(){
		this.dom.addEventListener('click', () => {
			const tabs = document.querySelectorAll('.tab');
			tabs.forEach((element)=>{
				console.log(element);
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
}
class Content {
	constructor(parentDom){
		const template = document.querySelector("#content");
		this.dom = document.importNode(template.content, true).querySelector(".content");
		this.parentDom = parentDom;
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
				res.text().then(text => {
					console.log(text);
					console.log(JSON.parse(text));
				});
			}else{
				console.error(res.statusText);
			}
		})
		.then(() => {
			const writeArea = this.dom.querySelector('.write-space');
			writeArea.innerHTML = '';
			writeArea.classList.remove('invisible');
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
			const writeArea = this.dom.querySelector('.write-space');
			writeArea.innerHTML = data.data || '';
			writeArea.classList.remove('invisible');
		})
		.catch(err => console.error(err));
	}
	saveFile(name){
		const htmlData = this.dom.querySelector('.write-space').innerHTML || '';
		const saveData = {
			name: name,
			data: htmlData
		};
		fetch('http://localhost:8080/save', {
			method: 'POST',
			body: JSON.stringify(saveData),
			headers: new Headers({
				'Content-Type': 'application/json'
			})
		}).then((res) => {
			if(res.status === 200 || res.status === 201){
				res.text().then(text => {
					console.log(text);
					console.log(JSON.parse(text));
				});
			}else{
				console.error(res.statusText);
			}
		}).catch(err => console.error(err));
	}
}