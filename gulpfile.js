// Speak Gulp File for local development 2018
// Any questions or concerns message Forrest
// Most, if not all, documentation concerning gulp, npm, node can be found at nodejs.org and npmjs.com and gulpjs.com
// Any of the below tasks can be modified, deleted, or new ones created to fit specific needs and team adjustments moving forward

const gulp = require( 'gulp' ), // Task Runner
      runSequence = require('run-sequence'), // Runs tasks in sequential order
      sass = require('gulp-sass'), // Compiles SASS/SCSS into CSS
      sassLint = require('gulp-sass-lint'), // Linter for SASS and SCSS
      notify = require('gulp-notify'), // Notification for errors in code
      plumber = require('gulp-plumber'), // Error check without failing stream
      proxy = require('http-proxy-middleware'), // Proxy options to reroute localhost to sitewrench
      cachebust = require('gulp-cache-bust'), // Cache buster for head.inc file
      imagemin = require('gulp-imagemin'), // Image compressor for build task
      autoprefixer = require('autoprefixer'), // Autoprefixer for previous 2 versions of browsers
      csswring = require('csswring'), // CSS minifier
      browserSync = require('browser-sync').create(),
      concat = require('gulp-concat'),
      jsmin = require('gulp-jsmin'),
      connect = require('gulp-connect'),
      homedir = require('os').homedir(),
      fs = require("fs"),
      argv = require('yargs').argv,
      cors = require('cors'), //adding cors to localhost origin
      postcss = require('gulp-postcss'), // CSS processor to allow better efficiency on minificatino and prefixing
      htmlmin = require('gulp-htmlmin'); // Minify .master and .inc files for faster delivery
// fetch command line arguments
// const arg = (argList => {

//   let arg = {}, a, opt, thisOpt, curOpt;
//   for (a = 0; a < argList.length; a++) {

//     thisOpt = argList[a].trim();
//     opt = thisOpt.replace(/^\-+/, '');

//     if (opt === thisOpt) {

//       // argument value
//       if (curOpt) arg[curOpt] = opt;
//       curOpt = null;

//     }
//     else {

//       // argument name
//       curOpt = opt;
//       arg[curOpt] = true;

//     }

//   }

//   return arg;

// })(process.argv);

var siteID = argv.siteID;
// siteID = 2400

var localsite = "http://localhost:" + siteID;

var siteURL = argv.siteURL;
// siteURL = 'https://www.resultspt.com'

var filePath = argv.filePath;
// filePath = '/Users/LC/Documents/Speak/2400-ResultsPT/'

var jsFiles = argv.jsFiles;
// Proxy middleware options
// Replace XXXXXXXX in URL with desired site redirect
var options = {
  target: siteURL, // target host
  changeOrigin: true // needed for virtual hosted sites
};


// Live Development Server at http://localhost:siteID using proxy
// This task allows all changes to be reloaded for local development
// If you need to run multiple gulp servers at the same time switch this port to another such as 8000 or 9000 to run concurrently
//Change port number to SiteID
gulp.task('server', function() {
  connect.server({
    root: filePath + "/",
    port: siteID,
    middleware: function() {
      return [
        proxy(options)
      ]
    },
});
});

gulp.task('file-server', function() {
  connect.server({
    root: filePath + "/",
    port: 3000,
    middleware: function() {
      return [
        cors()
      ]
    },
});
});

gulp.task('inject', ['styles'], function() {

    browserSync.init({
      proxy: localsite,
      online: true
    });

    gulp.watch(filePath + '/CSS/**/*.scss', ['styles']);
    gulp.watch(filePath + '/MasterPages/includes/*.inc').on('change', browserSync.reload);
    gulp.watch(filePath + '/js/*.js', ['js']).on('change', browserSync.reload);
});


// Styles compilation error if process fails
var onError = function(err) {
  notify.onError({
    message:  "Error: <%= error.message %>",
    sound:    "Basso",
    wait: false
  })(err);
};

notify.on('click', function(notifierObject, options) {

});


// Options feeding into postcss tasks
const processors = [
  csswring,
  autoprefixer({browsers:['last 2 version']})
]


// Sass/Scss compiler, minify task
// Compiles stylesheets minifies and prefixes while avoiding closing the stream with plumber
gulp.task('styles', function() {
  return gulp.src(filePath + '/CSS/master.scss')
    .pipe(plumber({errorHandler: onError}))
    .pipe(sass())
    .pipe(postcss(processors))
    .pipe(gulp.dest(filePath + '/CSS/'))
    .pipe(browserSync.stream())
    .pipe(notify({ message: 'Styles task complete' }));
});


gulp.task('styles-local', function() {
  return gulp.src('CSS/master.scss')
    .pipe(plumber({errorHandler: onError}))
    .pipe(sass())
    .pipe(postcss(processors))
    .pipe(gulp.dest('CSS/'));
});

// Sass linter
// Linter works constantly to check for errors using the sass-lint.yml config file for specific syntax checking
gulp.task('sass-lint', function() {
  gulp.src(filePath + '/CSS/**/*.scss')
    .pipe(sassLint({configFile: 'CSS/sass-lint/sass-lint.yml'}))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});

// Minify .master for faster load times
gulp.task('minifymaster', function() {
  return gulp.src(filePath + 'masterpages/*.master')
    .pipe(htmlmin({collapseWhitespace: true,minifyJS:true}))
    .pipe(gulp.dest(filePath + 'masterpages/'));
});

//Concat files from src folder into destination folder
gulp.task('concat', function() {
  var jsFileWithPath = [];
  var jsArray = JSON.parse(jsFiles)
  for (i = 0; i < jsArray.length; i++) {
    jsFileWithPath[i] = filePath + jsArray[i]
  } 
  return gulp.src(jsFileWithPath)
    .pipe(concat('concat-helper.js'))
    .pipe(gulp.dest(filePath + '/js/'));
});

//Minify JS files from src folder
gulp.task('minifyJS', function() {
  gulp.src(filePath + '/js/concat-helper.js')
    .pipe(jsmin())
    .pipe(gulp.dest(filePath + '/js/'));
})

gulp.task('js', function() {
  runSequence('concat', 'minifyJS');
})

// Cache-buster for head.inc script and stylesheets
gulp.task('cache-bust', function() {
  return gulp.src(filePath + '/masterpages/includes/head.inc')
    .pipe(cachebust({
        type: 'timestamp'
    }))
    .pipe(gulp.dest(filePath + '/masterpages/includes/'));
})


// Image compression during build task to optimize and provide faster load times
gulp.task('image-min', function() {
    gulp.src(filePath + 'CSS/images/*')
        .pipe(imagemin([
          imagemin.gifsicle({interlaced: true}),
          imagemin.jpegtran({progressive: true}),
          imagemin.optipng({optimizationLevel: 5}),
          imagemin.svgo({
              plugins: [
                  {removeViewBox: true},
                  {cleanupIDs: false}
              ]
          })
        ]))
        .pipe(gulp.dest(filePath + 'CSS/images'))
});

gulp.task('watch', function() {
  gulp.watch('CSS/*/*.scss', ['styles-local'])
})

// Default task runs server for active development, web-server for file hosting, and watch task to save, compile, and load file changes
gulp.task('start', function() {
  gulp.start('server', 'file-server', 'inject');
});

