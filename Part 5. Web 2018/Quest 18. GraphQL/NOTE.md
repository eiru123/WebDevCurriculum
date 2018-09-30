# Quest 18. GraphQL

* REST 기반의 API는 무엇인가요? 어떤 장점과 단점을 가지고 있을까요?
    * Representational State Transfer의 약자. 웹의 장점을 최대한 활용할 수 있는 네트워크 기반의 아키텍쳐.
    * 특징
        1. Uniform: Uniform Interface는 URI에 지정한 리소스에 대한 조작을 통일되고 한정적인 인터페이스로 수행하는 아키텍쳐 스타일.
        1. Stateless: REST는 무상태성 성격을 갖는다. 작업을 위한 상태 정보를 따로 저장하고 괸리하지 않는다. 세션 정보나 쿠키정보를 별도로 저장하며 관리하지 않기 때문에 API 서버는 들어오는 요청만 단순히 처리하면 된다. 따라서 서비스의 자유도가 높아지고 서버에서 불필요한 정보를 관리하지 않아도 된다.
        1. Cacheable: HTTP 웹 표준을 그대로 사용하기 때문에 웹에서 사용하는 기존 인프라를 그대로 활용가능하다. HTTP의 캐싱 기능을 적용할 수 있다. Last-Modified 태그나 E-Tag를 이용하면 캐싱 구현이 가능하다.
        1. Self-descriptiveness(자체 표현 구조): REST API 메시지만 보고도 이를 쉽게 이해할 수 있다.
        1. Client-Server 구조: REST서버는 API를 제공, 클라이언트는 사용자 인증이나 컨텍스트(세션, 로그인)등을 직접 관리하는 구조로 각각읭 역할이 확실히 구분되기 때문에 각자 개발할 내용이 명확하며 의존성을 줄일 수 있다.
        1. 계층형 구조: REST서버는 다중 계층으로 구성될 수 있으며, 보안, 로드 밸런싱, 암호화 계층을 추가해 구조상의 유연성을 둘 수 있고, PROXY, 게이트웨이 같은 네트워크 기반의 중간매체를 사용할 수 있게 한다.
    * 장점
        1. 쉬운 사용: 단순히 REST API 메시지를 읽는 것만으로도 메시지가 의도하는 바를 명확하게 파악할 수 있다. HTTP 인프라를 사용하기 때문에 별도의 인프라 구축을 필요로 하지 않는다. stateless한 특징 때문에 클라이언트가 이전에 서버에서 행해졌던 일들을 알 필요가 없다. 해당 URI와 원하는 메소드 자체만 독립적으로 이해하면 된다.
        1. 클라이언트와 서버가 완전히 분리된다. stateless한 특징때문에 서버는 클라이언트의 문맥을 유지할 필요가 없다. 따라서 서로의 일에 대해서 의존성이 줄어들어 각자의 코드만 신경쓰면 된다. 이러한 특성으로 인해서 HTTP 프로토콜 서비스라는 기본적인 요구만 충족되면 다양한 플랫폼에서 원하는 서비스를 쉽고 빠르게 개발하고 배포할 수 있다.
        1. REST API는 헤더 부분에 URI처리 메소드를 명시함으로써, 필요한 실제 데이터를 바디에 표현할 수 있다. 이는 특정 메소드의 세부적인 표현 문구를 JSON, XML등 다양한 언어를 이용하여 작성할 수 있다는 장점뿐만아니라, 간결한 헤더 표현을 통한 가독성 향상을 가져온다.
    * 단점
        1. HTTP 메소드를 사용하는 것이 장점도 있지만 단점도 있다. 메소드 형태가 제한적이라는 문제가 생긴다. 내부 context를 이용할 수 있지만 이 방법이 모든 해결책을 제공하지는 못한다.
        1. 표준의 부재. 가장 큰 단점이다. 관리의 어려움과 공식화 된 API디자인 가이드가 존재하지 않는다.
        1. 보안, 정책등의 표준이 없어 관리하기가 어렵고 이를 고려해서 구현할 경우 구현이 어려워진다.
        1. RDBMS와 잘 맞지 않다. RESTful한 테이블 구조가 필요한데 이보다는 NoSQL쪽이 더 잘 맞는 추세다.
        1. 새로운 기능이 필요할 때마다 새로운 API를 만들어야 한다. 이런 경우 프로젝트 규모가 커질경우 무수히 많은 API가 생겨나게 된다.
    * 출처: https://medium.com/@dltkdals2202/rest-api%EC%97%90-%EB%8C%80%ED%95%9C-%EA%B3%A0%EC%B0%B0-79f70a2b925d, https://wallees.wordpress.com/2018/04/19/rest-api-%EC%9E%A5%EB%8B%A8%EC%A0%90/
