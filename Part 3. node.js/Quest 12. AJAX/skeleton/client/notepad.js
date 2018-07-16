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
		this.menubar = new Menubar();
		this.tabs = new Tabs();
		this.content = new Content();

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
}

class Tabs {
	constructor(){
		const template = document.querySelector("#tabs");
        this.dom = document.importNode(template.content, true).querySelector(".tabs");
	}
}
class Tab {
	constructor(){
		const template = document.querySelector("#tab");
		this.dom = document.importNode(template.content, true).querySelector(".tab");
	}
}
class Content {
	constructor(){
		const template = document.querySelector("#content");
        this.dom = document.importNode(template.content, true).querySelector(".content");
	}
}