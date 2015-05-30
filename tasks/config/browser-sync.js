// var browserSync = require("browser-sync");
var config = require('../../config/config')
module.exports = function(grunt) {

	grunt.config.set('browserSync', {
		dev: {
                bsFiles: {
                    src : ['.tmp/styles/**/*.css','.rebooted','views/**/*.ejs']
                }, 
                options: {
                    proxy: "localhost:"+config.PORT,
                    // socket: {
                    //     path: '/socket.io',
                    //     namespace: function (namespace) {
                    //         return "localhost:1337" + namespace;
                    //     }
                    // }
                }
            }
	});

	grunt.loadNpmTasks('grunt-browser-sync');

    // grunt.registerTask("bs-init", function () {
    //     var done = this.async();
    //     browserSync({
    //         proxy: "localhost:1337"
    //         // server: "./app"
    //     }, function (err, bs) {
    //         console.log("bs-init");
    //         done();
    //     });
    // });
    // grunt.registerTask("bs-inject", function () {
    //     browserSync.reload([".tmp/styles/**/*.css"]);
    // });
};