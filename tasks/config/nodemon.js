var browserSync = require("browser-sync");

module.exports = function(grunt) {

	grunt.config.set('nodemon', {
		dev: {
               	script:'app.js',
				options: {
					ignore: ['node_modules/**','.tmp/**','tasks/','.rebooted'],
					ext: 'js,html',
					callback: function (nodemon) {
						// console.log("NODEMON CALLBACK");
						nodemon.on('restart', function () {

							console.log('RESTART');
				          // Delay before server listens on port
							setTimeout(function() {
							// 	console.log('REBOOTED');
								require('fs').writeFileSync('.rebooted', 'rebooted');
							}, 1000);
				        });
	            	}
				}
            }
	});
grunt.loadNpmTasks('grunt-nodemon');
};