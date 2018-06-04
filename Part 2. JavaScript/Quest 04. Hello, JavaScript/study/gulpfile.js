const gulp = require('gulp');
const babel = require('gulp-babel');
// const eslint = require('gulp-eslint');

gulp.task('default', function(){
	// node source
	// babel은 es6 코드를 es5 코드로 변환
	// gulp 는 디렉토리 구조와 파일 이름을 그대로 유지한다.
	// gulp.src(['es6/**/*.js', 'public/es6/**/*.js'])
	// 	.pipe(eslint())
	// 	.pipe(eslint.format());

	gulp.src('es6/**/*.js')
		.pipe(babel())
		.pipe(gulp.dest('dist'));

	// browser source
	// ** 은 서브디렉토리를 포함해 모든 디렉토리를 뜻하는 와일드카드
	gulp.src('public/es6/**/*.js"')
		.pipe(babel())
		.pipe(gulp.dest('public/dist'));

});