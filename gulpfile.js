/** @format */

import gulp from "gulp";
import concat from "gulp-concat";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import * as sass from "sass";
import gulpSass from "gulp-sass";
import pug from "gulp-pug";
import connect from "gulp-connect";
import uglify from "gulp-uglify";
import notify from "gulp-notify";
import livereload from "gulp-livereload";
import cleanCSS from "gulp-clean-css";
import ts from "gulp-typescript";
import sourcemaps from "gulp-sourcemaps";
import plumber from "gulp-plumber";
import image from "gulp-image";
import { deleteAsync } from "del";
import dotenv from "dotenv";
import zip from "gulp-zip";

// !Initialize gulpSass with the Sass compiler
const sassCompiler = gulpSass(sass);

// !Load environment variables from .env file
dotenv.config();

// !Utility function to get the target environment
let getTargetEnvironment = () => {
  const env = process.env.NODE_ENV || "production"; // *Default to development
  if (!["development", "production"].includes(env)) {
    console.warn(`Invalid environment: ${env}. Defaulting to "development".`);
    return "development";
  }
  return env;
};

// !Dynamically set the target environment
let target = getTargetEnvironment();
let path = target === "development" ? "public" : "dist";

// !Directories
const paths = {
  html: {
    src: "src/pug/pages/*.pug",
    dest: `${path}/`,
  },
  styleScss: {
    src: "src/scss/*.scss",
    dest: `${path}/css/`,
    sourcemaps: "../../sourcemaps/",
  },
  stylesCss: {
    src: "src/css/*.{css,map}",
    dest: `${path}/css/`,
  },
  bootstrapCss: {
    src: "src/bootstrap/css/*.{css,map}",
    dest: `${path}/css/`,
  },
  bootstrapJs: {
    src: "src/bootstrap/js/*.{js,map}",
    dest: `${path}/js/`,
  },
  scripts: {
    src: "src/js/*.{js,map}",
    dest: `${path}/js/`,
  },
  jQueryFiles: {
    src: "src/jquery/src/*.js",
    dest: `${path}/js/`,
  },
  jQuery: {
    src: "src/jquery/*.js",
    dest: `${path}/js/`,
    sourcemaps: "../../sourcemaps/",
  },
  images: {
    src: "src/assets/images/**/*.{jpg,jpeg,png,gif,svg}",
    dest: `${path}/assets/images/`,
  },
  videos: {
    src: "src/assets/videos/**/*",
    dest: `${path}/assets/videos/`,
  },
  webfonts: {
    src: "src/assets/webfonts/**/*",
    dest: `${path}/webfonts/`,
  },
  ts: {
    src: "src/ts/**/*.ts",
    dest: `${path}/js/`,
    sourcemaps: "../../sourcemaps/",
  },
};

// !Task to clean the folder using dynamic import for del
gulp.task("clean", function () {
  return deleteAsync(`${path}`).then((paths) => {
    console.log("Deleted files and folders:", paths.join("\n")); // *Log the deleted paths
  });
});

// !Task to copy HTML files
gulp.task("pug", function () {
  return gulp
    .src(paths.html.src)
    .pipe(pug({ pretty: false })) // *Compile Pug files to HTML
    .pipe(gulp.dest(paths.html.dest))
    .pipe(livereload());
});

// !Task to compile SCSS to CSS
gulp.task("styles", function () {
  return gulp
    .src(paths.styleScss.src)
    .pipe(
      plumber({
        errorHandler: notify.onError("Error: <%= error.message %>"),
      })
    ) // *Prevents pipe breaking caused by errors
    .pipe(sourcemaps.init()) // *Initialize sourcemaps
    .pipe(sassCompiler().on("error", sassCompiler.logError)) // *Compile SCSS
    .pipe(
      postcss([
        autoprefixer({
          cascade: false,
        }),
      ])
    ) // *Add vendor prefixes
    .pipe(concat("style.css")) // *Concatenate all files into one
    .pipe(cleanCSS()) // *Minify CSS
    .pipe(sourcemaps.write(paths.styleScss.sourcemaps)) // *Write sourcemaps to specified folder
    .pipe(gulp.dest(paths.styleScss.dest)) // *Output concatenated and minified CSS to destination
    .pipe(livereload());
  // TODO .pipe(notify("Styles task complete"));
});

// !Task to copy CSS files
gulp.task("css", function () {
  return gulp
    .src(paths.stylesCss.src)
    .pipe(cleanCSS()) // *Minify CSS
    .pipe(gulp.dest(paths.stylesCss.dest))
    .pipe(livereload());
  // TODO .pipe(notify("CSS Files copied"));
});

// !Task to minify and concatenate JavaScript files
gulp.task("scripts", function () {
  return gulp
    .src(paths.scripts.src)
    .pipe(uglify()) // *Minify JS
    .pipe(gulp.dest(paths.scripts.dest)) // *Output minified files to destination
    .pipe(livereload());
  // TODO .pipe(notify("Scripts task complete"));
});

// !Task to copy bootstrap CSS files
gulp.task("bootstrapCSS", function () {
  return gulp
    .src(paths.bootstrapCss.src)
    .pipe(gulp.dest(paths.bootstrapCss.dest)) // *Output minified files to destination
    .pipe(livereload());
  // TODO .pipe(notify("Bootstrap CSS task complete"));
});

