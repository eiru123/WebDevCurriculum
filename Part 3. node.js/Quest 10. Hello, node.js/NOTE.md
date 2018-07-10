# Quest 10. Hello, node.js

* node.js는 어떤 식으로 동작하나요?
    * node.js는 chrome V8 엔진으로 빌드된 javascript 런타입이다. 이벤트 기반, 논 블로킹 I/O 모델을 사용해 가볍고 효율적이다. 서버 개발을 위해 사용된다.
    * http://bcho.tistory.com/881
* require()함수는 어떻게 쓰는 것인가요?
    * 모듈들을 불러올 때 사용한다. 모듈로 만들어 둔 파일명을 require함수의 파라미터로 전달하면 module객체가 반환되는데 모듈 파일에서 exports 객체에 설정한 속성들을 접근할 수 있다. require() 는 CommonJS의 모듈표준이다. node는 파일과 모듈은 일대일로 대응하며 각 파인을 별도의 모듈로 처리된다. 따라서 하나의 파일에 작성된 모듈을 require()함수로 불러오면 캐싱된 인스턴스를 재사용한다.
* module.exports와 exports 변수는 어떻게 다른가요?
     * module.exports와 exports는 call by reference로 동일한 객체를 바라보고 있고, 리턴되는 값은 항상 module.exports이다.
     * exports에는 속성을 추가할 수 있어서 여러 개의 변수나 함수를 각각의 속성으로 추가할 수 있다.
     * module.exports는 하나의 변수나 함수 또는 객체를 직접 할당한다.
     * http://www.hacksparrow.com/node-js-exports-vs-module-exports.html
* npm이 무엇인가요?
    * node package manager의 줄임말. 이름 그대로 node의 모듈들을 관리해주는 프로그램. npm에 올려진 다른 사용자들이 만든 모듈들을 쉽게 다운받아 사용할 수 있게 해준다.
* npm 패키지를 -g 옵션을 통해 Global로 저장하는 것과 그러지 않은 것은 어떻게 다른가요?
    * -g 옵션을 사용하면 글로벌 패키지에 패키지가 추가된다. 글로벌 패키지에 추가된 패키지는 현재 프로젝트 뿐만 아니라 모든 프로젝트에 관련 패키지를 사용할 수 있다.
    * 원래는 현재의 프로젝트에만 node_modules라는 폴더에 설치된다. 그 외에도 install 시에 옵션을 줄 수 있는데 --save 옵션을 주면 pakage.json에 dependency에 추가되어 배포시 npm install을 실행할 때 필요한 패키지를 다운 받을 수 있게 설정할 수 있다. --save-dev 옵션은 devDependency에 추가되는데 이 때는 실행시 --porduction옵션을 붙이면 devDependency에 추가된 패키지는 빼고 설치한다.