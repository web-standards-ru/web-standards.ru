const babel = require('gulp-babel');
const buffer = require('vinyl-buffer');
const del = require('del');
const fs = require('fs');
const gulp = require('gulp');
const paths = require('vinyl-paths');
const postcss = require('gulp-postcss');
const replace = require('gulp-replace');
const rev = require('gulp-rev');
const rewrite = require('gulp-rev-rewrite');
const rollup = require('rollup-stream');
const source = require('vinyl-source-stream');
const terser = require('gulp-terser');

// Styles

gulp.task('styles', () => {
    return gulp.src('dist/styles/{styles,print}.css')
        .pipe(postcss([
            require('postcss-import'),
            require('postcss-color-hex-alpha'),
            require('autoprefixer'),
            require('postcss-csso'),
        ]))
        .pipe(gulp.dest('dist/styles'));
});

// Scripts

gulp.task('scripts', function() {
    return rollup({
        input: 'dist/scripts/index.js',
        format: 'iife',
    })
        .pipe(source('scripts.js'))
        .pipe(buffer())
        .pipe(babel({
            presets: ['@babel/preset-env'],
        }))
        .pipe(terser())
        .pipe(gulp.dest('dist'));
});

// Clean

gulp.task('clean', () => {
    return del([
        'dist/styles/**/*',
        '!dist/styles/{styles,print}.css',
        'dist/scripts/**/*',
        'dist/rev.json',
    ]);
});

// Cache

gulp.task('cache:hash', () => {
    return gulp.src([
        'dist/fonts/*.woff2',
        'dist/images/**/*.{svg,png,jpg}',
        'dist/scripts.js',
        'dist/styles/*.css',
        'dist/manifest.json',
    ], {
        base: 'dist',
    })
        .pipe(paths(del))
        .pipe(rev())
        .pipe(gulp.dest('dist'))
        .pipe(rev.manifest('rev.json'))
        .pipe(gulp.dest('dist'));
});

gulp.task('cache:replace', () => {
    const manifest = fs.readFileSync('dist/rev.json');

    return gulp.src([
        'dist/**/*.{html,css}',
        'dist/manifest-*.json',
    ])
        .pipe(rewrite({
            manifest,
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('cache', gulp.series(
    'cache:hash',
    'cache:replace'
));

// Paths

gulp.task('paths', () => {
    return gulp.src('dist/**/*.html')
        .pipe(replace(
            /(<script) type="module"( src="\/scripts)\/index(.js">)/, '$1$2$3'
        ))
        .pipe(gulp.dest('dist'));
});

// Build

gulp.task('build', gulp.series(
    'styles',
    'scripts',
    'paths',
    'cache',
    'clean'
));
