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
			console.log(this);
			this.tabs.addTab("untitle-" + this.i + ".txt");
			this.i++;
		});
	}
};

class Menubar {
	constructor(parentDom){
		const template = document.querySelector("#menubar");
		this.dom = document.importNode(template.content, true).querySelector(".menubar");
		this.parentDom = parentDom;
		this.newFile();
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
		button.addEventListener('click', (e) => {
			console.log(e);
		});
	}
	saveFile(){
		const button = this.dom.querySelector('.save');
	}
	deleteFile(){
		const button = this.dom.querySelector('.delete');
	}
}

class Tabs {
	constructor(parentDom){
		const template = document.querySelector("#tabs");
		this.dom = document.importNode(template.content, true).querySelector(".tabs");
		this.parentDom = parentDom;
		//test
	}
	addTab(name){
		const newTab = new Tab(name);
		this.dom.appendChild(newTab.dom);
	}
}
class Tab {
	constructor(name){
		const template = document.querySelector("#tab");
		this.dom = document.importNode(template.content, true).querySelector(".tab");
		this.name = name;
		this.dom.innerHTML = name;
	}
	addClickEvent(){
		this.dom.addEventListener('click', () => {
			
		});
	}
}
class Content {
	constructor(parentDom){
		const template = document.querySelector("#content");
		this.dom = document.importNode(template.content, true).querySelector(".content");
		this.parentDom = parentDom;
	}
	addEventListeners(){
		// const event;
	}
}