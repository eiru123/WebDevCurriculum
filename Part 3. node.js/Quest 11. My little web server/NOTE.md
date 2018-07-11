# Quest11. My little web server

* checklist
    * HTTP의 GET과 POST 메소드는 어떻게 다른가요?
        * GET 메소드는 URL의 끝에 ?가 붙는다. ?문자 뒤에는 이름과 값이 쌍으로 붙어있는 쿼리가 있다. 파라미터가 여러 개일 경우는 &로 구분된다. 즉 GET의 특징은 URL에 요청 파라미터를 붙여서 전송한다는 것이다. URL의 뒤에 요청 파라미터를 붙여쓰므로 대용량의 데이터를 전송하긴 힘들고 요청 파라미터를 URL만으로도 확인할 수 있기때문에 보안상 취약점이 있다. 따라서 GET메소드는 조회를 할 때 주로 사용한다. 인코딩/디코딩의 과정이 없기 때문에 POST보다 빠르다.
        * POST 메소드는 서버에 데이터를 전송하기 위해서 사용한다. GET메소드와 다르게 URL을 이용해 데이터를 보내지 않고 HTTP 패킷의 body에 담아서 파라미터를 전송한다. GET메소드는 조회를 위해 사용한다면 POST메소드는 서버의 상태나 데이터를 변경시킬 때 사용된다. body에 담아서 전송하므로 길이에 제한이 없어 대용량 데이터를 전송하는데 적합하다. POST로 요청할 때, Request headerdml Content-Type 에 해당 데이터 타입이 표현되며, 전송하고자 하는 데이터 타입을 적어주어야 한다. 타입을 적어주지 않거나 URI의 이름의 확장명 등으로 타입을 유추하지 못하는 경우에는 `application/octet-stream`으로 처리한다. (출처: https://hongsii.github.io/2017/08/02/what-is-the-difference-get-and-post/)
        * 다른 HTTP 메소드에는 무엇이 있나요?
            * HEAD: HTTP header 정보 요청. 리소스의 크기 확인시에 사용.
            * OPTIONS: 어떤 HTTP 메소드를 지원하는지 검사.
            * PUT: URI로 지정한 서버에 있는 파일을 대치한다.
            * DELETE: URI로 지정한 서버에 있는 파일을 삭제.
            * TRACE: 서버측에서 받은 리퀘스트 라인과 헤더를 그대로 클라이언트로 반송, 프록시 서버 등을 사용하는 환경에서 리퀘스트가 바뀌어 써지는 모양을 살펴볼 때 사용
            * CONNECT: 요청한 리소스에 대해 양방향 연결을 시작하는 메소드.
            * PATCH: 리소스에 부분적인 변화를 적용한다.
    * HTTP 서버에 GET과 POST를 통해 데이터를 보내려면 어떻게 해야 하나요?
        * GET: http모듈의 get함수 사용.
        * POST: http 모듈의 request함수 사용. 이때 요청 헤더와 본문을 모두 직접 설정해주어야 한다.
        * HTTP 요청의 `Content-Type` 헤더는 무엇인가요?
            * 전송하고자 하는 데이터 타입을 의미한다.
        * Postman에서 POST 요청을 보내는 여러가지 방법 (`form-data`, `x-www-form-urlencoded`, `raw`, `binary`) 각각은 어떤 용도를 가지고 있나요?
            * form-data: 키와 값의 쌍으로 보낸다. 파일도 전송할 수 있다. 하지만 html5 때문에 이전에 보낸 파일을 보내려면 다시 선택해서 보내야 한다.
            * x-www-form-urlencoded: key=value 형식으로 body에 저장하여 보냄. request를 처리하는 서버에서는 request body를 읽어서 map 형태로 변환. 반드시 body의 encoding을 추가해야 한다. 대용량 바이너리 데이터를 보내기에는 부적합. form-data와의 차이점은 파일을 전송할 수 없다.
            * raw: 어떠한 것도 담을 수 있다. text area에 넣는 어떤 것이든 보낼 수 있다.
            * binary: postman에서 사용할 수 없는 이미지나 오디오, 비디오파일 등을 데이터로 보낼 수 있다.

* EventEmitter객체를 생성하기 위해서는 events 모듈을 불러온 뒤 사용한다.