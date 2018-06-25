class App{
    constructor(){
        this.dom = document.querySelector(".app");
        this.setApp();
    }
    setApp(){
        const add = new Add();
        const planArea = new PlanArea();
        const resultArea = new ResultArea();

        this.dom.appendChild(add.getDom());
        this.dom.appendChild(planArea.getDom());
        this.dom.appendChild(resultArea.getDom());
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
}

class Plan{
    constructor(name, tag){
        this.name = name;
        this.tag = tag;
        this.makeDom();
    }
    makeDom(){
        const template = document.querySelector("#plan");
        this.dom = document.importNode(template.content, true);
    }
    getDom(){
        return this.dom;
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