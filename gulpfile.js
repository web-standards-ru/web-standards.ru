import babel from 'gulp-babel';
import buffer from 'vinyl-buffer';
import {deleteAsync} from 'del';
import gulp from 'gulp';
import postcss from 'gulp-postcss';
import replace from 'gulp-replace';
import rollup from 'rollup-stream';
import source from 'vinyl-source-stream';
import terser from 'gulp-terser';

// Styles

const postCssPlugins = await Promise.all([
    'postcss-import',
    'postcss-color-hex-alpha',
    'autoprefixer',
    'postcss-csso',
].map((name) => import(name).then(module => module.default)));

gulp.task('styles', () => {
    return gulp.src('dist/styles/{styles,print}.css')
        .pipe(postcss(postCssPlugins))
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

// Paths

gulp.task('paths', () => {
    return gulp.src('dist/**/*.html')
        .pipe(replace(
            /(<script) type="module"( src="\/scripts)\/index(.js">)/, '$1$2$3'
        ))
        .pipe(gulp.dest('dist'));
});

// Copy

gulp.task('copy:binary', () => {
    return gulp.src([
        'dist/fonts/*.woff2',
        'dist/images/**/*.{png,jpg}',
    ], {
        base: 'dist',
        encoding: false,
    })
        .pipe(gulp.dest('dist'));
});

gulp.task('copy:text', () => {
    return gulp.src([
        'dist/images/**/*.{svg}',
        'dist/scripts.js',
        'dist/styles/*.css',
        'dist/manifest.json',
    ], {
        base: 'dist',
    })
        .pipe(gulp.dest('dist'));
});

// Clean

gulp.task('clean', () => {
    return deleteAsync([
        'dist/styles/**/*',
        '!dist/styles/{styles,print}.css',
        'dist/scripts/**/*',
    ]);
});

// Build

gulp.task('build', gulp.series(
    'styles',
    'scripts',
    'paths',
    'copy:binary',
    'copy:text',
    'clean'
));
