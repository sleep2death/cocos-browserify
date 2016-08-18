const watchify = require('watchify')
const browserify = require('browserify')
const gulp = require('gulp')
const plumber = require('gulp-plumber')
// const uglify = require('gulp-uglify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const gutil = require('gulp-util')
// const babelify = require('babelify')
const assign = require('lodash.assign')
const del = require('del')
// const header = require('gulp-header')

const customOpts = {
  entries: ['./src/index.js'],
  debug: false,
  transform: [['babelify', {
    presets: ['es2015']
  }]] // do not ignore anything, we will pack all requires to one file
}

const opts = assign({}, watchify.args, customOpts)
const b = watchify(browserify(opts))
b.on('log', gutil.log)

/**
 ** This task removes all files inside the 'App' directory.
 **/
gulp.task('clean', () => {
  del.sync('./main.js')
})

/**
 *  * This task will bundle all other js files and babelify them.
 *   * If you want to add other processing to the main js files, add your code here.
 *    */
gulp.task('bundle', ['clean'], () => {
  return b.bundle()
    .on('error', function (err) {
      console.log(err.message)
      this.emit('end')
    })
    .pipe(plumber())
    .pipe(source('main.js'))
    .pipe(buffer())
  // .pipe(uglify())
    .pipe(gulp.dest('./'))
})

/**
 * This task starts watching the files inside 'src'. If a file is changed,
 * removed or added then it will run refresh task which will run the bundle task
 * and then refresh the page.
 *
 * For large projects, it may be beneficial to separate copying of libs and
 * media from bundling the source. This is especially true if you have large
 * amounts of media.
 */
gulp.task('watch', ['bundle'], () => {
  const jsWatcher = gulp.watch('./src/**', ['bundle'])
  jsWatcher.on('change', event => {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...')
  })
})
