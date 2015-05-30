module.exports = function(grunt) {
	grunt.config.set('concurrent',{
	 
	    target: {
            tasks: ['browserSync','nodemon','watch'],
            options: {
                logConcurrentOutput: true
            }
        }
	});

	grunt.loadNpmTasks('grunt-concurrent');
};
