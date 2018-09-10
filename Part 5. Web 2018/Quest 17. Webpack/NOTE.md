# Quest 17. Webpack

* Webpack
	* 자바스크립트 코드가 많아지면 하나의 파일로 관리하는데 한계가 있다. 하지만 여러개의 파일을 브라우져에서 로딩하는 것은 그만큼 네트웍 비용을 치뤄야한다는 단점이 있다. 또 각 파일은 서로의 스코프를 침범하지 않아야 하는데 잘못 작성할 경우 변수 충돌의 위험성도 있다. 이러한 문제를 해소하기 위해 모듈 번들러인 웹팩이 나오게 됐다.
	* 초기에 모든 것을 로딩하지 않고 필요한 것들만 로딩한다.
	* webpack 의 파일명은 `webpack.config.js`여야 한다. 
	* entry
		* 웹팩에서 모든 것은 모듈이다. js, css, image 등 모든 것을 js 모듈로 로딩해서 사용한다. 자바스크립트가 로딩하는 모듈이 많아질수록 모듈간의 의존성은 증가한다. 의존성 그래프의 시작점을 웹팩에서는 엔트리라고 한다. 웹팩은 엔트리를 통해서 필요한 모듈을 로딩하고 하나의 파일로 묶는다. 즉 웹팩이 시작할 파일이다.
		```
		{
			entry: {
				app: 'path',
				app2: 'path'
			}
		}
		```
		키가 app 이면 app.js 로 app2면 app2.js로 결과물이 나온다. 보통 멀티페이지 웹사이트에서 entry를 여러 개 넣어준다. entry에 여러 파일들을 넣고 싶을 때는 배열을 사용하면 된다. js파일 대신 npm모듈을 넣어도 된다. 보통 vendors 속성은 외부 라이브러리를 분리해서 번들링하기 위해 사용한다.
		* vendor: 외부 라이브러리를 지정해준다.
	* output
		* entry에 설정한 자바스크립트 파일을 시작으로 의존되어 있는 모든 모듈을 하나로 묶을 것이다. 이 때 번들된 결과물을 처리할 위치는 output에 기록한다. 합쳐진 파일을 저장하기위해 설정. 웹팩은 터미널에서 `webpack` 커맨드로 빌드할 수 있다.
		```
		{
			output: {
				path: '/dist',
				filename: '[name].js',
				publicPath: '/'
			}
		}
		```
		publicPath 는 파일들이 위치할 서버 상의 경로이다. filename은 entry 키의 이름에 맞춰서 결과를 산출하는 파일명이다. express.static경로와 비슷하다. path는 output으로 나올 파일이 저장될 경로다.  
		* name options: 엔트리 명에 따른 output 파일명, 특정 webpack build에 따른 output 파일명, 특정 webpack chunk에 따른 output 파일명 생성. 만약 entry객체에 main과 vendor속성이 있다면 main.js, vendor.js 파일이 생성된다.
		* [hash]: 매번 웹팩 컴파일 시 랜덤한 문자열을 붙여준다. 따라서 캐시 삭제 시 유용하다.
		* [chunkhash]: 파일이 달라질 때에만 랜덤 값이 바뀐다. 이를 사용하면 변경되지 않은 파일들은 계속 캐싱하고 변경된 파일만 새로불러올 수 있다.
	* mode
		* 웹팩4에서 추가. mode가 development면 개발용, production이면 배포용이다. 배포용일 경우 알아서 최적화가 적용된다. 웹팩3라면 config 파일에서 mode랑 optimization을 빼야한다.
	* resolve
		* 웹팩이 알아서 경로나 확장자를 처리할 수 있게 도와주는 옵션. extensions에 넣은 확장자들은 웹팩에서 알아서 처리해준다.
	* webpack loader
		* 웹팩은 js파일만 처리가 가능하다. 따라서 loader를 이용하여 다른 형태의 웹 자원들을(img,css)등을 js로 변환하여 로딩한다. 모듈 로딩 순서는 배열의 요소 오른쪽에서 왼쪽으로 진행된다.
		* `test`에 로딩할 파일을 지정하고 `use`에 적용할 로더를 설정.
		```
		{
			test: /backbone/,
			use: [
				'expose-loader?Backbone',
				'imports-loader?_=underscore,jquery' // jquery -> underscore 순으로 로딩 이때 underscore 는 _ 로 쓴다는 것을 의미한다.
			]
		}
		```
		babel loader -es6
		```
		module: {
			rules: [{
				test: /\.js$/,
				use: [{
					loader: 'babel-loader',
					options: {
						presets: [
							['es2015', 'react', {modules: false}]
						]
					}
				}]
			}]
		}
		```
		ExtractTextWebpackPlugin -> css를 bundle.js  파일 안에 번들링 하지 않고, 빌드시 별도의 .css파일로 분리해준다. -> webpack4 에서는 mini-css-extract-plugin을 써야한다.
		* 웹팩을 사용하면 babel을 주로 같이 사용한다. 바벨을 적용시키기 위해서는 로더를 사용해야 한다.
		* style-loader: html 파일에 style tag로 삽입.
		* file-loader: 특정 파일을 그대로 내보내 준다.
		* url-loader: 설정한 사이즈보다 작은 이미지나 폰트 파일을 인라인화 한다. base64로 인코딩한다.
		* babel-loader: es6로 작성된 코드를 es5로 변환하기 위해 사용. `test`에 es6로 작성된 파일을 지정하고, `use`에 이를 변환할 바벨 로더를 설정한다.
	* plugins
		* 파일별 커스텀 기능을 사용하기 위해서 사용한다. 추가적으로 커스텀 기능을 확장하거나 원하는 기능을 추가하기 위해서 사용한다. loader와의 차이점은 로더는 웹팩을 번들링할 때 중간에 개입을 하는 것이고 플러그인은 번들링을 끝내고 결과값을 낼 때 관여를 한다. js를 압축하기 위해서 UglifyJsPlugin()을 사용한다.
		* ProvidePlugin: 모든 모듈에서 사용할 수 있도록 해당 모듈을 변수로 변환한다. 라이브러리에 대해서 전역 변수와 비슷한 기능을 하도록 함.
		* DefinePlugin: 웹팩 번들링을 할 때 시작하는 지점에 사용 가능한 상수들을 정의한다. 일반적으로 개발계, 테스트계에 따라 다른 설정을 적용할 때 유용하다.
		* MenifestPlugin: 번들링시 생성되는 코드(라이브러리)에 대한 정보를 json 파일로 저장하여 관리한다.
		* webpack.optimize.CommonsChunkPlugin: 공통적으로 사용하는 라이브러리를 빼서 모든 모듈에서 사용하게 하는 것. name속성에 관련 entry속성을 넣어준다. -> config.optimization.splitChunks로 사용해야한다.
	* resolve
		* 모듈 번들링 관점에서 봤을 때, 모듈 간의 의존성을 고려하여 모듈을 로딩해야한다. 따라서 모듈을 어떤 위치에서 어떻게 로딩할지에 관해 정의를 하는 것이 바로 module resolution이다.
		* 모듈을 어떻게 로딩해야하느냐?
			1. 절대 경로를 이용한 파일로딩: 파일의 경로를 모두 입력한다.
			1. 상대경로를 이용한 파일 로딩: 해당 모듈이 로딩되는 시점의 위치에 기반하여 상대경로를 절대경로로 인식하여 로딩
		* alias: 특정 모듈을 로딩할 때 별칭으로 더 쉽게 로딩할 수 있다.
		```
		alias: {
			Utilities: path.resolve(__dirname, 'src/path/utilities/')
		}
		import Utility from '../../src/path/utilities/utility';
		import Utility from 'Utilities/utility';
		위 아래는 같다.
		```
		* modules: require() import ''등의 모듈 로딩시에 어느 폴더를 기준으로 할 것인지 정하는 옵션
		```
		modules: ["node_modules"] //defaults
		modules: [path.resolve(__dirname, "src"), "node_modules"]
	* optimization
		* 웹팩4에서 최적화 관련 플러그인들이 모두 이쪽 속성으로 통합되었다. minimize 는 UglifyJsPlugin, splitChunks는 CommonsChunkPlugin을 계승한다. mode가 production일 때는 자동으로 두 속성이 켜진다.
	* webpack 빌드를 위한 개발 서버 구성
		* webpack-dev-server: webpack 자체에서 제공하는 개발 서버, 빠른 리로딩 기능 제공. 페이지 새로고침을 자동으로 제공하는 webpack 개발용 node.js 서버 
		* 설치 및 실행
		```
		npm install --save-dev webpack-dev-server
		webpack-dev-server --open
		package.json
		"scripts": {"start": "webpack-dev-server"}
		npm start 만 치면 된다.
		```
		```
		options
		publicPath: webpack으로 번들한 파일들이 위치하는 곳. default 값은 / 항상 /를 앞 뒤로 붙여줘야 한다. /directory/, output의 publicPath와 같아야 한다.
		contentBase: 서버가 로딩할 static 파일 경로를 지정. default 값은 working directory 비활성화 하려면 false를 넣어주면 된다.
		compress: gzip 압축 방식을 이용하여 웹 자원의 사이즈를 줄인다.

		* webpack-dev-middleware: 서버가 이미 구성된 경우에는 webpack을 미들웨어로 구성하여 서버와 연결. 기존에 구성한 서버에 webpack 에서 컴파일한 파일을 전달하는 middleware wrapper. webpack에 설정한 파일을 변경시, 파일에 직접 변경 내역을 저장하지 않고 메모리 공간을 활용. 따라서 변경된 파일 내역을 파일 디렉토리 구조안에서 확인이 불가능.
		```
		설치
		npm install --save-dev express webpack-dev-middleware\
		lazy 옵션: 파일이 변경되었을 때 클라이언트에서 요청이 왔을 시에만 번들링을 다시 함.
		```
	* path vs public Path
		* webpack dev server의 path, publicPath를 구분하기 위해 파악
		* output의 path와 public path 속성의 차이점 이해. publicPath는 파일의 위치가 아니라 로더나 기타 기능을 활용했을 때 webpack이 url에 업데이트 해주기 위해 사용. cdn의 경우 cdn 호스트를 지정한다.
	* webpack 명령어
		* webpack: 기본 명령(주로 개발용)
		* webpack -p: minification 기능이 들어간 빌드 (주로 배포용)
		* webpack -watch(-w): 개발에서 빌드할 파일의 변화를 감지
		* webpack -d: sourcemap을 포함하여 빌드
		* webpack --display-error-details: error 발생시 디버깅 정보를 상세히 출력
		* webpack --optimize-minimize --define process.env.NODE_ENV="'production'": 배포용
	* 개발자 도구 연동
		* webpack으로 컴파일된 파일을 디버깅 하기는 어렵다.
		* 따라서, source-map 설정을 추가하여 원래의 파일구조에서 디버깅이 가능하다.
		```
		devtool: '#inline-source-map'
		```
	* Hot Module Replacement
		* 웹 앱에서 사용하는 js모듈들을 갱신할 때, 화면에 새로고침 없이 뒷 단에서 변경 및 삭제 기능을 지원
	* 코드 스플리팅: 느린 초기 로딩시간을 극복하고자 나왔다. 싱글페이지 앱일 때 해당 라우트를 방문했을 때만 관련된 모듈들을 로딩하도록 하는 것이다.
	* 출처: http://blog.jeonghwan.net/js/2017/05/15/webpack.html, https://www.zerocho.com/category/Webpack/post/58aa916d745ca90018e5301d
