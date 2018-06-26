
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
        this.totalRemoveEvent();
    }
    addEvent(){
        document.addEventListener("add", (e)=>{
            this.planArea.addPlan(e.name, e.tag);
        });
    }
    allRemoveEvent(){
        document.addEventListener("allRemove", ()=>{
            this.planArea.allRemoveEvent();
        });
    }
    removeEvent(){
        document.addEventListener("remove", (e)=>{
            this.planArea.removePlan(e.name);
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
    totalRemoveEvent(){
        document.addEventListener("totalRemove", (e)=>{
            this.resultArea.totalRemove(e);
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
            if(inputName.value.length === 0 || inputTag.value.length ===0) {
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
        this.tagList = new Map();
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
            document.dispatchEvent(event);
        });
    }
    allRemoveEvent(){
        
        for(let key of this.planList.keys()){
            if(this.planList.get(key).clockStart){
                alert("아직 작동중인 타이머가 있습니다.");
                return false;
            }
        }
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
        const plansArea = document.querySelector(".plans-contents-area");
        plansArea.appendChild(plan.getDom());
        
        this.planList.set(name, plan);
    }
    removePlan(name){
        const deletePlan = this.planList.get(name);
        deletePlan.dom.remove();

        const event = new Event("totalRemove");
        event.milis = deletePlan.milis;
        document.dispatchEvent(event);

        this.planList.delete(name);
    }
    allStopPlan(e){
        this.planList.forEach((value, key, map)=>{
            const event = new Event('click');
            const button = value.dom.querySelector(".start");
            
            event.allStop = true;
            if(value.clockStart&& value !== e.obj) button.dispatchEvent(event);
        });
    }
}

class Plan{
    constructor(name, tag){
        this.name = name;
        this.tag = tag;
        this.milis = 0;
        this.clockStart = false;
        this.makeDom();
    }
    makeDom(){
        const template = document.querySelector("#plan");

        this.dom = document.importNode(template.content, true).querySelector(".plan-area");
        this.dom.querySelector(".name").innerHTML = this.name;
        this.dom.querySelector(".tag").innerHTML = this.tag;

        this.clock = this.dom.querySelector(".clock-area");

        this.startButtonEvent();
        this.resetButtonEvent();
        this.removeButtonEvent();
    }
    getDom(){
        return this.dom;
    }
    runWatch(){
        this.milis++;
        const second = this.milis/100
        this.hour = Math.floor(second/3600);
        this.minute = Math.floor((second - (this.hour*3600))/60);
        this.second = Math.floor(second - this.hour*3600 - this.minute*60);

        if(this.hour < 10) this.hour = "0" + this.hour;
        if(this.minute < 10) this.minute = "0" + this.minute;
        if(this.second < 10) this.second = "0" + this.second;

        this.clock.innerHTML = this.hour + " : " + this.minute + " : " + this.second;
    }
    startButtonEvent(){
        const button = this.dom.querySelector(".start");
        button.addEventListener("click", (e)=>{
            let event = new Event("allStop");
            event.obj = this;
            document.dispatchEvent(event);

            event = new Event("totalTime");
            if(this.clockStart !== true){
                this.clockStart = true;
                this.intervalId = setInterval(this.runWatch.bind(this), 10);
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
            this.clock.innerHTML = "00 : 00 : 00";
            clearInterval(this.intervalId);
            const event = new Event("totalTime");

            event.reset = true;
            event.milis = this.milis;
            event.clockStart = this.clockStart;
            document.dispatchEvent(event);
            
            if(this.clockStart === true){
                startButton.innerHTML = "시작";
                this.clockStart = false;
            }

            this.milis = 0;
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
            document.dispatchEvent(event);
        });
    }
}

class ResultArea{
    constructor(){
        this.milis = 0;
        this.run = false;
        this.makeDom();
    }
    makeDom(){
        const template = document.querySelector("#results-area");
        this.dom = document.importNode(template.content, true).querySelector(".results-area");
    }
    getDom(){
        return this.dom;
    }
    totalTime(e){
        if(!this.run && e.run){
            this.run = true;
            this.intervalId = setInterval(this.runTotalTime.bind(this), 10);
        }else{
            if(e.reset) {
                this.milis -= e.milis;
            }
            this.showClock();
            if(e.clockStart || e.stop) {
                this.run = false;
                clearInterval(this.intervalId);
            }
        }
    }
    totalRemove(e){
        this.milis -= e.milis;
        this.showClock();
    }
    runTotalTime(){
        this.milis++;
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

        const clock = this.dom.querySelector(".total");
        clock.innerHTML = this.hour + " : " + this.minute + " : " + this.second;
    }
}

class Result{
    constructor(tag){
        this.tag = tag;
        this.makeDom();
    }
    makeDom(){
        const template = document.querySelector("#result");
        this.dom = document.importNode(template.content, true).querySelector(".result");
    }
    getDom(){
        return this.dom;
    }
}