* GraphQL API는 무엇인가요? REST의 어떤 단점을 보완해 주나요?
    * 페이스북에서 만든 어플리케이션 레이어 쿼리 언어. 기존의 웹 혹은 모바일 어플리케이션의 API를 구현 할 때는 REST API가 사용된다. 기존의 REST API를 사용하면 클라이언트 사이드에서 어떠한 기능이 필요 할 때마다 새로운 API를 만들어야 했다. 클라이언트에서 필요한 정보를 쿼리로 만들어서 서버에 전달하면 서버가 알아서 프로세싱을 하여 주어진 틀대로 데이터를 보여준다. 쿼리를 통하여 필요한 데이터만 fetching하기 때문에 overfetch 혹은 underfetch를 걱정하지 않아도 된다. GraphQL은 특정 언어에 제한된 것이 아니여서 Node.js Python등에서 사용할 수 있고 HTTP 프로토콜에 제한되어있는 것도 아니기 때문에 WebSocket이나 MQTT프로토콜 위에서 사용할 수도 있다. 데이터베이스도 어떤 데이터베이스를 사용하던지 상관없다. 이미 구현된 시스템에 도입을 해도 기존에 있떤 시스템이 무너지지 않는다. GraphQL은 HTTP 요청의 횟수를 줄일 수 있다. RESTful API는 각 리소스 종류 별로 요청을 해야하고, 따라서 요청 횟수가 필요한 리소스의 종류에 비례한다. 반면 GraphQL은 원하는 정보를 하나의 Query에 모두 담아 요청하는 것이 가능하다. GraphQL은 API를 위한 쿼리 언어이며 데이터를 위해 정의한 타입 시스템을 사용하여 쿼리를 실행하는 서버사이드 런타임이다.
    * fragment: 프래그먼트의 개념은 복잡한 응용 프로그램 데이터 요구 사항을 작은 청크로 분할하는 데 자주 사용된다. 반복되는 내용을 함수처럼 구성하여 필요한 곳의 쿼리에 포함시킬 수 있다.
    * operation type에는 query, mutation, subscription이 있다. operation name은 작업에 의미 있고 명시적인 이름이다. 디버깅시 도움이 된다.
    * 출처: https://graphql-kr.github.io, https://velopert.com/2318
