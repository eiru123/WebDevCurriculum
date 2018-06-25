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
    }
    getDom(){
        return this.dom;
    }
}

class PlanArea{
    constructor(){
        this.makeDom();
    }
    makeDom(){
        const template = document.querySelector("#plan-area");
        this.dom = document.importNode(template.content, true);
    }
    getDom(){
        return this.dom;
    }
}

class Plan{
    constructor(){
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
        const template = document.querySelector("#result-area");
        this.dom = document.importNode(template.content, true);
    }
    getDom(){
        return this.dom;
    }
}

class Result{
    constructor(){
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