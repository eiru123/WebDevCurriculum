# css정리

## checklist
* __CSS를 HTML에 적용하는 세 가지 방법의 장단점은 무엇인가요?__
    1. 인라인 방식
        * 해당 태그에 style 속성을 넣는 방식
            * `<p style="color:red; background-color:yellow;">안녕하세요</p>`
        * 내부 스타일 시트
            * main.html
            ```
            <head>
                <style>
                    body{
                        border: 1px; solid; black;
                    }
                    div{
                        background: green;
                    }
                </style>
            </head>
            ```
        * 외부 스타일 시트
            * main.html
            ```
            <head>
                <link rel="stylesheet" href="example.css">
            </head>
            ```
            * example.css
            ```
            body{
                border: 1px; solid; black;
            }
            div{
                background: green;
            }
            ```
                    
* __여러 개의 CSS규칙이 한 개의 대상에 적용될 때, 어떤 규칙이 우선순위를 가지게 되나요?__
* __어떤 박스가 `position:absolute;`인 속성을 갖는다면, 그 위치의 기준점은 어디가 되나요?__
* __가로나 세로로 여러 개의 박스가 공간을 채우되, 그 중 한 개의 박스만 가변적인 크기를 가지고 나머지 박스는 고정된 크기를 갖게 하려면 어떻게 해야 할까요?__
* __`float`속성은 왜 좋지 않을까요?__
* __Flexbox(Flexible box)와 CSS Grid의 차이와 장단점은 무엇일까요?__

## 위치 속성과 관련된 공식
* position 속성에 absolute 키워드를 적용하면 부모 태그가 영역을 차지하지 않는다. 따라서 자손의 position속성에 absolute 키워드를 적용할 경우는 부모 태그에 몇가지 처리를 해야한다.
    1. div 태그가 영역을 차지하지 않는다.
        * 이를 해결하기 위한 공식: 자손에게 position 속성을 absolute 키워드로 적용하면 부모에게 height 속성을 입력한다. 이렇게 하면 부모 태그가 영역을 차지하게 만들 수 있다.
    1. style이 적용된 div가 자신의 부모를 기준으로 위치를 잡지 않는다.
        * 자손의 position 속성을 absolute 키워드로 적용하면 부모의 position 속성을 relative 키워드로 적용한다.

## float 속성을 사용한 레이아웃 구성에 있어서의 공식
    * 자손에 float 속성을 적용하면 부모의 overflow속성에 hidden 키워드를 적용한다.