* GraphQL 스키마는 어떤 역할을 하며 어떤 식으로 정의되나요?
    * 스키마는 서버에 요청할 수 있는 데이터에 대해 정확한 표현을 갖기 위한 역할을 한다. 어떤 필드를 선택할 수 있는지, 어떤 종류의 객체를 반환 할 수 있는지, 해당 하위 객체에서 사용할 수 있는 필드는 무엇인지를 정한다. 모든 GraphQL 서비스는 해당 서비스에서 쿼리 가능한 데이터 집합을 완벽히 설명하는 타입들을 정의한다. 그런 다음 쿼리가 들어오면 해당 스키마에 대해 유효성이 검사되고 실행된다.
    * GraphQL 스키마 언어: 쿼리 언어와 비슷하며 GraphQL스키마를 언어에 구애받지 않는 방식으로 표현할 수 있게 해준다.
    * 스키마의 가장 기본적인 구성 요소는 객체 타입이다. 객체 타입은 서비스에서 가져올 수 있는 객체의 종류와 그 객체의 필드를 나타낸다.
    ```
    type Character {
        name: String!
        appearsIn: [Episode]!
    }
    ```
    Character는 GraphQL객체 타입이다. 일부 필드가 있는 유형이다. 즉, 일부 필드가 있는 유형이다. 스키마의 대부분의 타입은 개체 타입이다. name과 appearIn은 Character 타입의 필드이다. Character 타입으로 작동하는 GraphQL 쿼리의 어느 부분에도 나타날 수 있는 유일한 필드이다. String은 내장 된 스칼라 타입 중 하나이다. 이것은 단일 스칼라 객체로 해석되는 타입이며 퉈리에서 하위 선택을 가질 수 없다. String!은 필드가 non-nullable을 의미한다. 이 필드를 쿼리 할 때 GraphQL서비스가 항상 값을 제공한다는 것을 의미한다. [Episode]!는 Episode객체의 array를 타나낸다. 또한 non-nullable이기 때문에 appearIn필드를 쿼리할 때 항상 배열을 기대할 수 있다.
    * Arguments
        * GraphQL 개체 타입의 모든 필드는 0개 이상의 인수를 가질 수 있다. 모든 인수에는 이름이 있다. GraphQL의 모든 인수는 특별한 이름으로 전달된다. 이 경우 length필드는 하나의 정의된 unit을 가진다. 인수는 필수 또는 선택적이다. 인수가 선택적인 경우 기본값을 정의할 수 있다. 아래의 경우 인수가 전달되지 않으면 기본적으로 METER로 설정된다.
        ```
        type Starship {
            id: ID!
            name: String!
            length(unit: LengthUnit = METER): Float
        }
        ```
    * The Query and Mutation types
        * 스키마의 대부분의 타입은 일반 객체 유형일 뿐이지만 스키마 내에서는 특수한 두 가지 타입이 있다.
        ```
        schema {
            query: Query
            mutation: Mutation
        }
        ```
        모든 GraphQL 서비스는 query 타입을 가지며 mutation 타입은 가질 수도 있고 없을 수도 있다. 이러한 타입은 일반 객체 타입과 동일하지만  모든 GraphQL 쿼리의 진입점을 정의하므로 특별하다.
        ```
        query {
            hero {
                name
            }
            droid(id: "2000"){
                name
            }
        }
        ```
        즉 GraphQL 서비스는 Hero 및 droid 필드가 있는 Query 타입이 필요하다.
        ```
        type Query {
            hero(episode: Episode): Character
            droid(id: ID!): Droid
        }
        ```
        뮤테이션도 비슷한 방식으로 작동한다. Mutation 타입의 필드를 정의하면 쿼리에서 호출 할 수 있는 루트 뮤테이션 필드로 사용할 수 있다. 스키마에 대한 진입점이라는 특수한 상태 이외의 다른 쿼리 타입과 뮤테이션 타입은 다른 GraphQL객체 타입과 동일하며 해당 필드는 정확히 동일한 방식으로 작동한다.
    * scalar types
        * 객체 타입은 이름과 필드를 가지고 있지만, 어느 시점에서 이 필드는 일부 구체적인 데이터로 해석되어야 한다. 이것이 스칼라 타입이 필요한 이유이다. 쿼리의 끝을 나타낸다. 필드에 하위 필드가 없다.
        * 기본 스칼라 타입들: Int(부호가 있는 32비트 정수), Float(부호가 있는 부동소수점 값), String(UTF-8 문자열), Boolean(true or false), ID(객체를 다시 요청하거나 캐시의 키로써 자주 사용되는 고유 식별자를 나타낸다.String과 같은 방법으로 직렬화 된다. 사람이 읽을 수 있도록 하는 의도가 아니다.)
        * 맞춤 스칼라 타입을 지정할 수 있다. `scalar Date` 와 같이 타입을 정의할 수 있다. 해당 타입을 직렬화, 역 직렬화 및 유효성 검사를 수행하는 방법을 정의하는 것을 구현할 수 있다.
    * enumeration types
        * 열거 타입은 허용되는 특정 값들로 제한되는 특별한 종류의 스칼라이다. 이를 통해 1. 이 타입의 인수가 허용된 값 중 하나임을 검증할 수 있다. 2. 필드가 항상 값의 유한 집합 중 하나가 될 것임을 타입 시스템을 통해 의사소통한다.
        ```
        enum Episode {
            NEWHOPE
            EMPIRE
            JEDI
        }
        ```
        스키마에서 Episode 타입을 사용할 때마다 정확히 위의 세 가지 중 하나 일것으로 예상할 수 있다. 열거형 지원이 없는 javascript와 같은 언어에서는 이러한 값은 내부적으로 정수 집합에 매핑 될 수 있다.
    * List and Non-Null
        * 객체 타입, 스칼라 및 열거형은 GraphQL에서 정의 할 수 있는 유일한 타입이다. 하지만 스키마의 다른 부분이나 쿼리 변수 선언에서 타입을 사용하면 해당 값의 유효성 검사에 영향을 주는 추가 타입 수정자를 적용할 수 있다.
    * Interfaces
        * 인터페이스는 인터페이스를 구현하기 위해 타입이 포함해야하는 특정 필드 집합을 포함하는 추상 타입이다.
        ```
        interface Character {
            id: ID!
            name: String!
            friends: [Character]
            appearsIn: [Episode]!
        }
        ```
        위 인터페이스는 Character를 구현한 모든 타입은 이러한 인자와 리턴 타입을 가진 정확한 필드를 가져야 한다는 것을 의미한다.
        ```
        type Human implements Character {
            id: ID!
            name: String!
            friends: [Character]
            appearsIn: [Episode]!
            starships: [Starship]
            totalCredits: Int
        }
        type Droid implements Character {
            id: ID!
            name: String!
            friends: [Character]
            appearsIn: [Episode]!
            primaryFunction: String
        }
        ```
        이 두 타입 모두 Character 인터페이스의 모든 필드를 가지고 있음을 알 수 있다. 인터페이스는 객체 또는 객체 집합을 반환하려는 경우에 유용하지만 여러 다른 타입이 있을 수 있다.
        ```
        query HeroForEpisode($ep: Episode!) {
            hero(episode: $ep) {
                name
                primaryFunction
            }
            # hero는 character타입을 반환한다.
        }
        ```
        위의 경우 episode인수에 따라 hero필드는 Human 또는 Droid중 하나 일 수 있다. 위의 쿼리는 Primary함수를 포함하지 않는 Character 인터페이스 상에 존재하는 필드만 요청할 수 있다. 특정 객체 타입의 필드를 요청하려면 인라인 프래그먼트를 사용해야한다.
        ```
        query HeroForEpisode($ep: Episode!) {
            hero(episode: $ep) {
                name
                ... on Droid {
                    primaryFunction
                }
            }
        }
        ```
    * Union types
        * 인터페이스와 매우 유사하지만 타입 간에 공통 필드를 지정하지 않는다. `union SearchResult = Human | Droid | Starship` 스키마에서 SearchResult 타입을 반환 할 때마다, Human, Droid, Starship을 얻을 수 있다. 유니온 타입의 멤버는 구체적인 객체 타입일 필요가 있다. 인터페이스 또는 다른 유니온 타입에서 유니온 타입을 작성할 수 없다. SearchResult 유니언 타입을 반환하는 필드를 쿼리하면, 어떤 필드라도 쿼리할 수 있는 조건부 프래그먼트를 사용해야 한다.
    * input types
        * 복잡한 객체도 쉽게 전달할 수 있다. 이것은 특히 뮤테이션에서 유용하다. 뮤테이션은 생성될 전체 객체를 전달하고자 할 수 있다. GraphQL 스키마 언어에서 입력 타입은 일반 객체 타입과 정확히 같지만 type대신 input을 사용한다.
        ```
        input ReviewInput {
            stars: Int!
            commentary: String
        }
        ```
    * 검사
        * 타입 시스템을 사용하면 GraphQL 쿼리가 유효한지 여부를 미리 알 수 있다. 이를 통해 런타임 검사에 의존하지 않고도 유효하지 않은 쿼리가 생성되었을 때 서버와 클라이언트가 효과적으로 개발자에게 알릴 수 있다.
        * 프래그먼트는 무한 루프를 초래할 수 있으므로 프래그먼트가 자신을 참조하거나 싸이클을 만들 수 없다.
        * 필드를 쿼리할 때마다 스칼라나 열거형이 아닌 다른 것을 반환한다면 필드에서 어떤 데이터를 얻고자 하는지를 명확히 해야한다. 그렇지 않으면 오류가 난다. 반대로 스칼라인 경우 추가 필드를 쿼리하면 안된다.
        * 특정 타입에만 유효한 쿼리를 가져오고 싶은 경우 프래그먼트를 사용하면 된다. 하지만 프래그먼트는 재사용시에 큰 효과를 얻을 수 있기 때문에 인라인 프래그먼트를 사용하면 된다.
    * 실행
        * 유효성을 검사 한 후 GraphQL쿼리는 GraphQL 서버에 의해 실행되어 요청된 쿼리의 형태를 일반적인 JSON 형태의 결과로 반환한다. GraphQL은 타입 시스템없이는 쿼리를 실행할 수 없다. GraphQL 쿼리의 각 필드는 다음 타입을 반환하는 이전 타입의 함수 또는 메소드로 생각할 수 있다. 이는 GraphQL의 작동 방식이다. 각 타입의 각 필드는 GraphQL 서버 개발자가 만든 resolver함수에 의해 지원된다. 필드가 실행되면 해당 resolver가 호출되어 다음 값을 생성한다. 필드가 스칼라 값을 생성하면 실행이 완료 된다. 객체를 생성하면 쿼리는 해당 객체에 적용되는 다른 필드 선택 항목을 포함하게 된다. 스칼라 값이 나올때까지 반복한다. 쿼리는 항상 스칼라값으로 끝난다.
        * 모든 GraphQL 서버의 최상위 레벨은 GraphQL API에 가능한 모든 진입점을 나타내는 타입으로, Root타입 또는 Query타입이라고 한다.
    * node.js 상에서 GraphQL 서버를 실행하고 스키마를 정의하려면 어떻게 해야 하나요?
        * graphql모듈의 buildSchema 함수를 사용하여 정의한다.
        ```
        const schema = buildSchema (`
            type User {
                id: String
                name: String
            }
            type Query {
                user(id: String): User
            }
        `)
        ```
        * 또는 직접 object를 정의해서 사용할 수 있다.
        ```
        // Define the User type
        var userType = new graphql.GraphQLObjectType({
            name: 'User',
            fields: {
                id: { type: graphql.GraphQLString },
                name: { type: graphql.GraphQLString },
            }
        });

        // Define the Query type
        var queryType = new graphql.GraphQLObjectType({
            name: 'Query',
            fields: {
                user: {
                    type: userType,
                    // `args` describes the arguments that the `user` query accepts
                    args: {
                        id: { type: graphql.GraphQLString }
                    },
                    resolve: function (_, {id}) {
                        return fakeDatabase[id];
                    }
                }
            }
        });

        var schema = new graphql.GraphQLSchema({query: queryType});

        var app = express();
        app.use('/graphql', graphqlHTTP({
            schema: schema,
            graphiql: true,
        }));
        ```
