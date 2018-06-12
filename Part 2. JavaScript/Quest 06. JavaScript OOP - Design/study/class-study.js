class Row{
    constructor(color, classes){
        this.color = color;
        this.classes = classes;
    }
    colorChange(){
        let select = document.querySelectorAll(this.classes);
        console.log(select);
        for(let node of select){
            node.addEventListener('click', ()=>{
                if(node.style.backgroundColor !== this.color){
                    node.style.backgroundColor = this.color;
                }else{
                    node.style.backgroundColor = "white";
                }
            });
        }
    }
    makeToggle(){
        let select = document.querySelectorAll(this.classes);
        for(let node of select){
            node.addEventListener("click", ()=>{
                node.classList.toggle("enabled");
            });
        }
    }
}

class Square{
    constructor(className, parentName){
        this.parent = document.querySelector(parentName);
        this.square = document.createElement("div");
        this.square.classList.add(className);
        this.parent.appendChild(this.square);
    }
}

let newSquare1 = new Square("square", ".row1");
let newSquare2 = new Square("square", ".row2");
let row1 = new Row("black", ".row1 .square");
row1.colorChange();
let row2 = new Row("green", ".row2 .square");
row2.makeToggle();
