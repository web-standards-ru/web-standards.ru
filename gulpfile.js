const gulp = require('gulp');
const postcss = require('gulp-postcss');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const del = require('del');
const rev = require('gulp-rev');
const revCollector = require('gulp-rev-collector');

const fs = require('fs');

// Styles

gulp.task('styles', () => {
    return gulp.src('dist/styles/styles.css')
        .pipe(postcss([
            require('postcss-import'),
            require('postcss-color-hex-alpha'),
            require('autoprefixer'),
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

// Revision

gulp.task('revision', (done) => {
    return gulp.src([
            'dist/styles/styles.css',
            'dist/scripts/scripts.js'
        ], {
            base: 'dist'
        })
        .pipe(rev())
        .pipe(gulp.dest('dist'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/rev'))
        .on('end', done);
});

// HTML manifest
gulp.task('htmlManifest', (done) => {
	if ((fs.existsSync('dist/rev/rev-manifest.json'))) {
		return gulp.src(['dist/rev/rev-manifest.json', 'dist/index.html'])
			.pipe(revCollector({
				replaceReved: true
			}))
			.pipe(gulp.dest('dist'))
			.on('end', done);
	} else {
		console.log('HTML manifest error, file not exist.');
		return false;
	}
});


// Build

gulp.task('build', gulp.series(
    'styles',
    'scripts',
    'clean',
    'revision',
    'htmlManifest'
));
