/**
 * grunt/pipeline.js
 *
 * The order in which your css, javascript, and template files should be
 * compiled and linked from your views and static HTML files.
 *
 * (Note that you can take advantage of Grunt-style wildcard/glob/splat expressions
 * for matching multiple files.)
 */



// CSS files to inject in order
//
// (if you're using LESS with the built-in default config, you'll want
//  to change `assets/styles/importer.less` instead.)
var cssFilesToInject = [
  '/bower_components/bootstrap/dist/css/bootstrap.min.css',
  '/bower_components/font-awesome/css/font-awesome.min.css',
  '/bower_components/animate.css/animate.min.css',
  'css/menu.css',
  'css/skel.css',
  'css/style.css',
  'css/style-wide.css',
  // 'css/style-mobile.css',
  'styles/**/*.css'
];


// Client-side javascript files to inject in order
// (uses Grunt-style wildcard/glob/splat expressions)
var jsFilesToInject = [

  // Dependencies like sails.io.js, jQuery, or Angular
  // are brought in here
  'bower_components/jquery/dist/jquery.min.js',
  'bower_components/bootstrap/dist/js/bootstrap.min.js',
  'bower_components/wow/dist/wow.min.js',
  'bower_components/waitingForImages/dist/jquery.waitingforimages.min.js',
  'bower_components/sharrre/jquery.sharrre.min.js',
  'bower_components/fitvids/jquery.fitvids.js',
  'js/dependencies/**/*.js',
  'js/menu.js',
  
  // 'js/*.js',
];


// Client-side HTML templates are injected using the sources below
// The ordering of these templates shouldn't matter.
// (uses Grunt-style wildcard/glob/splat expressions)
//
// By default, Sails uses JST templates and precompiles them into
// functions for you.  If you want to use jade, handlebars, dust, etc.,
// with the linker, no problem-- you'll just want to make sure the precompiled
// templates get spit out to the same file.  Be sure and check out `tasks/README.md`
// for information on customizing and installing new tasks.
var templateFilesToInject = [
  'templates/**/*.html'
];



// Prefix relative paths to source files so they point to the proper locations
// (i.e. where the other Grunt tasks spit them out, or in some cases, where
// they reside in the first place)
module.exports.cssFilesToInject = cssFilesToInject.map(function(path) {
  return '.tmp/public/' + path;
});
module.exports.jsFilesToInject = jsFilesToInject.map(function(path) {
  return '.tmp/public/' + path;
});
module.exports.templateFilesToInject = templateFilesToInject.map(function(path) {
  return 'assets/' + path;
});
