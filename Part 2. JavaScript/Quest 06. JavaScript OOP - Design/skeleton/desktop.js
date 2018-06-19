class Desktop {
	/* TODO: Desktop 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	constructor(className){
		this.desktop = document.querySelector(className);
		this.setDesktop();
	}
	/* 
	바탕화면 기본 세팅.
	macOS를 카피한 바탕화면. 
	폴더 2개와 아이콘 2개
	*/
	setDesktop(){
		this.createStatusBar();
		this.contents = this.createContentArea();

		this.addIcon("sample folder1", "folder", this.contents);
		this.addIcon("sample folder2", "folder", this.contents);
		this.addIcon("sample icon", "icon");
		this.desktop.appendChild(this.contents);
	}
	// 상태바 생성
	createStatusBar(){
		const topbar = document.createElement("div");
		const gnbStrings = ["icon", "program name", "파일", "편집", 
						"보기", "이동", "윈도우", "도움말"];
		const gnb = this.createList(["gnbList"], gnbStrings);
		const infoStrings = ["wifi", "battery", "language", 
						"date", "search", "alarm"];
		const info = this.createList(["infoList"], infoStrings);

		topbar.classList.add("topbar");
		
		topbar.appendChild(gnb);
		topbar.appendChild(info);
		this.desktop.appendChild(topbar);
	}
	createContentArea(){
		const contents = document.createElement("div");

		contents.classList.add("contents");
		contents.addEventListener("click", (e)=>{
			
			const icons = document.querySelectorAll(".icon");
			for(let temp of icons){
				if(temp.classList.contains("focused"));
					temp.classList.remove("focused");
			}
		}, false);
		return contents;
	}

	addIcon(name, type, parentDiv){
		let icon;
		/*
		folder는 더블 클릭시 새로운 창이 생성된다.
		이 때 새로 생성된 window가 드래그 될 영역을 지정해주기 위해서
		parentDiv 객체를 전달한다.
		*/
		if(type === "folder") icon = new Folder(name, parentDiv);
		else icon = new Icon(name);
		
		this.contents.appendChild(icon.icon);
	}

	createList(classes, menuStrings){
		const nb = document.createElement("nav");
		const list = document.createElement("ul");

		// list에 class 추가
		for(let name of classes){
			list.classList.add(name);
		}
		// list 요소 추가
		for(let name of menuStrings){
			const listContent = document.createElement("li");
			listContent.innerHTML = name;
			list.appendChild(listContent);
		}
		nb.appendChild(list);
		return nb;
	}
};

class Icon {
	/* TODO: Icon 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	constructor(name){
		this.icon = this.setIcon(name);
		this.addEvent();
	}
	/*
	아이콘 기본 세팅.
	이미지와 아이콘 이름을 가지는 dom 요소 생성.
	*/
	setIcon(name){
		const icon = document.createElement("div");
		const iconImage = document.createElement("img");
		const iconName = document.createElement("div");

		icon.classList.add("icon");

		iconImage.classList.add("icon-image");
		iconImage.setAttribute("src", "icon");
		
		iconName.classList.add("icon-name");
		iconName.innerHTML = name;
		icon.appendChild(iconImage);
		icon.appendChild(iconName);

		return icon;
	}

	/*
	드래그 함수
	*/
	dragFunction(){

	}
	addEvent(){
		const eventMap = new Map();
		eventMap.set("click", this.clickEvent);
		for(let [eventName, eventFunction] of eventMap){
			this.icon.addEventListener(eventName, eventFunction.bind(this));
		}
	}
	clickEvent(e){
		e.stopPropagation();
		const icons = document.querySelectorAll(".icon");
		for(let temp of icons){
			if(temp.classList.contains("focused"));
				temp.classList.remove("focused");
		}
		this.icon.classList.add("focused");
	}
};

class Folder {
	/* TODO: Folder 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	constructor(name, parentDiv){
		this.name = name;
		this.icon = this.setFolder(name);
		this.parentDiv = parentDiv;
		this.addEvent();
	}
	/*
	폴더 기본 세팅.
	이미지와 폴더 이름을 가지는 dom 요소 생성.
	*/
	setFolder(name){
		const icon = document.createElement("div");
		const iconImage = document.createElement("img");
		const iconName = document.createElement("div");

		icon.classList.add("icon");

		iconImage.classList.add("icon-image");
		iconImage.setAttribute("src", "folder");
		
		iconName.classList.add("icon-name");
		iconName.innerHTML = name;
		icon.appendChild(iconImage);
		icon.appendChild(iconName);

		return icon;
	}
	/*
	드래그 함수.
	*/
	dragFunction(){
		
	}
	/*
	더블 클릭 이벤트 핸들러.
	더블 클릭할 시 창이 새로 생긴다.
	*/
	addEvent(){
		const eventMap = new Map();
		eventMap.set("click", this.clickEvent);
		eventMap.set("dblclick", this.dblClickEvent);
		for(let [eventName, eventFunction] of eventMap){
			this.icon.addEventListener(eventName, eventFunction.bind(this));
		}
	}
	clickEvent(e){
		e.stopPropagation();
		const icons = document.querySelectorAll(".icon");
		for(let temp of icons){
			if(temp.classList.contains("focused"));
				temp.classList.remove("focused");
		}
		this.icon.classList.add("focused");
	}
	
	dblClickEvent(e){
		console.log(this);
		const newWindow = new Window(e.currentTarget.name).window;
		this.parentDiv.appendChild(newWindow);
	}
};

class Window {
	/* TODO: Window 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	constructor(name){
		this.window = this.setWindow(name);
	}
	/*
	창 기본 세팅
	macOs의 finder를 카피.
	좌측 상단에 종료, 최대화 아이콘.
	상단에 상태바가 있고 좌측에 네비게이션 중앙에 폴더가 가지고 있는 파일들 나열.
	*/
	setWindow(){
		const window = document.createElement("div");
		const windowStatus = document.createElement("div");
		const windowNavigation = document.createElement("div");
		const windowContents = document.createElement("div");

		window.classList.add("window");
		windowStatus.classList.add("window-status");
		windowNavigation.classList.add("window-navigation");
		windowContents.classList.add("window-contents");

		return window;
	}
	/*
	드래그 함수.
	창의 상단부분을 클릭했을시에만 드래그가 가능해야 한다.
	*/
	dragFunction(){
		
	}
	/*
	창의 크기를 늘리거나 줄이기 위한 이벤트 핸들러.
	*/
	windowManipulate(){

	}
	/*
	종료 버튼을 눌렀을때의 핸들러
	*/
	windowCloseEvent(){
		this.window.remove();
	}
	/*
	창 최대화 버튼을 눌렀을때의 핸들러
	*/
	windowMaximizeEvent(){
		
	}
};
