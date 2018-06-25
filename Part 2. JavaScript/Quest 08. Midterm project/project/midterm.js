
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
    }
    addEvent(){
        document.addEventListener("add", (e)=>{
            this.planArea.addPlan(e.name, e.tag);
        });
    }
    removeEvent(){
        document.addEventListener("remove", (e)=>{

        });
    }
}

class Add{
    constructor(){
        this.makeDom();
    }
    makeDom(){
        const template = document.querySelector("#add");
        this.dom = document.importNode(template.content, true);
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
            const event = new Event("add", {bubbles: true, cancelable: true});
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
        this.makeDom();
    }
    makeDom(){
        const template = document.querySelector("#plans-area");
        this.dom = document.importNode(template.content, true);
    }
    getDom(){
        return this.dom;
    }
    addPlan(name, tag){
        const plan = new Plan(name, tag);
        const plansArea = document.querySelector(".plans-contents-area");
        plansArea.appendChild(plan.getDom());
    }
}

class Plan{
    constructor(name, tag){
        this.name = name;
        this.tag = tag;
        this.time = 0;
        this.makeDom();
    }
    makeDom(){
        const template = document.querySelector("#plan");

        this.dom = document.importNode(template.content, true);
        this.dom.querySelector(".name").innerHTML = this.name;
        this.dom.querySelector(".tag").innerHTML = this.tag;

        this.startButtonEvent();
        this.resetButtonEvent();
        this.removeButtonEvent();
    }
    getDom(){
        return this.dom;
    }
    startButtonEvent(){
        const button = this.dom.querySelector(".start");
        button.addEventListener("click", ()=>{
            console.log("start");
        });
    }
    resetButtonEvent(){
        const button = this.dom.querySelector(".reset");
        button.addEventListener("click", ()=>{
            this.time = 0;
        });
    }
    removeButtonEvent(){
        const button = this.dom.querySelector(".remove");
        const dom = this.dom;
        button.addEventListener("click", ()=>{
            const event = new Event("remove", {bubbles: false, cancelable: false});
            event.dom = dom;
            console.log(event);
            document.dispatchEvent(event);
        });
    }
}

class ResultArea{
    constructor(){
        this.makeDom();
    }
    makeDom(){
        const template = document.querySelector("#results-area");
        this.dom = document.importNode(template.content, true);
    }
    getDom(){
        return this.dom;
    }
}

class Result{
    constructor(tag){
        this.tag = tag;
        this.makeDom();
    }
    makeDom(){
        const template = document.querySelector("#result");
        this.dom = document.importNode(template.content, true);
    }
    getDom(){
        return this.dom;
    }
}