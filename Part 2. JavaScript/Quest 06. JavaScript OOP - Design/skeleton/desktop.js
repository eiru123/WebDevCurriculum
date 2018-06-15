class Desktop {
	/* TODO: Desktop 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	constructor(containerClass){
		this.desktop = document.querySelector(containerClass);
		
		this.addFolder();
		this.addFolder();
		this.addIcon();
	}
	addFolder(){

	}
	addIcon(){

	}
};

class Icon {
	/* TODO: Icon 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	constructor(name, containerClass){
		this.name = name;
		this.containerClass = containerClass;
		this.icon = makeIcon("icon", name);
		this.dragFunction();
	}
	// drag 관련 함수
	dragFunction(){

	}
};

class Folder {
	/* TODO: Folder 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	constructor(name, containerClass){
		this.name = name;
		this.containerClass = containerClass;
		this.folder = makeIcon("folder", name);
		this.doubleClickEvent();
		this.dragFunction();
	}
	// drag 관련 함수
	dragFunction(){
		
	}
	doubleClickEvent(){

	}
	addWindow(){
	}
};

class Window {
	/* TODO: Window 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	constructor(name){
		this.name = name
	}
	// drag 관련 함수
	dragFunction(){
		
	}
	closeWindow(){

	}
	createWindow(){

	}
	static getCount(){
	}
};
