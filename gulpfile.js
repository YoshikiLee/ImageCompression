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
var zip         = require('gulp-zip');
var rev         = require('gulp-date-rev');

var paths = {
  srcDir : 'PIC',
  dstDir : 'PIC_Compressed'
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
  var watcher = gulp.watch(watchGlob, {interval: 5000}, ['imagemin']);
  watcher.on('change', function(event) {
      log('file: ' + event.path + ', ' + 'type: ' + event.type);
      if (event.type === 'deleted' || event.type === 'changed') {
          var filePathFromSrc = path.relative(path.resolve(paths.srcDir), event.path);
          var destFilePath = path.resolve(paths.dstDir, filePathFromSrc);
          del.sync(destFilePath);
          log(destFilePath + ' deleted');
      }
  });
});

gulp.task('backup', function(){
    var zipfile = paths.srcDir + '.zip';
    gulp.src(paths.srcDir + '/*', {base: paths.srcDir})
    .pipe(zip(zipfile))
    .pipe(rev(zipfile))
    .pipe(gulp.dest('.'));
});

gulp.task('clean', function(){
     del(paths.srcDir, {force:true});
});

gulp.task('copy', function(){
     gulp.src(paths.dstDir + '/**/*')
     .pipe(gulp.dest(paths.srcDir));
});
