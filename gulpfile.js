var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

//script paths
var jsFiles = [
  // Sigma.js
  'lib/sigma.min.js',
  
  // Mustache.js
  'lib/mustache.min.js',

  // Sigma Plugins
  'lib/sigma.plugins.animate.js',
  'lib/sigma.layout.fruchtermanReingold.js',
  'lib/sigma.plugins.tooltips.js',

  // NetJSON Plugin
  'src/sigma.parsers.netjson.js'
];

// Combine, concat and uglify all JS Files in dist folder
gulp.task('scripts', function() {
    return gulp.src(jsFiles)
      .pipe(concat('sigma-netjson.js'))
      .pipe(gulp.dest('dist'))
      .pipe(rename('sigma-netjson.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('dist'));
});

// Default Task
gulp.task('default', ['scripts'])
