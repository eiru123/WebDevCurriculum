# Quest 15. ORM
* ORM(Object-relational mapping)
    * 간단히 말하면 객체와 관계와의 설정. ORM에서의 객체는 OOP의 객체를 의미한다. 관계라는 것은 관계형 데이터베이스를 의미한다. OOP다운 프로그래밍을 하자는 의미에서 출발했다. 
    
    * sequelize
        * node.js 기반의 ORM. 공식적으로 PostgreSQL, MySQL, MariaDB, SQLite, MS-SQL을 지원한다.
        * `npm install sequelize`, `npm install mysql` 로 설치한다.
        * 연결하기
        ```
        const Sequelize = require('sequelize');
        const sequelize = new Sequelize(
            'db이름', '유저이름', '패스워드', {
                'host': db호스트,
                'dialect': 사용할 db 종류
                }
        );
        ```
        * 모델 만들기: 자바스크립트 객체와 실체 테이블을 매핑하기 위해서는 모델을 정의해야 한다.
        ```
        sequelize.define('테이블명', {
            column 명: {
                type: Sequelize.INTEGER,
                PrimaryKey: bool,
                autoIncrement: bool,
                allowNull: bool
            }
        })
        ```
        sequelize는 모델을 정의하면 `createdAt`, `updatedAt` 필드를 자동으로 만들어주며, 테이블에 레코드를 생성할 때, 업데이트 할 때 자동으로 관리해주기도 한다.
    * 모델간의 관계들(BelongsTo, HasOne, HasMany, BelongsToMany)
        * 관계 관련 메소드의 option 항목은 대표적으로 foreignKey, as가 있다. foreignKey에는 foreignKey로 사용되는 column의 name이 들어간다. as는 alias를 주는 옵션이다.
        * BelongsTo
            * 1:1 관계를 만드는 데 사용하는 메소드. targetKey 옵션을 사용할 수 있다. 관계 키를 source에 추가한다.
        * HasOne
            * 1:1 관계를 만드는 데 사용하는 메소드. child모델의 입장에서 parent 모델의 정보가 필요할 때 사용한다. 관계 키를 target에 추가한다. source.hasOne(target)
        * HasMany
            * 1:N 관계를 위해 사용하는 메소드.
        * BelongsToMany
            * N:M 관계를 만드는 데 사용하는 메소드. targetKey 옵션을 사용할 수 있다.
* 각종 쿼리
    * `CREATE`, `SELECT`, `UPDATE`, `DELETE`

* ORM을 사용하는 것은 사용하지 않는 것에 비해 어떤 장단점을 가지고 있나요?
    * 장점
        * 생산성 향상: SQL query를 작성하고 그 query 실행 결과로부터 객체를 생성하는 코드를 작성하는 시간이 줄어들어 business logic에 집중할 수 있다.
        * 유지보수 용이: JDBC, ADO.NET 등의 api를 사용한 코드 축소. 코드가 business logic 위주로 작성되기 때문에 이해도가 상승한다. 리펙토링이 용이하다. ORM은 독립적으로 작성되어있고 해당 객체들을 재활용할 수 있다. 
        * 특정 DBMS에 종속적이지 않다. 대부분의 ORM 솔루션은 DBMS에 종속적이지 않다.
    * 단점
        * DAO 패턴에 익숙한 개발자에게는 초반 접근이 어렵다. 객체 지향적으로 class를 설계하는 것은 쉽지 않다.
        * ORM을 잘못 사용할 경우 성능을 저하시킬 수 있다. ORM 솔루션들은 자체적으로 cache와 같이 성능을 향상 시킬 수 있는 기능을 제공하고 있기 때문에 ORM 자체의 성능은 나쁘지 않다. 그러나 부적절하게 ORM을 적용할 경우 성능 저하를 유발할 수 있다.
        * 객체 지향적 프로그래밍이 아니라면 별다른 효과를 볼 수 없다.
        * 프로젝트의 복잡성이 커질경우 난이도 또한 올라갈 수 잇다.
        * 출처: https://m.blog.naver.com/PostView.nhn?blogId=my0biho&logNo=40146063900&proxyReferer=https%3A%2F%2Fwww.google.co.kr%2F, http://www.incodom.kr/ORM
* 모델간의 1:1, 1:N, N:M 관계는 각각 무엇이고 어떨 때 사용하나요?
    * 1:1 관계
        * 만약 개체 B의 각 인스턴스에 대해 하나의 개체 A의 인스턴스가 존재할 때 이 둘은 1:1관계라고 한다. 반드시 1:1 관계로 테이블을 구성해야 할 필요가 없는 한, 1:1 관계는 대개 두 테이블의 데이터를 단일 테이블로 통합하는 것이 더 낫다는 것을 의미한다.
        ex) 한 명의 직원은 하나의 주차장을 갖는다.(직원 테이블, 주차장 테이블)
    * 1:N 관계
        * 한 테이블의 레코드가 다수의 항목과 관련되었을 때 발생한다. 데이터베이스를 구성할 때 1:M 관계를 구현하려면, 한 쪽의 프라이머리 키를 다른 쪽의 속성으로 추가하기만 하면 된다. 이 방식으로 다른 테이블에 프라이머리 키가 나열될 때, 이 프라이머리 키를 외래키라고 부른다. 1 방면의 테이블을 상위 테이블, 다른 방면의 테이블을 하위 테이블이라고 한다.
        ex)한 사무실에는 여러 명의 직원이 있다.(사무실 테이블, 직원 테이블)
    * N:M 관계
        * 한 테이블의 복수의 개체가 다른 테이블의 복수의 개체와 관련이 있을 때, 이 둘은 다대다 관계가 있다고 한다. 이러한 관계는 학생과 수업 간의 경우에서 발생가능, 학생 한 명은 여러 수업을 수강할 수 있고, 한 수업은 여러 명의 학생으로 구성되기 때문이다. 이런 관계는 데이터베이스에서 직접 구현할 수 없고 두 개의 일대다 관계로 분리해야 한다. 이를 위해서 두 테이블 사이에 새로운 개체를 생성한다. 
        ex) 여러 강의가 있고 여러 학생이 있을 때 한 명의 학생은 여러 개의 강의를 들을 수 있고 한 개의 강의는 여러 명의 학생이 듣는 경우.(강의 테이블, 학생 테이블) -> 이 때 가운데에 수강이라는 테이블을 하나 더 둔다음(강의 테이블 1:n 수강테이블 n:1 학생테이블) 의 구성으로 바꾼다.
    * 출처 : https://medium.com/@khwsc1/%EB%B2%88%EC%97%AD-%EB%8D%B0%EC%9D%B4%ED%84%B0-%EA%B5%AC%EC%A1%B0%EC%99%80-%EC%84%A4%EA%B3%84-%ED%8A%9C%ED%86%A0%EB%A6%AC%EC%96%BC-b25792a0aa86
