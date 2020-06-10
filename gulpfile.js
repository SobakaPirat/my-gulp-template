// конфигурация Gulp.js

const

  // режим разработки
  devBuild = (process.env.NODE_ENV !== 'production'),

  // модули
  gulp = require('gulp'),
  newer = require('gulp-newer'),
  imagemin = require('gulp-imagemin'),
  noop = require('gulp-noop'),
  htmlclean = require('gulp-htmlclean'),
  babel = require('gulp-babel'),
  concat = require('gulp-concat'),
  deporder = require('gulp-deporder'),
  sourcemaps = devBuild ? require('gulp-sourcemaps') : null,
  sass = require('gulp-sass'),
  postcss = require('gulp-postcss'),
  assets = require('postcss-assets'),
  autoprefixer = require('autoprefixer'),
  mqpacker = require('css-mqpacker'),
  cssnano = require('cssnano'),

  

  // папки
  src = 'src/',
  build = 'build/'
  ;

  function images() {
      const out = build + 'images/';

      return gulp.src(src + 'images/**/*')
        .pipe(newer(out))
        .pipe(imagemin({ optimizationLevel: 5 }))
        .pipe(gulp.dest(out));
  };
  exports.images = images;

  function html() {
      const out = build + 'html/';
      return gulp.src(src + 'html/**/*')
        .pipe(newer(out))
        .pipe(devBuild ? noop() : htmlclean())
        .pipe(gulp.dest(out))
        .pipe(browserSync.stream());
  }
  exports.html = gulp.series(images, html);

  function js() {

    return gulp.src(src + 'js/**/*')
      .pipe(sourcemaps ? sourcemaps.init() : noop())
      .pipe(babel({
        presets: ['@babel/env']
        }))
      .pipe(deporder())
      .pipe(concat('main.js'))
      .pipe(sourcemaps ? sourcemaps.write() : noop())
      .pipe(gulp.dest(build + 'js/'))
      .pipe(browserSync.stream());
  
  }
  exports.js = js;

  
  function css() {

    return gulp.src(src + 'scss/main.scss')
      .pipe(sourcemaps ? sourcemaps.init() : noop())
      .pipe(sass({
        outputStyle: 'nested',
        imagePath: '/images/',
        precision: 3,
        errLogToConsole: true
      }).on('error', sass.logError))
      .pipe(postcss([
        assets({ loadPaths: ['images/'] }),
        autoprefixer({ overrideBrowserslist: ['last 2 versions', '> 2%'] }),
        mqpacker,
        cssnano
      ]))
      .pipe(sourcemaps ? sourcemaps.write() : noop())
      .pipe(gulp.dest(build + 'css/'))
      .pipe(browserSync.stream());
  }
  exports.css = gulp.series(images, css);

  function fonts() {

    return gulp.src(src + 'fonts/**/*')
      .pipe(gulp.dest(build + 'fonts/'))
      .pipe(browserSync.stream());
  
  }
  exports.fonts = fonts;

  // запустить все таски
  exports.build = gulp.parallel(exports.html, exports.css, exports.js, exports.fonts);

  // следим за изменениями файлов
  function watch(done) {

    // изменениями изображений
    gulp.watch(src + 'images/**/*', images);
  
    // изменениями html
    gulp.watch(src + 'html/**/*', html);
  
    // изменениями css
    gulp.watch(src + 'scss/**/*', css);
  
    // изменениями js
    gulp.watch(src + 'js/**/*', js);
  
    done();
  
  }
  exports.watch = watch;
  // таск по умолчанию

  
  exports.default = gulp.series(exports.build, exports.watch);

    
