const gulp = require('gulp');
const postcss = require('gulp-postcss');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const del = require('del');

// Styles

gulp.task('styles', () => {
    return gulp.src('dist/styles/styles.css')
        .pipe(postcss([
            require('postcss-import'),
            require('postcss-csso'),
        ]))
        .pipe(gulp.dest('dist/styles'));
});

// Scripts

gulp.task('scripts', () => {
    return gulp.src('dist/scripts/scripts.js')
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(terser())
        .pipe(gulp.dest('dist/scripts'));
});

// Clean

gulp.task('clean', () => {
    return del([
        'dist/styles/**/*',
        '!dist/styles/styles.css',
        'dist/scripts/**/*',
        '!dist/scripts/scripts.js',
    ]);
});

// Build

gulp.task('build', gulp.series(
    'styles',
    'scripts',
    'clean',
));
