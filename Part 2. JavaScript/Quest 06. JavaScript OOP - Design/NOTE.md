# JavaScript OOP - Design

* 객체지향 프로그래밍은 무엇일까요?
    * 전통적인 패러다임 중 하나. 스몰톡으로부터 제대로 된 oop의 형태가 갖춰짐. 객체는 데이터와 기능을 논리적으로 묶어 놓은 것이고 우리가 사물을 이해하는 자연스러운 방식을 반영하도록 설계됨. 이렇게 설계된 객체들의 상호작용으로 프로그램을 서술하는 방식 객체지향은 사물에 관해 추상적이거나 구체적으로 생각하게 한다. 캡슐화, 상속, 다형성이 객체지향의 3대 요소이다.
* 객체와 클래스는 어떤 역할을 할까요?
    * 클래스는 객체들의 속성을 대표하는 틀을 정의한다. 해당 객체군을 표현할 수 있는 특정 멤버를 지칭하는 것이 아닌 그보다 더 추상적인 것을 말한다.
    * 객체는 클래스를 기반으로 실체화된 것을 말한다. 만약 자동차 클래스가 정의되어 있을 때 자동차 클래스를 이용하여 k5라는 자동차를 만들면 k5는 하나의 객체가 된다.
* 자바스크립트의 클래스는 어떻게 정의할까요?
    * 자바스크립트의 클래스는 기본적으로 함수이다. es6에서부터는 class라는 키워드로 클래스를 선언할 수 있지만 이는 함축 표현이다.
    * 함수 이용하기: 자바스크립트 함수를 만든 뒤 new키워드로 객체를 생성한다. 객체의 속성값과 메소드를 정의하기 위해서는 this 키워드를 사용하면 된다.
    ```
    function Car(company, years){
        this.company = company;
        this.years = years;
        this.driving = function(){
            console.log("driving!!");
        }
    }
    ```
    * prototype에 메소드를 추가하기: 위의 방식의 단점은 객체를 생성할 때 마다 driving 함수가 계속해서 생성된다는 점이다. 이렇게 의도한 프로그램은 좋겠지만 그 외에는 쓸데없이 더 많은 메모리를 가지게 된다. 이 때 prototype에 함수를 정의하면 모든 객체에 같은 함수가 적용된다. 
    ```
    function Car(company, years){
        this.company = company;
        this.years = years;
    }
    Car.prototype.driving = function(){console.log("driving!!");};
    ```
    * 객체 리터럴 사용: 객체를 생성하기 위한 new 연산자를 사용해서 생성할 필요 없이 바로 객체를 생성할 수 있다. 이러한 객체는 싱글톤객체가 된다. 싱글톤객체는 하나의 클래스 인스턴스를 가지는것을 말한다.
    ```
    const Car = {
        company: "tesla",
        years: 2012;
        driving: function(){ console.log("driving!!");}
    };
    ```
    * class 키워드 사용:
    ```
    class Car{
        constructor(company, years){
            this.company = company;
            this.years = years;
        }
        driving(){
            console.log("driving!!");
        }
    }
    ```
* 프로토타입 기반의 객체지향 프로그래밍은 무엇일까요?
    * 
* 클래스 기반의 객체지향 프로그래밍과 어떤 점이 다를까요?
    * 
* 클래스는 어떻게 상속할 수 있을까요?
    * 
* 클래스를 상속하는 설계의 장점과 단점은 무엇일까요?
    * 

* **prototype** 모든 함수에 있는 프로퍼티. new 키워드로 만든 새 객체는 생성자의 prototype에 접근할 수 있다. 객체 인스턴스는 생성자의 prototype 프로퍼티를 \_\_proto\_\_ 프로퍼티에 저장한다. 클래스의 모든 인스턴스는 모두 같은 프로토타입을 공유한다.