class Desktop {
	/* TODO: Desktop 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	constructor(className, folderNum, iconNum){
		this.className = className;
		this.desktop = document.querySelector(className);
		this.folderNum = folderNum;
		this.iconNum = iconNum;
		this.setDesktop();
	}
	/* 
	바탕화면 기본 세팅.
	macOS를 카피한 바탕화면. 
	입력된 폴더의 갯수와 아이콘의 갯수로 생성
	*/
	setDesktop(){
		this.createStatusBar();
		this.contents = this.createContentArea();

		this.addIcon("folder", this.folderNum);
		this.addIcon("icon", this.iconNum);
		
		this.desktop.appendChild(this.contents);
	}

	addIcon(type, num){
		let icon;
		/*
		folder는 더블 클릭시 새로운 창이 생성된다.
		이 때 새로 생성된 window가 드래그 될 영역을 지정해주기 위해서
		parentDiv 객체를 전달한다.
		*/
		for(let i = 1; i <= num; i++){
			if(type === "folder") icon = new Folder(type, "folder " + i, this);
			else icon = new Icon(type, "icon " + i, this);
			this.contents.appendChild(icon.icon);
		}
	}
	// 상태바 생성
	createStatusBar(){
		const topbar = document.createElement("div");
		const gnbStrings = ["icon", "program name", "파일", "편집", 
						"보기", "이동", "윈도우", "도움말"];
		const gnb = this.createList(["gnbList"], gnbStrings);
		const infoStrings = ["wifi", "battery", "language", "date", 
						"search", "alarm"];
		const info = this.createList(["infoList"], infoStrings);

		topbar.classList.add("topbar");
		
		topbar.appendChild(gnb);
		topbar.appendChild(info);
		this.desktop.appendChild(topbar);
	}
	// 리스트 생성
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
	// 바탕화면 생성
	createContentArea(){
		const contents = document.createElement("div");

		contents.classList.add("contents");
		contents.addEventListener("click", (e)=>{
			this.focusRemove(e);
		}, false);
		return contents;
	}
	focusRemove(e){
		e.stopPropagation();
		const icons = document.querySelectorAll(this.className + " .icon");
		const windows = document.querySelectorAll(this.className + " .window-focus");
		for(let temp of icons){
			if(temp.classList.contains("focused"));
				temp.classList.remove("focused");
		}
		
		for(let temp of windows){
			temp.classList.remove("window-focus");
		}
	}
	dragEvent(moveDom, controlDom){
		let drag = false;
		let offsetX = 0;
		let offsetY = 0;

		controlDom.addEventListener("mousedown", (e)=>{
			e.preventDefault();
			drag = true;
			offsetX = e.pageX;
			offsetY = e.pageY;
			if(moveDom.classList.contains("window"))
				moveDom.style.zIndex = Window.getZIndexCount();
		});
		document.addEventListener("mousemove", (e)=>{
			if(!drag) return true;
			let x = e.pageX;
			let y = e.pageY;
			
			let xPos = parseInt(moveDom.style.left) || 0;
			let yPos = parseInt(moveDom.style.top) || 0;

			if(x != offsetX || y != offsetY){
				moveDom.style.left = xPos + (x - offsetX) + "px";
				moveDom.style.top = yPos + (y - offsetY) + "px";
				offsetX = x;
				offsetY = y;		

				if(moveDom.classList.contains("window") &&
					(parseInt(moveDom.style.top) < 0 || y < 50))
					moveDom.style.top = 0;
			}
		});
		document.addEventListener("mouseup", (e)=>{
			e.preventDefault();
			drag = false;
		});
	}
};

class Icon {
	/* TODO: Icon 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	constructor(type, name, parentDiv){
		this.parentDiv = parentDiv;
		this.icon = this.setIcon(type, name);
		this.addEvent();
	}
	/*
	아이콘 기본 세팅.
	이미지와 아이콘 이름을 가지는 dom 요소 생성.
	*/
	setIcon(type, name){
		const icon = document.createElement("div");
		const iconImage = document.createElement("img");
		const iconName = document.createElement("div");

		icon.classList.add("icon");

		iconImage.classList.add("icon-image");
		iconImage.setAttribute("src", type + ".png");
		
		iconName.classList.add("icon-name");
		iconName.innerHTML = name;
		icon.appendChild(iconImage);
		icon.appendChild(iconName);

		return icon;
	}

	addEvent(){
		const eventMap = new Map();
		eventMap.set("mousedown", this.focusEvent);
		eventMap.set("click", this.focusEvent);
		for(let [eventName, eventFunction] of eventMap){
			this.icon.addEventListener(eventName, eventFunction.bind(this));
		}
		this.parentDiv.dragEvent(this.icon, this.icon);
	}
	focusEvent(e){
		this.parentDiv.focusRemove(e);

		this.icon.classList.add("focused");
	}
};

// icon과 folder의 기본 속성은 같으므로 
// folder의 icon은 icon을 이용해서 만든 후
// doubleclick 이벤트만 추가
class Folder {
	/* TODO: Folder 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	constructor(type, name, parentDiv){
		this.name = name;
		this.parentDiv = parentDiv;
		this.window = null;
		this.icon = new Icon(type, name, parentDiv).icon;
		this.addEvent();
	}
	addEvent(){
		this.icon.addEventListener("dblclick", this.dblClickEvent.bind(this));
	}
	
	dblClickEvent(e){
		e.stopPropagation();
		if(this.window === null){
			this.window = new Window(this.name, this.parentDiv);
			this.parentDiv.contents.appendChild(this.window.window);
		}
		this.icon.classList.remove("focused");
		this.window.focusEvent(e);
	}
};

class Window {
	/* TODO: Window 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	constructor(name, parentDiv){
		this.type = "window";
		this.parentDiv = parentDiv;
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
		window.style.top = "120px";
		window.style.left = "120px";
		window.style.zIndex = this.zIndexCount;

		windowNavigation.classList.add("window-navigation");
		windowContents.classList.add("window-contents");

		window.appendChild(this.windowStatus);
		window.appendChild(windowNavigation);
		window.appendChild(windowContents);
		return window;
	}
	// 창 상단부분 생성
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

		eventMap.set("mousedown", this.focusEvent);
		eventMap.set("click", this.focusEvent);

		for(let [eventName, eventFunction] of eventMap){
			this.window.addEventListener(eventName, eventFunction.bind(this));
		}
		this.parentDiv.dragEvent(this.window, this.windowStatus);
	}
	/*
	드래그 함수.
	창의 상단부분을 클릭했을시에만 드래그가 가능해야 한다.
	*/
	focusEvent(e){
		this.parentDiv.focusRemove(e);
		this.window.style.zIndex = Window.getZIndexCount();
		this.windowStatus.classList.add("window-focus");
	}
	
	/*
	종료 버튼을 눌렀을때의 핸들러
	*/
	windowCloseEvent(){
		this.window.remove();
	}
	
	static getCount(){
		return (Window.count++)%10;
	}
	static getZIndexCount(){
		return Window.zIndexCount++;
	}
};

Window.count = 0;
Window.zIndexCount = 0;