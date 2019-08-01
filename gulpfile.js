const gulp = require("gulp");
const sass = require("gulp-sass");
sass.compiler = require('node-sass');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
// HomeWork 
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const mozjpeg = require('imagemin-mozjpeg');
const cache = require('gulp-cache');
/*************************************************************/

gulp.task("html", (done) => {

    gulp.src("./src/*.html")
        .pipe(gulp.dest("./dist"))
        .pipe(browserSync.stream());

    done();
});

gulp.task("scss", (done) => {
    gulp.src("./src/scss/*.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer(['last 15 versions'], {
            cascade: true
        }))
        .pipe(gulp.dest("./dist/css"))
        .pipe(browserSync.stream());

    done();
});

gulp.task("js", (done) => {

    gulp.src("./src/js/**/*.js")
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat("index.js"))
        .pipe(gulp.dest("./dist/js"))
        .pipe(browserSync.stream());

    done();
});

gulp.task("browser-init", (done) => {
    browserSync.init({
        server: "./dist"
    });

    done();
});

gulp.task("images", (done) => {
    gulp.src("./src/img/**/*")
        .pipe(cache(imagemin([pngquant({
            quality: [0.5, 0.5]
        }), mozjpeg({
            quality: 50
        })])))
        .pipe(gulp.dest("./dist/img"));
    done();
})

gulp.task('clear-cache', () =>
    cache.clearAll()
);

gulp.task("watch", (done) => {
    gulp.watch("./src/*.html", gulp.series("html"));
    gulp.watch("./src/scss/*.scss", gulp.series("scss"));
    gulp.watch("./src/js/*.js", gulp.series("js"));
    gulp.watch("./src/img/**/*", gulp.series("images"));
    done();
});

gulp.task("default", gulp.series("browser-init", "watch"));