* Bundling
* Image Sprite
	* 여러 개의 이미지를 하나의 이미지로 합쳐서 관리하는 이미지.
	* Data URL
* Transpiling
	* Source Map

* 여러 개로 나뉘어진 자바스크립트나 이미지, 컴포넌트 파일 등을 하나로 합치는 작업을 하는 것은 성능상에서 어떤 이점이 있을까요?
	* 여러 개의 파일을 브라우져에 로딩하는 것은 그만큼의 네트워크 비용을 소모하게 되는데 이를 하나로 합쳐서 로딩한다면 네트워크 비용을 줄일 수 있다.
	* 이미지를 Data URL로 바꾸어 번들링하는 것은 어떤 장점과 단점이 있을까요?
		* 장점: 스프라이트 이미지처럼 http 요청을 절약할 수 있다. HTML 파일로 관리할 수 있다.
		* 단점: 캐시되지 않아 매번 불러와야한다. 기존 파일보다 용량이 30%커진다.(이는 과장된 표현이라 한다. 실제 단점은 인코딩과 디코딩의 추가적인 작업으로 메모리 및 처리 시간이 저하되는 단점이 있다.) 일부 브라우저에서 제한 및 지원되지 않는다.
* Source Map이란 무엇인가요? Source Map을 생성하는 것은 어떤 장점이 있을까요?
	* 소스맵이란 원본 소스와 변환된 소스를 맵핑해 주는 방법을 제안한 것이다. 웹팩을 이용해 자바스크립트를 한 파일로 합치거나 사이즈를 줄이기 위해서 압축을 하거나 배포를 위해 난독화를 진행한다. 이러한 과정을 거치면 성능은 좋아지지만 디버깅이 어려워 진다. 이를 해결하기 위해 원본 소스와 최종 소스를 매핑해서 추적할 수 있는 방법이다. 소스맵 파일은 JSON형식으로 되어있다.
	* 파일 구조
	```
	{
		version: 양수로 소스맵의 버전을 의미하고 항상 제일 먼저 나와야 한다.,
		file: 변환된 파일명이다.,
		sourceRoot: 옵션값으로 소스 파일을 가져올 경로의 루트를 재조정하는데 사용.,
		sources: mappings에서 사용할 원본 소스 파일명의 배열,
		sourcesContent: 옵션값을로 소스의 내용을 담고 있어야 하면 sources의 파일명으로 파일을 가져오지 못했을 때 사용하는 용도. null로 지정하면 반드시 소스피알이 필요하다.,
		names: mappings에서 사용할 심볼 이름.,
		mapping: 인코딩된 매핑 데이터의 문자열
	}
	```
* Webpack의 플러그인과 모듈은 어떤 역할들을 하나요?
	* 모듈은 번들링을 진행할 때 처리해야하는 일들을 실행할 때 사용한다.
	* Webpack을 이용하여 HMR(Hot Module Replacement) 기능을 설정하려면 어떻게 해야 하나요?
	* HMR이란 내용이 변경된 모듈을 페이지 새로고침 없이 런타임에서 업데이트 하는 것을 말한다. 업데이트에 실패할 경우 새로고침을 수행한다. 변경된 모듈을 hot module이라고 한다. 모듈이 업데이트 되면 해당 모듈부터 accept 될때까지 부모 모듈로 bubbling-up된다. 만약 accept되지 않는다면 업데이트는 실패하게 된다.
	* devServer옵션 중 `hot`을 true로 설정한다. 플러그인에 `new webpack.HotModuleReplacementPlugin()`를 추가한다. 상위 파일에서 module.hot일 때 accept하는 코드를 추가해준다.
* bundle.js