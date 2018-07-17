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
		this.menubar = new Menubar().dom;
		this.tabs = new Tabs().dom;
		this.content = new Content().dom;

		this.dom.appendChild(this.menubar);
		this.dom.appendChild(this.tabs);
		this.dom.appendChild(this.content);
	}
};

class Menubar {
	constructor(){
		const template = document.querySelector("#menubar");
        this.dom = document.importNode(template.content, true).querySelector(".menubar");
	}
	newFile(){
		const button = this.dom.querySelector('.new-file');
		button.addEventListener('click',()=>{

		});
	}
	openFile(){
		const button = this.dom.querySelector('.open');
	}
	saveFile(){
		const button = this.dom.querySelector('.save');
	}
	deleteFile(){
		const button = this.dom.querySelector('.delete');
	}
}

class Tabs {
	constructor(){
		const template = document.querySelector("#tabs");
		this.dom = document.importNode(template.content, true).querySelector(".tabs");
		
		//test
		for(let i=0; i<30;i++){
			this.addTab("addTab" + (i + 1));
		}
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
}
class Content {
	constructor(){
		const template = document.querySelector("#content");
        this.dom = document.importNode(template.content, true).querySelector(".content");
	}
}