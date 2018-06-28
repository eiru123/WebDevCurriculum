
class App{
    constructor(){
        this.dom = document.querySelector(".app");
        this.setApp();
    }
    setApp(){
        this.add = new Add();
        this.planArea = new PlanArea();
        this.resultArea = new ResultArea();

        this.dom.appendChild(this.add.getDom());
        this.dom.appendChild(this.planArea.getDom());
        this.dom.appendChild(this.resultArea.getDom());
        
        this.addEvent();
        this.removeEvent();
        this.allRemoveEvent();
        this.allStopEvent();
        this.totalTimeEvent();
    }
    addEvent(){
        document.addEventListener("add", (e)=>{
            this.planArea.addPlan(e.name, e.tag);
            this.resultArea.addResult(e.name, e.tag);
        });
    }
    allRemoveEvent(){
        document.addEventListener("allRemove", (e)=>{
            if(e.run){
                alert("아직 작동중인 타이머가 있습니다.");
                return false;
            }
            this.planArea.allRemoveEvent();
            this.resultArea.allRemoveEvent();
        });
    }
    removeEvent(){
        document.addEventListener("remove", (e)=>{
            this.planArea.removePlan(e.name);
            this.resultArea.removeResult(e);
        });
    }
    allStopEvent(){
        document.addEventListener("allStop", (e)=>{
            this.planArea.allStopPlan(e);
        });
    }
    totalTimeEvent(){
        document.addEventListener("totalTime", (e)=>{
            this.resultArea.totalTime(e);
        });
    }
}

class Add{
    constructor(){
        this.makeDom();
    }
    makeDom(){
        const template = document.querySelector("#add");
        this.dom = document.importNode(template.content, true).querySelector(".add-area");
        this.addEvent();
    }
    getDom(){
        return this.dom;
    }
    addEvent(){
        const button = this.dom.querySelector(".button");
        const inputName = this.dom.querySelector(".name");
        const inputTag = this.dom.querySelector(".tag");
        
        button.addEventListener("click", ()=>{
            const event = new Event("add");
            if(inputName.value.length === 0) {
                alert("input todolist name & tag")
                return false;
            }
            event.name = inputName.value;
            event.tag = inputTag.value;
            document.dispatchEvent(event);
        });
    }
}

class PlanArea{
    constructor(){
        this.planList = new Map();
        this.makeDom();
    }
    makeDom(){
        const template = document.querySelector("#plans-area");
        this.dom = document.importNode(template.content, true).querySelector(".plans-area");

        this.allRemoveButtonEvent();
    }
    getDom(){
        return this.dom;
    }
    allRemoveButtonEvent(){
        const button = this.dom.querySelector(".all-remove");
        
        button.addEventListener("click", ()=>{
            const event = new Event("allRemove");
            event.run = false;
            for(let key of this.planList.keys()){
                if(this.planList.get(key).clockStart){
                    event.run = true;
                }
            }
            document.dispatchEvent(event);
        });
    }
    allRemoveEvent(){
        this.planList.forEach((value, key, map)=>{
            this.removePlan(key);
        });
    }

    addPlan(name, tag){
        if(this.planList.has(name)) {
            alert("동일한 이름의 계획이 있습니다.");
            return false;
        }
        const plan = new Plan(name, tag);
        const plansArea = document.querySelector(".contents-area");
        plansArea.appendChild(plan.getDom());
        
        this.planList.set(name, plan);
    }
    removePlan(name){
        const deletePlan = this.planList.get(name);
        deletePlan.dom.remove();
        this.planList.delete(name);
    }
    allStopPlan(e){
        this.planList.forEach((value, key, map)=>{
            const event = new Event('click');
            const button = value.dom.querySelector(".start");
            
            event.allStop = true;
            if(value.clockStart && value !== e.obj) button.dispatchEvent(event);
        });
    }
}

class Plan{
    constructor(name, tag){
        this.name = name;
        this.tag = tag;
        this.clockStart = false;
        this.makeDom();
    }
    makeDom(){
        const template = document.querySelector("#plan");

        this.dom = document.importNode(template.content, true).querySelector(".plan-area");
        this.dom.querySelector(".name").innerHTML = this.name;
        this.dom.querySelector(".tag").innerHTML = Tag.getTag(this.tag);
        this.dom.classList.add(this.tag);
        this.clock = new Clock(this.dom.querySelector(".clock-area"));
        this.startButtonEvent();
        this.resetButtonEvent();
        this.removeButtonEvent();
    }
    getDom(){
        return this.dom;
    }
    startButtonEvent(){
        const button = this.dom.querySelector(".start");
        button.addEventListener("click", (e)=>{
            let event = new Event("allStop");
            event.obj = this;
            document.dispatchEvent(event);

            event = new Event("totalTime");
            event.name = this.name;
            event.tag = this.tag;
            if(this.clockStart !== true){
                this.clockStart = true;
                this.intervalId = setInterval(this.clock.runWatch.bind(this.clock), 10);
                button.innerHTML = "정지";
                event.run = true;
            }else{
                this.clockStart = false;
                clearInterval(this.intervalId);
                button.innerHTML = "시작";
                event.stop = true;
                event.run = false;
            }
            document.dispatchEvent(event);
        });
    }
    resetButtonEvent(){
        const button = this.dom.querySelector(".reset");
        const startButton = this.dom.querySelector(".start");
        
        button.addEventListener("click", ()=>{
            clearInterval(this.intervalId);
            const event = new Event("totalTime");
            event.tag = this.tag;
            event.reset = true;
            event.milis = this.clock.milis;
            event.clockStart = this.clockStart;
            document.dispatchEvent(event);
            
            if(this.clockStart === true){
                startButton.innerHTML = "시작";
                this.clockStart = false;
            }

            this.clock.reset();
        });
    }
    removeButtonEvent(){
        const button = this.dom.querySelector(".remove");
        const dom = this.dom;
        button.addEventListener("click", ()=>{
            if(this.clockStart){
                alert("현재 타이머가 작동중입니다. 타이머를 정지한 후에 삭제해주세요.");
                return false;
            }
            const event = new Event("remove");
            event.name = this.name;
            event.tag = this.tag;
            event.milis = this.clock.milis;
            document.dispatchEvent(event);
        });
    }
}

