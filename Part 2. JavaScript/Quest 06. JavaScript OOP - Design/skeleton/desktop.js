class Desktop {
	/* TODO: Desktop 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	constructor(width, height, className){
		this.width = width;
		this.height = height;
		this.desktop = document.querySelector("." + className);
	}
	addFolder(){

	}
	addIcon(){

	}
};

class Icon {
	/* TODO: Icon 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	// 아이콘과 폴더는 고정 크기로 가지고 있는다.
	constructor(name){
		this.name = name;
		this.width = 100;
		this.height = 100;
	}
	// drag 관련 함수
	dragFunction(){

	}
	set name(){
		this.name = name;
	}
};

class Folder {
	/* TODO: Folder 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	// 아이콘과 폴더는 고정 크기로 가지고 있는다.
	constructor(name, parentClassName){
		this.name = name
		this.width = 100;
		this.height = 100;
		this.parentClassName = parentClassName;
	}
	// drag 관련 함수
	dragFunction(){
		
	}
	doubleClickEvent(){

	}
	set name(name){
		this.name = name;
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
};
