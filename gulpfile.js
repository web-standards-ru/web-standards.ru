const gulp = require('gulp');
const postcss = require('gulp-postcss');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const del = require('del');
const rev = require('gulp-rev');
const revRewrite = require('gulp-rev-rewrite');
const paths = require('vinyl-paths');

// Styles

gulp.task('styles', () => {
    return gulp.src('dist/styles/{styles,print}.css')
        .pipe(postcss([
            require('postcss-import'),
            require('postcss-color-hex-alpha'),
            require('autoprefixer'),
            require('postcss-csso')
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
        '!dist/styles/{styles,print}.css',
        'dist/scripts/**/*',
        '!dist/scripts/scripts.js'
    ]);
});

// Cache

gulp.task('cache:hash', () => {
    return gulp.src([
        'dist/fonts/*.woff2',
        'dist/images/**/*.{svg,png,jpg}',
        'dist/scripts/*.js',
        'dist/styles/*.css',
        'dist/manifest.json'
    ], {
        base: 'dist'
    })
        .pipe(paths(del))
        .pipe(rev())
        .pipe(gulp.dest('dist'))
        .pipe(rev.manifest('rev.json'))
        .pipe(gulp.dest('dist'));
});

gulp.task('cache:replace', () => {
    return gulp.src([
        'dist/**/*.{html,css}',
        'dist/manifest-*.json'
    ])
        .pipe(revRewrite({
            manifest:
                gulp.src('dist/rev.json').pipe(paths(del))
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('cache', gulp.series(
    'cache:hash',
    'cache:replace'
));


// Build

gulp.task('build', gulp.series(
    'styles',
    'scripts',
    'clean',
    'cache'
));
