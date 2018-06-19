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

		this.addIcon("folder1", "folder", this.contents);
		this.addIcon("folder2", "folder", this.contents);
		this.addIcon("file", "icon");
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
			const windows = document.querySelectorAll(".window-focus");
			for(let temp of windows){
				temp.classList.remove("window-focus");
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
		iconImage.setAttribute("src", "file.png");
		
		iconName.classList.add("icon-name");
		iconName.innerHTML = name;
		icon.appendChild(iconImage);
		icon.appendChild(iconName);

		return icon;
	}

	addEvent(){
		const eventMap = new Map();
		eventMap.set("mousedown", this.clickEvent);
		eventMap.set("click", this.clickEvent);
		for(let [eventName, eventFunction] of eventMap){
			this.icon.addEventListener(eventName, eventFunction.bind(this));
		}
		this.dragEvent();
	}
	/*
	드래그 함수
	*/
	dragEvent(){
		let drag = false;
		let offsetX = 0;
		let offsetY = 0;

		this.icon.addEventListener("mousedown", (e)=>{
			e.preventDefault();
			drag = true;
			offsetX = e.pageX;
			offsetY = e.pageY;
			this.icon.style.zIndex = Window.getZIndexCount();
		});
		document.addEventListener("mousemove", (e)=>{
			if(!drag) return true;
			let x = e.pageX;
			let y = e.pageY;
			
			let xPos = parseInt(this.icon.style.left) || 0;
			let yPos = parseInt(this.icon.style.top) || 0;

			if(x != offsetX || y != offsetY){
				this.icon.style.left = xPos + (x - offsetX) + "px";
				this.icon.style.top = yPos + (y - offsetY) + "px";
				offsetX = x;
				offsetY = y;
				
			}
		});
		document.addEventListener("mouseup", (e)=>{
			e.preventDefault();
			drag = false;
		});
	}
	
	clickEvent(e){
		e.stopPropagation();
		const icons = document.querySelectorAll(".icon");
		for(let temp of icons){
			if(temp.classList.contains("focused"));
				temp.classList.remove("focused");
		}
		const windows = document.querySelectorAll(".window-focus");
		for(let temp of windows){
			temp.classList.remove("window-focus");
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
		iconImage.setAttribute("src", "Folder-icon.png");
		
		iconName.classList.add("icon-name");
		iconName.innerHTML = name;
		icon.appendChild(iconImage);
		icon.appendChild(iconName);

		return icon;
	}
	/*
	드래그 함수.
	*/
	dragEvent(){
		let drag = false;
		let offsetX = 0;
		let offsetY = 0;

		this.icon.addEventListener("mousedown", (e)=>{
			e.preventDefault();
			drag = true;
			offsetX = e.pageX;
			offsetY = e.pageY;
			this.icon.style.zIndex = Window.getZIndexCount();
		});
		document.addEventListener("mousemove", (e)=>{
			if(!drag) return true;
			let x = e.pageX;
			let y = e.pageY;
			
			let xPos = parseInt(this.icon.style.left) || 0;
			let yPos = parseInt(this.icon.style.top) || 0;

			if(x != offsetX || y != offsetY){
				this.icon.style.left = xPos + (x - offsetX) + "px";
				this.icon.style.top = yPos + (y - offsetY) + "px";
				offsetX = x;
				offsetY = y;
				
			}
		});
		document.addEventListener("mouseup", (e)=>{
			e.preventDefault();
			drag = false;
		});
	}
	/*
	더블 클릭 이벤트 핸들러.
	더블 클릭할 시 창이 새로 생긴다.
	*/
	addEvent(){
		const eventMap = new Map();

		eventMap.set("mousedown", this.clickEvent);
		eventMap.set("click", this.clickEvent);
		eventMap.set("dblclick", this.dblClickEvent);

		for(let [eventName, eventFunction] of eventMap){
			this.icon.addEventListener(eventName, eventFunction.bind(this));
		}
		this.dragEvent();
	}
	clickEvent(e){
		e.stopPropagation();
		const icons = document.querySelectorAll(".icon");
		for(let temp of icons){
			if(temp.classList.contains("focused"));
				temp.classList.remove("focused");
		}
		const windows = document.querySelectorAll(".window-focus");
		for(let temp of windows){
			temp.classList.remove("window-focus");
		}
		this.icon.classList.add("focused");
	}
	
	dblClickEvent(e){
		const newWindow = new Window(this.name).window;
		this.parentDiv.appendChild(newWindow);
		this.icon.classList.remove("focused");
	}
};

