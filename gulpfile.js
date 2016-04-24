var gulp    = require('gulp'),
	  path    = require('path'),
    webpack = require('webpack-stream'),
    sass    = require('gulp-sass'),
    takana  = require('takana'),
    plumber = require('gulp-plumber');
    notify  = require("gulp-notify");

//
// Stylesheets
//

var neat    = path.join(__dirname, 'node_modules/bourbon-neat/app/assets/stylesheets'),
    bourbon = require("bourbon").includePaths;

const SASS_INCLUDE_PATHS = bourbon.concat(neat);

gulp.task('sass', function () {
  return gulp.src('scss/**/*.scss')
             .pipe(sass({
               includePaths: SASS_INCLUDE_PATHS
             }))
             .on('error', sass.logError)
             .on('error', notify.onError({
               title:   'Sass Error',
               message: '<%=error.relativePath%>:<%= error.line %> - <%=error.messageOriginal%>',
               sound:   false 
             }))
             .pipe(gulp.dest('build/'));
});

gulp.task('takana', function() {
  takana.run({
    path:         __dirname,
    includePaths: SASS_INCLUDE_PATHS
  });
});

//
// WebPack
//

gulp.task('webpack', function() {
  return gulp.src('app/index.jsx')
        .pipe(plumber({
          errorHandler: function(error) {
              console.log(error.toString());
              this.emit('end');
          }
        }))  
        .pipe(webpack({
          output: {
        	  filename: 'bundle.js'
          },
          module: {
            loaders: [
              {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                  presets: ['es2015', 'react']
                }
              }
            ]
          }
        }))  
        .on("error", notify.onError({
          title: 'Webpack Error',
          message: '<%=error.message%>',
          sound: false // deactivate sound?
        }))     
        .pipe(gulp.dest('build/'));
});

//
// Main
//

gulp.task('watch', function () {
  gulp.watch('scss/**/*.scss', ['sass']);
  gulp.watch('app/**/*.js*', ['webpack']);
});

gulp.task('build', ['sass', 'webpack']);
gulp.task('default', ['build', 'watch']);

