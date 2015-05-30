module.exports = function (grunt) {
	grunt.registerTask('default', ['compileAssets', 'linkAssets',  'watch']);
	grunt.registerTask('bower', ['clean:components','copy:components']);
	grunt.registerTask('debug', ['concurrent:target']);
};
//'ngAnnotate',