class Window {
	/* TODO: Window 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	constructor(name){
		this.count = Window.getCount();
		this.zIndexCount = Window.getZIndexCount();
		this.window = this.setWindow(name);
		this.addEvent();
	}
	/*
	창 기본 세팅
	macOS의 finder를 카피.
	좌측 상단에 종료, 최대화 아이콘.
	상단에 상태바가 있고 좌측에 네비게이션 중앙에 폴더가 가지고 있는 파일들 나열.
	*/
	setWindow(name){
		const window = document.createElement("div");
		this.windowStatus = this.createWindowStatus(name);
		const windowNavigation = document.createElement("div");
		const windowContents = document.createElement("div");

		window.classList.add("window");
		window.style.top = 20*this.count + 100 + "px";
		window.style.left = 20*this.count + 100 + "px";
		window.style.zIndex = this.zIndexCount;

		windowNavigation.classList.add("window-navigation");
		windowContents.classList.add("window-contents");

		window.appendChild(this.windowStatus);
		window.appendChild(windowNavigation);
		window.appendChild(windowContents);
		return window;
	}
	createWindowStatus(name){
		const status = document.createElement("div");
		const upper = document.createElement("div");
		const bottom = document.createElement("div");
		const close = document.createElement("button");
		const nameDiv = document.createElement("div");

		status.classList.add("window-status");
		upper.classList.add("upper");
		bottom.classList.add("bottom");
		close.classList.add("close");
		nameDiv.classList.add("name");

		nameDiv.innerHTML = name;

		close.addEventListener("click", this.windowCloseEvent.bind(this));

		upper.appendChild(close);
		upper.appendChild(nameDiv);
		status.appendChild(upper);
		status.appendChild(bottom);
		return status;
	}
	addEvent(){
		const eventMap = new Map();

		eventMap.set("mousedown", this.clickEvent);
		eventMap.set("click", this.clickEvent);

		for(let [eventName, eventFunction] of eventMap){
			this.window.addEventListener(eventName, eventFunction.bind(this));
		}
		this.dragEvent();
	}
	/*
	드래그 함수.
	창의 상단부분을 클릭했을시에만 드래그가 가능해야 한다.
	*/
	dragEvent(){
		let drag = false;
		let border = false;
		let offsetX = 0;
		let offsetY = 0;

		this.windowStatus.addEventListener("mousedown", (e)=>{
			e.preventDefault();
			drag = true;
			offsetX = e.pageX;
			offsetY = e.pageY;
			this.window.style.zIndex = Window.getZIndexCount();
			
			this.windowStatus.classList.add("window-focus");
		});
		document.addEventListener("mousemove", (e)=>{
			if(!drag) return true;
			let x = e.pageX;
			let y = e.pageY;
			let xPos = parseInt(this.window.style.left) || 0;
			let yPos = parseInt(this.window.style.top) || 0;
			
			if(x != offsetX || y != offsetY){
				this.window.style.left = xPos + (x - offsetX) + "px";
				this.window.style.top = yPos + (y - offsetY) + "px";
				offsetX = x;
				offsetY = y;
				
				if(parseInt(this.window.style.top) < 25 || y < 40) {
					this.window.style.top = "25px";
				}
			}
		});
		document.addEventListener("mouseup", (e)=>{
			e.preventDefault();
			drag = false;
		});
	}
	clickEvent(e){
		e.stopPropagation();
		const windows = document.querySelectorAll(".window-focus");
		const icons = document.querySelectorAll(".icon");
		for(let temp of icons){
			if(temp.classList.contains("focused"));
				temp.classList.remove("focused");
		}
		for(let temp of windows){
			temp.classList.remove("window-focus");
		}
		this.windowStatus.classList.add("window-focus");
	}
	
	/*
	종료 버튼을 눌렀을때의 핸들러
	*/
	windowCloseEvent(){
		this.window.remove();
	}
	
	static getCount(){
		if(Window.count > 10) return Window.count = 0;
		return (Window.count++)%10;
	}
	static getZIndexCount(){
		return Window.zIndexCount++;
	}
};

Window.count = 0;
Window.zIndexCount = 0;