import babel from 'gulp-babel';
import buffer from 'vinyl-buffer';
import {deleteAsync} from 'del';
import fs from 'fs';
import gulp from 'gulp';
import paths from 'vinyl-paths';
import postcss from 'gulp-postcss';
import replace from 'gulp-replace';
import rev from 'gulp-rev';
import rewrite from 'gulp-rev-rewrite';
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
        .pipe(paths(deleteAsync))
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

// Clean

gulp.task('clean', () => {
    return deleteAsync([
        'dist/styles/**/*',
        '!dist/styles/{styles,print}-*.css',
        'dist/scripts/**/*',
        'dist/rev.json',
    ]);
});

// Build

gulp.task('build', gulp.series(
    'styles',
    'scripts',
    'paths',
    'cache',
    'clean'
));
