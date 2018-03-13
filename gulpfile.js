var del         = require('del');
var path        = require('path');
var gulp        = require('gulp');
var changed     = require('gulp-changed');
var imagemin    = require('gulp-imagemin');
var svgmin      = require('gulp-svgmin');
var imageminJpg = require('imagemin-jpeg-recompress');
var imageminPng = require('imagemin-pngquant');
var imageminGif = require('imagemin-gifsicle');
var log         = require('fancy-log');

var paths = {
  srcDir : 'src',
  dstDir : 'dist'
}

gulp.task('imagemin', function(){
    var srcGlob = paths.srcDir + '/**/*.+(jpg|jpeg|png|gif)';
    var dstGlob = paths.dstDir;
    gulp.src( srcGlob )
    .pipe(changed( dstGlob ))
    .pipe(imagemin([
        imageminPng(),
        imageminJpg(),
        imageminGif({
            interlaced: false,
            optimizationLevel: 3,
            colors:180
        })
    ]))
    .pipe(gulp.dest( dstGlob ));
});

gulp.task('svgmin', function(){
    var srcGlob = paths.srcDir + '/**/*.+(svg)';
    var dstGlob = paths.dstDir;
    gulp.src( srcGlob )
    .pipe(changed( dstGlob ))
    .pipe(svgmin())
    .pipe(gulp.dest( dstGlob ));
});

gulp.task('watch', function(){
  var watchGlob = paths.srcDir + '/**/*.+(jpg|jpeg|png|gif)';
  var watcher = gulp.watch(watchGlob, {interval: 500}, ['imagemin']);
  watcher.on('change', function(event) {
      log('file: ' + event.path + ', ' + 'type: ' + event.type);
      if (event.type === 'deleted') {
          var filePathFromSrc = path.relative(path.resolve(paths.srcDir), event.path);
          var destFilePath = path.resolve(paths.dstDir, filePathFromSrc);
          del.sync(destFilePath);
          log(destFilePath + ' deleted');
      }
  });
});
