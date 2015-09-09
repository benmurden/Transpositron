var gulp = require('gulp');
var path = require('path');
var conf = require('./conf');
var ghPages = require('gulp-gh-pages');

gulp.task('deploy', ['build'], function() {
  return gulp.src(path.join(conf.paths.dist, '/**/*'))
    .pipe(ghPages());
});