class ResultArea{
    constructor(){
        this.run = false;
        this.tags = new Map();
        this.checkDuplicate = new Set();
        this.makeDom();
    }
    makeDom(){
        const template = document.querySelector("#results-area");
        this.dom = document.importNode(template.content, true).querySelector(".results-area");
        this.clock = new Clock(this.dom.querySelector(".total"));
    }
    getDom(){
        return this.dom;
    }
    totalTime(e){
        if(!this.run && e.run){
            this.run = true;
            this.intervalId = setInterval(this.clock.runWatch.bind(this.clock), 10);
        }else{
            if(e.reset) {
                this.clock.totalRemove(e);
            }
            if(e.clockStart || e.stop) {
                this.run = false;
                clearInterval(this.intervalId);
            }
        }
        this.tags.get(e.tag).runTimer(e);
    }
    addResult(name, tag){
        if(this.checkDuplicate.has(name)) return false;
        this.checkDuplicate.add(name);
        if(!this.tags.has(tag)) {
            this.tags.set(tag, new ResultPane(tag));
            this.dom.querySelector(".contents-area").appendChild(this.tags.get(tag).getDom());
        }
        this.tags.get(tag).addResult(name, tag);
    }
    allRemoveEvent(){
        this.tags.forEach((value, key, map) => {
            this.clock.totalRemove(value.getClock());
            value.dom.remove();
        });
        this.tags.clear();
        this.checkDuplicate.clear();
    }
    removeResult(e){
        this.clock.totalRemove(e);
        this.checkDuplicate.delete(e.name);
        if(this.tags.get(e.tag).removeResultElement(e))
            this.tags.delete(e.tag);
    }
}
class ResultPane{
    constructor(tag){
        this.tag = tag;
        this.run = false;
        this.results = new Map();
        this.makeDom();
    }
    makeDom(){
        const template = document.querySelector("#result-tag-area");
        this.dom = document.importNode(template.content, true).querySelector(".result-tag-area");
        this.dom.classList.add(this.tag);
        this.dom.querySelector(".result-tag").innerHTML = Tag.getTag(this.tag);
        this.clock = new Clock(this.dom.querySelector(".clock-area"));
    }
    getDom(){
        return this.dom;
    }
    addResult(name, tag){
        this.results.set(name, tag);
    }
    removeResultElement(e){
        this.results.delete(e.name);
        this.clock.totalRemove(e);
        if(this.results.size === 0){
            this.dom.remove();
            return true;
        }
    }
    runTimer(e){
        if(!this.run && e.run){
            this.run = true;
            this.intervalId = setInterval(this.clock.runWatch.bind(this.clock), 10);
        }else{
            if(e.reset) {
                this.clock.totalRemove(e);
            }
            if(e.clockStart || e.stop) {
                this.run = false;
                clearInterval(this.intervalId);
            }
        }
    }
    getClock(){
        return this.clock;
    }
}

class Clock{
    constructor(dom){
        this.dom = dom;
        this.milis = 0;
    }
    runWatch(){
        this.milis++;
        this.showClock();   
    }
    reset(){
        this.milis = 0;
        this.showClock();
    }
    totalRemove(clock){
        this.milis -= clock.milis;
        this.showClock();
    }
    showClock(){
        const second = this.milis/100;
        this.hour = Math.floor(second/3600);
        this.minute = Math.floor((second - (this.hour*3600))/60);
        this.second = Math.floor(second - this.hour*3600 - this.minute*60);

        if(this.hour < 10) this.hour = "0" + this.hour;
        if(this.minute < 10) this.minute = "0" + this.minute;
        if(this.second < 10) this.second = "0" + this.second;

        this.dom.innerHTML = this.hour + " : " + this.minute + " : " + this.second;
    }
}
class Tag{
    constructor(){}
    static getTag(tag){
        switch(tag){
            case "default": return "기본";
            case "study": return "공부";
            case "exercise": return "운동";
            case "self-dev": return "자기 계발";
            case "work": return "업무";
        }
    }
}