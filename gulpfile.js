import gulp from "gulp";
import browserSync from "browser-sync";
import gulpSass from "gulp-sass";
import sass from "sass";
import cssnano from "gulp-cssnano";
import autoprefixer from "gulp-autoprefixer";
import rename from "gulp-rename";
import babel from "gulp-babel";
import uglify from "gulp-uglify";
import imagemin, { mozjpeg, optipng, svgo } from "gulp-imagemin";
import sourcemaps from "gulp-sourcemaps";
import clean from "gulp-clean";
import kit from "gulp-kit";
import deploy from "gulp-gh-pages";

const { src, dest, series, parallel, watch } = gulp;
const scss = gulpSass(sass);

const paths = {
  html: "./html/**/*.kit",
  sass: "./src/sass/**/*.scss",
  js: "./src/js/**/*.js",
  img: "./src/img/*",
  sassDest: "./dist/css",
  jsDest: "./dist/js",
  imgDest: "./dist/img",
  dist: "./dist",
};

// browserSync.create();

function style(done) {
  src(paths.sass)
    .pipe(sourcemaps.init())
    .pipe(scss().on("error", scss.logError))
    .pipe(autoprefixer())
    .pipe(cssnano())
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(sourcemaps.write())
    .pipe(dest(paths.sassDest));

  done();
}

function javaScript(done) {
  src(paths.js)
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(uglify())
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(sourcemaps.write())
    .pipe(dest(paths.jsDest));

  done();
}

export function convertImages(done) {
  src(paths.img)
    .pipe(
      imagemin(
        [
          mozjpeg({ quality: 90, progressive: true }),
          optipng({ optimizationLevel: 5 }),
          svgo(),
        ],
        { verbose: true }
      )
    )

    .pipe(dest(paths.imgDest));

  done();
}

function handleKits(done) {
  src(paths.html).pipe(kit()).pipe(dest("./"));
  src(paths.html).pipe(kit()).pipe(dest("./.publish/"));

  done();
}

function cleanStuff(done) {
  src(paths.dist, { read: false }).pipe(clean());
  done();
}

function startBrowserSync(done) {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
  done();
}

function watchForChanges(done) {
  watch("./*.html").on("change", browserSync.reload);
  watch(
    [paths.html, paths.sass, paths.js],
    parallel(handleKits, style, javaScript)
  ).on("change", browserSync.reload);
  watch(paths.img, convertImages).on("change", browserSync.reload);
  done();
}
// gulp.task("deploy", function () {
//   gulp.src("./dist/**/*").pipe(
//     deploy({
//       remoteUrl: "https://github.com/lukaszbajor/ForestWebsite.git",
//       branch: "master",
//     })
//   );
// });

const mainFunctions = parallel(handleKits, style, javaScript, convertImages);
export const cStuff = cleanStuff;
export default series(mainFunctions, startBrowserSync, watchForChanges);