* GraphQL 리졸버는 어떤 역할을 하며 어떤 식으로 정의되나요?
    * resolver 함수는 데이터베이스에 액세스 한 다음 관련 객체를 생성하고 반환한다. 세 개의 인수를 받는다. obj: 루트 쿼리 타입의 필드에 대해 종종 사용되지 않는 이전 객체, args: GraphQL 쿼리의 필드에 제공된 인수, context: 모든 resolver함수에 제공되고 현재 로그인한 사용자 또는 데이터베이스에 대한 액세스와 같은 중요한 문맥정보를 보유하는 값. context는 쿼리에서 인자로 제공된 id에 의해 사용자의 데이터를 로드하는데 사용되는 데이터베이스에 액세스를 위해 사용된다. 데이터베이스에서 로딩은 비동기 작업이기 때문에 Promise를 반환한다. 데이터베이스가 반환되면 새로운 Human 객체를 생성하고 반환할 수 있다. resolver함수는 Promise를 인식해야 하지만 쿼리는 Promise를 인식할 필요가 없다. GraphQL은 Promise가 완료될때까지 기다렸다가 효율적으로 동시에 처리한다. 많은 라이브러리는 resolver를 생략할 수 있게 해주며 resolver가 필드에 제공되지 않으면 같은 이름의 속성을 읽고 반환해야 한다고 가정된다. 각 필드가 resolve될 때 결과 값은 필드 이름을 키로 사용하고 resolve된 값을 값으로 사용하여 key-value맵에 들어간다. 이 방법은 쿼리의 맨 하단 끝 필드에서부터 루트 쿼리 타입의 초기 필드까지 반복된다. 최종적으로 기존 쿼리를 미러링하는 구조를 만들어서 요청한 클라이언트에(일반적으로 JSON)보낼 수 있다. query에서 특정 필드에 대한 요청이 있을 때, 그것을 어떤 로직으로 처리할지 GraphQL에 알려주는 역할
    ```
    const root = {
        setMessage:function(args){
            return args.message;
        }
    }
    app.use('/graphql', graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
    }))
    ```
    * scalar coercion: 타입 시스템은 어떤 값이 올지 알고 있어서 resolver함수에 의해 리턴된 값을 API규약을 유지할 수 있는 형태로 변환할 것이다. 내부적으로 4,5,6과 같은 숫자를 이용하는 Enum이 있을 수 있지만 GraphQL 타입 시스템에서는 이를 Enum 값으로 나타낸다.
    * GraphQL 리졸버의 성능 향상을 위한 DataLoader는 무엇이고 어떻게 쓰나요?
        * dataloader란 1+N문제를 1+1로 변환시켜주는 라이브러리다. 이벤트 루프가 돌아가는 한 사이클동안 들어온 id기반 요청을 모아 배치로 처리한 후 값을 되돌려주는 방식으로 문제를 해결한다.
* 클라이언트 상에서 GraphQL 요청을 보내려면 어떻게 해야 할까요?
    * 보통은 POST 요청으로 body에 query 내용을 실어서 보낸다.
    ```
    fetch('/graphql', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    body: JSON.stringify({query: "{ hello }"})
    })
    .then(r => r.json())
    .then(data => console.log('data returned:', data));
    ```
    * Apollo Client의 장점은 무엇일까요?
        * 어떠한 앱에라도 사용할 수 있다. 간단하고 시작하기 쉽다. 어떤 빌드 셋팅이든 사용 가능하다. 브라우저 devtool이 있다. 캐싱의 기능이 있다.
    * Apollo Client를 쓰지 않고 Vanilla JavaScript로 GraphQL 요청을 보내려면 어떻게 해야 할까요?