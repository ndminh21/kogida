# gulp-nearley
Gulp plugin for compiling parsers written with the nearley parser library

## Usage

```es6
const nearley = require('gulp-nearley');

gulp.task('nearley', () =>
  gulp.src('src/**/*.ne')
      .pipe(nearley())
      .pipe(gulp.dest('lib')));
```

Any files with a `.ne` file extension will have their extension changed to `.js` in the output directory.