// !Task to copy bootstrap Js files
gulp.task("bootstrapJS", function () {
  return gulp
    .src(paths.bootstrapJs.src)
    .pipe(gulp.dest(paths.bootstrapJs.dest)) // *Output minified files to destination
    .pipe(livereload());
  // TODO .pipe(notify("Bootstrap JS task complete"));
});

// !Task to copy jQuery files
gulp.task("jQueryFiles", function () {
  return gulp
    .src(paths.jQueryFiles.src)
    .pipe(uglify()) // *Minify jQuery
    .pipe(gulp.dest(paths.jQueryFiles.dest)) // *Output minified files to destination
    .pipe(livereload());
  // TODO .pipe(notify("jQuery scripts files task complete"));
});

// !Task to minify and concatenate jQuery files
gulp.task("jQuery", function () {
  return gulp
    .src(paths.jQuery.src)
    .pipe(sourcemaps.init()) // *Initialize sourcemaps
    .pipe(concat("plugins.js")) // *Concatenate all files into one
    .pipe(uglify()) // *Minify jQuery
    .pipe(sourcemaps.write(paths.jQuery.sourcemaps)) // *Write sourcemaps to specified folder
    .pipe(gulp.dest(paths.jQuery.dest)) // *Output minified files to destination
    .pipe(livereload());
  // TODO .pipe(notify("jQuery scripts task complete"));
});

// !Task to compile TypeScript
gulp.task("typescript", function () {
  const tsProject = ts.createProject("tsconfig.json"); 
  return tsProject
    .src()
    .pipe(
      plumber({
        errorHandler: notify.onError("Error: <%= error.message %>"),
      })
    )
    .pipe(sourcemaps.init()) // *Initialize sourcemap generation
    .pipe(tsProject()) // Compile TypeScript using tsconfig.json settings
    .pipe(concat("main.js")) // *Concatenate files
    .pipe(uglify()) // *Minify JS
    .pipe(sourcemaps.write(paths.ts.sourcemaps)) // *Write sourcemaps to specified folder
    .pipe(gulp.dest(paths.ts.dest))
    .pipe(livereload());
  // TODO .pipe(notify("TypeScript task complete"));
});

// !Task to optimize images
gulp.task("images", () => {
  return gulp
    .src(paths.images.src)
    .pipe(
      image({
        optipng: ["-i 1", "-strip all", "-fix", "-o7", "-force"],
        pngquant: ["--speed=1", "--force", 256],
        zopflipng: ["-y", "--lossy_8bit", "--lossy_transparent"],
        jpegRecompress: [
          "--strip",
          "--quality",
          "medium",
          "--min",
          40,
          "--max",
          80,
        ],
        mozjpeg: ["-optimize", "-progressive"],
        gifsicle: ["--optimize"],
        svgo: ["--enable", "cleanupIDs", "--disable", "convertColors"],
      })
    )
    .pipe(gulp.dest(paths.images.dest))
    .pipe(
      notify({
        message: "Images optimized successfully!",
        onLast: true,
      })
    )
    .on(
      "error",
      notify.onError({
        title: "Gulp Error",
        message: "Error: <%= error.message %>",
      })
    ); // TODO Global error handler
});

// !Task to copy videos
gulp.task("videos", function () {
  return gulp
    .src(paths.videos.src)
    .pipe(gulp.dest(paths.videos.dest))
    .pipe(livereload());
  // TODO .pipe(notify("Videos copied"));
});

// !Task to copy webfonts
gulp.task("webfonts", function () {
  return gulp
    .src(paths.webfonts.src)
    .pipe(gulp.dest(paths.webfonts.dest))
    .pipe(livereload());
  // TODO .pipe(notify("Webfonts copied"));
});

// !Task to create a zip file of the folder
gulp.task("compress", async () => {
  return gulp
    .src("dist/**/*")
    .pipe(zip("website.zip"))
    .pipe(gulp.dest("./"))
    .pipe(notify("Project compressed to website.zip"));
});

// !Serve and watch files for changes
gulp.task("serve", function (done) {
  connect.server({
    root: "public",
    livereload: true,
    port: 8000,
  });
  done(); // *Server is running
});

// !Watch task
gulp.task("watch", function () {
  livereload.listen();
  gulp.watch("src/pug/**/*.pug", gulp.series("pug"));
  gulp.watch("src/scss/**/*.scss", gulp.series("styles"));
  gulp.watch("src/js/**/*.js", gulp.series("scripts"));
  gulp.watch(
    "src/assets/images/**/*.{jpg,jpeg,png,gif,svg}",
    gulp.series("images")
  );
  gulp.watch(paths.videos.src, gulp.series("videos"));
  gulp.watch(paths.jQuery.src, gulp.series("jQuery"));
  gulp.watch(paths.bootstrapCss.src, gulp.series("bootstrapCSS"));
  gulp.watch(paths.bootstrapJs.src, gulp.series("bootstrapJS"));
  gulp.watch("src/ts/**/*.ts", gulp.series("typescript"));
});

// !Default task
gulp.task(
  "default",
  gulp.series(
    "clean",
    gulp.parallel(
      "pug",
      "styles",
      "scripts",
      "images",
      "jQuery",
      "bootstrapCSS",
      "bootstrapJS",
      "jQueryFiles",
      "videos",
      "webfonts",
      "css",
      "typescript"
    ),
    gulp.parallel("serve", "watch")
  )
);
